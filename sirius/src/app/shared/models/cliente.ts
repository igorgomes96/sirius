export class Cliente {
    _id: string;
    nome: string;
    fone1: string;
    fone2: string;
    observacoes: string;
    endereco: Endereco;
    enderecoStr: string;
}

export interface Endereco {
    rua: string;
    bairro: string;
    cidade: string;
    uf: string;
    numero: number;
}
