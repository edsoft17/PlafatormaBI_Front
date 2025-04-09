import { IconOption } from './../../../shared/models/IGenericIcon';
import { Injectable } from "@angular/core";

export class FlowStructurePresenter {

    defineIconsFunctions(openDialogView: (param: any) => void): IconOption<any>[] {
        const iconoEditar = new IconOption("pencil", "heroicons_solid", "Ver estructura de flujo");

        iconoEditar.actionIcono = (data: any) => {
            openDialogView(data);
        };

        return [iconoEditar];
    }
}