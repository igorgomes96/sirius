import { Component, OnInit } from '@angular/core';
import { PedidosApiService } from '../../shared/api/pedidos-api.service';
import { Pedido } from '../../shared/models/pedido';
import { ToastsService } from 'src/app/shared/services/toasts.service';
import { PedidosService } from 'src/app/shared/services/pedidos.service';
import { datepicker } from 'src/environments/datepicker-options';

declare var $: any;

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.css']
})
export class AgendaComponent implements OnInit {

  pedidos: Pedido[];
  data: Date;
  constructor(private api: PedidosApiService, private toasts: ToastsService,
    private pedidosService: PedidosService) { }

  atualizaPedido(pedido: Pedido) {
    this.api.put(pedido._id, pedido)
      .subscribe(_ => this.toasts.toast('Pedido atualizado com sucesso.'));
  }

  restaurarPedido(pedido: Pedido) {
    this.api.restauraPedido(pedido._id)
      .subscribe(_ => {
        this.load();
        this.toasts.toast('Pedido restaurado com sucesso.');
      });
  }

  ngOnInit() {

    this.data = new Date();
    this.data = this.pedidosService.data;
    $('#data').datepicker(Object.assign(datepicker, {
      defaultDate: this.data,
      onSelect: (novaData: any) => {
        this.data = novaData;
        this.load();
      }
    }));

    this.load();
  }

  load() {
    this.api.getByData(this.data)
      .subscribe((pedidos: Pedido[]) => {
        this.pedidos = pedidos;
      });
  }

}
