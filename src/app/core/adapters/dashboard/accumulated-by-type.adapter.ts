import { AccumulatedByTypeEntity } from "app/core/entities/dashboard/accumulated-by-type.entity";
import { AccumulatedByType } from "app/core/models/dashboard/accumulated-by-type";

export class AccumulatedByTypeAdapter {
    convertEntityToModelArray(enttites: AccumulatedByTypeEntity[]): AccumulatedByType[] {
        return enttites?.map( entity => this.convertEntityToModel(entity));
    }

    convertEntityToModel(entity: AccumulatedByTypeEntity): AccumulatedByType {
        return {
            parentFlowStructureId: entity.idEstructuraFlujo_Padre,
            parentLevelName: entity.nombreNivel_Padre,
            executedAmount: entity.monto_Ejecutado,
            budgetedAmount: entity.monto_Presupuesto,
            difference: entity.diferencia,
            percentage: entity.porcentaje
        }
    }
}