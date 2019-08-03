import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Cliente } from 'src/app/shared/models/cliente';
import { ClientesApiService } from 'src/app/core/api/clientes-api.service';
import { ToastsService } from 'src/app/core/services/toasts.service';
import { Router, ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-clientes-form',
  templateUrl: './clientes-form.component.html',
  styleUrls: ['./clientes-form.component.css']
})
export class ClientesFormComponent implements OnInit {

  form: FormGroup;
  cliente: Cliente;
  constructor(private formBuilder: FormBuilder,
    private api: ClientesApiService, private toasts: ToastsService,
    private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
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

    this.route.data
    .pipe(filter(d => d.hasOwnProperty('cliente')), map(d => d['cliente']))
    .subscribe((cliente: Cliente) => {
      this.cliente = cliente;
      this.form.patchValue(cliente);
    });
  }

  salvar() {
    const cliente = <Cliente>this.form.getRawValue();
    if (this.cliente) {
      this.api.put(this.cliente._id, cliente)
      .subscribe(_ => {
        this.toasts.toast('Cliente atualizado!');
        this.router.navigate(['/clientes']);
      });
    } else {
      this.api.post(cliente)
      .subscribe(_ => {
        this.toasts.toast('Cliente cadastrado!');
        this.router.navigate(['/clientes']);
      });
    }
  }

}
