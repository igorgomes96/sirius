import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { Cliente } from '../models/cliente';
import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { UtilService } from '../services/util.service';
import { Util } from '../services/util';

@Injectable({
  providedIn: 'root'
})
export class ClientesApiService {

  url: string;
  constructor(private httpClient: HttpClient, private utilService: UtilService) {
    this.url = environment.url + 'clientes';
  }

  private mapCliente(cliente: Cliente): Cliente {
    return Object.assign(cliente, {
      enderecoStr: Util.enderecoCompleto(cliente.endereco),
      enderecoStrSimples: Util.enderecoSimples(cliente.endereco)
    });
  }

  private mapClientes(clientes: Cliente[]): Cliente[] {
    return clientes.map(cli => Object.assign(cli, {
      enderecoStr: Util.enderecoCompleto(cli.endereco),
      enderecoStrSimples: Util.enderecoSimples(cli.endereco)
    }));
  }

  getAll(): Observable<Cliente[]> {
    return this.httpClient.get<Cliente[]>(this.url).pipe(
      take(1),
      map(this.mapClientes));
  }

  getByNome(nome: string): Observable<Cliente[]> {
    return this.httpClient.get<Cliente[]>(this.url, { params: { nome: nome } }).pipe(
      take(1),
      map(this.mapClientes));
  }

  getByTelefone(telefone: string): Observable<Cliente[]> {
    return this.httpClient.get<Cliente[]>(this.url, { params: { telefone: telefone } }).pipe(
      take(1),
      map(this.mapClientes));
  }

  get(id: string): Observable<Cliente> {
    return this.httpClient.get<Cliente>(this.url + `/${id}`).pipe(
      take(1),
      map(this.mapCliente));
  }

  post(cliente: Cliente): Observable<Cliente> {
    return this.httpClient.post<Cliente>(this.url, cliente).pipe(
      take(1),
      map(this.mapCliente));
  }

  put(id: string, cliente: Cliente): Observable<void> {
    return this.httpClient.put<void>(this.url + `/${id}`, cliente).pipe(take(1));
  }

  delete(id: string): Observable<Cliente> {
    return this.httpClient.delete<Cliente>(this.url + `/${id}`).pipe(
      take(1),
      map(this.mapCliente));
  }
}
