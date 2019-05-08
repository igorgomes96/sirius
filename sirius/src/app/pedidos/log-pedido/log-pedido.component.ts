import { Component, OnInit, EventEmitter } from '@angular/core';
import { PedidosApiService } from 'src/app/shared/api/pedidos-api.service';
import { ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { Log } from 'src/app/shared/models/log';
import { Pedido } from 'src/app/shared/models/pedido';

@Component({
  selector: 'app-log-pedido',
  templateUrl: './log-pedido.component.html',
  styleUrls: ['./log-pedido.component.css']
})
export class LogPedidoComponent implements OnInit {

  pedidoAnterior: Pedido;
  logs: Log[];
  openModalLogCompare = new EventEmitter<boolean>();

  constructor(private api: PedidosApiService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data
    .pipe(
      filter(d => d.hasOwnProperty('log')),
      map(d => d['log'])
    ).subscribe((log: Log[]) => {
      this.logs = log;
    });
  }

  compare(log: Log) {
    alert('Em desenvolvimento. Em breve essa tela será liberada.');
    // this.pedidoAnterior = log.pedido;
    // this.openModalLogCompare.emit(true);
  }

  proximoPedido(log: Log) {
    // let i = this.logs.indexOf(log);
  }

}
