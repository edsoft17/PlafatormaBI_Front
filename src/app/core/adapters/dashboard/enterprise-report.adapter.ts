import { AccumulatedIncomedEntity } from "app/core/entities/dashboard/accumulated-incomed.entity";
import { EnterpriseReportEntity } from "app/core/entities/dashboard/enterprise-report.entity";
import { AccumulatedIncomed } from "app/core/models/dashboard/accumulated-incomed";
import { EnterpriseReport } from "app/core/models/dashboard/enterprise-report";

export class EnterpriseReportAdapter {
    convertEntityToModel(entity: EnterpriseReportEntity): EnterpriseReport {
        return {
            customer: entity.cliente,
            contract: entity.contrato,
            contractPercentage: entity.contrato_Porc,
            incomeP: entity.ingreso_P,
            incomeE: entity.ingreso_E,
            incomePercentage: entity.ingreso_Porc,
            cashInflow: entity.ingresoCaja,
            cashPercentage: entity.caja_Porc,
            budgetP: entity.presupuesto_P,
            budgetE: entity.presupuesto_E,
            budgetPercentage: entity.presupuesto_Porc,
            profitP: entity.utilidad_P,
            profitE: entity.utilidad_E,
            profitPercentage: entity.utilidad_Porc,
            accountingProfitE: entity.e_Utilidad_Contable,
            accountingProfit: entity.utilidad_Contable,
            leasingProfitE: entity.e_Utilidad_conLeasing,
            leasingProfit: entity.utilidad_conLeasing
        }
    }
}