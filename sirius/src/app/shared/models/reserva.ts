import { Unidade } from './item-cardapio';

export class Reserva {
    _id: string;
    data: Date;
    qtda: number;
    qtdaVendida: number;
    item: {
        _id: string,
        nome: String,
        valor: Number,
        tipo: String,
        unidade: Unidade,
        detalhes: String,
        semPimenta: boolean
    };
}
