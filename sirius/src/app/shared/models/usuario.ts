export enum Perfil {
    Administrador = 'Administrador',
    Padrao = 'Padrão'
}

export interface Usuario {
    _id: string;
    nome: string;
    email: string;
    senha: string;
    perfil: Perfil;
}
