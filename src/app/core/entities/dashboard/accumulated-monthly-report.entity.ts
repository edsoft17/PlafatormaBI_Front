export interface AccumulatedMonthlyReportEntity {
    mes: string;
    monto_Presupuesto: number;
    monto_Ejecutado: number;
}

export interface MonthlyReportSummaryEntity {
    mes: string; 
    monto_Ejecutado: number;
    monto_Presupuesto: number;
    periodo: number;
    tipo: string;
}