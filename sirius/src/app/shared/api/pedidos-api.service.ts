import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Pedido } from '../models/pedido';
import { take, map, retry } from 'rxjs/operators';
import { ItemCardapio } from '../models/item-cardapio';
import { Util } from '../services/util';
import { Log, PedidoLog } from '../models/log';

@Injectable({
  providedIn: 'root'
})
export class PedidosApiService {

  url: string;
  constructor(private httpClient: HttpClient) {
    this.url = environment.url + 'pedidos';
  }

  private mapPedido(pedido: Pedido): Pedido {
    if (!pedido.cliente) {
      return pedido;
    }
    return Object.assign(pedido,
      {
        cliente: Object.assign(pedido.cliente, {
          enderecoStr: Util.enderecoCompleto(pedido.cliente.endereco),
          enderecoStrSimples: Util.enderecoSimples(pedido.cliente.endereco)
        }),
        enderecoStr: Util.enderecoCompleto(pedido.enderecoEntrega),
        enderecoStrSimples: Util.enderecoSimples(pedido.enderecoEntrega)
      });
  }

  private mapPedidos(pedidos: Pedido[]): Pedido[] {
    return pedidos.map(pedido => {
      if (!pedido.cliente) {
        return pedido;
      }
      return Object.assign(pedido,
        {
          cliente: Object.assign(pedido.cliente, {
            enderecoStr: Util.enderecoCompleto(pedido.cliente.endereco),
            enderecoStrSimples: Util.enderecoSimples(pedido.cliente.endereco)
          }),
          enderecoStr: Util.enderecoCompleto(pedido.enderecoEntrega),
          enderecoStrSimples: Util.enderecoSimples(pedido.enderecoEntrega)
        });
      }
    );
  }

  getAll(): Observable<Pedido[]> {
    return this.httpClient.get<Pedido[]>(this.url).pipe(
      take(1),
      map(this.mapPedidos));
  }

  getByData(data: Date): Observable<Pedido[]> {
    return this.httpClient.get<Pedido[]>(this.url, { params: { data: data.toString() } }).pipe(
      take(1),
      map(this.mapPedidos));
  }

  getAggregatedByData(data: Date): Observable<ItemCardapio[]> {
    return this.httpClient.get<ItemCardapio[]>(this.url + '/agrupados', { params: { data: data.toString() } }).pipe(take(1));
  }

  get(id: string): Observable<Pedido> {
    return this.httpClient.get<Pedido>(this.url + `/${id}`).pipe(
      take(1),
      map(this.mapPedido));
  }

  post(pedido: Pedido): Observable<Pedido> {
    return this.httpClient.post<Pedido>(this.url, pedido).pipe(
      take(1),
      map(this.mapPedido));
  }

  put(id: string, pedido: Pedido): Observable<void> {
    return this.httpClient.put<void>(this.url + `/${id}`, pedido).pipe(take(1));
  }

  log(id: string): Observable<PedidoLog> {
    return this.httpClient.get<PedidoLog>(this.url + `/${id}/log`).pipe(
      take(1));
  }

  confirmacaoPedido(id: string, pedido: Pedido, senha: string): Observable<void> {
    return this.httpClient.put<void>(this.url + `/${id}/confirmacao`, { pedido: pedido, senha: senha }).pipe(take(1));
  }


  restauraPedido(id: string): Observable<Pedido> {
    return this.httpClient.post<Pedido>(this.url + `/${id}/restaura`, null).pipe(
      take(1),
      map(this.mapPedido));
  }

  delete(id: string, senha: string): Observable<Pedido> {
    return this.httpClient.post<Pedido>(this.url + `/${id}/delete`, { senha: senha }).pipe(
      take(1),
      map(this.mapPedido));
  }

  deleteAdmin(id: string): Observable<Pedido> {
    return this.httpClient.delete<Pedido>(this.url + `/${id}`).pipe(
      take(1),
      map(this.mapPedido));
  }

  deleteItem(id: string, idItem: string): Observable<void> {
    return this.httpClient.delete<void>(this.url + `/${id}/item/${idItem}`).pipe(take(1));
  }

  additem(id: string, item: ItemCardapio): Observable<ItemCardapio> {
    return this.httpClient.post<ItemCardapio>(this.url + `/${id}/item`, item).pipe(take(1));
  }

  addItens(id: string, itens: ItemCardapio[]): Observable<any> {
    return this.httpClient.post<any>(this.url + `/${id}/itens`, itens).pipe(take(1));
  }

  getImpressoes(): Observable<any[]> {
    return this.httpClient.get<any[]>(this.url + `/impressoes`).pipe(take(1));
  }

  postImpressao(id: string): Observable<any> {
    return this.httpClient.post<any>(this.url + `/${id}/imprime`, null).pipe(take(1));
  }
}
