import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { PedidosApiService } from '../core/api/pedidos-api.service';
import { Observable, of } from 'rxjs';
import { Log } from '../shared/models/log';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LogResolverService {

  constructor(private router: Router, private api: PedidosApiService) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Log[]> {
    if (route.paramMap.has('id')) {
      const id: string = route.paramMap.get('id');
      return this.api.log(id).pipe(
        catchError(_ => {
          this.router.navigate(['/not-found']);
          return of(null);
        })
      );
    } else {
      this.router.navigate(['/not-found']);
    }
  }
}
