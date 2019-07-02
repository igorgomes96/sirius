import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ItemCardapio } from '../models/item-cardapio';
import { environment } from 'src/environments/environment';
import { take, map, retry } from 'rxjs/operators';
import { Observable, forkJoin } from 'rxjs';
import { Reserva } from '../models/reserva';
import { ReservasApiService } from './reservas-api.service';

@Injectable({
  providedIn: 'root'
})
export class CardapioApiService {

  url: string;
  constructor(private httpClient: HttpClient, private reservasApi: ReservasApiService) {
    this.url = environment.url + 'cardapio';
  }

  mapItem(item: ItemCardapio, reservas: Reserva[]): ItemCardapio {
    const reserva = reservas.find(r => r.item._id === item._id && r.item.semPimenta === item.semPimenta);
    if (reserva) {
      item.reserva = reserva.qtda - reserva.qtdaVendida;
    }
    return item;
  }

  mapItens(itens: ItemCardapio[], reservas: Reserva[]): ItemCardapio[] {
    return itens.map(item => {
      return this.mapItem(item, reservas);
    });
  }

  getAll(dia: Date = null): Observable<ItemCardapio[]> {
    if (dia) {
      return forkJoin(
        [this.httpClient.get<ItemCardapio[]>(this.url),
        this.reservasApi.getByData(dia)]
      ).pipe(
        retry(3),
        map(data => this.mapItens(data[0], data[1])),
        take(1)
      );
    }
    return this.httpClient.get<ItemCardapio[]>(this.url);
  }

  getByNome(nome: string, dia: Date = null): Observable<ItemCardapio[]> {
    if (dia) {
      return forkJoin(
        [this.httpClient.get<ItemCardapio[]>(this.url, { params: { nome: nome } }),
        this.reservasApi.getByData(dia)]
      ).pipe(
        retry(3),
        map(data => this.mapItens(data[0], data[1])),
        take(1)
      );
    }
    return this.httpClient.get<ItemCardapio[]>(this.url, { params: { nome: nome } });
  }

  get(id: string, dia: Date = null): Observable<ItemCardapio> {
    if (dia) {
      return forkJoin(
        [this.httpClient.get<ItemCardapio>(this.url + `/${id}`),
        this.reservasApi.getByData(dia)]
      ).pipe(
        retry(3),
        map(data => this.mapItem(data[0], data[1])),
        take(1)
      );
    }
    return this.httpClient.get<ItemCardapio>(this.url + `/${id}`);
  }

  post(itemCardapio: ItemCardapio, dia: Date = null): Observable<ItemCardapio> {
    if (dia) {
      return forkJoin(
        [this.httpClient.post<ItemCardapio>(this.url, itemCardapio),
        this.reservasApi.getByData(dia)]
      ).pipe(
        retry(3),
        map(data => this.mapItem(data[0], data[1])),
        take(1)
      );
    }
    return this.httpClient.post<ItemCardapio>(this.url, itemCardapio);
  }

  put(id: string, itemCardapio: ItemCardapio): Observable<void> {
    return this.httpClient.put<void>(this.url + `/${id}`, itemCardapio).pipe(
      retry(3),
      take(1));
  }

  delete(id: string): Observable<ItemCardapio> {
    return this.httpClient.delete<ItemCardapio>(this.url + `/${id}`).pipe(
      retry(3),
      take(1));
  }
}
