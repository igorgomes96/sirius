import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';

declare var $: any;
declare var M: any;

@Component({
  selector: 'app-confirmacao-modal',
  templateUrl: './confirmacao-modal.component.html',
  styleUrls: ['./confirmacao-modal.component.css']
})
export class ConfirmacaoModalComponent implements OnInit, AfterViewInit {

  @Input() open: EventEmitter<boolean>;
  @Output() confirmar: EventEmitter<boolean> = new EventEmitter<boolean>();

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
    $('#modal-confirmacao').modal();
  }

  confirmarAcao() {
    this.confirmar.emit(true);
    this.instanceModal.close();
  }

  get instanceModal() {
    return M.Modal.getInstance($('#modal-confirmacao')[0]);
  }


}
