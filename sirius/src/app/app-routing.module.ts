import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotFoundComponent } from './not-found/not-found.component';
import { LoginComponent } from './login/login.component';
import { CadastrarSenhaComponent } from './login/cadastrar-senha/cadastrar-senha.component';
import { AdminGuard } from './shared/guards/admin-guard';
import { AuthGuard } from './shared/guards/auth-guard';


const routes: Routes = [
  { path: 'not-found', component: NotFoundComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'cadastrar-senha', component: CadastrarSenhaComponent },
  {
    path: 'cardapio',
    loadChildren: './cardapio/cardapio.module#CardapioModule',
    canLoad: [AdminGuard]
  },
  {
    path: 'pedidos',
    loadChildren: './pedidos/pedidos.module#PedidosModule',
    canLoad: [AuthGuard]
  },
  {
    path: 'clientes',
    loadChildren: './clientes/clientes.module#ClientesModule',
    canLoad: [AuthGuard]
  },
  {
    path: 'reservas',
    loadChildren: './reservas/reservas.module#ReservasModule',
    canLoad: [AuthGuard]
  },
  {
    path: 'usuarios',
    loadChildren: './usuarios/usuarios.module#UsuariosModule',
    canLoad: [AdminGuard]
  },
  { path: '', redirectTo: '/pedidos', pathMatch: 'full' },
  { path: '**', redirectTo: '/not-found' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
