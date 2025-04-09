import { LedgerAccountGet } from "./ledger-account-get";

export interface FlowHeaderRequest {
    userId: number;
    companyId: number;
    flowTypeId: number;
    name: string;
    flowState: number;
    structureDetail: FlowStructureRegister;
}

export interface FlowStructureRegister {
    userId: number;
    companyId: number;
    flowHeaderId: number;
    detail: Structure[];
}

export interface Structure {
    order: number;
    levelId: number;
    parentId: number;
    levelName: string;
    behaviorId: number;
    lastLevelId: number;
    sourceDetailId: number;
    budgetAmount?: number
    unitQuantity?: number;
    accountsList?: LedgerAccountGet[];
    children: Structure[];
}