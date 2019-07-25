import { Router, ActivatedRoute } from '@angular/router';
import { CardapioApiService } from './../../shared/api/cardapio-api.service';
import { Component, OnInit, EventEmitter } from '@angular/core';
import { ItemCardapio, TipoSalgado } from 'src/app/shared/models/item-cardapio';
import { map, tap, filter, switchMap, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Pedido } from 'src/app/shared/models/pedido';
import { PedidosApiService } from 'src/app/shared/api/pedidos-api.service';
import { Cliente, Endereco } from 'src/app/shared/models/cliente';
import { ClientesApiService } from 'src/app/shared/api/clientes-api.service';
import { timepicker } from 'src/environments/timepicker-options';
import { ToastsService } from 'src/app/shared/services/toasts.service';
import { UtilService } from 'src/app/shared/services/util.service';
import { HttpErrorResponse } from '@angular/common/http';
import { datepicker } from 'src/environments/datepicker-options';

declare var $: any;
declare var M: any;

@Component({
  selector: 'app-pedidos-form',
  templateUrl: './pedidos-form.component.html',
  styleUrls: ['./pedidos-form.component.css']
})
export class PedidosFormComponent implements OnInit {

  telefoneFiltro = '';
  pedido = new Pedido();
  clientes: Cliente[];
  showFormCliente = false;
  salgadosFesta: ItemCardapio[] = [];
  salgadosComerciais: ItemCardapio[] = [];
  TipoSalgado: typeof TipoSalgado = TipoSalgado;
  itemPersonalizadoModal = new EventEmitter<boolean>();
  atualizarCliente = true;
  openModalSenha = new EventEmitter<boolean>();
  // data: string;
  diversos: ItemCardapio[] = [];
  edicao = false;

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
    // this.data = new Date().toLocaleDateString('pt-BR');

    const onSelectHour = (hour: any, minutes: any) => {
      const data = new Date(this.pedido.horario);
      data.setHours(hour);
      data.setMinutes(minutes);
      this.pedido.horario = data;
    };

    const onSelectDate = (value: any) => {
      const data = new Date(value);
      this.pedido.horario = new Date(this.pedido.horario);
      data.setHours(this.pedido.horario.getHours());
      data.setMinutes(this.pedido.horario.getMinutes());
      this.pedido.horario = data;
    };

    const onSelectRepetirAte = (value: any) => {
      this.pedido.repetirAte = new Date(value);
    };

    const onCloseRepetirAte = () => {
      const instance = this.datePickerInstance('#repetirAte');
      if (!instance.toString()) {
        this.pedido.repetirAte = null;
      }
    };

    this.createDatePicker('#data', { ...datepicker, ...{
      onSelect: onSelectDate
    }});

    this.createDatePicker('#repetirAte', { ...datepicker, ...{
      onSelect: onSelectRepetirAte,
      setDefaultDate: false,
      showClearBtn: true,
      onClose: onCloseRepetirAte
    }});

    $('#hora').timepicker(Object.assign(timepicker, {
      onSelect: onSelectHour
    }));

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
        this.edicao = true;
        if (!pedido.entregar) {
          if (pedido.cliente.endereco) {
            pedido.enderecoEntrega = pedido.cliente.endereco;
          } else {
            pedido.enderecoEntrega = this.pedido.enderecoEntrega;
          }
        }
        this.diversos = pedido.itens.filter(i => i.tipo === TipoSalgado[TipoSalgado.Diversos]);
        this.updateQuantidades(pedido.itens);
        const hora = this.utilService.getTime(this.utilService.getDateTime(pedido.horario.toString()));
        $('#hora').val(hora);
        this.datePickerInstance('#data').destroy();
        this.createDatePicker('#data', { ...datepicker, ...{
          defaultDate: new Date(pedido.horario),
          onSelect: onSelectDate
        }});
        if (pedido.repetirAte) {
          this.datePickerInstance('#repetirAte').destroy();
          this.createDatePicker('#repetirAte', { ...datepicker, ...{
            defaultDate: new Date(pedido.repetirAte),
            onSelect: onSelectRepetirAte,
            showClearBtn: true
          }});
        }
        this.showFormCliente = true;
        this.pedido = pedido;
      });

  }

  datePickerInstance(selector: string) {
    return M.Datepicker.getInstance(document.querySelector(selector));
  }

  createDatePicker(selector: string, options: any) {
    return $(selector).datepicker(options);
  }

  get horario() {
    return $('#hora').val();
  }

  cancelarPedido() {
    const confirmacao = confirm('Tem certeza que deseja cancelar o pedido?');
    if (confirmacao) {
      this.router.navigate(['/pedidos']);
    }
  }

  updateQuantidades(salgados: ItemCardapio[]) {
    salgados.filter(s => s.tipo === TipoSalgado[TipoSalgado.Festa])
      .forEach(salgado => {
        const salgadoFesta = this.salgadosFesta.find(s => s._id === salgado._id);
        if (salgadoFesta) {
          salgadoFesta.quantidade = salgado.quantidade;
          salgadoFesta.semPimenta = salgado.semPimenta;
          salgadoFesta.triangulo = salgado.triangulo;
          if (salgadoFesta.semPimenta && salgadoFesta.reservaSemPimenta) {
            salgadoFesta.reservaSemPimenta += salgado.quantidade;
          } else if (salgadoFesta.reservaComPimenta) {
            salgadoFesta.reservaComPimenta += salgado.quantidade;
          }
        }
      });

    salgados.filter(s => s.tipo === TipoSalgado[TipoSalgado.Comercial])
      .forEach(salgado => {
        const salgadoComercial = this.salgadosComerciais.find(s => s._id === salgado._id);
        if (salgadoComercial) {
          salgadoComercial.quantidade = salgado.quantidade;
          salgadoComercial.semPimenta = salgado.semPimenta;
          salgadoComercial.triangulo = salgado.triangulo;
          if (salgadoComercial.semPimenta && salgadoComercial.reservaSemPimenta) {
            salgadoComercial.reservaSemPimenta += salgado.quantidade;
          } else if (salgadoComercial.reservaComPimenta) {
            salgadoComercial.reservaComPimenta += salgado.quantidade;
          }
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


  numbersPhone(telefone: string): string {
    const numeros = telefone.match(/\d+/g);
    if (!numeros || !numeros.length) {
      return;
    }
    return numeros.reduce((prev: string, curr: string) => prev + curr, '');
  }

  get itensSelecionados(): ItemCardapio[] {
    return this.salgadosComerciais.filter(s => s.quantidade)
      .concat(this.salgadosFesta.filter(s => s.quantidade))
      .concat(this.diversos.filter(s => s.quantidade));
  }

  atualizaInformacoesPedido() {
    this.pedido.horario = new Date(this.pedido.horario);
    // dataFormatted.setHours(this.pedido.horario.getHours());
    // dataFormatted.setMinutes(this.pedido.horario.getMinutes());
    // this.pedido.horario = dataFormatted;

    this.pedido.itens = this.itensSelecionados;

    if (!this.pedido.entregar) {
      this.pedido.enderecoEntrega = null;
    }

    if (this.pedido.entregar) {
      this.pedido.cliente.endereco = this.pedido.enderecoEntrega;
    } else if (!this.pedido.cliente._id) { // Se não vai entregar e o cliente não existe
      this.pedido.cliente.endereco = new Endereco();
    }
  }

  fecharPedido() {
    if (this.edicao) {
      this.openModalSenha.emit(true);
    } else {
      this.salvar(null);
    }
  }

  salvar(senha: string) {

    const qtdaMenorQue0 = this.itensSelecionados.filter((item) => item.quantidade < 0);
    if (qtdaMenorQue0.length > 0) {
      this.toasts.toast(`O salgado ${qtdaMenorQue0[0].nome} está com quantidade negativa!`);
      return;
    }

    if (!this.horario) {
      this.toasts.toast(`É necessário informar o horário!`);
      return;
    }

    const alemReserva = this.itensAlemReserva();
    if (alemReserva && alemReserva.length > 0) {
      this.toasts.toast(`O salgado '${alemReserva[0].nome}' ultrapassou a quantidade em reserva!`);
      return;
    }

    if (!this.pedido.cliente || !this.pedido.cliente.nome) {
      this.toasts.toast(`É necessário informar o nome do cliente!`);
      return;
    }

    if (!this.pedido.cliente.fone1 && !this.pedido.cliente.fone2) {
      this.toasts.toast(`É necessário informar o(s) telefone(s) do cliente!`);
      return;
    }

    this.atualizaInformacoesPedido();

    // Verifica se cria um novo pedido ou atualiza um pedido existente
    let httpCall: Observable<Pedido | void>;

    // Verifica se cria um novo cliente ou atualiza um cliente existente
    if (!this.pedido.cliente._id) {
      httpCall = this.clientesApi.post(this.pedido.cliente)
        .pipe(
          tap((novoCliente: Cliente) => this.pedido.cliente._id = novoCliente._id),
          switchMap(_ => this.pedidoCall(senha))
        );
    } else if (this.atualizarCliente) {
      httpCall = this.clientesApi.put(this.pedido.cliente._id, this.pedido.cliente)
        .pipe(
          catchError((err: HttpErrorResponse) => {
            if (err.status === 404) {
              return this.clientesApi.post(this.pedido.cliente);
            }
            return of(null);
          }),
          switchMap(_ => this.pedidoCall(senha))
        );
    } else {
      httpCall = this.pedidoCall(senha);
    }

    httpCall.pipe().subscribe((pedidoCriado: any) => {
      if (this.edicao) {
        this.router.navigate([`/pedidos`]);
      } else {
        this.router.navigate([`/pedidos/${pedidoCriado._id}/confirmacao`]);
      }
    });

  }

  pedidoCall(senha: string = null): Observable<Pedido | void> {
    if (this.edicao) {
      return this.api.put(this.pedido._id, this.pedido, senha);
    } else {
      return this.api.post(this.pedido);
    }
  }

  get habilitaFecharPedido() {
    return this.salgadosFesta.some(s => !!s.quantidade) ||
      this.salgadosComerciais.some(s => !!s.quantidade);
  }

  addItemForaCardapio() {
    this.itemPersonalizadoModal.emit(true);
  }

  itensAlemReserva(): ItemCardapio[] {
    return this.itensSelecionados.filter(item => {
      if (item.semPimenta) {
        return item.reservaSemPimenta && item.quantidade > item.reservaSemPimenta;
      } else {
        return item.reservaComPimenta && item.quantidade > item.reservaComPimenta;
      }
    });
  }

  loadItensPromisse(nome: string = null): Observable<ItemCardapio[]> {
    let obs: Observable<ItemCardapio[]>;
    if (nome) {
      obs = this.cardapioApi.getByNome(nome, new Date());
    } else {
      obs = this.cardapioApi.getAll(new Date());
    }
    return obs;
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
    this.diversos.push(item);
  }

}
