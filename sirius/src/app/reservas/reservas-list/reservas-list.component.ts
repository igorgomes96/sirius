import { Component, OnInit, OnDestroy } from '@angular/core';
import { Reserva } from 'src/app/shared/models/reserva';
import { ReservasApiService } from 'src/app/shared/api/reservas-api.service';
import { Router } from '@angular/router';
import { ToastsService } from 'src/app/shared/services/toasts.service';
import { datepicker } from 'src/environments/datepicker-options';
import { ReservasService } from 'src/app/shared/services/reservas.service';

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
  data: Date;
  constructor(private api: ReservasApiService, private router: Router,
    private toasts: ToastsService, private reservasService: ReservasService) { }

  ngOnInit() {
    this.data = this.zeraHora(this.reservasService.data);
    this.load();

    const options = datepicker;
    options.defaultDate = this.data;
    $('#data').datepicker(Object.assign(datepicker, {
      onSelect: (novaData: any) => {
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

  delete(reserva: Reserva) {
    this.api.delete(reserva._id)
    .subscribe(_ => {
      this.toasts.toast('Reserva excluída com sucesso!');
      this.load();
    });
  }

  ngOnDestroy() {
    this.reservasService.data = this.data;
  }

}
