import { Component, OnInit, EventEmitter } from '@angular/core';
import { PedidosApiService } from 'src/app/shared/api/pedidos-api.service';
import { ActivatedRoute } from '@angular/router';
import { filter, map, tap, switchMap } from 'rxjs/operators';
import { Log, PedidoLog } from 'src/app/shared/models/log';
import { Pedido } from 'src/app/shared/models/pedido';
import { Util } from 'src/app/shared/services/util';
import { Location } from '@angular/common';

@Component({
  selector: 'app-log-pedido',
  templateUrl: './log-pedido.component.html',
  styleUrls: ['./log-pedido.component.css']
})
export class LogPedidoComponent implements OnInit {

  pedidoAnterior: Pedido;
  pedidoPosterior: Pedido;
  logs: Log[];
  pedido: Pedido;
  openModalLogCompare = new EventEmitter<boolean>();

  constructor(private api: PedidosApiService, private route: ActivatedRoute,
    private location: Location) { }

  ngOnInit() {
    this.route.data
    .pipe(
      filter(d => d.hasOwnProperty('log')),
      map(d => d['log']),
      switchMap((log: PedidoLog) => {
        this.logs = log.logs;
        return this.api.get(log.pedidoId);
      })
    ).subscribe((pedido: Pedido) => {
      this.pedido = pedido;
    });
  }

  voltar() {
    this.location.back();
  }

  compare(log: Log) {
    // alert('Em desenvolvimento. Em breve essa tela será liberada.');
    this.pedidoAnterior = log.pedido;
    this.pedidoAnterior.enderecoStrSimples = Util.enderecoSimples(this.pedidoAnterior.enderecoEntrega);
    this.pedidoAnterior.enderecoStr = Util.enderecoSimples(this.pedidoAnterior.enderecoEntrega);
    this.pedidoPosterior = this.proximoPedido(log);
    this.openModalLogCompare.emit(true);
  }

  proximoPedido(log: Log) {
    const indice = this.logs.indexOf(log);
    let proximo = null;
    for (let i = indice + 1; i < this.logs.length; i++) {
      if (this.logs[i].pedido) {
        proximo = this.logs[i].pedido;
        break;
      }
    }
    if (!proximo) {
      proximo = this.pedido;
    }
    return proximo;
  }

}
