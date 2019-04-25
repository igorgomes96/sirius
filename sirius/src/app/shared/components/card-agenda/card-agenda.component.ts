import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Pedido } from '../../models/pedido';

@Component({
  selector: 'app-card-agenda',
  templateUrl: './card-agenda.component.html',
  styleUrls: ['./card-agenda.component.css']
})
export class CardAgendaComponent implements OnInit {

  @Input() pedido: Pedido;
  @Output() pagamento: EventEmitter<Pedido> = new EventEmitter<Pedido>();
  @Output() restaurar: EventEmitter<Pedido> = new EventEmitter<Pedido>();

  constructor() { }

  ngOnInit() {
  }

  pedidoPago() {
    this.pagamento.emit(this.pedido);
  }

  restaurarPedido() {
    this.restaurar.emit(this.pedido);
  }

  get valorTotal() {
    return this.pedido.itens.map(i => i.valor * (!i.quantidade ? 0 : i.quantidade))
      .reduce((p, c) => p + c);
  }

}
