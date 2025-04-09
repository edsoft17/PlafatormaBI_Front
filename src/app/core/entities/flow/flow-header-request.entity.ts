import { LedgerAccountGetEntity } from "./ledger-account-get.entity";

export interface FlowHeaderEntityRequest {
    IdUsuario: number;
    IdEmpresa: number;
    IdTipoFlujo: number;
    NombreFlujo: string;
    EstadoFlujo: number;
    structureDetail: FlowStructureEntityRegister;
}

export interface FlowStructureEntityRegister {
    IdUsuario: number;
    IdEmpresa: number;
    IdEstructuraFlujo_Cabecera: number;
    Estructura: StructureEntity[];
}

export interface StructureEntity {
    Orden: number;
    IdNivel: number;
    IdPadre: number;
    Nivel: string;
    IdComportamiento: number;
    UltNivel: number;
    IdFuenteDetalle: number;
    Monto?: number
    Cantidad?: number;
    hijos: StructureEntity[];
    cuentasAsociadas: LedgerAccountGetEntity[] 
}