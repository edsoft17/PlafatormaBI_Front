export interface ParamToReport { 
    structureId: number;
    dates: [Date,Date];
    parentIdFlow: number;
    type: 'I' | 'E';
    nameChild?: string;
    executedAmount?: number;
    budgetedAmount?: number;
}