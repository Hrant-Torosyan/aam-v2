export interface DailyBalance {
    date: string;
    amount: number;
}
export interface PopUpState {
    isOpen: boolean;
    info: string | null;
    type: string;
    balance: number;
    percent: number;
}
export interface MonthlyBalance {
    date: string;
    amount: number;
}

export interface WalletsData {
    masterAccount: number;
    investmentAccount: number;
    agentAccount: number;
}

export interface BalanceChartResponse {
    dailyBalancesChart: DailyBalance[];
    monthlyBalancesChart: MonthlyBalance[][] | null;
    profitability: number;
    masterAccount?: number;
    investmentAccount?: number;
    agentAccount?: number;
}

export interface OperationItem {
    id: string;
    amount: number;
    date: string;
    status: 'DONE' | 'IN_PROCESS' | 'FAILED';
    type: string;
    depositAddress?: string;
    depositCurrencyFrom?: string;
    withdrawalAddress?: string;
    withdrawalCurrencyFrom?: string;
    operationFrom?: string;
    operationTo?: string;
    projectTitle?: string;
    projectTerm?: string;
    projectPeriod?: string;
    fromUserId?: string;
    toUserId?: string | null;
}

export interface ProcessedBalanceChart {
    lab?: string[];
    data?: number[];
    mainData?: { month: string; average: number }[];
    profitability: number;
    masterAccount: number;
    investmentAccount: number;
    agentAccount: number;
}

export interface BalanceChartRequest {
    period: string;
    accountType?: string;
    refresh?: number;
}