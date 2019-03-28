import { Usuario } from '../models/usuario';
import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private usuario: any;
  onUserChanges: EventEmitter<Usuario> = new EventEmitter<Usuario>();

  constructor() { }

  set user(user: Usuario) {
    // localStorage.setItem('user', JSON.stringify(user));
    this.usuario = user;
    this.onUserChanges.emit(user);
  }

  get user(): Usuario {
    return <Usuario>this.usuario;
    // return JSON.parse(localStorage.getItem('user'));
  }

  isAuthenticated() {
    const user = this.user;
    return user;
  }
}
