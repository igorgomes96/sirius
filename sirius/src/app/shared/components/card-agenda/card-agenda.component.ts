import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { Pedido } from '../../models/pedido';
import { UsuarioService } from '../../../core/services/usuario.service';
import { PedidosApiService } from '../../../core/api/pedidos-api.service';
import { UtilService } from '../../../core/services/util.service';
import { retry } from 'rxjs/operators';
import { TipoSalgado, ItemCardapio } from '../../models/item-cardapio';

declare var $: any;

@Component({
  selector: 'app-card-agenda',
  templateUrl: './card-agenda.component.html',
  styleUrls: ['./card-agenda.component.css']
})
export class CardAgendaComponent implements OnInit {

  isAdmin = false;
  htmlImpressao = `<style>ul{list-style-type: none;padding: 0;}</style><body onload="window.focus(); window.print()">
    <h2>Teste</h2>@DADOS</body>`;

  @Input() enbableCkbPago = true;
  @Input() showActions = true;
  @Input() oneColumn = false;
  @Input() pedido: Pedido;
  @Input() mostrarRestaurar = false;
  @Output() pagamento: EventEmitter<Pedido> = new EventEmitter<Pedido>();
  @Output() restaurar: EventEmitter<Pedido> = new EventEmitter<Pedido>();
  @Output() editPedido = new EventEmitter<Pedido>();
  @Output() deletePedido = new EventEmitter<Pedido>();
  @Output() imprimePedido = new EventEmitter<Pedido>();

  constructor(private usuarioService: UsuarioService, private router: Router,
    private api: PedidosApiService, private utilService: UtilService) { }

  ngOnInit() {
    this.isAdmin = this.usuarioService.isAdmin();
  }

  edit() {
    this.editPedido.emit(this.pedido);
  }

  log() {
    this.router.navigate([`/pedidos/${this.pedido._id}/log`]);
  }

  delete() {
    this.deletePedido.emit(this.pedido);
  }

  pedidoPago() {
    this.pagamento.emit(this.pedido);
  }

  restaurarPedido() {
    this.restaurar.emit(this.pedido);
  }

  get valorTotal() {
    return this.subTotal(this.pedido.itens);
  }

  qtdaItens(itens: ItemCardapio[]) {
    return itens.map(i => i.quantidade)
      .reduce((p, c) => p + c);
  }

  subTotal(itens: ItemCardapio[]) {
    return itens.map(i => i.valor * (!i.quantidade ? 0 : i.quantidade))
      .reduce((p, c) => p + c);
  }

  get salgados() {
    return this.pedido && this.pedido.itens && this.pedido.itens
      .filter(i => i.tipo === TipoSalgado.Comercial || i.tipo === TipoSalgado.Festa);
  }

  get diversos() {
    return this.pedido && this.pedido.itens && this.pedido.itens
      .filter(i => i.tipo === TipoSalgado.Outros || i.tipo === TipoSalgado.Diversos);
  }

  imprimir() {
    if (this.pedido.impressao && this.pedido.impressao.horario && this.pedido.impressao.usuario) {
      // tslint:disable-next-line: max-line-length
      const confirmacao = confirm(`Esse pedido foi impresso às ${new Date(this.pedido.impressao.horario).toLocaleString()} por ${this.pedido.impressao.usuario.nome}. Deseja imprimir novamente?`);
      if (confirmacao) {
        this.imprime();
      }
    } else {
      this.imprime();
    }
  }

  private imprime() {
    this.api.postImpressao(this.pedido._id).subscribe();
    this.utilService.imprimirPedido(this.pedido);
  }
}

