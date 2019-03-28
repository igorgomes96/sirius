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
    usuario: Usuario;
}
