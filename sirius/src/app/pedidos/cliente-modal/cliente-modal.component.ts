import { Component, OnInit, Output, EventEmitter, Input, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastsService } from 'src/app/shared/services/toasts.service';
import { ClientesApiService } from 'src/app/shared/api/clientes-api.service';
import { Cliente } from 'src/app/shared/models/cliente';

declare var $: any;
declare var M: any;

@Component({
  selector: 'app-cliente-modal',
  templateUrl: './cliente-modal.component.html',
  styleUrls: ['./cliente-modal.component.css']
})
export class ClienteModalComponent implements OnInit, AfterViewInit {

  @Input() open = new EventEmitter<boolean>();
  @Output() saveCliente = new EventEmitter<Cliente>();

  form: FormGroup;
  constructor(private formBuilder: FormBuilder,
    private api: ClientesApiService, private toasts: ToastsService) { }

  ngOnInit() {
    $('#modal-cliente').modal();

    this.form = this.formBuilder.group({
      nome: ['', Validators.required],
      fone1: ['', Validators.required],
      fone2: [''],
      observacoes: [''],
      endereco: this.formBuilder.group({
        rua: [''],
        bairro: [''],
        cidade: ['Araguari', Validators.required],
        numero: [''],
        uf: ['MG', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]]
      })
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
    // $('#modal-cliente').modal();
  }

  get instanceModal() {
    return M.Modal.getInstance($('#modal-cliente')[0]);
  }

  salvar() {
    const cliente = <Cliente>this.form.getRawValue();
    this.saveCliente.emit(cliente);
  }

}
