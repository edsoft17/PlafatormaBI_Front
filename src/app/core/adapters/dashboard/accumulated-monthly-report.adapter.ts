import { AccumulatedIncomedEntity } from "app/core/entities/dashboard/accumulated-incomed.entity";
import { AccumulatedMonthlyReportEntity } from "app/core/entities/dashboard/accumulated-monthly-report.entity";
import { AccumulatedIncomed } from "app/core/models/dashboard/accumulated-incomed";
import { AccumulatedMonthlyReport } from "app/core/models/dashboard/accumulated-monthly-report.";

export class AccumulatedMonthlyReportAdapter {
    convertEntityToModelArray(enttites: AccumulatedMonthlyReportEntity[]): AccumulatedMonthlyReport[] {
        return enttites?.map( entity => this.convertEntityToModel(entity));
    }

    convertEntityToModel(entity: AccumulatedMonthlyReportEntity): AccumulatedMonthlyReport {
        return {
            month: entity.mes,
            budgetAmount: entity.monto_Presupuesto,
            executedAmount: entity.monto_Ejecutado
        }
    }
} 