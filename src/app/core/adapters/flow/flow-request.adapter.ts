import { FlowHeaderEntityRequest, StructureEntity } from "app/core/entities/flow/flow-header-request.entity";
import { FlowHeaderRequest, Structure } from "app/core/models/flow/flow-header-request";
import { LedgerAccountAdapter } from "./ledger-account.adapter";

export class FlowRequestAdapter {
    private _ledgerAccountAdapter = new LedgerAccountAdapter();

    convertModelToEntity(request: FlowHeaderRequest): FlowHeaderEntityRequest {
        return {
            IdUsuario: request.userId,
            IdEmpresa: request.companyId,
            EstadoFlujo: request.flowState,
            NombreFlujo: request.name,
            IdTipoFlujo: request.flowTypeId,
            structureDetail: {
                IdEmpresa: request.structureDetail.companyId,
                IdUsuario: request.structureDetail.userId,
                IdEstructuraFlujo_Cabecera: request.structureDetail.flowHeaderId,
                Estructura: this.convertStructureModelToEntityArray(request.structureDetail.detail)
            },

        }
    }

    convertStructureModelToEntityArray(structure: Structure[]): StructureEntity[] {
        return structure?.map(model => {
            return this.convertStructureModelToEntity(model)
        });
    }

    convertStructureModelToEntity(structure: Structure): StructureEntity {
        return {
            Nivel: structure.levelName,
            IdNivel: structure.levelId,
            IdFuenteDetalle: structure.behaviorId,
            IdComportamiento: structure.behaviorId,
            Orden: structure.order,
            IdPadre: structure.parentId,
            UltNivel: structure.lastLevelId,
            Cantidad: structure.unitQuantity,
            Monto: structure.budgetAmount,
            hijos: [],
            cuentasAsociadas: this._ledgerAccountAdapter.convertAccountsModelToEntityArray(structure.accountsList ?? [])
        }
    }



    extraerCuentasConOrden(estructura: StructureEntity[]): { Orden: number; cod_Cuenta: string }[] {
        return estructura.flatMap(({ Orden, cuentasAsociadas }) =>
          cuentasAsociadas?.map(({ cod_Cuenta }) => ({ Orden, cod_Cuenta })) ?? []
        );
    }
}