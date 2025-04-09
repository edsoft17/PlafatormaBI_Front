import { IUserEntity } from "../entities/user.entity";
import { User } from "../models/user.model";

export class UserAdapter {
    convertEntityToModel(entity: IUserEntity): User {
        return {
            id: entity.id,
            documentType: entity.tipoDoc,
            documentNumber: entity.nroDoc,
            name: entity.nombres,
            fatherLastName: entity.apellidosPaternos,
            motherLastName: entity.apellidosMaternos,
            username: entity.username
        }
    }
}