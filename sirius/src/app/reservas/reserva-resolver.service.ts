import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Reserva } from './../shared/models/reserva';
import { ReservasApiService } from './../shared/api/reservas-api.service';

import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ReservaResolverService implements Resolve<Reserva> {

  constructor(private router: Router, private api: ReservasApiService) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Reserva> {
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
