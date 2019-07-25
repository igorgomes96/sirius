import { ItemCardapio } from './item-cardapio';
import { Cliente, Endereco } from './cliente';
import { Usuario } from './usuario';

export class Pedido {
    _id: string;
    itens: ItemCardapio[];
    cliente: Cliente;
    horario: Date;
    entregar: Boolean;
    observacoes: string;
    enderecoEntrega: Endereco;
    enderecoStr: string;
    enderecoStrSimples: string;
    usuario: Usuario;
    pago: boolean;
    exclusao: Exclusao;
    impressao: Impressao;
    recorrencia: number[];
    repetirAte: Date;
}

export class Exclusao {
    horario: Date;
    usuario: Usuario;
}

export class Impressao {
    horario: Date;
    usuario: Usuario;
}
