import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ItemCardapio } from '../../models/item-cardapio';

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

  constructor() { }

  ngOnInit() {
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

  edit() {
    this.editItem.emit(this.item);
  }

  classReserva() {
    if (this.item.reserva >= 50) {
      return '';
    } else if (this.item.reserva <= 10) {
      return ['deep-orange', 'accent-4'];
    } else {
      return ['amber', 'accent-4'];
    }
  }
}
