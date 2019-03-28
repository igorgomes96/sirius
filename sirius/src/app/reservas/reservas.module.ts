import { ReservasRoutingModule } from './reservas-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservasListComponent } from './reservas-list/reservas-list.component';
import { ReservasFormComponent } from './reservas-form/reservas-form.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [ReservasListComponent, ReservasFormComponent],
  imports: [
    CommonModule,
    SharedModule,
    ReservasRoutingModule
  ]
})
export class ReservasModule { }
