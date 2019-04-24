import { Component, OnInit } from '@angular/core';
import { PedidosApiService } from '../../shared/api/pedidos-api.service';
import { Pedido } from '../../shared/models/pedido';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.css']
})
export class AgendaComponent implements OnInit {

  pedidos: Pedido[];
  constructor(private api: PedidosApiService) { }

  ngOnInit() {

    this.api.getAll()
      .subscribe((pedidos: Pedido[]) => {
        this.pedidos = pedidos;
      });
  }

}
