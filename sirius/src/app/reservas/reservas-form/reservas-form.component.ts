import { CardapioApiService } from '../../core/api/cardapio-api.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Reserva } from 'src/app/shared/models/reserva';
import { ReservasApiService } from 'src/app/core/api/reservas-api.service';
import { ToastsService } from 'src/app/core/services/toasts.service';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, map, distinctUntilChanged, debounceTime, tap } from 'rxjs/operators';
import { ItemCardapio, TipoSalgado } from 'src/app/shared/models/item-cardapio';
import { datepicker } from 'src/environments/datepicker-options';
import { ReservasService } from 'src/app/core/services/reservas.service';
import { componentNeedsResolution } from '@angular/core/src/metadata/resource_loading';

declare var $: any;
declare var M: any;

@Component({
  selector: 'app-reservas-form',
  templateUrl: './reservas-form.component.html',
  styleUrls: ['./reservas-form.component.css']
})
export class ReservasFormComponent implements OnInit {

  form: FormGroup;
  reserva: Reserva;
  cardapio: ItemCardapio[] = [];
  dataAtual: Date = new Date();
  TipoSalgado: typeof TipoSalgado = TipoSalgado;
  constructor(private formBuilder: FormBuilder,
    private api: ReservasApiService, private toasts: ToastsService,
    private router: Router, private route: ActivatedRoute,
    private cardapioApi: CardapioApiService, private reservasService: ReservasService) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      tipo: [TipoSalgado.Festa],
      pesquisa: ['', Validators.required],
      data: [this.reservasService.data],
      qtda: [0, Validators.required],
      qtdaVendida: [0, Validators.required],
      item: this.formBuilder.group({
        _id: [''],
        semPimenta: [false],
        nome: [{ value: '', disabled: true }, Validators.required],
        detalhes: [{ value: '', disabled: true }],
        valor: [{ value: '', disabled: true }],
        tipo: [{ value: '', disabled: true }],
        unidade: this.formBuilder.group({
          nome: [{ value: '', disabled: true }],
          sigla: [{ value: '', disabled: true }]
        })
      })
    });

    this.route.data
      .pipe(filter(d => d.hasOwnProperty('reserva')), map(d => d['reserva']))
      .subscribe((reserva: Reserva) => {
        this.reserva = reserva;
        this.form.patchValue(reserva);
      });

      this.loadCardapio(this.form.get('tipo').value);
  }

  loadCardapio(tipo: string) {
    this.cardapioApi.getAll()
      .pipe(
        map((cardapio: ItemCardapio[]) => {
          return cardapio.filter(c => {
            return c.tipo === tipo;
          });
        })
      ).subscribe((cardapio: ItemCardapio[]) => {
        this.cardapio = cardapio;
        const objData = {};
        this.cardapio.forEach((i: ItemCardapio) => {
          let nome = i.nome;
          if (i.detalhes) {
            nome += ' | ' + i.detalhes.slice(0, 30);
          }
          objData[nome] = null;
        });
        $('#pesquisa').autocomplete({
          data: objData,
          onAutocomplete: (ev: any) => {
            const item = this.cardapio.filter(i => {
              if (i.detalhes) {
                return ev === (i.nome + ' | ' + i.detalhes.slice(0, 30));
              } else {
                return ev === i.nome;
              }
            })[0];
            this.form.get('item').patchValue(item);
          }
        });

        $('#data').datepicker(Object.assign(datepicker, {
          defaultDate: this.reservasService.data,
          onSelect: (novaData: any) => {
            this.dataAtual = novaData;
          }
        }));
      });
  }

  hasValue(field: string) {
    return !!this.form.get(field).value || this.form.get(field).value === 0;
  }

  zeraHora(data: Date) {
    data.setHours(0);
    data.setMinutes(0);
    data.setSeconds(0);
    data.setMilliseconds(0);
    return data;
  }

  salvar() {
    const reserva = <Reserva>this.form.getRawValue();
    delete reserva['pesquisa'];
    delete reserva['tipo'];
    reserva.data = this.zeraHora(this.dataAtual);
    if (this.reserva) {
      this.api.put(this.reserva._id, reserva)
        .subscribe(_ => {
          this.toasts.toast('Reserva atualizada!');
          this.router.navigate(['/reservas']);
        });
    } else {
      this.api.post(reserva)
        .subscribe(_ => {
          this.toasts.toast('Reserva cadastrada!');
          this.router.navigate(['/reservas']);
        });
    }
  }


}
