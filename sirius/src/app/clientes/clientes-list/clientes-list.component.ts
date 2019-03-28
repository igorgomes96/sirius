import { distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Cliente } from 'src/app/shared/models/cliente';
import { ClientesApiService } from 'src/app/shared/api/clientes-api.service';
import { ToastsService } from 'src/app/shared/services/toasts.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-clientes-list',
  templateUrl: './clientes-list.component.html',
  styleUrls: ['./clientes-list.component.css']
})
export class ClientesListComponent implements OnInit {

  formFiltro: FormGroup;
  clientes: Cliente[];
  constructor(private api: ClientesApiService, private router: Router,
    private toasts: ToastsService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.load();

    this.formFiltro = this.formBuilder.group({
      filtro: ['']
    });

    this.formFiltro.get('filtro').valueChanges
    .pipe(distinctUntilChanged(), debounceTime(500))
    .subscribe(v => this.load(v));
  }

  load(nome: string = null) {
    let obs: Observable<Cliente[]>;
    if (nome) {
      obs = this.api.getByNome(nome);
    } else {
      obs = this.api.getAll();
    }
    obs.subscribe((clientes: Cliente[]) => this.clientes = clientes);
  }

  edit(cliente: Cliente) {
    this.router.navigate(['/clientes', cliente._id]);
  }

  delete(cliente: Cliente) {
    this.api.delete(cliente._id)
      .subscribe(_ => {
        this.toasts.toast('Cliente excluído com sucesso!');
        this.load();
      });
  }

}
