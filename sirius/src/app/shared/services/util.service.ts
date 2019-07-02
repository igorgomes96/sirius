import { Injectable } from '@angular/core';
import { Pedido } from '../models/pedido';
import { DatePipe, DecimalPipe } from '@angular/common';
import { MaskPipe } from 'ngx-mask';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor(private decimalPipe: DecimalPipe, private datePipe: DatePipe, private maskPipe: MaskPipe) { }

  public getDateTime(dataStr: string): Date {
    const data = new Date(dataStr);
    return new Date(data.getTime() - (data.getTimezoneOffset() * 60000));
  }

  public getTime(data: Date) {
    return data.toISOString().substr(11, 5);
  }

  public imprimirPedido(pedido: Pedido, tamanhoLinha: number = 38) {

    let endereco = 'Cliente não solicitou entrega.\n';
    if (pedido.entregar) {
      endereco = `End.: ${pedido.enderecoStr}\n`;
    }
    const horario = this.datePipe.transform(pedido.horario, 'dd/MM/yy HH:mm');
    let telefone = '';
    if (pedido.cliente.fone1) {
      // tslint:disable-next-line: max-line-length
      telefone = this.maskPipe.transform(pedido.cliente.fone1, '(00)00009-0000') + (pedido.cliente.fone2 ? ` / ${this.maskPipe.transform(pedido.cliente.fone2, '(00)00009-0000')}` : '');
    }
    // tslint:disable-next-line: max-line-length
    let str = `Salgados Sirius\nHorário: ${horario}\nCliente: ${pedido.cliente.nome}\nFone: ${telefone}\n${endereco}Pago? ${pedido.pago ? 'Sim' : 'Não'}\n\n`;
    str = this.retira_acentos(str);

    pedido.itens.forEach(item => {
      const detalhes = item.detalhes ? ` (${item.detalhes})` : '';
      const semPimenta = item.semPimenta ? ' - Sem Pimenta' : '';
      const nome = `${item.quantidade} un. de ${item.nome}${semPimenta}${detalhes} .`;
      const valor = ` ${this.convertToReal(item.quantidade * item.valor)}`;
      const dif = tamanhoLinha - ((nome.length + valor.length) % tamanhoLinha);
      str += `${nome}${'.'.repeat(dif)}${valor}\n`;
    });
    const totalStr = 'Total .';
    const total = ` ${this.convertToReal(pedido.itens.reduce((prev, cur) => prev + (cur.quantidade * cur.valor), 0))}`;
    const difTotal = tamanhoLinha - ((totalStr.length + total.length) % tamanhoLinha);
    str += this.retira_acentos(`\n${totalStr}${'.'.repeat(difTotal)}${total}\n`);
    console.log(str);

    try {
      window.navigator['share']({ text: str });
    } catch {
      alert('Seu navegador não é compatível com a função de impressão.');
    }
  }

  retira_acentos(str: string) {

    const com_acento = 'ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝŔÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿŕ';
    const sem_acento = 'AAAAAAACEEEEIIIIDNOOOOOOUUUUYRsBaaaaaaaceeeeiiiionoooooouuuuybyr';
    let novastr = '';
    for (let i = 0; i < str.length; i++) {
      let troca = false;
      for (let a = 0; a < com_acento.length; a++) {
        if (str.substr(i, 1) === com_acento.substr(a, 1)) {
          novastr += sem_acento.substr(a, 1);
          troca = true;
          break;
        }
      }
      if (troca === false) {
        novastr += str.substr(i, 1);
      }
    }
    return novastr;
  }

  convertToReal(num: number): string {
    return 'R$ ' + this.decimalPipe.transform(num, '1.2-2');
    // .replace('.', '@').replace(',', '.').replace('@', ',');
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
