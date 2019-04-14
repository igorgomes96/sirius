import { Component, OnInit, OnDestroy } from '@angular/core';

import { PedidosApiService } from './../../shared/api/pedidos-api.service';
import { datepicker } from 'src/environments/datepicker-options';
import { Pedido } from 'src/app/shared/models/pedido';
import { Router } from '@angular/router';
import { PedidosService } from 'src/app/shared/services/pedidos.service';
import { ToastsService } from 'src/app/shared/services/toasts.service';
import { htmlImpressao } from 'src/environments/impressao';

declare var $: any;

@Component({
  selector: 'app-pedidos-list',
  templateUrl: './pedidos-list.component.html',
  styleUrls: ['./pedidos-list.component.css']
})
export class PedidosListComponent implements OnInit, OnDestroy {

  pedidos: Pedido[] = [];
  data: Date;

  constructor(private api: PedidosApiService, private router: Router,
    private pedidosService: PedidosService, private toasts: ToastsService) { }

  ngOnInit() {
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

  editPedido(pedido: Pedido) {
    this.router.navigate(['/pedidos', pedido._id]);
  }

  deletePedido(pedido: Pedido) {
    const confirmacao = confirm('Tem certeza que deseja excluir esse pedido?');
    if (confirmacao) {
      this.api.delete(pedido._id)
        .subscribe(_ => {
          this.toasts.toast('Pedido excluído com sucesso!');
          this.load();
        });
    }
  }

  ngOnDestroy() {
    this.pedidosService.data = this.data;
  }

  print() {
    this.api.getImpressoes()
      .subscribe((impressoes: any[]) => {
        let confirmation = false;
        if (impressoes.length > 0) {
          // tslint:disable-next-line:max-line-length
          confirmation = window.confirm(`Os pedidos já foram impressos hoje pelo usuário '${impressoes[0]['usuario']['nome']}'. Deseja imprimir novamente?`);
          if (!confirmation) {
            return;
          }
        }
        this.imprimir();
        if (!confirmation) {
          this.api.postImpressao().subscribe();
        }
      });
  }

  private imprimir() {
    const w = window.open('', 'print');
    if (w) {
      w.document.write(htmlImpressao.replace('@DADOS', $('#pedidos').html()));
      setTimeout(() => {
        w.document.close();
      }, 1000);
    }
  }

}
