import { Router, ActivatedRoute } from '@angular/router';
import { CardapioApiService } from './../../shared/api/cardapio-api.service';
import { Component, OnInit, AfterViewInit, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ItemCardapio, TipoSalgado } from 'src/app/shared/models/item-cardapio';
import { distinctUntilChanged, debounceTime, map, tap, filter, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Pedido } from 'src/app/shared/models/pedido';
import { PedidosApiService } from 'src/app/shared/api/pedidos-api.service';
import { CardapioService } from 'src/app/shared/services/cardapio.service';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { Cliente, Endereco } from 'src/app/shared/models/cliente';
import { ClientesApiService } from 'src/app/shared/api/clientes-api.service';
import { datepicker } from 'src/environments/datepicker-options';
import { timepicker } from 'src/environments/timepicker-options';
import { ToastsService } from 'src/app/shared/services/toasts.service';
import { UtilService } from 'src/app/shared/services/util.service';

declare var $: any;

@Component({
  selector: 'app-pedidos-form',
  templateUrl: './pedidos-form.component.html',
  styleUrls: ['./pedidos-form.component.css']
})
export class PedidosFormComponent implements OnInit, AfterViewInit {

  telefoneFiltro = '';
  pedido = new Pedido();
  clientes: Cliente[];
  showFormCliente = false;
  salgadosFesta: ItemCardapio[] = [];
  salgadosComerciais: ItemCardapio[] = [];
  itensSelecionados: ItemCardapio[] = [];
  TipoSalgado: typeof TipoSalgado = TipoSalgado;
  itemPersonalizadoModal = new EventEmitter<boolean>();
  atualizarCliente = true;

  constructor(private cardapioApi: CardapioApiService,
    private router: Router, private api: PedidosApiService,
    private clientesApi: ClientesApiService, private route: ActivatedRoute,
    private toasts: ToastsService, private utilService: UtilService) { }

  ngOnInit() {
    this.pedido.cliente = new Cliente();
    this.pedido.enderecoEntrega = new Endereco();
    this.pedido.enderecoEntrega.cidade = 'Araguari';
    this.pedido.enderecoEntrega.uf = 'MG';
    this.pedido.horario = new Date();

    const onSelectDate = (value: any) => {
      const data = new Date(value);
      this.pedido.horario = new Date(this.pedido.horario);
      data.setHours(this.pedido.horario.getHours());
      data.setMinutes(this.pedido.horario.getMinutes());
      this.pedido.horario = data;
    };

    const onSelectHour = (hour: any, minutes: any) => {
      const data = new Date(this.pedido.horario);
      data.setHours(hour);
      data.setMinutes(minutes);
      this.pedido.horario = data;
    };

    $('#data').datepicker(Object.assign(datepicker, {
      onSelect: onSelectDate
    }));

    $('#hora').timepicker(Object.assign(timepicker, {
      onSelect: onSelectHour
    }));
    $('#hora').val(this.utilService.getTime(this.utilService.getDateTime(new Date().toString())));

    this.loadItensPromisse(null)
      .pipe(
        tap((itens: ItemCardapio[]) => {
          this.salgadosFesta = itens.filter(i => i.tipo === TipoSalgado[TipoSalgado.Festa]);
          this.salgadosComerciais = itens.filter(i => i.tipo === TipoSalgado[TipoSalgado.Comercial]);
        }),
        switchMap(_ => this.route.data),
        filter(d => d.hasOwnProperty('pedido')),
        map(d => d['pedido'])
      ).subscribe((pedido: Pedido) => {
        this.updateQuantidades(pedido.itens);
        const hora = this.utilService.getTime(this.utilService.getDateTime(pedido.horario.toString()));
        $('#hora').val(hora);
        this.showFormCliente = true;
        this.pedido = pedido;
      });

  }

  updateQuantidades(salgados: ItemCardapio[]) {
    salgados.filter(s => s.tipo === TipoSalgado[TipoSalgado.Festa])
      .forEach(salgado => {
        const salgadoFesta = this.salgadosFesta.find(s => s._id === salgado._id);
        if (salgadoFesta) {
          salgadoFesta.quantidade = salgado.quantidade;
        }
      });

    salgados.filter(s => s.tipo === TipoSalgado[TipoSalgado.Comercial])
      .forEach(salgado => {
        const salgadoComercial = this.salgadosComerciais.find(s => s._id === salgado._id);
        if (salgadoComercial) {
          salgadoComercial.quantidade = salgado.quantidade;
        }
      });
  }

  selecionaCliente(cliente: Cliente) {
    this.clientes = [];
    this.pedido.cliente = cliente;
    if (this.pedido.cliente.endereco) {
      this.pedido.enderecoEntrega = this.pedido.cliente.endereco;
    }
    this.showFormCliente = true;
  }

  onFiltroTelefoneChange(filtro: string) {
    if (!filtro) {
      return;
    }
    const telefone = this.numbersPhone(filtro);
    if (!telefone || telefone.length < 8) {
      this.clientes = [];
      return;
    }

    this.loadClientes(telefone);
  }

  deletePedido(): Observable<boolean> {
    return this.api.delete(this.pedido._id)
      .pipe(switchMap(_ => of(true)), tap(_ => this.toasts.toast('Pedido cancelado!')));
  }

  numbersPhone(telefone: string): string {
    const numeros = telefone.match(/\d+/g);

    if (!numeros || !numeros.length) {
      return;
    }

    return numeros.reduce((prev: string, curr: string) => prev + curr, '');
  }

  ngAfterViewInit() {
    $('#tipo').formSelect();
  }

  fecharPedido() {

    this.pedido.itens = this.salgadosComerciais.filter(s => s.quantidade)
      .concat(this.salgadosFesta.filter(s => s.quantidade));

    if (!this.pedido.entregar) {
      this.pedido.enderecoEntrega = null;
    }

    if (this.pedido.entregar) {
      this.pedido.cliente.endereco = this.pedido.enderecoEntrega;
    } else if (!this.pedido.cliente._id) { // Se não vai entregar e o cliente não existe
      this.pedido.cliente.endereco = new Endereco();
    }

    // Verifica se cria um novo pedido ou atualiza um pedido existente
    let httpCall: Observable<Pedido | void>;
    let pedidoCall: Observable<Pedido | void>;
    if (this.pedido._id) {
      pedidoCall = this.api.put(this.pedido._id, this.pedido);
    } else {
      pedidoCall = this.api.post(this.pedido);
    }

    // Verifica se cria um novo cliente ou atualiza um cliente existente
    if (!this.pedido.cliente._id) {
      httpCall = this.clientesApi.post(this.pedido.cliente)
        .pipe(switchMap(_ => pedidoCall));
    } else if (this.atualizarCliente) {
      httpCall = this.clientesApi.put(this.pedido.cliente._id, this.pedido.cliente)
        .pipe(switchMap(_ => pedidoCall));
    }

    httpCall.pipe().subscribe(p => {
      if (p) {
        this.router.navigate([`/pedidos/${p._id}/confirmacao`]);
      } else {
        this.router.navigate([`/pedidos/${this.pedido._id}/confirmacao`]);
      }
    });

    /*const personalizados = this.itensSelecionados.filter(i => !i._id);
    const cardapio = this.itensSelecionados.filter(i => i._id);
    const pedido: Pedido = {
      _id: null,
      cliente: null,
      horario: new Date(),
      observacoes: null,
      entregar: false,
      itens: cardapio,
      usuario: this.usuarioService.user,
      enderecoEntrega: null
    };
    this.api.post(pedido)
      .subscribe(p => {
        this.api.addItens(p._id, personalizados)
          .subscribe(_ => {
            this.router.navigate(['/pedidos', p._id]);
          });
      });*/
  }

  get habilitaFecharPedido() {
    return this.salgadosFesta.some(s => !!s.quantidade) ||
      this.salgadosComerciais.some(s => !!s.quantidade);
  }

  addItemForaCardapio() {
    this.itemPersonalizadoModal.emit(true);
  }

  removeItem(item: ItemCardapio) {
    this.itensSelecionados.splice(this.itensSelecionados.indexOf(item), 1);
    item.quantidade = null;
  }

  loadItensPromisse(nome: string = null): Observable<ItemCardapio[]> {
    let obs: Observable<ItemCardapio[]>;
    if (nome) {
      obs = this.cardapioApi.getByNome(nome, new Date());
    } else {
      obs = this.cardapioApi.getAll(new Date());
    }
    return obs;
    // obs.subscribe((itens: ItemCardapio[]) => {
    //   this.salgadosFesta = itens.filter(i => i.tipo === TipoSalgado[TipoSalgado.Festa]);
    //   this.salgadosComerciais = itens.filter(i => i.tipo === TipoSalgado[TipoSalgado.Comercial]);
    // });
  }

  novoCliente() {
    this.pedido.cliente = new Cliente();
    let telefone = this.numbersPhone(this.telefoneFiltro);
    if (telefone && (telefone.length === 8 || telefone.length === 9)) {
      telefone = '34' + telefone;
    }
    if (telefone && telefone.length < 12) {
      this.pedido.cliente.fone1 = telefone;
    }
    this.showFormCliente = true;
  }

  trocarCliente() {
    this.telefoneFiltro = '';
    this.pedido.cliente = new Cliente();
    this.showFormCliente = false;
  }


  loadClientes(telefone: string = null) {
    let obs: Observable<Cliente[]>;
    if (telefone) {
      obs = this.clientesApi.getByTelefone(telefone);
    } else {
      obs = this.clientesApi.getAll();
    }
    obs.subscribe((clientes: Cliente[]) => {
      this.clientes = clientes;
    });
  }

  addItem(item: ItemCardapio) {
    this.itensSelecionados.push(item);
  }

}
