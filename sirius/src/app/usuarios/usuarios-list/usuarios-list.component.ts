import { distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, EventEmitter } from '@angular/core';
import { Usuario } from 'src/app/shared/models/usuario';
import { UsuariosApiService } from 'src/app/core/api/usuarios-api.service';
import { Router } from '@angular/router';
import { ToastsService } from 'src/app/core/services/toasts.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-usuarios-list',
  templateUrl: './usuarios-list.component.html',
  styleUrls: ['./usuarios-list.component.css']
})
export class UsuariosListComponent implements OnInit {

  formFiltro: FormGroup;
  usuarios: Usuario[];
  usuarioExclusao: Usuario;
  openModalSenha: EventEmitter<boolean>;

  constructor(private api: UsuariosApiService, private router: Router,
    private toasts: ToastsService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.openModalSenha = new EventEmitter<boolean>();
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

  confirmarExclusao({ senha }) {
    if (senha) {
      this.api.delete(this.usuarioExclusao._id, senha)
        .subscribe(_ => {
          this.toasts.toast('Usuario excluído com sucesso!');
          this.load();
        });
    }
  }

  delete(usuario: Usuario) {
    this.usuarioExclusao = usuario;
    this.openModalSenha.emit(true);
  }

}
