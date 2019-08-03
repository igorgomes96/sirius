import { Component, OnInit, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { PedidosApiService } from '../../core/api/pedidos-api.service';
import { Pedido } from 'src/app/shared/models/pedido';
import { ToastsService } from 'src/app/core/services/toasts.service';
import { TipoSalgado } from 'src/app/shared/models/item-cardapio';
import { SpinnerService } from 'src/app/core/services/spinner.service';
import { tap, finalize } from 'rxjs/operators';

declare var $: any;

@Component({
  selector: 'app-pedidos-list',
  templateUrl: './pedidos-list.component.html',
  styleUrls: ['./pedidos-list.component.css']
})
export class PedidosListComponent implements OnInit {

  pedidos: Pedido[] = [];
  data: Date;
  pedidoExcluir: Pedido;
  openModalSenha: EventEmitter<boolean>;

  constructor(private api: PedidosApiService, private router: Router, private toasts: ToastsService,
    private spinnerService: SpinnerService) { }

  ngOnInit() {
    this.openModalSenha = new EventEmitter<boolean>();
    this.data = new Date();

    this.load();
  }

  load() {
    this.api.getByData(this.data)
      .subscribe((pedidos: Pedido[]) => {
        this.pedidos = pedidos;
      });
  }

  get pedidosFesta(): Pedido[] {
    return this.pedidos.filter(p => p.tipo === TipoSalgado.Festa);
  }

  get pedidosComerciais(): Pedido[] {
    return this.pedidos.filter(p => p.tipo === TipoSalgado.Comercial);
  }

  get mensagemAlteracaoRecorrente(): any {
    if (this.pedidoExcluir && this.pedidoExcluir.recorrencia && this.pedidoExcluir.recorrencia.repetirAte) {
      const data = new Date(this.pedidoExcluir.recorrencia.repetirAte).toLocaleDateString();
      return {
        mensagem: `Esse pedido é recorrente. Deseja excluir também os próximos pedidos até a data ${data}?`,
        checkbox: 'Sim, excluir os pedidos recorrentes'
      };
    }
  }


  editPedido(pedido: Pedido) {
    this.router.navigate(['/pedidos', pedido._id]);
  }

  deletePedido(pedido: Pedido) {
    this.pedidoExcluir = pedido;
    this.openModalSenha.emit(true);
  }

  confirmarExclusao({ senha, recorrente }) {
    this.spinnerService.showSpinner(true);
    this.api.delete(this.pedidoExcluir._id, senha, recorrente)
      .pipe(finalize(() => this.spinnerService.showSpinner(false)))
      .subscribe(_ => {
        this.toasts.toast('Pedido excluído com sucesso!');
        this.load();
      });
  }

  atualizaPedido(pedido: Pedido) {
    this.api.put(pedido._id, pedido)
      .subscribe(_ => this.toasts.toast('Pedido atualizado com sucesso.'));
  }

}
