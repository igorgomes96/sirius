import { Usuario } from '../models/usuario';
import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  onUserChanges: EventEmitter<Usuario> = new EventEmitter<Usuario>();

  constructor() { }

  set user(user: Usuario) {
    localStorage.setItem('user', JSON.stringify(user));
    this.onUserChanges.emit(user);
  }

  get user(): Usuario {
    return JSON.parse(localStorage.getItem('user'));
  }

  isAdmin() {
    return this.user && this.user.perfil === 'Administrador';
  }

  isAuthenticated() {
    const user = this.user;
    return user;
  }
}
