import { NgModule } from '@angular/core';

import { SharedModule } from './../shared/shared.module';
import { CardapioListComponent } from './cardapio-list/cardapio-list.component';
import { CardapioFormComponent } from './cardapio-form/cardapio-form.component';
import { CardapioRoutingModule } from './cardapio-routing.module';

@NgModule({
  declarations: [CardapioListComponent, CardapioFormComponent],
  imports: [
    SharedModule,
    CardapioRoutingModule
  ]
})
export class CardapioModule { }
