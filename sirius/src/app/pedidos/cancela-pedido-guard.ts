import { PedidosDetalheComponent } from './pedidos-detalhe/pedidos-detalhe.component';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
    CanDeactivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
} from '@angular/router';


@Injectable({
    providedIn: 'root',
})
export class CancelaPedidoDeactivateGuard implements CanDeactivate<PedidosDetalheComponent> {

    canDeactivate(
        component: PedidosDetalheComponent,
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | boolean {
        if (!component.clienteAdded) {
            const confirmation = window.confirm('Cancelar o pedido atual?');
            return confirmation ? component.deletePedido() : false;
        }
        return true;
    }
}
