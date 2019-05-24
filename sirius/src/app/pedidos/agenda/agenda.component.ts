import { Component, OnInit, EventEmitter } from '@angular/core';
import { PedidosApiService } from '../../shared/api/pedidos-api.service';
import { Pedido } from '../../shared/models/pedido';
import { ToastsService } from 'src/app/shared/services/toasts.service';
import { PedidosService } from 'src/app/shared/services/pedidos.service';
import { datepicker } from 'src/environments/datepicker-options';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

declare var $: any;

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.css']
})
export class AgendaComponent implements OnInit {

  pedidos: Pedido[];
  data: Date;
  pedidoExcluir: Pedido;
  openModalSenha: EventEmitter<boolean>;

  constructor(private api: PedidosApiService, private toasts: ToastsService,
    private pedidosService: PedidosService, private router: Router) { }

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

    this.openModalSenha = new EventEmitter<boolean>();
    this.data = this.pedidosService.data;
    $('#data').datepicker(Object.assign(datepicker, {
      defaultDate: this.data,
      onSelect: (novaData: any) => {
        this.data = novaData;
        this.pedidosService.data = novaData;
        this.load();
      }
    }));

    this.load();
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

  load() {
    this.api.getByData(this.data)
      .subscribe((pedidos: Pedido[]) => {
        this.pedidos = pedidos;
      });
  }

  imprimePedido(pedido: Pedido) {
    this.api.postImpressao(pedido._id)
      .subscribe(pedidoAlterado => {
        let pedidoEncontrado = this.pedidos.find(p => p._id === pedido._id);
        if (pedidoEncontrado) {
          pedidoEncontrado = pedidoAlterado;
        }
      });
  }

}
