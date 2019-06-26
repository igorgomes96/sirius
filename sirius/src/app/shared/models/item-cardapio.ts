export interface Unidade {
    _id: string;
    nome: string;
    sigla: string;
}

export enum TipoSalgado {
    Comercial = 'Comercial',
    Festa = 'Festa',
    Diversos = 'Diversos'
}

export interface ItemCardapio {
    _id: string;
    nome: string;
    valor: number;
    unidade: Unidade;
    popular: boolean;
    tipo: TipoSalgado;
    detalhes: string;
    comPimenta: boolean;
    selecionado: boolean;
    quantidade: number;
    reserva: number;

}
