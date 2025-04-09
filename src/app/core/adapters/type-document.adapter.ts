
import { TypeDocumentEntity } from "../entities/type-document.entity";
import { TypeDocument } from "../models/type-document.model";

export class TypeDocumentAdapter {
    convertEntityToModelArray(entities: TypeDocumentEntity[]): TypeDocument[] {
        return entities.map(entity => this.convertEntityToModel(entity))
    }

    convertEntityToModel(entity: TypeDocumentEntity): TypeDocument {
        return {
            code: entity.codigo,
            name: entity.nombre,
            selected: entity.selected,
            codeParent: entity.codigoPadre
        }
    }
}