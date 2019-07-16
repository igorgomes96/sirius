import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'telefone'
})
export class TelefonePipe implements PipeTransform {

  transform(value: string): any {
    if (!value) {
      return value;
    }
    const numbers = value.match(/\d/g);
    value = numbers.join('');
    switch (value.length) {
      case 8:
        return `${value.substr(0, 4)}-${value.substr(4)}`;
      case 9:
        return `${value.substr(0, 1)} ${value.substr(1, 4)}-${value.substr(5)}`;
      case 10:
        return `(${value.substr(0, 2)}) ${value.substr(2, 4)}-${value.substr(6)}`;
      case 11:
        return `(${value.substr(0, 2)}) ${value.substr(2, 1)} ${value.substr(3, 4)}-${value.substr(7)}`;
      default:
        return value;
    }
  }

}
