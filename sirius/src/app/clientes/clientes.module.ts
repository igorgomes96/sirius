import { NgModule } from '@angular/core';

import { ClientesRoutingModule } from './clientes-routing.module';
import { ClientesListComponent } from './clientes-list/clientes-list.component';
import { ClientesFormComponent } from './clientes-form/clientes-form.component';

import { SharedModule } from './../shared/shared.module';

@NgModule({
  declarations: [ClientesListComponent, ClientesFormComponent],
  imports: [
    SharedModule,
    ClientesRoutingModule
  ]
})
export class ClientesModule { }
