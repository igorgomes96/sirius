import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { CardCardapioComponent } from './components/card-cardapio/card-cardapio.component';
import { CardPedidoComponent } from './components/card-pedido/card-pedido.component';
import { CardClienteComponent } from './components/card-cliente/card-cliente.component';
import { NgxMaskModule } from 'ngx-mask';
import { CardReservaComponent } from './components/card-reserva/card-reserva.component';
import { CardUsuarioComponent } from './components/card-usuario/card-usuario.component';
import { ValidatorMessageComponent } from './components/validator-message/validator-message.component';
import { OnlyNumberDirective } from './directives/only-number.directive';
import { SenhaModalComponent } from './components/senha-modal/senha-modal.component';
import { ConfirmacaoModalComponent } from './components/confirmacao-modal/confirmacao-modal.component';
import { CardAgendaComponent } from './components/card-agenda/card-agenda.component';

@NgModule({
  declarations: [CardCardapioComponent, CardPedidoComponent, CardClienteComponent, CardReservaComponent,
    CardUsuarioComponent, ValidatorMessageComponent, OnlyNumberDirective, SenhaModalComponent, ConfirmacaoModalComponent,
    CardAgendaComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule,
    NgxMaskModule.forRoot()
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    CardCardapioComponent,
    CardPedidoComponent,
    CardClienteComponent,
    CardUsuarioComponent,
    CardReservaComponent,
    CardAgendaComponent,
    ValidatorMessageComponent,
    NgxMaskModule,
    CardReservaComponent,
    SenhaModalComponent,
    OnlyNumberDirective,
    ConfirmacaoModalComponent
  ]
})
export class SharedModule { }
