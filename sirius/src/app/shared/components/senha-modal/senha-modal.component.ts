import { Component, OnInit, EventEmitter, Input, AfterViewInit, Output } from '@angular/core';

declare var $: any;
declare var M: any;

@Component({
  selector: 'app-senha-modal',
  templateUrl: './senha-modal.component.html',
  styleUrls: ['./senha-modal.component.css']
})
export class SenhaModalComponent implements OnInit, AfterViewInit {

  @Input() message = 'Essa ação não poderá ser desfeita. Deseja confirmar?';
  @Input() open: EventEmitter<boolean>;
  @Input() recorrenteMessage = null;
  @Input() recorrenteMessageCheckbox = null;
  @Output() confirmar: EventEmitter<{ senha: string, recorrente: boolean }> = new EventEmitter<{ senha: string, recorrente: boolean }>();

  senha: string;
  recorrencia = false;

  constructor() { }

  ngOnInit() {
    this.open.subscribe((v: boolean) => {
      if (v) {
        this.instanceModal.open();
      } else {
        this.senha = '';
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
    this.confirmar.emit({ senha: this.senha, recorrente: this.recorrencia });
    this.senha = '';
    this.recorrencia = false;
    this.instanceModal.close();
  }

  get instanceModal() {
    return M.Modal.getInstance($('#modal-senha')[0]);
  }

}
