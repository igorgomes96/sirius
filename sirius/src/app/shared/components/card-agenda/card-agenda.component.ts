import { Component, OnInit, Input } from '@angular/core';
import { Pedido } from '../../models/pedido';

@Component({
  selector: 'app-card-agenda',
  templateUrl: './card-agenda.component.html',
  styleUrls: ['./card-agenda.component.css']
})
export class CardAgendaComponent implements OnInit {

  @Input() pedido: Pedido;
  constructor() { }

  ngOnInit() {
  }

  get valorTotal() {
    return this.pedido.itens.map(i => i.valor * (!i.quantidade ? 0 : i.quantidade))
      .reduce((p, c) => p + c);
  }

}
