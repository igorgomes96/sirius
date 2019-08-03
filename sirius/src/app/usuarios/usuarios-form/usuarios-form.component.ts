import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Usuario, Perfil } from 'src/app/shared/models/usuario';
import { UsuariosApiService } from 'src/app/core/api/usuarios-api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { filter, map } from 'rxjs/operators';
import { ToastsService } from 'src/app/core/services/toasts.service';
import { LoginApiService } from 'src/app/core/api/login-api.service';

declare var $: any;

@Component({
  selector: 'app-usuarios-form',
  templateUrl: './usuarios-form.component.html',
  styleUrls: ['./usuarios-form.component.css']
})
export class UsuariosFormComponent implements OnInit, AfterViewInit {

  Perfil: typeof Perfil = Perfil;
  form: FormGroup;
  usuario: Usuario;
  constructor(private api: UsuariosApiService, private formBuilder: FormBuilder,
    private router: Router, private route: ActivatedRoute,
    private toasts: ToastsService, private loginApi: LoginApiService) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required]],
      perfil: ['', Validators.required]
    });

    this.route.data
    .pipe(filter(d => d.hasOwnProperty('usuario')), map(d => d['usuario']))
    .subscribe((usuario: Usuario) => {
      this.usuario = usuario;
      this.form.patchValue(usuario);
    });
  }

  ngAfterViewInit() {
    $('select').formSelect();
  }

  resetSenha() {
    this.loginApi.resetSenha(this.usuario._id)
      .subscribe(result => this.toasts.toast(result.msg));
  }

  salvar() {
    const usuario = <Usuario>this.form.getRawValue();
    if (this.usuario) {
      this.api.put(this.usuario._id, usuario)
      .subscribe(_ => {
        this.toasts.toast('Usuário atualizado com sucesso!');
        this.router.navigate(['/usuarios']);
      });
    } else {
      this.api.post(usuario)
      .subscribe(_ => {
        this.toasts.toast('Usuário criado com sucesso!');
        this.router.navigate(['/usuarios']);
      });
    }
  }

}
