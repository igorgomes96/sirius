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

  public stringToDate(date: any, format: any, delimiter: any): any {
    try {
      const formatLowerCase = format.toLowerCase();
      const formatItems = formatLowerCase.split(delimiter);
      const dateItems = date.split(delimiter);
      const monthIndex = formatItems.indexOf('mm');
      const dayIndex = formatItems.indexOf('dd');
      const yearIndex = formatItems.indexOf('yyyy');
      if (dateItems[yearIndex].length !== 4 || dateItems[monthIndex].length !== 2 ||
        dateItems[dayIndex].length !== 2) {
          throw new Error();
      }
      // tslint:disable-next-line:radix
      let month = parseInt(dateItems[monthIndex]);
      month -= 1;
      const formatedDate = new Date(dateItems[yearIndex], month, dateItems[dayIndex]);
      return formatedDate;
    } catch {
      return 'Erro na conversão!';
    }
  }

}
