import { Cliente, Endereco } from '../models/cliente';

export class Util {
    public static endereco(endereco: Endereco): string {
        if (!endereco) {
            return '';
        }

        if (endereco.rua && endereco.numero && endereco.bairro) {
            return `${endereco.rua}, nº ${endereco.numero}, bairro ${endereco.bairro}`;
        } else if (!endereco.numero && !endereco.bairro) {
            return `${endereco.rua}`;
        } else if (!endereco.rua && !endereco.numero) {
            return `Bairro ${endereco.bairro}`;
        } else if (!endereco.bairro) {
            return `${endereco.rua}, nº ${endereco.numero}`;
        } else {
            return '';
        }
    }
}
