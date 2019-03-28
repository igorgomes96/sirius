import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Cliente } from '../../models/cliente';

@Component({
  selector: 'app-card-cliente',
  templateUrl: './card-cliente.component.html',
  styleUrls: ['./card-cliente.component.css']
})
export class CardClienteComponent implements OnInit {

  @Input() cliente: Cliente;
  @Input() showDeleteOption = false;
  @Input() showEditOption = false;
  @Input() showSelectOption = false;

  @Output() editCliente = new EventEmitter<Cliente>();
  @Output() deleteCliente = new EventEmitter<Cliente>();
  @Output() selectCliente = new EventEmitter<Cliente>();


  constructor() { }

  ngOnInit() {
    // this.cliente.enderecoStr = this.endereco;
  }

  edit() {
    this.editCliente.emit(this.cliente);
  }

  delete() {
    this.deleteCliente.emit(this.cliente);
  }

  seleciona() {
    this.selectCliente.emit(this.cliente);
  }

}
