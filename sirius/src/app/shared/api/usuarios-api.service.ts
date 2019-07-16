import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { take, map, retry } from 'rxjs/operators';

import { Usuario } from './../models/usuario';
import { environment } from './../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuariosApiService {

  url: string;
  constructor(private httpClient: HttpClient) {
    this.url = environment.url + 'usuarios';
  }

  getAll(): Observable<Usuario[]> {
    return this.httpClient.get<Usuario[]>(this.url).pipe(
      take(1),
      map((usuarios: Usuario[]) => usuarios.filter(u => u.email !== 'admin@admin.com')));
  }

  getByNome(nome: string): Observable<Usuario[]> {
    return this.httpClient.get<Usuario[]>(this.url, { params: { nome: nome }}).pipe(take(1));
  }

  get(id: string): Observable<Usuario>  {
    return this.httpClient.get<Usuario>(this.url + `/${id}`).pipe(take(1));
  }

  post(usuario: Usuario): Observable<Usuario>  {
    return this.httpClient.post<Usuario>(this.url, usuario).pipe(take(1));
  }

  put(id: string, usuario: Usuario): Observable<void> {
    return this.httpClient.put<void>(this.url + `/${id}`, usuario).pipe(take(1));
  }

  delete(id: string, senha: string): Observable<Usuario>  {
    return this.httpClient.post<Usuario>(this.url + `/${id}/delete`, { senha: senha }).pipe(take(1));
  }

}
