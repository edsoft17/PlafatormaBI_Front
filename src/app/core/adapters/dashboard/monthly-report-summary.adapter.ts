import { MonthlyReportSummaryEntity } from "app/core/entities/dashboard/accumulated-monthly-report.entity";
import { MonthlyReportSummary } from "app/core/models/dashboard/accumulated-monthly-report.";

export class MonthlyReportSummaryAdapter {
    convertEntityToModelArray(enttites: MonthlyReportSummaryEntity[]): MonthlyReportSummary[] {
        return enttites?.map( entity => this.convertEntityToModel(entity));
    }

    convertEntityToModel(entity: MonthlyReportSummaryEntity): MonthlyReportSummary {
        return {
            month: entity.mes,
            executedAmount: entity.monto_Ejecutado,
            budgetAmount: entity.monto_Presupuesto,
            period: entity.periodo,
            type: entity.tipo
        }
    }
}