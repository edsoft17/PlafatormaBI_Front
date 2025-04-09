export interface MenuEntity {
    modulos:            ModulesEntity[];
    acciones:           ActionEntity[];
    tiposAsignable:     TiposAsignable[];
    asignables:         Asignable[];
    accionesAsignables: any[];
}

export interface ActionEntity {
    idOpcion:         number;
    idModulo:         number;
    nombre:           string;
    url:              string;
    orden:            number;
    icono:            string;
    codigo:           string;
    esMenu:           EsMenu;
    idPredecesor:     number;
    nombrePredecesor: NombrePredecesor;
}

export enum EsMenu {
    N = "N",
    S = "S",
}

export enum NombrePredecesor {
    Empty = "",
    EstructuraFlujo = "Estructura flujo",
    Parametros = "Parametros",
    TiposDeFlujo = "Tipos de Flujo",
}

export interface Asignable {
    idAsignable:     number;
    codigoAsignable: string;
    nombreAsignable: string;
    idTipoAsignable: number;
}

export interface ModulesEntity {
    idOpcion:      number;
    idPredecesor:  number;
    nombre:        string;
    url:           string;
    orden:         number;
    hijo:          number;
    icono:         string;
    accionesMenu:  ActionEntity[];
    otrasAcciones: ActionEntity[];
}

export interface TiposAsignable {
    idTipoAsignable:          number;
    nombreTipoAsignable:      string;
    descripcionTipoAsignable: string;
    asignables:               any[];
}
