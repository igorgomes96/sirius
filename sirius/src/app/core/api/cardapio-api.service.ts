import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ItemCardapio } from '../../shared/models/item-cardapio';
import { environment } from 'src/environments/environment';
import { take, map, tap } from 'rxjs/operators';
import { Observable, forkJoin } from 'rxjs';
import { Reserva } from '../../shared/models/reserva';
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
    const reservasEncontradas = reservas.filter(r => r.item._id === item._id);
    if (reservasEncontradas) {
      const reservaComPimenta = reservasEncontradas.find(r => !r.item.semPimenta);
      const reservaSemPimenta = reservasEncontradas.find(r => r.item.semPimenta);
      item.reservaComPimenta = reservaComPimenta ? reservaComPimenta.qtda - reservaComPimenta.qtdaVendida : undefined;
      item.reservaSemPimenta = reservaSemPimenta ? reservaSemPimenta.qtda - reservaSemPimenta.qtdaVendida : undefined;
    }
    return item;
  }

  mapItens(itens: ItemCardapio[], reservas: Reserva[]): ItemCardapio[] {
    return itens.map(item => {
      return this.mapItem(item, reservas);
    });
  }

  getAll(dia: Date = null): Observable<ItemCardapio[]> {
    console.log(dia);
    if (dia) {
      return forkJoin(
        [this.httpClient.get<ItemCardapio[]>(this.url),
        this.reservasApi.getByData(dia)]
      ).pipe(
        tap(console.log),
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
        map(data => this.mapItem(data[0], data[1])),
        take(1)
      );
    }
    return this.httpClient.post<ItemCardapio>(this.url, itemCardapio);
  }

  put(id: string, itemCardapio: ItemCardapio): Observable<void> {
    return this.httpClient.put<void>(this.url + `/${id}`, itemCardapio).pipe(take(1));
  }

  delete(id: string): Observable<ItemCardapio> {
    return this.httpClient.delete<ItemCardapio>(this.url + `/${id}`).pipe(take(1));
  }
}
