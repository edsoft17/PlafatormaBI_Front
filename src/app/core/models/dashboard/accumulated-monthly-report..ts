export interface AccumulatedMonthlyReport {
    month: string;
    budgetAmount: number;
    executedAmount: number;
}

export interface MonthlyReportSummary {
    month: string; 
    executedAmount: number;
    budgetAmount: number;
    period: number;
    type: string;
}