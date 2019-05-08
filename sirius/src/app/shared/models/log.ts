import { Pedido } from './pedido';
import { Usuario } from './usuario';

export class PedidoLog {
    pedidoId: string;
    logs: Log[];
}

export class Log {
    horario: Date;
    usuario: Usuario;
    tipo: string;
    pedido: Pedido;
}