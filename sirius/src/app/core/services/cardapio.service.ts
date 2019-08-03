import { Injectable } from '@angular/core';
import { TipoSalgado } from 'src/app/shared/models/item-cardapio';

@Injectable({
  providedIn: 'root'
})
export class CardapioService {

  private _tipoSalgado: string = TipoSalgado.Comercial;
  constructor() { }

  get tipoSalgado(): string {
    return this._tipoSalgado;
  }

  set tipoSalgado(tipo: string) {
    this._tipoSalgado = tipo;
  }

}
