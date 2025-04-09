export interface IUserEntity {
    id: number;
    tipoDoc: string;
    nroDoc: string;
    nombres: string;
    apellidosPaternos: string;
    apellidosMaternos: string;
    username: string;
    token: string;
    refreshToken: string;
}