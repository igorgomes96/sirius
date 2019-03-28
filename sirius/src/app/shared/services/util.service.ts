import { Injectable } from '@angular/core';
import { Cliente } from '../models/cliente';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor() { }

  public getDateTime(dataStr: string): Date {
    const data = new Date(dataStr);
    return new Date(data.getTime() - (data.getTimezoneOffset() * 60000));
  }

  public getTime(data: Date) {
    return data.toISOString().substr(11, 5);
  }

}
