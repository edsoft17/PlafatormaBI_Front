import { FlowHeaderGetEntity } from "app/core/entities/flow/flow-header-get.entity"
import { FlowHeaderGet } from "app/core/models/flow/flow-header-get"

export class FlowHeaderGetAdapter {
    convertEntityToModelArray(entities: FlowHeaderGetEntity[]): FlowHeaderGet[] {
        return entities.map(entity => this.convertEntityToModel(entity))
    }

    convertEntityToModel(entity: FlowHeaderGetEntity): FlowHeaderGet {
        return {
            structureHeaderId: entity.idEstructuraFlujo_Cabecera,
            name: entity.nombre_cabecera,
            state: entity.estado_cabecera
        }
    }
}