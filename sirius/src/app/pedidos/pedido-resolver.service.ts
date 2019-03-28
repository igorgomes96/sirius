import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { PedidosApiService } from '../shared/api/pedidos-api.service';
import { Observable, of } from 'rxjs';
import { Pedido } from '../shared/models/pedido';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PedidoResolverService {

  constructor(private router: Router, private api: PedidosApiService) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Pedido> {
    if (route.paramMap.has('id')) {
      const id: string = route.paramMap.get('id');
      return this.api.get(id).pipe(
        catchError((err) => {
          this.router.navigate(['/not-found']);
          return of(null);
        })
      );
    } else {
      this.router.navigate(['/not-found']);
    }
  }
}
