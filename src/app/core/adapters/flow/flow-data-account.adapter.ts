import { FlowDataAccountEntity, FlowDataAssociatedAccountsEntity, FlowDataGetEntity } from "app/core/entities/flow/flow-data-account.entity"
import { FlowDataAccount, FlowDataAssociatedAccounts, FlowDataGet } from "app/core/models/flow/flow-data-account"

export class FlowDataGetAdapter {
    convertEntityToModel(entity: FlowDataAccountEntity): FlowDataAccount {
        return {
            flows: this.convertFlowEntityToModelArray(entity.flujo),
            accounts: this.convertAccountEntityToModelArray(entity.cuentas)
        }
    }

    convertFlowEntityToModelArray(entities: FlowDataGetEntity[]): FlowDataGet[] {
        return entities?.map(entity => this.convertFlowEntityToModel(entity));
    }

    convertFlowEntityToModel(entity: FlowDataGetEntity): FlowDataGet {
        return {
            structureFlowHeaderId: entity.idEstructuraFlujo_Cabecera, 
            structureFlowId: entity.idEstructuraFlujo, 
            order: entity.orden, 
            parentId: entity.idPadre, 
            levelId: entity.idNivel, 
            levelName: entity.nombreNivel, 
            isLastLevel: entity.ultNivel, 
            behavior: entity.comportamiento, 
            budgetAmount: entity.monto_Presupuesto, 
            budgetQuantity: entity.cantidad_Presupuesto
        }
    }

    convertAccountEntityToModelArray(entities: FlowDataAssociatedAccountsEntity[]): FlowDataAssociatedAccounts[] {
        return entities?.map(entity => this.convertAccountEntityToModel(entity));
    }

    convertAccountEntityToModel(entity: FlowDataAssociatedAccountsEntity): FlowDataAssociatedAccounts {
        return {
            structureFlowId: entity.idEstructuraFlujo,
            order: entity.orden,
            accountingAccountId: entity.idCuentaContable,
            accountCode: entity.cod_Cuenta,
            accountName: entity.cuenta,
            level1: entity.nivel1,
            level2: entity.nivel2,
            level3: entity.nivel3
        }
    }
}