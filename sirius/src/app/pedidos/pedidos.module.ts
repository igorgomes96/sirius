import { NgModule } from '@angular/core';

import { PedidosRoutingModule } from './pedidos-routing.module';
import { SharedModule } from './../shared/shared.module';
import { PedidosListComponent } from './pedidos-list/pedidos-list.component';
import { PedidosFormComponent } from './pedidos-form/pedidos-form.component';
import { PedidosDetalheComponent } from './pedidos-detalhe/pedidos-detalhe.component';
import { ItemModalComponent } from './item-modal/item-modal.component';
import { ClienteModalComponent } from './cliente-modal/cliente-modal.component';
import { NgxPrintModule } from 'ngx-print';
import { PedidosAgrupadosComponent } from './pedidos-agrupados/pedidos-agrupados.component';

@NgModule({
  declarations: [PedidosListComponent, PedidosFormComponent, PedidosDetalheComponent, ItemModalComponent, ClienteModalComponent, PedidosAgrupadosComponent],
  imports: [
    SharedModule,
    NgxPrintModule,
    PedidosRoutingModule
  ]
})
export class PedidosModule { }
