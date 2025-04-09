import { IUserCompanyEntity } from "../entities/user-company.entity"
import { UserCompany } from "../models/user-company"


export class UserCompanyAdapter {
    convertEntityToModelArray(entities: IUserCompanyEntity[]): UserCompany[] {
        return entities.map(entity => this.convertEntityToModel(entity))
    }

    convertEntityToModel(entity: IUserCompanyEntity): UserCompany {
        return {
            id: entity.id,
            documentType: entity.tipoDoc,
            ruc: entity.ruc,
            businessName: entity.razonSocial,
            brandName: entity.nombreComercial,
            profileId: entity.idPerfil,
            profileName: entity.nombrePerfil,
            userEmail: entity.correoUsuario,
            userPhone: entity.telefonoUsuario
        }
    }
}