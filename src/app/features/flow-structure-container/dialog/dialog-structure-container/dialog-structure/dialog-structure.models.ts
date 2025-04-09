import { FlowStructureRegister, Structure } from "app/core/models/flow/flow-header-request";

export class DataDialogStructure {
    /* isEdit: boolean;
    totalNodes: number;
    currentNode?: Structure */
    constructor(public isEdit = false,public currentNode?: Structure,public totalNodes = 0) {}
}