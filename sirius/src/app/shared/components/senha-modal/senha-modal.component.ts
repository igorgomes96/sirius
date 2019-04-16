import { Component, OnInit, EventEmitter, Input, AfterViewInit, Output } from '@angular/core';
import { ToastsService } from '../../services/toasts.service';

declare var $: any;
declare var M: any;

@Component({
  selector: 'app-senha-modal',
  templateUrl: './senha-modal.component.html',
  styleUrls: ['./senha-modal.component.css']
})
export class SenhaModalComponent implements OnInit, AfterViewInit {

  @Input() open: EventEmitter<boolean>;
  @Output() confirmar: EventEmitter<string> = new EventEmitter<string>();

  senha: string;

  constructor() { }

  ngOnInit() {
    this.open.subscribe((v: boolean) => {
      if (v) {
        this.instanceModal.open();
      } else {
        this.instanceModal.close();
      }
    });
  }

  ngAfterViewInit() {
    $('#modal-senha').modal();
  }

  confirmarAcao() {
    if (!this.senha) {
      return;
    }
    this.confirmar.emit(this.senha);
    this.instanceModal.close();
  }

  get instanceModal() {
    return M.Modal.getInstance($('#modal-senha')[0]);
  }

}
