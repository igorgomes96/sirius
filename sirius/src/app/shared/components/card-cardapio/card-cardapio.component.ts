import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ItemCardapio, TipoSalgado } from '../../models/item-cardapio';

@Component({
  selector: 'app-card-cardapio',
  templateUrl: './card-cardapio.component.html',
  styleUrls: ['./card-cardapio.component.css']
})
export class CardCardapioComponent implements OnInit {

  @Input() item: ItemCardapio;
  @Input() showEditOption: boolean;
  @Input() showAddOption: boolean;
  @Input() showFavoriteButton: boolean;

  @Output() addItemPedido = new EventEmitter<ItemCardapio>();
  @Output() deleteItem = new EventEmitter<ItemCardapio>();
  @Output() favoriteItem = new EventEmitter<ItemCardapio>();
  @Output() editItem = new EventEmitter<ItemCardapio>();

  qtdas: number[];

  constructor() { }

  ngOnInit() {
    this.qtdas = [10, 25, 30, 50, 75, 100];
  }

  popular(): string {
    return this.item.popular ? 'star' : 'star_border';
  }

  favorite() {
    this.item.popular = !this.item.popular;
    this.favoriteItem.emit(this.item);
  }

  delete() {
    this.deleteItem.emit(this.item);
  }

  addItem() {
    this.addItemPedido.emit(this.item);
  }

  addQtda(qtda: number) {
    if (!this.item.quantidade) {
      this.item.quantidade = qtda;
      return;
    }

    this.item.quantidade += qtda;
  }

  showTriangulo(item: ItemCardapio) {
    if (item && item.nome.toLowerCase() === 'esfirra' && item.tipo === TipoSalgado.Comercial) {
      return true;
    }
    return false;
  }

  edit() {
    this.editItem.emit(this.item);
  }

  get reserva() {
    if (this.item) {
      if (this.item.semPimenta) {
        return this.item.reservaSemPimenta;
      } else {
        return this.item.reservaComPimenta;
      }
    }
  }

  classReserva() {
    const valorReserva = this.reserva;
    if (valorReserva >= 50) {
      return '';
    } else if (valorReserva <= 10) {
      return ['deep-orange', 'accent-4'];
    } else {
      return ['amber', 'accent-4'];
    }
  }

  get excedeReserva(): boolean {
    return this.reserva != null && this.item.quantidade > this.reserva;
  }
}
