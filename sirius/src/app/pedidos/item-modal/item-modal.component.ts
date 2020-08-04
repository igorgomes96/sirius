import { Unidade, ItemCardapio, TipoSalgado } from 'src/app/shared/models/item-cardapio';
import { UnidadesApiService } from 'src/app/core/api/unidades-api.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Input, EventEmitter, Injectable, AfterViewInit, Output } from '@angular/core';

declare var $: any;
declare var M: any;

@Component({
  selector: 'app-item-modal',
  templateUrl: './item-modal.component.html',
  styleUrls: ['./item-modal.component.css']
})
export class ItemModalComponent implements OnInit, AfterViewInit {

  @Input() open: EventEmitter<boolean>;
  @Output() saveItem = new EventEmitter<ItemCardapio>();

  form: FormGroup;
  constructor(private formBuilder: FormBuilder) { } // , private unidadesApi: UnidadesApiService) { }

  ngOnInit() {

    this.form = this.formBuilder.group({
      nome: ['', Validators.required],
      valor: ['', Validators.required],
      quantidade: [''],
      detalhes: ['']
    });

    this.open.subscribe((v: boolean) => {
      if (v) {
        this.instanceModal.open();
      } else {
        this.instanceModal.close();
      }
    });

  }

  ngAfterViewInit() {
    $('#modal-item').modal();
  }

  get selectUnidadeInstance() {
    return M.FormSelect.getInstance($('#unidade')[0]);
  }

  get instanceModal() {
    return M.Modal.getInstance($('#modal-item')[0]);
  }

  salvar() {
    const item = <ItemCardapio>this.form.getRawValue();
    item.tipo = TipoSalgado[TipoSalgado.Outros];
    item.unidade = {
      _id: undefined,
      nome: 'Unidade',
      sigla: 'un.'
    };
    this.form.reset();
    this.saveItem.emit(item);
  }

}
