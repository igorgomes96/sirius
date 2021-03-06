import { Router } from '@angular/router';
import { ToastsService } from '../../core/services/toasts.service';
import { CardapioApiService } from '../../core/api/cardapio-api.service';
import { TipoSalgado } from './../../shared/models/item-cardapio';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, AfterViewInit, EventEmitter } from '@angular/core';
import { ItemCardapio, Unidade } from 'src/app/shared/models/item-cardapio';
import { distinctUntilChanged, debounceTime, filter, map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CardapioService } from 'src/app/core/services/cardapio.service';

declare var $: any;

@Component({
  selector: 'app-cardapio-list',
  templateUrl: './cardapio-list.component.html',
  styleUrls: ['./cardapio-list.component.css']
})
export class CardapioListComponent implements OnInit, AfterViewInit {

  formFiltroCardapio: FormGroup;
  salgadosFesta: ItemCardapio[];
  salgadosComerciais: ItemCardapio[];
  diversos: ItemCardapio[];
  salgadoExclusao: ItemCardapio;
  openModalConfirmacao: EventEmitter<boolean>;
  TipoSalgado: typeof TipoSalgado = TipoSalgado;

  constructor(private formBuilder: FormBuilder, private api: CardapioApiService,
    private toasts: ToastsService, private router: Router,
    private cardapioService: CardapioService) { }

  ngOnInit() {

    this.openModalConfirmacao = new EventEmitter<boolean>();

    this.formFiltroCardapio = this.formBuilder.group({
      filtro: [''],
    });

    this.formFiltroCardapio.get('filtro').valueChanges
      .pipe(distinctUntilChanged(), debounceTime(300))
      .subscribe(v => this.load(v));

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

    obs.subscribe((itens: ItemCardapio[]) => {
      this.salgadosComerciais = itens.filter(i => i.tipo === TipoSalgado[TipoSalgado.Comercial]);
      this.salgadosFesta = itens.filter(i => i.tipo === TipoSalgado[TipoSalgado.Festa]);
      this.diversos = itens.filter(i => i.tipo === TipoSalgado[TipoSalgado.Diversos]);
    });
  }

  confirmarExclusao(confirmacao: boolean) {
    if (confirmacao) {
      this.api.delete(this.salgadoExclusao._id)
        .subscribe(_ => {
          this.toasts.toast('Item excluído do cardápio!');
          this.load(this.formFiltroCardapio.get('filtro').value);
        });
    }
  }

  delete(item: ItemCardapio) {
    this.salgadoExclusao = item;
    this.openModalConfirmacao.emit(true);
  }

  edit(item: ItemCardapio) {
    this.router.navigate(['/cardapio', item._id]);
  }


}
