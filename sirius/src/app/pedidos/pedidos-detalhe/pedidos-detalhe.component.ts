import { ToastsService } from './../../shared/services/toasts.service';
import { ClientesApiService } from './../../shared/api/clientes-api.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, AfterViewInit, EventEmitter } from '@angular/core';

import { datepicker } from 'src/environments/datepicker-options';
import { timepicker } from 'src/environments/timepicker-options';
import { Cliente } from 'src/app/shared/models/cliente';
import { distinctUntilChanged, debounceTime, filter, map, tap, switchMap } from 'rxjs/operators';
import { Pedido } from 'src/app/shared/models/pedido';
import { ActivatedRoute, Router } from '@angular/router';
import { PedidosApiService } from 'src/app/shared/api/pedidos-api.service';
import { UtilService } from 'src/app/shared/services/util.service';
import { ItemCardapio, TipoSalgado } from 'src/app/shared/models/item-cardapio';
import { Observable, of } from 'rxjs';
import { CardapioApiService } from 'src/app/shared/api/cardapio-api.service';

declare var $: any;
declare var M: any;

@Component({
  selector: 'app-pedidos-detalhe',
  templateUrl: './pedidos-detalhe.component.html',
  styleUrls: ['./pedidos-detalhe.component.css']
})
export class PedidosDetalheComponent implements OnInit, AfterViewInit {

  formFiltroCardapio: FormGroup;
  formFiltro: FormGroup;
  clientes: Cliente[];
  pedido: Pedido = new Pedido();
  itens: ItemCardapio[] = [];
  clienteAdded = false;
  TipoSalgado: typeof TipoSalgado = TipoSalgado;
  itemPersonalizadoModal = new EventEmitter<boolean>();
  novoClienteModal = new EventEmitter<boolean>();

  constructor(private formBuilder: FormBuilder, private router: Router,
    private clientesApi: ClientesApiService, private route: ActivatedRoute,
    private api: PedidosApiService, private toasts: ToastsService,
    private utilService: UtilService, private cardapioApi: CardapioApiService) { }

  ngOnInit() {

    const onSelectDate = (value: any) => {
      const data = new Date(value);
      this.pedido.horario = new Date(this.pedido.horario);
      data.setHours(this.pedido.horario.getHours());
      data.setMinutes(this.pedido.horario.getMinutes());
      this.pedido.horario = data;
    };

    this.pedido.horario = new Date();
    this.formFiltro = this.formBuilder.group({
      filtro: ['']
    });

    this.formFiltroCardapio = this.formBuilder.group({
      filtro: [''],
      tipo: [TipoSalgado.Comercial]
    });

    $('#data').datepicker(Object.assign(datepicker, {
      onSelect: onSelectDate
    }));

    $('#hora').timepicker(Object.assign(timepicker, {
      onSelect: (hour: any, minutes: any) => {
        const data = new Date(this.pedido.horario);
        data.setHours(hour);
        data.setMinutes(minutes);
        this.pedido.horario = data;
      }
    }));

    this.route.data
      .pipe(filter(d => d.hasOwnProperty('pedido')), map(d => d['pedido']))
      .subscribe((pedido: Pedido) => {
        this.clienteAdded = !!pedido.cliente;
        this.pedido = pedido;
        $('#hora').val(this.utilService.getTime(this.utilService.getDateTime(this.pedido.horario.toString())));
        const instance = M.Datepicker.getInstance($('#data')[0]);
        if (instance) {
          instance.destroy();
        }
        const options = datepicker;
        options.defaultDate = new Date(this.pedido.horario);
        options['onSelect'] = onSelectDate;
        $('#data').datepicker(options);
      });

    this.formFiltro.get('filtro').valueChanges
      .pipe(distinctUntilChanged(), debounceTime(200))
      .subscribe(v => {
        if (v) {
          this.pedido.cliente = null;
        }
        this.loadClientes(v);
      });

    this.formFiltroCardapio.get('filtro').valueChanges
      .pipe(distinctUntilChanged(), debounceTime(300))
      .subscribe(v => this.loadItens(v, this.formFiltroCardapio.get('tipo').value));

    this.formFiltroCardapio.get('tipo').valueChanges
      .pipe(distinctUntilChanged(), debounceTime(300))
      .subscribe(v => this.loadItens(this.formFiltroCardapio.get('filtro').value, v));
  }

  entregarChange(_: any) {
    if (this.pedido.entregar) {
      if (this.pedido.cliente) {
        this.pedido.enderecoEntrega = this.pedido.cliente.endereco;
      } else {
        this.pedido.enderecoEntrega = {
          bairro: '',
          cidade: 'Araguari',
          numero: 0,
          rua: '',
          uf: 'MG'
        };
      }
    } else {
      this.pedido.enderecoEntrega = null;
    }
  }

  novoCliente() {
    this.novoClienteModal.emit(true);
  }

  addItemForaCardapio() {
    this.itemPersonalizadoModal.emit(true);
  }

  ngAfterViewInit() {
    $('#tipo').formSelect();
  }

  reloadPedido() {
    this.api.get(this.pedido._id)
      .subscribe(pedido => this.pedido = pedido);
  }

  alteraCliente() {
    this.pedido.cliente = null;
  }

  loadItens(nome: string = null, tipo: string = null) {
    if (!nome) {
      this.itens = [];
      return;
    }
    let obs: Observable<ItemCardapio[]>;
    if (nome) {
      obs = this.cardapioApi.getByNome(nome, this.pedido.horario);
    } else {
      obs = this.cardapioApi.getAll(this.pedido.horario);
    }
    obs.pipe(map((itens: ItemCardapio[]) => {
      return itens.filter(i => i.tipo === tipo);
    })).subscribe((itens: ItemCardapio[]) => {
      this.itens = itens;
    });
  }

  get itensNaoSelecionados() {
    return this.itens.filter(i => !this.pedido.itens.some(is => is._id === i._id));
  }

  salvar() {
    this.api.put(this.pedido._id, this.pedido)
      .subscribe(_ => {
        this.clienteAdded = true;
        this.toasts.toast('Pedido salvo com sucesso!');
        this.router.navigate(['/pedidos']);
      });
  }

  deletePedido(): Observable<boolean> {
    return this.api.delete(this.pedido._id)
      .pipe(switchMap(_ => of(true)), tap(_ => this.toasts.toast('Pedido cancelado!')));
  }

  loadClientes(nome: string) {
    if (!nome) {
      this.clientes = [];
      return;
    }

    this.clientesApi.getByNome(nome)
      .subscribe((clientes: Cliente[]) => this.clientes = clientes);
  }

  get valorTotal() {
    return this.pedido.itens.map(i => i.valor * i.quantidade).reduce((p, c) => p + c, 0);
  }

  selecionaCliente(cliente: Cliente) {
    this.pedido.cliente = cliente;
    this.formFiltro.get('filtro').reset();
    this.clientes = [];
    this.api.put(this.pedido._id, this.pedido).subscribe();
  }

  removeItem(item: ItemCardapio) {
    this.api.deleteItem(this.pedido._id, item._id)
      .subscribe(_ => {
        this.toasts.toast('Item removido com sucesso!');
        this.api.get(this.pedido._id)
          .subscribe(p => this.pedido = p);
      });
  }

  addItem(item: ItemCardapio) {
    this.api.additem(this.pedido._id, item)
      .subscribe(_ => {
        this.toasts.toast('Item adicionado com sucesso!');
        this.reloadPedido();
        this.formFiltroCardapio.get('filtro').reset();
      });
  }

  saveCliente(cliente: Cliente) {
    this.clientesApi.post(cliente)
      .pipe(switchMap((cli: Cliente) => {
        this.pedido.cliente = cli;
        return this.api.put(this.pedido._id, this.pedido);
      }))
      .subscribe(_ => {
        this.reloadPedido();
      });
  }

}
