import { Router } from '@angular/router';
import { CardapioApiService } from './../../shared/api/cardapio-api.service';
import { Component, OnInit, AfterViewInit, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ItemCardapio, TipoSalgado } from 'src/app/shared/models/item-cardapio';
import { distinctUntilChanged, debounceTime, map, tap, filter } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Pedido } from 'src/app/shared/models/pedido';
import { PedidosApiService } from 'src/app/shared/api/pedidos-api.service';
import { CardapioService } from 'src/app/shared/services/cardapio.service';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { Cliente } from 'src/app/shared/models/cliente';
import { ClientesApiService } from 'src/app/shared/api/clientes-api.service';
import { datepicker } from 'src/environments/datepicker-options';
import { timepicker } from 'src/environments/timepicker-options';

declare var $: any;

@Component({
  selector: 'app-pedidos-form',
  templateUrl: './pedidos-form.component.html',
  styleUrls: ['./pedidos-form.component.css']
})
export class PedidosFormComponent implements OnInit, AfterViewInit {

  formFiltroCardapio: FormGroup;
  pedido = new Pedido();
  itens: ItemCardapio[] = [];
  clientes: Cliente[];
  itensSelecionados: ItemCardapio[] = [];
  TipoSalgado: typeof TipoSalgado = TipoSalgado;
  itemPersonalizadoModal = new EventEmitter<boolean>();

  constructor(private cardapioApi: CardapioApiService, private formBuilder: FormBuilder,
    private router: Router, private api: PedidosApiService,
    private cardapioService: CardapioService, private usuarioService: UsuarioService,
    private clientesApi: ClientesApiService) { }

  ngOnInit() {
    this.pedido.horario = new Date();
    const onSelectDate = (value: any) => {
      const data = new Date(value);
      this.pedido.horario = new Date(this.pedido.horario);
      data.setHours(this.pedido.horario.getHours());
      data.setMinutes(this.pedido.horario.getMinutes());
      this.pedido.horario = data;
    };

    this.formFiltroCardapio = this.formBuilder.group({
      filtroTelefone: ['']
      // filtro: [''],
      // tipo: [this.cardapioService.tipoSalgado]
    });

    this.formFiltroCardapio.get('filtroTelefone').valueChanges
      .pipe(
        distinctUntilChanged(),
        debounceTime(300),
        tap(_ => this.clientes = []),
        map((v: string) => v.match(/\d+/g)),
        filter((numbers: string[]) => numbers && numbers.length > 0),
        map((numbers: string[]) => numbers.reduce((prev: string, curr: string) => prev + curr, '')),
        filter((v: string) => v.length >= 8)
      ).subscribe(v => {
        this.loadClientes(v);
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

    // this.formFiltroCardapio.get('filtro').valueChanges
    //   .pipe(distinctUntilChanged(), debounceTime(300))
    //   .subscribe(v => this.load(v, this.formFiltroCardapio.get('tipo').value));

    // this.formFiltroCardapio.get('tipo').valueChanges
    //   .pipe(distinctUntilChanged(), debounceTime(300), tap(v => this.cardapioService.tipoSalgado = v))
    //   .subscribe(v => this.load(this.formFiltroCardapio.get('filtro').value, v));

    // this.load(null, this.formFiltroCardapio.get('tipo').value);
  }

  ngAfterViewInit() {
    $('#tipo').formSelect();
  }

  get itensNaoSelecionados() {
    return this.itens.filter(i => !this.itensSelecionados.some(is => is._id === i._id));
  }

  fecharPedido() {
    const personalizados = this.itensSelecionados.filter(i => !i._id);
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
      });
  }

  addItemForaCardapio() {
    this.itemPersonalizadoModal.emit(true);
  }

  removeItem(item: ItemCardapio) {
    this.itensSelecionados.splice(this.itensSelecionados.indexOf(item), 1);
    item.quantidade = null;
  }

  load(nome: string = null, tipo: string = null) {
    let obs: Observable<ItemCardapio[]>;
    if (nome) {
      obs = this.cardapioApi.getByNome(nome, new Date());
    } else {
      obs = this.cardapioApi.getAll(new Date());
    }
    obs.pipe(map((itens: ItemCardapio[]) => {
      return itens.filter(i => i.tipo === tipo);
    })).subscribe((itens: ItemCardapio[]) => {
      this.itens = itens;
    });
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
