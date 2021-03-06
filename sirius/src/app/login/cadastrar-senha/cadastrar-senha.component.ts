import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormValidators } from 'src/app/shared/form-validators';
import { LoginApiService } from 'src/app/core/api/login-api.service';
import { ToastsService } from 'src/app/core/services/toasts.service';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { Usuario } from 'src/app/shared/models/usuario';

@Component({
  selector: 'app-cadastrar-senha',
  templateUrl: './cadastrar-senha.component.html',
  styleUrls: ['./cadastrar-senha.component.css']
})
export class CadastrarSenhaComponent implements OnInit {

  hasError = FormValidators.hasError;
  form: FormGroup;
  constructor(private formBuilder: FormBuilder, private api: LoginApiService,
    private toasts: ToastsService, private router: Router,
    private usuarioService: UsuarioService) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required]],
      senha: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(14)]],
      confirmaSenha: ['', [Validators.required, FormValidators.equalsTo('senha')]]
    });
  }

  cadastrar() {
    const usuario = this.form.getRawValue();
    delete usuario.confirmaSenha;
    this.api.cadastrarSenha(usuario)
    .pipe(switchMap(_ => this.api.login(usuario)))
    .subscribe((user: Usuario) => {
      this.usuarioService.user = user;
      this.toasts.toast('Senha cadastrada com sucesso!');
      this.router.navigate(['/pedidos']);
    });
  }


}
