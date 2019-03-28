import { Component, OnInit, AfterViewInit } from '@angular/core';
import { PedidosService } from 'src/app/shared/services/pedidos.service';
import { PedidosApiService } from 'src/app/shared/api/pedidos-api.service';
import { ItemCardapio, TipoSalgado } from 'src/app/shared/models/item-cardapio';
import { datepicker } from 'src/environments/datepicker-options';

declare var $: any;

@Component({
  selector: 'app-pedidos-agrupados',
  templateUrl: './pedidos-agrupados.component.html',
  styleUrls: ['./pedidos-agrupados.component.css']
})
export class PedidosAgrupadosComponent implements OnInit, AfterViewInit {

  data: Date;
  itens: ItemCardapio[];
  TipoSalgado: typeof TipoSalgado = TipoSalgado;

  constructor(private pedidosService: PedidosService,
    private api: PedidosApiService) { }

  ngOnInit() {
    this.data = this.pedidosService.data;
    this.load();
  }

  ngAfterViewInit() {
    $('#data').datepicker(Object.assign(datepicker, {
      defaultDate: this.data,
      onSelect: (novaData: any) => {
        this.data = novaData;
        this.load();
      }
    }));
  }

  load() {
    this.api.getAggregatedByData(this.data)
      .subscribe((itens: ItemCardapio[]) => {
        this.itens = itens;
      });
  }

}
