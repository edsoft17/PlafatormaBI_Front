import { model } from "@angular/core";
import { LedgerAccountGetEntity } from "app/core/entities/flow/ledger-account-get.entity";
import { LedgerAccountGet } from "app/core/models/flow/ledger-account-get";

export class LedgerAccountAdapter {
    convertModelToEntity(model: LedgerAccountGet): LedgerAccountGetEntity {
        return {
            cod_Cuenta: model.accountCode,
            cuenta: model.account,
            nivel1: model.level1,
            nivel2: model.level2,
            nivel3: model.level3
        }
    }

    convertAccountsEntityToModelArray(entities: LedgerAccountGetEntity[]): LedgerAccountGet[] {
        return entities?.map(entity => {
            return this.convertEntityToModel(entity)
        });
    }

    convertAccountsModelToEntityArray(models: LedgerAccountGet[]): LedgerAccountGetEntity[] {
        return models?.map(model => {
            return this.convertModelToEntity(model)
        });
    }

    convertEntityToModel(structure: LedgerAccountGetEntity):  LedgerAccountGet{
        return {
            accountCode: structure.cod_Cuenta,
            account: structure.cuenta,
            level1: structure.nivel1,
            level2: structure.nivel2,
            level3: structure.nivel3
        }
    }
}