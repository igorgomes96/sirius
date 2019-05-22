import { UsuarioService } from './../shared/services/usuario.service';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Injectable, NgModule } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, empty, of } from 'rxjs';
import { ToastsService } from '../shared/services/toasts.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private toast: ToastsService, private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
      .pipe(
        tap(_ => {}, (event: HttpEvent<any>) => {
          if (event instanceof HttpErrorResponse) {
            if (event.status === 401) {
              this.router.navigate(['login']);
              return Observable.create(empty);
            }
            let mensagem = event.error || event.message;
            if (typeof(mensagem) === 'object') {
              mensagem = 'Erro desconhecido! Verifique sua conexão de rede';
            }
            this.toast.toast(mensagem);
            return Observable.create(empty);
          }
          return of(event);
        })
      );
  }
}

@Injectable()
export class WithCredentialsInterceptor implements HttpInterceptor {

  constructor(private usuarioService: UsuarioService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // if (!this.usuarioService.user) {
    //   return next.handle(req);
    // }

    const dupReq = req.clone({
      withCredentials: true
    });
    return next.handle(dupReq);
  }

}

@NgModule({
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: WithCredentialsInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    }
  ]
})
export class InterceptorModule { }
