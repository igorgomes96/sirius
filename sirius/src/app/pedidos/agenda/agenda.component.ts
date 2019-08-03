import { Component, OnInit, EventEmitter } from '@angular/core';
import { PedidosApiService } from '../../core/api/pedidos-api.service';
import { Pedido } from '../../shared/models/pedido';
import { ToastsService } from 'src/app/core/services/toasts.service';
import { PedidosService } from 'src/app/core/services/pedidos.service';
import { datepicker } from 'src/environments/datepicker-options';
import { Router } from '@angular/router';
import { tap, finalize } from 'rxjs/operators';
import { TipoSalgado } from 'src/app/shared/models/item-cardapio';
import { SpinnerService } from 'src/app/core/services/spinner.service';

declare var $: any;

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.css']
})
export class AgendaComponent implements OnInit {

  pedidos: Pedido[] = [];
  data: Date;
  pedidoExcluir: Pedido;
  openModalSenha: EventEmitter<boolean>;

  constructor(private api: PedidosApiService, private toasts: ToastsService,
    private pedidosService: PedidosService, private router: Router,
    private spinnerService: SpinnerService) { }

  atualizaPedido(pedido: Pedido) {
    this.api.put(pedido._id, pedido)
      .subscribe(_ => this.toasts.toast('Pedido atualizado com sucesso.'));
  }

  restaurarPedido(pedido: Pedido) {
    this.api.restauraPedido(pedido._id)
      .subscribe(_ => {
        this.load();
        this.toasts.toast('Pedido restaurado com sucesso.');
      });
  }

  ngOnInit() {

    this.openModalSenha = new EventEmitter<boolean>();
    this.data = this.pedidosService.data;
    $('#data').datepicker(Object.assign(datepicker, {
      defaultDate: this.data,
      onSelect: (novaData: any) => {
        this.data = novaData;
        this.pedidosService.data = novaData;
        this.load();
      }
    }));

    this.load();
  }

  get pedidosFesta(): Pedido[] {
    return this.pedidos.filter(p => p.tipo === TipoSalgado.Festa);
  }

  get pedidosComerciais(): Pedido[] {
    return this.pedidos.filter(p => p.tipo === TipoSalgado.Comercial);
  }

  editPedido(pedido: Pedido) {
    this.router.navigate(['/pedidos', pedido._id]);
  }

  deletePedido(pedido: Pedido) {
    this.pedidoExcluir = pedido;
    this.openModalSenha.emit(true);
  }

  confirmarExclusao({ senha, recorrente }) {
    this.spinnerService.showSpinner(true);
    this.api.delete(this.pedidoExcluir._id, senha, recorrente)
      .pipe(finalize(() => this.spinnerService.showSpinner(false)))
      .subscribe(_ => {
        this.toasts.toast('Pedido excluído com sucesso!');
        this.load();
      });
  }

  get mensagemAlteracaoRecorrente(): any {
    if (this.pedidoExcluir && this.pedidoExcluir.recorrencia && this.pedidoExcluir.recorrencia.repetirAte) {
      const data = new Date(this.pedidoExcluir.recorrencia.repetirAte).toLocaleDateString();
      return {
        mensagem: `Esse pedido é recorrente. Deseja excluir também os próximos pedidos até a data ${data}?`,
        checkbox: 'Sim, excluir os pedidos recorrentes'
      };
    }
  }

  load() {
    this.api.getByData(this.data)
      .subscribe((pedidos: Pedido[]) => {
        this.pedidos = pedidos;
      });
  }

  imprimePedido(pedido: Pedido) {
    this.api.postImpressao(pedido._id)
      .subscribe(pedidoAlterado => {
        let pedidoEncontrado = this.pedidos.find(p => p._id === pedido._id);
        if (pedidoEncontrado) {
          pedidoEncontrado = pedidoAlterado;
        }
      });
  }

}
