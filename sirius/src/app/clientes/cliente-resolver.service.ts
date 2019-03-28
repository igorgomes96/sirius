import { Injectable } from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Cliente } from '../shared/models/cliente';
import { ClientesApiService } from '../shared/api/clientes-api.service';


@Injectable({
  providedIn: 'root'
})
export class ClienteResolverService implements Resolve<Cliente> {

  constructor(private router: Router, private api: ClientesApiService) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Cliente> {
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
