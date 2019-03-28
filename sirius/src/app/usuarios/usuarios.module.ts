import { NgModule } from '@angular/core';

import { UsuariosRoutingModule } from './usuarios-routing.module';
import { SharedModule } from './../shared/shared.module';
import { UsuariosListComponent } from './usuarios-list/usuarios-list.component';
import { UsuariosFormComponent } from './usuarios-form/usuarios-form.component';

@NgModule({
  declarations: [UsuariosListComponent, UsuariosFormComponent],
  imports: [
    SharedModule,
    UsuariosRoutingModule
  ]
})
export class UsuariosModule { }
