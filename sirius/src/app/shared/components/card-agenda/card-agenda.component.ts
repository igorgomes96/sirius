import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Pedido } from '../../models/pedido';
import { UsuarioService } from '../../services/usuario.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card-agenda',
  templateUrl: './card-agenda.component.html',
  styleUrls: ['./card-agenda.component.css']
})
export class CardAgendaComponent implements OnInit {

  isAdmin = false;

  @Input() pedido: Pedido;
  @Input() mostrarRestaurar = false;
  @Output() pagamento: EventEmitter<Pedido> = new EventEmitter<Pedido>();
  @Output() restaurar: EventEmitter<Pedido> = new EventEmitter<Pedido>();
  @Output() editPedido = new EventEmitter<Pedido>();
  @Output() deletePedido = new EventEmitter<Pedido>();

  constructor(private usuarioService: UsuarioService, private router: Router) { }

  ngOnInit() {
    this.isAdmin = this.usuarioService.isAdmin();
  }

  edit() {
    this.editPedido.emit(this.pedido);
  }

  log() {
    this.router.navigate([`/pedidos/${this.pedido._id}/log`]);
  }

  delete() {
    this.deletePedido.emit(this.pedido);
  }

  pedidoPago() {
    this.pagamento.emit(this.pedido);
  }

  restaurarPedido() {
    this.restaurar.emit(this.pedido);
  }

  get valorTotal() {
    return this.pedido.itens.map(i => i.valor * (!i.quantidade ? 0 : i.quantidade))
      .reduce((p, c) => p + c);
  }


}
