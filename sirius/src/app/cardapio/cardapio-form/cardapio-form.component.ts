import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { filter, map, tap } from 'rxjs/operators';

import { ToastsService } from '../../core/services/toasts.service';
import { CardapioApiService } from '../../core/api/cardapio-api.service';
import { TipoSalgado, ItemCardapio, Unidade } from './../../shared/models/item-cardapio';
import { UnidadesApiService } from 'src/app/core/api/unidades-api.service';

declare var $: any;
declare var M: any;

@Component({
  selector: 'app-cardapio-form',
  templateUrl: './cardapio-form.component.html',
  styleUrls: ['./cardapio-form.component.css']
})
export class CardapioFormComponent implements OnInit, AfterViewInit {

  TipoSalgado: typeof TipoSalgado = TipoSalgado;
  form: FormGroup;
  item: ItemCardapio;
  unidades: Unidade[];
  unidade: Unidade = {
    _id: null,
    nome: '',
    sigla: ''
  };

  constructor(private api: CardapioApiService, private toasts: ToastsService,
    private formBuilder: FormBuilder, private router: Router,
    private route: ActivatedRoute, private unidadesApi: UnidadesApiService) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      tipo: ['', Validators.required],
      nome: ['', Validators.required],
      // unidade: ['', Validators.required],
      valor: ['', Validators.required],
      detalhes: ['']
    });

    this.unidadesApi.getAll()
      .subscribe((unidades: Unidade[]) => {
        this.unidades = unidades;
      });

    this.route.data
      .pipe(tap(d => {
        if (!d.hasOwnProperty('itemCardapio')) {
          this.loadUnidades();
        }
      }), filter(d => d.hasOwnProperty('itemCardapio')), map(d => d['itemCardapio']))
      .subscribe((item: ItemCardapio) => {
        this.item = item;
        this.form.patchValue(this.item);
        // this.form.get('unidade').setValue(this.item.unidade.sigla);
        setTimeout(() => {
          this.loadUnidades();
        }, 500);
      });


  }

  ngAfterViewInit() {
    $('select').not('#unidade').formSelect();
    $(document).ready(function () {
      $('.modal').modal();
    });
  }

  loadUnidades() {
    // const instance = this.selectUnidadeInstance;
    // if (instance) {
    //   instance.destroy();
    // }
    this.unidadesApi.getAll()
      .subscribe((unidades: Unidade[]) => {
        this.unidades = unidades;
        // setTimeout(() => {
        //   $('#unidade').formSelect();
        // }, 300);
      });
  }

  // get selectUnidadeInstance() {
  //   return M.FormSelect.getInstance($('#unidade')[0]);
  // }

  salvar() {
    const formValue = this.form.getRawValue();
    // formValue['unidade'] = this.unidades.filter(u => u.sigla === formValue.unidade)[0];
    const item = formValue;
    item.unidade = this.unidades[0];
    if (this.item) {
      this.api.put(this.item._id, item)
        .subscribe(_ => {
          this.toasts.toast('Item atualizado com sucesso!');
          this.router.navigate(['/cardapio']);
        });
    } else {
      this.api.post(item)
        .subscribe(_ => {
          this.toasts.toast('Item adicionado ao cardápio!');
          this.router.navigate(['/cardapio']);
        });
    }
  }

  // addUnidade() {
  //   const unidade = <Unidade>this.unidade;
  //   delete unidade._id;
  //   this.unidadesApi.post(unidade)
  //     .subscribe(_ => {
  //       this.toasts.toast('Unidade adicionada com sucesso!');
  //       this.loadUnidades();
  //     });
  // }

  // deleteUnidade(id: string) {
  //   this.unidadesApi.delete(id)
  //     .subscribe(_ => {
  //       this.toasts.toast('Unidade excluída com sucesso!');
  //       this.loadUnidades();
  //     });
  // }


}
