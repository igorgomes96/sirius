import { Component, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, map, switchMap, finalize } from 'rxjs/operators';
import { Pedido } from 'src/app/shared/models/pedido';
import { UtilService } from 'src/app/core/services/util.service';
import { ItemCardapio } from 'src/app/shared/models/item-cardapio';
import { PedidosApiService } from 'src/app/core/api/pedidos-api.service';
import { ToastsService } from 'src/app/core/services/toasts.service';
import { SpinnerService } from 'src/app/core/services/spinner.service';

declare var $: any;
declare var M: any;

@Component({
  selector: 'app-confirmacao-pedido',
  templateUrl: './confirmacao-pedido.component.html',
  styleUrls: ['./confirmacao-pedido.component.css']
})
export class ConfirmacaoPedidoComponent implements OnInit {

  pedido: Pedido;
  openModalSenha: EventEmitter<boolean>;
  imprimir = false;

  constructor(private route: ActivatedRoute,
    private api: PedidosApiService,
    private toasts: ToastsService,
    private router: Router,
    private util: UtilService,
    private spinnerService: SpinnerService) { }

  ngOnInit() {
    this.openModalSenha = new EventEmitter<boolean>();
    this.route.data
      .pipe(filter(d => d.hasOwnProperty('pedido')), map(d => d['pedido']))
      .subscribe((pedido: Pedido) => {
        pedido.itens.forEach(item => item.selecionado = false);
        this.pedido = pedido;
      });
  }

  removeItem(item: ItemCardapio) {
    const remover = confirm('Tem certeza que deseja remover esse item do pedido?');
    if (remover) {
      this.api.deleteItem(this.pedido._id, item._id)
        .subscribe(_ => {
          this.toasts.toast('Item removido com sucesso!');
          this.api.get(this.pedido._id)
            .subscribe(p => this.pedido = p);
        });
    }
  }

  alteraItem(item: ItemCardapio) {
    this.api.deleteItem(this.pedido._id, item._id)
      .pipe(
        switchMap(_ => this.api.additem(this.pedido._id, item))
      ).subscribe(_ => {
        item.selecionado = false;
        this.toasts.toast('Item alterado com sucesso!');
      });
  }

  confirmarPedido({ senha }) {
    this.spinnerService.showSpinner(true);
    this.api.confirmacaoPedido(this.pedido._id, this.pedido, senha)
      .pipe(finalize(() => this.spinnerService.showSpinner(false)))
      .subscribe(() => {
        this.toasts.toast('Pedido salvo com sucesso!');
        this.router.navigate(['/pedidos']);
        if (this.imprimir) {
          this.util.imprimirPedido(this.pedido);
        }
      });
  }

  get valorTotal() {
    return this.pedido.itens.map(i => i.valor * i.quantidade).reduce((p, c) => p + c, 0);
  }

  get qtdaSalgados() {
    return this.pedido.itens.map(i => i.quantidade).reduce((prev, cur) => (+prev) + (+cur), 0);
  }

  cancelarPedido() {
    const cancelar = confirm('Tem certeza que deseja cancelar esse pedido?');
    if (cancelar) {
      this.spinnerService.showSpinner(true);
      this.api.deleteAdmin(this.pedido._id)
        .pipe(finalize(() => this.spinnerService.showSpinner(false)))
        .subscribe(_ => {
          this.router.navigate(['/pedidos']);
        });
    }
  }

  salvar(imprimir = false) {
    this.imprimir = imprimir;
    this.openModalSenha.emit(true);
  }

}
