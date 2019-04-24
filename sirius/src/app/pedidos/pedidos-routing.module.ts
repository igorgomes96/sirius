import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

import { PedidosListComponent } from './pedidos-list/pedidos-list.component';
import { PedidosFormComponent } from './pedidos-form/pedidos-form.component';
import { PedidoResolverService } from './pedido-resolver.service';
import { PedidosDetalheComponent } from './pedidos-detalhe/pedidos-detalhe.component';
import { CancelaPedidoDeactivateGuard } from './cancela-pedido-guard';
import { PedidosAgrupadosComponent } from './pedidos-agrupados/pedidos-agrupados.component';
import { ConfirmacaoPedidoComponent } from './confirmacao-pedido/confirmacao-pedido.component';
import { AgendaComponent } from './agenda/agenda.component';

const routes: Routes = [
    { path: '', component: PedidosListComponent },
    { path: 'novo', component: PedidosFormComponent },
    { path: 'agrupados', component: PedidosAgrupadosComponent },
    { path: 'agenda', component: AgendaComponent },
    {
        path: ':id',
        component: PedidosFormComponent,
        resolve: {
            pedido: PedidoResolverService
        }
    },
    {
        path: ':id/confirmacao',
        component: ConfirmacaoPedidoComponent,
        resolve: {
            pedido: PedidoResolverService
        }
    }
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PedidosRoutingModule {}
