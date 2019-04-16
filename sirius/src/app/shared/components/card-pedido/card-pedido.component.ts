import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Pedido } from '../../models/pedido';

@Component({
  selector: 'app-card-pedido',
  templateUrl: './card-pedido.component.html',
  styleUrls: ['./card-pedido.component.css']
})
export class CardPedidoComponent implements OnInit {

  @Input() pedido: Pedido;
  @Output() editPedido = new EventEmitter<Pedido>();
  @Output() deletePedido = new EventEmitter<Pedido>();
  @Output() pagamento = new EventEmitter<Pedido>();

  constructor() { }

  ngOnInit() {
  }

  edit() {
    this.editPedido.emit(this.pedido);
  }

  delete() {
    this.deletePedido.emit(this.pedido);
  }

  pedidoPago() {
    this.pagamento.emit(this.pedido);
  }

  get valorTotal() {
    return this.pedido.itens.map(i => i.valor * (!i.quantidade ? 0 : i.quantidade))
      .reduce((p, c) => p + c);
  }
}
