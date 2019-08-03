import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ItemCardapio } from 'src/app/shared/models/item-cardapio';
import { CardapioApiService } from '../core/api/cardapio-api.service';

@Injectable({
  providedIn: 'root'
})
export class CardapioResolverService implements Resolve<ItemCardapio> {

    constructor(private api: CardapioApiService, private router: Router) {}

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<ItemCardapio> {
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
