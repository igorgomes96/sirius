import { Component, OnInit, Input, EventEmitter, AfterViewInit } from '@angular/core';
import { Pedido } from 'src/app/shared/models/pedido';

declare var $: any;
declare var M: any;

@Component({
  selector: 'app-log-compare',
  templateUrl: './log-compare.component.html',
  styleUrls: ['./log-compare.component.css']
})
export class LogCompareComponent implements OnInit, AfterViewInit {

  @Input() antes: Pedido;
  @Input() depois: Pedido;
  @Input() open: EventEmitter<boolean>;

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
    $('#modal-compare').modal();
  }

  get instanceModal() {
    return M.Modal.getInstance($('#modal-compare')[0]);
  }
}
