import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Reserva } from '../../models/reserva';

@Component({
  selector: 'app-card-reserva',
  templateUrl: './card-reserva.component.html',
  styleUrls: ['./card-reserva.component.css']
})
export class CardReservaComponent implements OnInit {

  @Input() item: Reserva;

  @Output() edit = new EventEmitter<Reserva>();
  @Output() delete = new EventEmitter<Reserva>();

  constructor() { }

  ngOnInit() {
  }

  darBaixa() {
    this.edit.emit(this.item);
  }

  excluir() {
    this.delete.emit(this.item);
  }

  get restante() {
    return this.item.qtda - this.item.qtdaVendida;
  }

  get percentual() {
    return ((this.item.qtda - this.item.qtdaVendida) / this.item.qtda) * 100;
  }

  get statusReserva() {
    const intermediario = 50;
    const minimo = 10;
    return this.restante >= intermediario ? '' :
      (this.restante <= intermediario && this.restante > minimo ? 'warning' : 'danger');
  }

  get classProgressBack() {
    switch (this.statusReserva) {
      case 'warning':
        return ['amber', 'lighten-4'];
      case 'danger':
        return ['deep-orange', 'lighten-4'];
      default:
        return '';
    }
  }

  get classProgress() {
    switch (this.statusReserva) {
      case 'warning':
        return ['amber', 'accent-4'];
      case 'danger':
        return ['deep-orange', 'accent-4'];
      default:
        return '';
    }
  }

}
