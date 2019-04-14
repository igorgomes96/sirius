import { distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/shared/models/usuario';
import { UsuariosApiService } from 'src/app/shared/api/usuarios-api.service';
import { Router } from '@angular/router';
import { ToastsService } from 'src/app/shared/services/toasts.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-usuarios-list',
  templateUrl: './usuarios-list.component.html',
  styleUrls: ['./usuarios-list.component.css']
})
export class UsuariosListComponent implements OnInit {

  formFiltro: FormGroup;
  usuarios: Usuario[];
  constructor(private api: UsuariosApiService, private router: Router,
    private toasts: ToastsService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.formFiltro = this.formBuilder.group({
      filtro: ['']
    });

    this.formFiltro.get('filtro').valueChanges
      .pipe(distinctUntilChanged(), debounceTime(500))
      .subscribe(v => this.load(v));

    this.load();
  }

  load(nome: string = null) {
    let obs: Observable<Usuario[]>;
    if (nome === null) {
      obs = this.api.getAll();
    } else {
      obs = this.api.getByNome(nome);
    }
    obs.subscribe((usuarios: Usuario[]) => this.usuarios = usuarios);
  }

  edit(usuario: Usuario) {
    this.router.navigate(['/usuarios', usuario._id]);
  }

  delete(usuario: Usuario) {
    const confirmacao = confirm('Tem certeza que deseja excluir esse usuário?');
    if (confirmacao) {
      this.api.delete(usuario._id)
        .subscribe(_ => {
          this.toasts.toast('Usuario excluído com sucesso!');
          this.load();
        });
    }
  }

}
