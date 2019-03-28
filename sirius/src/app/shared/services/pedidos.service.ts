import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {

  private _data = new Date();

  constructor() { }

  get data() {
    return this._data;
  }

  set data(data: Date) {
    this._data = data;
  }
  
}
