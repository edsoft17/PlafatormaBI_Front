import { Injectable } from "@angular/core";
import { AuthTokenEntity } from "./auth.entity";
import { AuthToken } from "./auth.model";

@Injectable({
    providedIn: "root"
})
export class AuthTokenAdapter {
    convertEntityToModel(entity: AuthTokenEntity): AuthToken {
        return {
            jwt: entity.jwt,
            message: entity.message,
            success: entity.success,
            type: entity.tipo
        }
    }
}