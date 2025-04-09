export interface FlowDataAccountEntity {
    flujo: FlowDataGetEntity[];
    cuentas: FlowDataAssociatedAccountsEntity[];
}

export interface FlowDataGetEntity {
    idEstructuraFlujo_Cabecera: number;
    idEstructuraFlujo: number;
    orden: number;
    idPadre: number;
    idNivel: number;
    nombreNivel: string;
    ultNivel: number;
    comportamiento: string;
    monto_Presupuesto?: number;
    cantidad_Presupuesto?: number;
  }
  
  export interface FlowDataAssociatedAccountsEntity {
    idEstructuraFlujo: number;
    orden: number;
    idCuentaContable: string;
    cod_Cuenta: string;
    cuenta: string;
    nivel1: string;
    nivel2: string;
    nivel3: string;
  }