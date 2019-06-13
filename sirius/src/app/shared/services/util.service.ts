import { Injectable } from '@angular/core';
import { Pedido } from '../models/pedido';
import { CurrencyPipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor(private currencyPipe: CurrencyPipe) { }

  public getDateTime(dataStr: string): Date {
    const data = new Date(dataStr);
    return new Date(data.getTime() - (data.getTimezoneOffset() * 60000));
  }

  public getTime(data: Date) {
    return data.toISOString().substr(11, 5);
  }

  public imprimirPedido(pedido: Pedido, tamanhoLinha: number = 38) {

    let str = `Salgados Sirius\nCliente: ${pedido.cliente.nome}\nEnd.: ${pedido.enderecoStr}\nPago? ${pedido.pago ? 'Sim' : 'Não'}\n\n`;

    pedido.itens.forEach(item => {
      const nome = `${item.quantidade} un. de ${item.nome} .`;
      const valor = ` ${this.convertToReal(item.quantidade * item.valor)}`;
      const dif = tamanhoLinha - ((nome.length + valor.length) % tamanhoLinha);
      str += `${nome}${'.'.repeat(dif)}${valor}\n`;
    });
    const totalStr = 'Total .';
    const total = ` ${this.convertToReal(pedido.itens.reduce((prev, cur) => prev + (cur.quantidade * cur.valor), 0))}`;
    const difTotal = tamanhoLinha - ((totalStr.length + total.length) % tamanhoLinha);
    str += `\n${totalStr}${'.'.repeat(difTotal)}${total}\n`;
    console.log(str);

    try {
      window.navigator['share']({ text: str });
    } catch {
      alert('Seu navegador não é compatível com a função de impressão.');
    }
  }

  convertToReal(num: number): string {
    return this.currencyPipe.transform(num, 'BRL', 'R$ ')
      .replace('.', '@').replace(',', '.').replace('@', ',');
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
