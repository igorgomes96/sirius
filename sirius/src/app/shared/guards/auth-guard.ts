import { UsuarioService } from './../services/usuario.service';
import { LoginApiService } from './../api/login-api.service';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanLoad, Route, UrlSegment } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {
    constructor(private usuarioApi: LoginApiService, private usuarioService: UsuarioService,
        private router: Router) { }

    private isAuth(): Observable<boolean> {
        return this.usuarioApi.usuario()
            .pipe(
                map(usuario => {
                    if (!usuario || !usuario.autorizado) {
                        this.usuarioService.user = null;
                        this.router.navigate(['/login']);
                        return false;
                    } else {
                        this.usuarioService.user = usuario;
                        return true;
                    }
                })
            );
    }
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | boolean {
        return this.isAuth();
    }

    canLoad(
        route: Route, segments: UrlSegment[]
    ): Observable<boolean> | boolean {
        return this.isAuth();
    }
}
