import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { take, retry, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { Usuario } from './../models/usuario';


@Injectable({
  providedIn: 'root'
})
export class LoginApiService {

  constructor(private httpClient: HttpClient) {
  }

  login(usuario: Usuario): Observable<Usuario> {
    return this.httpClient.post<Usuario>(environment.url + 'login', usuario).pipe(take(1));
  }

  cadastrarSenha(usuario: any): Observable<any> {
    return this.httpClient.post(environment.url + 'cadastrarsenha', usuario).pipe(take(1));
  }

  resetSenha(id: string): Observable<any> {
    return this.httpClient.post<any>(environment.url + 'resetsenha', { id: id }).pipe(take(1));
  }

  usuario(): Observable<any> {
    return this.httpClient.get<any>(environment.url + 'usuario').pipe(take(1));
  }
}
