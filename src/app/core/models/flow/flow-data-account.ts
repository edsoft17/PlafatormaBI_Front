export interface FlowDataAccount {
    flows: FlowDataGet[];
    accounts: FlowDataAssociatedAccounts[];
}

export interface FlowDataGet {
    structureFlowHeaderId: number;
    structureFlowId: number;
    order: number;
    parentId: number;
    levelId: number;
    levelName: string;
    isLastLevel: number;
    behavior: string;
    budgetAmount?: number;
    budgetQuantity?: number;
}
  
export interface FlowDataAssociatedAccounts {
    structureFlowId: number;
    order: number;
    accountingAccountId: string;
    accountCode: string;
    accountName: string;
    level1: string;
    level2: string;
    level3: string;
}