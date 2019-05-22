import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { take, retry } from 'rxjs/operators';

import { Unidade } from '../models/item-cardapio';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UnidadesApiService {

  url: string;
  constructor(private httpClient: HttpClient) {
    this.url = environment.url + 'unidades';
  }

  getAll(): Observable<Unidade[]> {
    return this.httpClient.get<Unidade[]>(this.url).pipe(
      retry(3),
      take(1));
  }

  post(unidade: Unidade): Observable<Unidade>  {
    return this.httpClient.post<Unidade>(this.url, unidade).pipe(
      retry(3),
      take(1));
  }

  delete(id: string): Observable<Unidade>  {
    return this.httpClient.delete<Unidade>(this.url + `/${id}`).pipe(
      retry(3),
      take(1));
  }
}
