import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ItemCardapio } from 'src/app/shared/models/item-cardapio';

@Component({
  selector: 'app-cardapio-item',
  templateUrl: './cardapio-item.component.html',
  styleUrls: ['./cardapio-item.component.css']
})
export class CardapioItemComponent implements OnInit {

  @Input() item: ItemCardapio;
  @Output() editar = new EventEmitter<ItemCardapio>();
  @Output() excluir = new EventEmitter<ItemCardapio>();

  constructor() { }

  ngOnInit() {
  }

  delete(item: ItemCardapio) {
    this.excluir.emit(item);
  }

  edit(item: ItemCardapio) {
    this.editar.emit(item);
  }

}
