import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Usuario } from '../shared/models/usuario';
import { UsuariosApiService } from '../shared/api/usuarios-api.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsuarioResolverService implements Resolve<Usuario> {

  constructor(private router: Router, private api: UsuariosApiService) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Usuario> {
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
