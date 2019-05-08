import { Component, OnInit, OnDestroy, EventEmitter } from '@angular/core';

import { PedidosApiService } from './../../shared/api/pedidos-api.service';
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
  pedidoExcluir: Pedido;
  openModalSenha: EventEmitter<boolean>;

  constructor(private api: PedidosApiService, private router: Router, private toasts: ToastsService) { }

  ngOnInit() {
    this.openModalSenha = new EventEmitter<boolean>();
    this.data = new Date();
    // this.data = this.pedidosService.data;
    // $('#data').datepicker(Object.assign(datepicker, {
    //   defaultDate: this.data,
    //   onSelect: (novaData: any) => {
    //     this.data = novaData;
    //     this.load();
    //   }
    // }));
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
    this.pedidoExcluir = pedido;
    this.openModalSenha.emit(true);
  }

  confirmarExclusao(senha: string) {
    this.api.delete(this.pedidoExcluir._id, senha)
      .subscribe(_ => {
        this.toasts.toast('Pedido excluído com sucesso!');
        this.load();
      });
  }

  ngOnDestroy() {
    // this.pedidosService.data = this.data;
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

  atualizaPedido(pedido: Pedido) {
    this.api.put(pedido._id, pedido)
      .subscribe(_ => this.toasts.toast('Pedido atualizado com sucesso.'));
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
