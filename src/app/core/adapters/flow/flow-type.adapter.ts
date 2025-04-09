import { FlowTypeGetEntity } from "app/core/entities/flow/flow-type-get.entity"
import { FlowTypeGet } from "app/core/models/flow/flow-type-get"

export class FlowTypeGetAdapter {
    convertEntityToModelArray(entities: FlowTypeGetEntity[]): FlowTypeGet[] {
        return entities.map(entity => this.convertEntityToModel(entity))
    }

    convertEntityToModel(entity: FlowTypeGetEntity): FlowTypeGet {
        return {
            flowTypeId: entity.idTipoFlujo,
            name: entity.nombreFlujo,
            state: entity.estadoFlujo
        }
    }
}