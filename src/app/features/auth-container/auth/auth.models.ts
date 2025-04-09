export interface FormLogin {
    typeDocument: string;
    document: string;
    password: string;
}

export interface LoginRequest {
    idPlataforma: string;
    tipoDoc: string;
    nroDoc: string;
    password: string;
    ip: string;
    appVersion: string;
}