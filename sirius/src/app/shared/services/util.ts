import { Cliente } from '../models/cliente';

export class Util {
    public static endereco(cliente: Cliente): string {
        if (!cliente) {
            return '';
        }

        if (cliente.endereco.rua && cliente.endereco.numero && cliente.endereco.bairro) {
            return `${cliente.endereco.rua}, nº ${cliente.endereco.numero}, bairro ${cliente.endereco.bairro}`;
        } else if (!cliente.endereco.numero && !cliente.endereco.bairro) {
            return `${cliente.endereco.rua}`;
        } else if (!cliente.endereco.rua && !cliente.endereco.numero) {
            return `Bairro ${cliente.endereco.bairro}`;
        } else if (!cliente.endereco.bairro) {
            return `${cliente.endereco.rua}, nº ${cliente.endereco.numero}`;
        } else {
            return '';
        }
    }
}
