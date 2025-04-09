import { inject } from "@angular/core";
import { AbstractControl, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FlowHeaderRequest, FlowStructureRegister, Structure } from "app/core/models/flow/flow-header-request";
import { User } from "app/core/models/user.model";
import { DataDialogStructure } from "./dialog-structure.models";
import { FormService } from "@shared/services/form.service";

export class DialogStructurePresenter {
    private _companyId = Number(localStorage.getItem("currentCompany"));
    private _user = JSON.parse(localStorage.getItem("usuario")!) as User;

    private readonly _fb = inject(FormBuilder);
    private readonly _formService = inject(FormService);
    
    initForm(dataDialog: DataDialogStructure): FormGroup {
        return this._fb.group({
            levelName: [(dataDialog.isEdit) ? dataDialog.currentNode?.levelName : "",Validators.required],
            budgetAmount: [dataDialog.currentNode?.budgetAmount ?? 0],
            unitQuantity: [dataDialog.currentNode?.unitQuantity ?? 0]
        });
    }

    initStructure(dataDialog: DataDialogStructure): Structure {
        return {
            order: (dataDialog.isEdit && dataDialog?.currentNode) ? dataDialog.currentNode.order : 0,//this.defineOrder(dataDialog),
            levelName: (dataDialog.isEdit) ?  dataDialog?.currentNode?.levelName! : "",
            levelId: (dataDialog.isEdit) ? dataDialog?.currentNode?.levelId! : this.defineLevelIdFromNodeParent(dataDialog),
            budgetAmount: 0,
            unitQuantity: 0,
            behaviorId: 0,
            parentId: (dataDialog.currentNode) ? dataDialog.currentNode.order : 0,
            sourceDetailId: 1,
            lastLevelId: this.defineLastLevelFromNodeParent(dataDialog),
            children: []
            /* userId: this._user.id,
            companyId: this._companyId,
            flowHeaderId: 0,
            structure: { */
            }
            /* children: [] 
        }*/
    }

    defineLevelIdFromNodeParent(dataDialog: DataDialogStructure): number {
        const { currentNode } = dataDialog;
        if(!currentNode) return 1;

        return currentNode.levelId + 1;
    }

    defineLastLevelFromNodeParent(dataDialog: DataDialogStructure): number {
        const { currentNode } = dataDialog;
        console.log("defineLastLevelFromNodeParent: ", currentNode);
        if(!currentNode || currentNode.levelId < 2) return 0;

        return 1;
    }

    defineOrder(dataDialog: DataDialogStructure, structures: Structure[]): number {
        if(!dataDialog?.currentNode) {
            return Number('1' + (dataDialog.totalNodes + 1).toString());
        }

        //if(!dataDialog.isEdit && dataDialog.currentNode.)

        return Number((dataDialog.currentNode.levelId + 1).toString() + (dataDialog.totalNodes + 1).toString());
    }

    /* calculateTotalNodes(dataDialog: DataDialogStructure): number {

    } */

    setValueNode(node: Structure, valueForm: FormGroup): void {
        console.log("valueForm: ",valueForm.value);
        node.levelName = valueForm.get("levelName")?.value;
        if(node.levelId === 3) {
            node.unitQuantity = valueForm.get("unitQuantity")?.value;
            node.budgetAmount = valueForm.get("budgetAmount")?.value;
        }
    }

    isNameValidated(name: string, listStructure: Array<{levelName: string, parentName: string}>): boolean {
        if(listStructure.some(structure => structure.levelName.toUpperCase() === name.toUpperCase()))
            return false;
        
        return true;
    }

    verificationError(form: AbstractControl, control: string): string {
        return this._formService.obtenerErrorControl(form.get(control)!);
    }
}