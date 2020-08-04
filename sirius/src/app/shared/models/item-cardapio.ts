export interface Unidade {
    _id: string;
    nome: string;
    sigla: string;
}

export enum TipoSalgado {
    Comercial = 'Comercial',
    Festa = 'Festa',
    Diversos = 'Diversos',
    Outros = 'Outros'
}

export interface ItemCardapio {
    _id: string;
    nome: string;
    valor: number;
    unidade: Unidade;
    popular: boolean;
    tipo: TipoSalgado;
    detalhes: string;
    semPimenta: boolean;
    selecionado: boolean;
    quantidade: number;
    triangulo: boolean;
    reservaComPimenta: number;
    reservaSemPimenta: number;
}
