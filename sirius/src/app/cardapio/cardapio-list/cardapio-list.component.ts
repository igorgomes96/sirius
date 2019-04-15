import { Router } from '@angular/router';
import { ToastsService } from './../../shared/services/toasts.service';
import { CardapioApiService } from './../../shared/api/cardapio-api.service';
import { TipoSalgado } from './../../shared/models/item-cardapio';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ItemCardapio, Unidade } from 'src/app/shared/models/item-cardapio';
import { distinctUntilChanged, debounceTime, filter, map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CardapioService } from 'src/app/shared/services/cardapio.service';

declare var $: any;

@Component({
  selector: 'app-cardapio-list',
  templateUrl: './cardapio-list.component.html',
  styleUrls: ['./cardapio-list.component.css']
})
export class CardapioListComponent implements OnInit, AfterViewInit {

  formFiltroCardapio: FormGroup;
  // itens: ItemCardapio[];
  salgadosFesta: ItemCardapio[];
  salgadosComerciais: ItemCardapio[];
  TipoSalgado: typeof TipoSalgado = TipoSalgado;

  constructor(private formBuilder: FormBuilder, private api: CardapioApiService,
    private toasts: ToastsService, private router: Router,
    private cardapioService: CardapioService) { }

  ngOnInit() {
    this.formFiltroCardapio = this.formBuilder.group({
      filtro: [''],
      // tipo: [this.cardapioService.tipoSalgado]
    });

    this.formFiltroCardapio.get('filtro').valueChanges
      .pipe(distinctUntilChanged(), debounceTime(300))
      .subscribe(v => this.load(v));

    // this.formFiltroCardapio.get('tipo').valueChanges
    //   .pipe(distinctUntilChanged(), debounceTime(300), tap(v => this.cardapioService.tipoSalgado = v))
    //   .subscribe(v => this.load(this.formFiltroCardapio.get('filtro').value, v));


    // this.load(null, this.formFiltroCardapio.get('tipo').value);
    this.load();
  }

  ngAfterViewInit(): void {
    $('#tipo').formSelect();
  }

  load(nome: string = null) {
    let obs: Observable<ItemCardapio[]>;
    if (nome) {
      obs = this.api.getByNome(nome, new Date());
    } else {
      obs = this.api.getAll(new Date());
    }
    // obs.pipe(map((itens: ItemCardapio[]) => {
    //   return itens.filter(i => i.tipo === tipo);
    // }))
    obs.subscribe((itens: ItemCardapio[]) => {
      this.salgadosComerciais = itens.filter(i => i.tipo === TipoSalgado[TipoSalgado.Comercial]);
      this.salgadosFesta = itens.filter(i => i.tipo === TipoSalgado[TipoSalgado.Festa]);
    });
  }

  delete(item: ItemCardapio) {
    this.api.delete(item._id)
      .subscribe(_ => {
        this.toasts.toast('Item excluído do cardápio!');
        this.load(this.formFiltroCardapio.get('filtro').value);
      });
  }

  edit(item: ItemCardapio) {
    this.router.navigate(['/cardapio', item._id]);
  }


}
