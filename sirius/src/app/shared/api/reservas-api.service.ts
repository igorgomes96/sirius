import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { Reserva } from '../models/reserva';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReservasApiService {

  url: string;
  constructor(private httpClient: HttpClient) {
    this.url = environment.url + 'reservas';
  }

  getAll(): Observable<Reserva[]> {
    return this.httpClient.get<Reserva[]>(this.url).pipe(take(1));
  }

  getByData(data: Date): Observable<Reserva[]>  {
    return this.httpClient.get<Reserva[]>(this.url, { params: { data: data.toString() } }).pipe(take(1));
  }

  get(id: string): Observable<Reserva>  {
    return this.httpClient.get<Reserva>(this.url + `/${id}`).pipe(take(1));
  }

  post(reserva: Reserva): Observable<Reserva>  {
    return this.httpClient.post<Reserva>(this.url, reserva).pipe(take(1));
  }

  put(id: string, reserva: Reserva): Observable<void> {
    return this.httpClient.put<void>(this.url + `/${id}`, reserva).pipe(take(1));
  }

  delete(id: string): Observable<Reserva>  {
    return this.httpClient.delete<Reserva>(this.url + `/${id}`).pipe(take(1));
  }
}
