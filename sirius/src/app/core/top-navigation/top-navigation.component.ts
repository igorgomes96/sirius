import { Usuario } from './../../shared/models/usuario';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginApiService } from 'src/app/shared/api/login-api.service';

declare const $: any;

@Component({
  selector: 'app-top-navigation',
  templateUrl: './top-navigation.component.html',
  styleUrls: ['./top-navigation.component.css']
})
export class TopNavigationComponent implements OnInit {

  menu = [
    {
      text: 'Pedidos',
      link: ['/pedidos'],
      icon: 'receipt',
      admin: false
    },
    {
      text: 'Clientes',
      link: ['/clientes'],
      icon: 'people',
      admin: false
    },
    {
      text: 'Cardápio',
      link: ['/cardapio'],
      icon: 'restaurant_menu',
      admin: true
    },
    {
      text: 'Reserva',
      link: ['/reservas'],
      icon: 'add_box',
      admin: false
    },
    {
      text: 'Usuários',
      link: ['/usuarios'],
      icon: 'person',
      admin: true
    },
    {
      text: 'Sair',
      link: ['/login'],
      icon: 'power_settings_new',
      admin: false
    }
  ];
  usuario: Usuario;
  openMenu = false;
  constructor(private api: LoginApiService) { }

  ngOnInit() {
    this.api.usuario()
      .subscribe(u => {
        this.usuario = u;
      });
  }

  showItemMenu(item: any) {
    return !item.admin || (this.usuario && this.usuario.perfil === 'Administrador');
  }

}
