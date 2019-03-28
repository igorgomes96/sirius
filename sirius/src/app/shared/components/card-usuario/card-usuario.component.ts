import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Usuario } from '../../models/usuario';

@Component({
  selector: 'app-card-usuario',
  templateUrl: './card-usuario.component.html',
  styleUrls: ['./card-usuario.component.css']
})
export class CardUsuarioComponent implements OnInit {

  @Input() usuario: Usuario;

  @Output() editUsuario = new EventEmitter<Usuario>();
  @Output() deleteUsuario = new EventEmitter<Usuario>();

  constructor() { }

  ngOnInit() {
  }

  edit() {
    this.editUsuario.emit(this.usuario);
  }

  delete() {
    this.deleteUsuario.emit(this.usuario);
  }


}
