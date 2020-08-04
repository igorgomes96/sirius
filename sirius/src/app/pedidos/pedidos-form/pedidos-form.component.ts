import { Router, ActivatedRoute } from '@angular/router';
import { CardapioApiService } from '../../core/api/cardapio-api.service';
import { Component, OnInit, EventEmitter } from '@angular/core';
import { ItemCardapio, TipoSalgado } from 'src/app/shared/models/item-cardapio';
import { map, tap, filter, switchMap, catchError, finalize } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Pedido } from 'src/app/shared/models/pedido';
import { PedidosApiService } from 'src/app/core/api/pedidos-api.service';
import { Cliente, Endereco } from 'src/app/shared/models/cliente';
import { ClientesApiService } from 'src/app/core/api/clientes-api.service';
import { timepicker } from 'src/environments/timepicker-options';
import { ToastsService } from 'src/app/core/services/toasts.service';
import { UtilService } from 'src/app/core/services/util.service';
import { HttpErrorResponse } from '@angular/common/http';
import { datepicker } from 'src/environments/datepicker-options';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { SpinnerService } from 'src/app/core/services/spinner.service';

declare var $: any;
declare var M: any;

@Component({
  selector: 'app-pedidos-form',
  templateUrl: './pedidos-form.component.html',
  styleUrls: ['./pedidos-form.component.css']
})
export class PedidosFormComponent implements OnInit {

  telefoneFiltro = '';
  pedido = new Pedido();
  clientes: Cliente[];
  showFormCliente = false;
  salgadosFesta: ItemCardapio[] = [];
  salgadosComerciais: ItemCardapio[] = [];
  TipoSalgado: typeof TipoSalgado = TipoSalgado;
  itemPersonalizadoModal = new EventEmitter<boolean>();
  atualizarCliente = true;
  openModalSenha = new EventEmitter<boolean>();
  habilitaRecorrencia = true;
  outros: ItemCardapio[] = [];
  diversos: ItemCardapio[] = [];
  edicao = false;
  recorrenciaForm: FormGroup;
  onSelectRepetirAte: any;
  onSelectDate: any;

  dias = ['Dom.', 'Seg.', 'Ter.', 'Qua.', 'Qui.', 'Sex.', 'Sáb.'];

  constructor(private cardapioApi: CardapioApiService,
    private router: Router, private api: PedidosApiService,
    private clientesApi: ClientesApiService, private route: ActivatedRoute,
    private toasts: ToastsService, private utilService: UtilService,
    private fb: FormBuilder, private spinnerService: SpinnerService) { }

  ngOnInit() {

    this.recorrenciaForm = this.fb.group({
      dias: this.buildDias(),
    });

    this.pedido.cliente = new Cliente();
    this.pedido.enderecoEntrega = new Endereco();
    this.pedido.enderecoEntrega.cidade = 'Araguari';
    this.pedido.enderecoEntrega.uf = 'MG';
    this.pedido.horario = new Date();
    this.pedido.recorrencia = { repetirAte: null, dias: [], pedidoOrigem: null };

    const onSelectHour = (hour: any, minutes: any) => {
      const data = new Date(this.pedido.horario);
      data.setHours(hour);
      data.setMinutes(minutes);
      this.pedido.horario = data;
    };

    this.onSelectRepetirAte = (value: any) => {
      this.pedido.recorrencia.repetirAte = new Date(value);
    };

    const onCloseRepetirAte = () => {
      const instance = this.datePickerInstance('#repetirAte');
      if (!instance.toString()) {
        this.pedido.recorrencia.repetirAte = null;
      }
    };

    this.onSelectDate = (value: any) => {
      const data = new Date(value);
      this.carregarItensCardapio(data);
      this.pedido.horario = new Date(this.pedido.horario);
      data.setHours(this.pedido.horario.getHours());
      data.setMinutes(this.pedido.horario.getMinutes());
      this.pedido.horario = data;

      if (this.habilitaRecorrencia) {
        $('#repetirAte').val('');
        const repetirAteSelecionado = this.datePickerInstance('#repetirAte').date;
        const setDate = repetirAteSelecionado && new Date(repetirAteSelecionado) > data;
        this.datePickerInstance('#repetirAte').destroy();
        const options = {
          ...datepicker, ...{
            onSelect: this.onSelectRepetirAte,
            setDefaultDate: setDate,
            defaultDate: setDate ? repetirAteSelecionado : null,
            showClearBtn: true,
            onClose: onCloseRepetirAte,
            minDate: data
          }
        };
        this.createDatePicker('#repetirAte', options);
      }

    };

    this.createDatePicker('#data', {
      ...datepicker, ...{
        onSelect: this.onSelectDate
      }
    });

    this.createDatePicker('#repetirAte', {
      ...datepicker, ...{
        onSelect: this.onSelectRepetirAte,
        setDefaultDate: false,
        showClearBtn: true,
        onClose: onCloseRepetirAte,
        minDate: new Date()
      }
    });

    $('#hora').timepicker(Object.assign(timepicker, {
      onSelect: onSelectHour
    }));

    this.carregarItensCardapio(new Date());

  }

  carregarItensCardapio(data: Date) {
    this.loadItensPromisse(data, null)
      .pipe(
        map(itens => {
          itens.forEach(i => i.semPimenta = false);
          return itens;
        }),
        tap((itens: ItemCardapio[]) => {
          this.salgadosFesta = itens.filter(i => i.tipo === TipoSalgado[TipoSalgado.Festa]);
          this.salgadosComerciais = itens.filter(i => i.tipo === TipoSalgado[TipoSalgado.Comercial]);
          this.diversos = itens.filter(i => i.tipo === TipoSalgado[TipoSalgado.Diversos]);
        }),
        switchMap(_ => this.route.data),
        filter(d => d.hasOwnProperty('pedido')),
        map(d => d['pedido'])
      ).subscribe((pedido: Pedido) => {
        this.edicao = true;
        this.habilitaRecorrencia = false;
        if (!pedido.entregar) {
          if (pedido.cliente.endereco) {
            pedido.enderecoEntrega = pedido.cliente.endereco;
          } else {
            pedido.enderecoEntrega = this.pedido.enderecoEntrega;
          }
        }
        this.outros = pedido.itens.filter(i => i.tipo === TipoSalgado[TipoSalgado.Outros]);
        this.updateQuantidades(pedido.itens);
        const hora = this.utilService.getTime(this.utilService.getDateTime(pedido.horario.toString()));
        $('#hora').val(hora);
        this.datePickerInstance('#data').destroy();
        this.createDatePicker('#data', {
          ...datepicker, ...{
            defaultDate: new Date(pedido.horario),
            onSelect: this.onSelectDate
          }
        });
        if (pedido.recorrencia.repetirAte) {
          this.datePickerInstance('#repetirAte').destroy();
          this.createDatePicker('#repetirAte', {
            ...datepicker, ...{
              defaultDate: new Date(pedido.recorrencia.repetirAte),
              onSelect: this.onSelectRepetirAte,
              minDate: new Date(pedido.horario),
              showClearBtn: true
            }
          });
        }

        if (pedido.recorrencia.dias && pedido.recorrencia.dias.length) {
          const formValueDias = this.dias.map((_: string, index: number) => {
            if (pedido.recorrencia.dias.indexOf(index) >= 0) {
              return true;
            }
            return false;
          });
          this.recorrenciaForm.get('dias').disable();
          this.recorrenciaForm.get('dias').setValue(formValueDias);
        }

        this.showFormCliente = true;
        this.pedido = pedido;
      });
  }

  buildDias(): FormArray {
    const controls = this.dias.map(d => new FormControl(false));
    return this.fb.array(controls);
  }

  datePickerInstance(selector: string) {
    return M.Datepicker.getInstance(document.querySelector(selector));
  }

  createDatePicker(selector: string, options: any) {
    return $(selector).datepicker(options);
  }

  get horario() {
    return $('#hora').val();
  }

  cancelarPedido() {
    const confirmacao = confirm('Tem certeza que deseja cancelar o pedido?');
    if (confirmacao) {
      this.router.navigate(['/pedidos']);
    }
  }

  atualizarQuantidadesItens(itemLista: ItemCardapio, itemAtualizado: ItemCardapio) {
    if (itemLista) {
      itemLista.quantidade = itemAtualizado.quantidade;
      itemLista.semPimenta = itemAtualizado.semPimenta;
      itemLista.triangulo = itemAtualizado.triangulo;
      if (itemLista.semPimenta && itemLista.reservaSemPimenta) {
        itemLista.reservaSemPimenta += itemAtualizado.quantidade;
      } else if (itemLista.reservaComPimenta) {
        itemLista.reservaComPimenta += itemAtualizado.quantidade;
      }
    }
  }

  updateQuantidades(itens: ItemCardapio[]) {
    itens.filter(s => s.tipo === TipoSalgado[TipoSalgado.Festa])
      .forEach(salgado => {
        const salgadoFesta = this.salgadosFesta.find(s => s._id === salgado._id);
        this.atualizarQuantidadesItens(salgadoFesta, salgado);
      });

    itens.filter(s => s.tipo === TipoSalgado[TipoSalgado.Comercial])
      .forEach(salgado => {
        const salgadoComercial = this.salgadosComerciais.find(s => s._id === salgado._id);
        this.atualizarQuantidadesItens(salgadoComercial, salgado);
      });

    itens.filter(s => s.tipo === TipoSalgado[TipoSalgado.Diversos])
      .forEach(salgado => {
        const diverso = this.diversos.find(s => s._id === salgado._id);
        this.atualizarQuantidadesItens(diverso, salgado);
      });
  }

  selecionaCliente(cliente: Cliente) {
    this.clientes = [];
    this.pedido.cliente = cliente;
    if (this.pedido.cliente.endereco) {
      this.pedido.enderecoEntrega = this.pedido.cliente.endereco;
    }
    this.showFormCliente = true;
  }

  onFiltroTelefoneChange(filtro: string) {
    if (!filtro) {
      return;
    }
    const telefone = this.numbersPhone(filtro);
    if (!telefone || telefone.length < 8) {
      this.clientes = [];
      return;
    }

    this.loadClientes(telefone);
  }


  numbersPhone(telefone: string): string {
    const numeros = telefone.match(/\d+/g);
    if (!numeros || !numeros.length) {
      return;
    }
    return numeros.reduce((prev: string, curr: string) => prev + curr, '');
  }

  get itensSelecionados(): ItemCardapio[] {
    return this.salgadosComerciais.filter(s => s.quantidade)
      .concat(this.salgadosFesta.filter(s => s.quantidade))
      .concat(this.outros.filter(s => s.quantidade))
      .concat(this.diversos.filter(s => s.quantidade));
  }

  atualizaInformacoesPedido() {
    this.pedido.horario = new Date(this.pedido.horario);
    this.pedido.itens = this.itensSelecionados;
    console.log(this.pedido.itens);

    if (!this.pedido.entregar) {
      this.pedido.enderecoEntrega = null;
    }

    let recorrenciaDias = this.recorrenciaForm.get('dias').value;
    recorrenciaDias = recorrenciaDias.map((d: any, i: number) => d === true ? i : null).filter((v: any) => v !== null);
    this.pedido.recorrencia.dias = recorrenciaDias;

    if (this.pedido.entregar) {
      this.pedido.cliente.endereco = this.pedido.enderecoEntrega;
    } else if (!this.pedido.cliente._id) { // Se não vai entregar e o cliente não existe
      this.pedido.cliente.endereco = new Endereco();
    }
  }

  fecharPedido() {

    this.atualizaInformacoesPedido();

    const message = this.validaPedido();
    if (message) {
      this.toasts.toast(message);
      return;
    }

    if (this.edicao) {
      this.openModalSenha.emit(true);
    } else {
      this.salvar(null);
    }
  }

  get mensagemAlteracaoRecorrente(): any {
    if (!this.habilitaRecorrencia && this.pedido.recorrencia.repetirAte) { // É recorrente
      const data = new Date(this.pedido.recorrencia.repetirAte).toLocaleDateString();
      return {
        mensagem: `Esse pedido é recorrente. Deseja alterar também os próximos pedidos até a data ${data}?`,
        checkbox: 'Sim, alterar os pedidos recorrentes'
      };
    }
  }

  get formDias(): FormArray {
    return this.recorrenciaForm.get('dias') as FormArray;
  }

  private validaPedido(): string {
    const qtdaMenorQue0 = this.itensSelecionados.filter((item) => item.quantidade < 0);
    if (qtdaMenorQue0.length > 0) {
      return `O salgado ${qtdaMenorQue0[0].nome} está com quantidade negativa!`;
    }

    if (!this.horario) {
      return `É necessário informar o horário!`;
    }

    const alemReserva = this.itensAlemReserva();
    if (alemReserva && alemReserva.length > 0) {
      return `O salgado '${alemReserva[0].nome}' ultrapassou a quantidade em reserva!`;
    }

    if (!this.pedido.cliente || !this.pedido.cliente.nome) {
      return `É necessário informar o nome do cliente!`;
    }

    if (!this.pedido.cliente.fone1 && !this.pedido.cliente.fone2) {
      return `É necessário informar o(s) telefone(s) do cliente!`;
    }

    if (this.pedido.recorrencia && this.pedido.recorrencia.repetirAte
      && (!this.pedido.recorrencia.dias || !this.pedido.recorrencia.dias.length)) {
      return `Escolha os dias de recorrência do pedido ou deixe o campo 'Repetir até' em branco!`;
    }

    if (this.pedido.recorrencia && this.pedido.recorrencia.dias
      && this.pedido.recorrencia.dias.length && !this.pedido.recorrencia.repetirAte) {
      return `Preencha o campo 'Repetir até' para definir a recorrência, ou desmarque todos os dias!`;
    }
  }

  salvar(confirmacao: any) {

    const senha = confirmacao ? confirmacao.senha : null;
    const recorrente = confirmacao ? confirmacao.recorrente : null;

    // Verifica se cria um novo pedido ou atualiza um pedido existente
    let httpCall: Observable<Pedido | void>;

    // Verifica se cria um novo cliente ou atualiza um cliente existente
    if (!this.pedido.cliente._id) {
      httpCall = this.clientesApi.post(this.pedido.cliente)
        .pipe(
          tap((novoCliente: Cliente) => this.pedido.cliente._id = novoCliente._id),
          switchMap(_ => this.pedidoCall(senha, recorrente))
        );
    } else if (this.atualizarCliente) {
      httpCall = this.clientesApi.put(this.pedido.cliente._id, this.pedido.cliente)
        .pipe(
          catchError((err: HttpErrorResponse) => {
            if (err.status === 404) {
              return this.clientesApi.post(this.pedido.cliente);
            }
            return of(null);
          }),
          switchMap(_ => this.pedidoCall(senha, recorrente))
        );
    } else {
      httpCall = this.pedidoCall(senha, recorrente);
    }

    this.spinnerService.showSpinner(true);
    httpCall.pipe(
      finalize(() => this.spinnerService.showSpinner(false))
    ).subscribe((pedidoCriado: any) => {
      if (this.edicao) {
        this.router.navigate([`/pedidos`]);
      } else {
        this.router.navigate([`/pedidos/${pedidoCriado._id}/confirmacao`]);
      }
    });

  }

  pedidoCall(senha: string = null, recorrente = false): Observable<Pedido | void> {
    if (this.edicao) {
      return this.api.put(this.pedido._id, this.pedido, senha, recorrente);
    } else {
      return this.api.post(this.pedido);
    }
  }

  get habilitaFecharPedido() {
    return this.salgadosFesta.some(s => !!s.quantidade) ||
      this.salgadosComerciais.some(s => !!s.quantidade) ||
      this.diversos.some(s => !!s.quantidade);
  }

  addItemForaCardapio() {
    this.itemPersonalizadoModal.emit(true);
  }

  itensAlemReserva(): ItemCardapio[] {
    return this.itensSelecionados.filter(item => {
      if (item.semPimenta) {
        return item.reservaSemPimenta && item.quantidade > item.reservaSemPimenta;
      } else {
        return item.reservaComPimenta && item.quantidade > item.reservaComPimenta;
      }
    });
  }

  loadItensPromisse(data: Date, nome: string): Observable<ItemCardapio[]> {
    let obs: Observable<ItemCardapio[]>;
    if (nome) {
      obs = this.cardapioApi.getByNome(nome, data);
    } else {
      obs = this.cardapioApi.getAll(data);
    }
    return obs;
  }

  novoCliente() {
    this.pedido.cliente = new Cliente();
    let telefone = this.numbersPhone(this.telefoneFiltro);
    if (telefone && (telefone.length === 8 || telefone.length === 9)) {
      telefone = '34' + telefone;
    }
    if (telefone && telefone.length < 12) {
      this.pedido.cliente.fone1 = telefone;
    }
    this.showFormCliente = true;
  }

  trocarCliente() {
    this.telefoneFiltro = '';
    this.pedido.cliente = new Cliente();
    this.showFormCliente = false;
  }


  loadClientes(telefone: string = null) {
    let obs: Observable<Cliente[]>;
    if (telefone) {
      obs = this.clientesApi.getByTelefone(telefone);
    } else {
      obs = this.clientesApi.getAll();
    }
    obs.subscribe((clientes: Cliente[]) => {
      this.clientes = clientes;
    });
  }

  addItem(item: ItemCardapio) {
    this.outros.push(item);
  }

}
