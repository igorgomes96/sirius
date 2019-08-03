import { Component, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { Reserva } from 'src/app/shared/models/reserva';
import { ReservasApiService } from 'src/app/core/api/reservas-api.service';
import { Router } from '@angular/router';
import { ToastsService } from 'src/app/core/services/toasts.service';
import { datepicker } from 'src/environments/datepicker-options';
import { ReservasService } from 'src/app/core/services/reservas.service';

declare var $: any;
declare var M: any;

@Component({
  selector: 'app-reservas-list',
  templateUrl: './reservas-list.component.html',
  styleUrls: ['./reservas-list.component.css']
})
export class ReservasListComponent implements OnInit, OnDestroy {

  reservas: Reserva[];
  reserva: Reserva;
  qtdaBaixa: number;
  reservaExclusao: Reserva;
  data: Date;
  openModalConfirmacao: EventEmitter<boolean>;

  constructor(private api: ReservasApiService, private router: Router,
    private toasts: ToastsService, private reservasService: ReservasService) { }

  ngOnInit() {
    this.data = this.zeraHora(this.reservasService.data);
    this.load();

    this.openModalConfirmacao = new EventEmitter<boolean>();

    const options = datepicker;
    options.defaultDate = this.data;
    $('#data').datepicker(Object.assign(datepicker, {
      onSelect: (novaData: any) => {
        this.reservasService.data = novaData;
        this.data = novaData;
        this.load();
      }
    }));

    $('#modal-baixa').modal();
  }

  zeraHora(data: Date) {
    data.setHours(0);
    data.setMinutes(0);
    data.setSeconds(0);
    data.setMilliseconds(0);
    return data;
  }

  get instanceModal() {
    return M.Modal.getInstance($('#modal-baixa')[0]);
  }

  load() {
    this.api.getByData(this.data)
      .subscribe((reservas: Reserva[]) => this.reservas = reservas);
  }

  edit(reserva: Reserva) {
    this.router.navigate(['/reservas', reserva._id]);
  }

  darBaixa(reserva: Reserva) {
    this.reserva = reserva;
    this.instanceModal.open();
  }

  baixa(qtda: number) {
    this.reserva.qtdaVendida = +this.reserva.qtdaVendida + (+qtda);
    this.api.put(this.reserva._id, this.reserva)
      .subscribe(_ => {
        this.load();
        this.qtdaBaixa = null;
      });
  }

  confirmarExclusao(confirmacao: boolean) {
    if (confirmacao) {
      this.api.delete(this.reservaExclusao._id)
        .subscribe(_ => {
          this.toasts.toast('Reserva excluída com sucesso!');
          this.load();
        });
    }
  }

  delete(reserva: Reserva) {
    this.reservaExclusao = reserva;
    this.openModalConfirmacao.emit(true);
  }

  ngOnDestroy() {
    this.reservasService.data = this.data;
  }

}
