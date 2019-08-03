import { ToastsService } from '../../core/services/toasts.service';
import { LoginApiService } from '../../core/api/login-api.service';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanLoad, Route, UrlSegment, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AdminGuard implements CanLoad {
    constructor(private usuarioApi: LoginApiService, private toasts: ToastsService,
        private router: Router) { }

    canLoad(
        route: Route, segments: UrlSegment[]
    ): Observable<boolean> | boolean {
        return this.usuarioApi.usuario()
            .pipe(map(usuario => {
                if (!usuario || !usuario['autorizado'] ||
                    usuario['perfil'] !== 'Administrador') {
                    this.toasts.toast('Usuário sem Permissão!');
                    this.router.navigate(['/pedidos']);
                    return false;
                }
                return true;
            }));
    }
}
