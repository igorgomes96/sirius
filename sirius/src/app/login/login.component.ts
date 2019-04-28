
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { catchError, tap } from 'rxjs/operators';
import { of, Observable, empty } from 'rxjs';

import { UsuarioService } from './../shared/services/usuario.service';
import { ToastsService } from './../shared/services/toasts.service';
import { Usuario } from './../shared/models/usuario';
import { LoginApiService } from './../shared/api/login-api.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormValidators } from '../shared/form-validators';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  hasError = FormValidators.hasError;
  form: FormGroup;
  usuario = {};
  constructor(private router: Router, private loginApi: LoginApiService,
    private usuarioService: UsuarioService, private formBuilder: FormBuilder,
    private toasts: ToastsService) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      senha: ['', Validators.required]
    });
  }

  login() {
    this.loginApi.login(this.form.getRawValue())
    .subscribe(usuario => {
      this.usuarioService.user = usuario;
      this.toasts.toast('Bem-vindo(a), ' + usuario.nome);
      this.router.navigate(['/pedidos']);
    });
  }

}
