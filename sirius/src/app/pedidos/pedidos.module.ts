import { NgModule } from '@angular/core';

import { PedidosRoutingModule } from './pedidos-routing.module';
import { SharedModule } from './../shared/shared.module';
import { PedidosListComponent } from './pedidos-list/pedidos-list.component';
import { PedidosFormComponent } from './pedidos-form/pedidos-form.component';
import { ItemModalComponent } from './item-modal/item-modal.component';
import { NgxPrintModule } from 'ngx-print';
import { PedidosAgrupadosComponent } from './pedidos-agrupados/pedidos-agrupados.component';
import { ConfirmacaoPedidoComponent } from './confirmacao-pedido/confirmacao-pedido.component';
import { AgendaComponent } from './agenda/agenda.component';
import { LogPedidoComponent } from './log-pedido/log-pedido.component';
import { LogCompareComponent } from './log-compare/log-compare.component';

@NgModule({
  declarations: [PedidosListComponent, PedidosFormComponent, ItemModalComponent,
    PedidosAgrupadosComponent, ConfirmacaoPedidoComponent, AgendaComponent, LogPedidoComponent, LogCompareComponent],
  imports: [
    SharedModule,
    NgxPrintModule,
    PedidosRoutingModule
  ]
})
export class PedidosModule { }
