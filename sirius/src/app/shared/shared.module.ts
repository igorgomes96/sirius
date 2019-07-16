import { NgModule } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { CardCardapioComponent } from './components/card-cardapio/card-cardapio.component';
import { CardClienteComponent } from './components/card-cliente/card-cliente.component';
import { CardReservaComponent } from './components/card-reserva/card-reserva.component';
import { CardUsuarioComponent } from './components/card-usuario/card-usuario.component';
import { ValidatorMessageComponent } from './components/validator-message/validator-message.component';
import { OnlyNumberDirective } from './directives/only-number.directive';
import { SenhaModalComponent } from './components/senha-modal/senha-modal.component';
import { ConfirmacaoModalComponent } from './components/confirmacao-modal/confirmacao-modal.component';
import { CardAgendaComponent } from './components/card-agenda/card-agenda.component';
import { TelefonePipe } from './pipes/telefone.pipe';
import { TelefoneDirective } from './directives/telefone.directive';

@NgModule({
  declarations: [CardCardapioComponent, CardClienteComponent, CardReservaComponent,
    CardUsuarioComponent, ValidatorMessageComponent, OnlyNumberDirective, SenhaModalComponent, ConfirmacaoModalComponent,
    CardAgendaComponent,
    TelefonePipe,
    TelefoneDirective],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    CardCardapioComponent,
    CardClienteComponent,
    CardUsuarioComponent,
    CardReservaComponent,
    CardAgendaComponent,
    ValidatorMessageComponent,
    CardReservaComponent,
    SenhaModalComponent,
    OnlyNumberDirective,
    ConfirmacaoModalComponent,
    TelefonePipe,
    TelefoneDirective
  ],
  providers: [DecimalPipe, DatePipe, TelefonePipe]
})
export class SharedModule { }
