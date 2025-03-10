import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { analyticsApi } from './analyticsAPI';

export interface Operation {
    id: string;
    description: string;
    amount: number;
    date: string | number;
    transactionOperationId: string;
    type: string;
    status: "DONE" | "IN_PROCESS" | "FAILED";
}

export interface BalanceChartData {
    mainData: never[];
    data: never[];
    lab: never[];
    date: string;
    balance: number;
    profitability: number;
    masterAccount: number;
    investmentAccount: number;
    agentAccount: number;
}

export interface TransactionItem {
    info: string;
    type: string;
    balance: number;
    percent: number;
    color: string;
    bg: string;
}

export interface AccountDetails {
    info: string;
    type: string;
    balance: number;
    percent: number;
    color: string;
    bg: string;
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

interface PopUpState {
    isOpen: boolean;
    info: string | null;
    type: string;
    balance: number;
    percent: number;
    operations: Operation[];
    balanceChartData: BalanceChartData[];
}

export interface ReplenishData {
    paymentStatus: boolean;
    payAddress: string;
    payAmount: number;
    payCurrency: string;
    amountReceived: number;
    priceCurrency: string;
}

interface AnalyticsState {
    loading: boolean;
    error: { message: string; code?: string } | null;
    selectValue: TransactionItem;
    analyticsData: ProcessedBalanceChart | null;
    transferSuccess: boolean;
    popUp: PopUpState;
    checkWallet: boolean;
    currency: string;
    transaction: any;
    sumValue: string | number;
    remainingTime: number;
    replenishData: ReplenishData | null;
    minMax: { min: number; max: number };
    copied: boolean;
    isActive: boolean;
    next: boolean;
    operationsArr: Operation[];
    isProcessingTransaction: boolean;
}

const initialState: AnalyticsState = {
    loading: false,
    error: null,
    selectValue: {
        info: '',
        type: '',
        balance: 0,
        percent: 0,
        color: '',
        bg: '',
    },
    analyticsData: null,
    transferSuccess: false,
    popUp: {
        isOpen: false,
        info: null,
        type: '',
        balance: 0,
        percent: 0,
        operations: [],
        balanceChartData: [],
    },
    checkWallet: false,
    currency: '',
    transaction: {},
    sumValue: '',
    remainingTime: 0,
    replenishData: null,
    minMax: { min: 0, max: 0 },
    copied: false,
    isActive: false,
    next: true,
    operationsArr: [],
    isProcessingTransaction: false, // Initialize transaction processing state
};

const analyticsSlice = createSlice({
    name: 'analytics',
    initialState,
    reducers: {
        setSelectValue: (state, action: PayloadAction<TransactionItem>) => {
            state.selectValue = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
        setTransferSuccess: (state, action: PayloadAction<boolean>) => {
            state.transferSuccess = action.payload;
        },
        resetAnalyticsData: (state) => {
            state.analyticsData = null;
        },
        setPopUpState: (state, action: PayloadAction<PopUpState>) => {
            state.popUp = action.payload;
        },
        resetPopUpState: (state) => {
            state.popUp = {
                isOpen: false,
                info: null,
                type: '',
                balance: 0,
                percent: 0,
                operations: [],
                balanceChartData: [],
            };
            state.operationsArr = [];
        },
        setCheckWallet: (state, action: PayloadAction<boolean>) => {
            state.checkWallet = action.payload;
        },
        setCurrency: (state, action: PayloadAction<string>) => {
            state.currency = action.payload;
        },
        setTransaction: (state, action: PayloadAction<any>) => {
            state.transaction = action.payload;
        },
        setSumValue: (state, action: PayloadAction<string | number>) => {
            state.sumValue = action.payload;
        },
        setRemainingTime: (state, action: PayloadAction<number | ((prevTime: number) => number)>) => {
            if (typeof action.payload === 'function') {
                const updateFn = action.payload;
                state.remainingTime = updateFn(state.remainingTime);
            } else {
                state.remainingTime = action.payload;
            }
        },
        setReplenishData: (state, action: PayloadAction<ReplenishData>) => {
            state.replenishData = action.payload;
        },
        setMinMax: (state, action: PayloadAction<{ min: number; max: number }>) => {
            state.minMax = action.payload;
        },
        setError: (state, action: PayloadAction<{ message: string; code?: string } | null>) => {
            state.error = action.payload;
        },
        setCopied: (state, action: PayloadAction<boolean>) => {
            state.copied = action.payload;
        },
        setActive: (state, action: PayloadAction<boolean>) => {
            state.isActive = action.payload;
        },
        setNext: (state, action: PayloadAction<boolean>) => {
            state.next = action.payload;
        },
        setOperationsList: (state, action: PayloadAction<Operation[]>) => {
            state.operationsArr = action.payload;
        },
        setIsProcessingTransaction: (state, action: PayloadAction<boolean>) => {
            state.isProcessingTransaction = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(
                analyticsApi.endpoints.getBalanceChart.matchPending,
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                analyticsApi.endpoints.getBalanceChart.matchFulfilled,
                (state, action) => {
                    state.loading = false;
                    state.analyticsData = action.payload;
                    state.error = null;
                }
            )
            .addMatcher(
                analyticsApi.endpoints.getBalanceChart.matchRejected,
                (state, action) => {
                    state.loading = false;
                    state.error = {
                        message: action.error?.message || 'Failed to fetch analytics data',
                        code: action.error?.code,
                    };
                    state.analyticsData = null;
                }
            )
            .addMatcher(
                analyticsApi.endpoints.getOperationsList.matchPending,
                (state) => {
                    state.loading = true;
                }
            )
            .addMatcher(
                analyticsApi.endpoints.getOperationsList.matchFulfilled,
                (state, action) => {
                    if (action.payload && action.payload.data) {
                        state.operationsArr = action.payload.data;
                    }
                    state.loading = false;
                }
            )
            .addMatcher(
                analyticsApi.endpoints.getOperationsList.matchRejected,
                (state, action) => {
                    state.loading = false;
                    state.error = {
                        message: action.error?.message || 'Failed to fetch operations data',
                        code: action.error?.code,
                    };
                    state.operationsArr = [];
                }
            );
    },
});

export const {
    setSelectValue,
    clearError,
    setTransferSuccess,
    resetAnalyticsData,
    setPopUpState,
    resetPopUpState,
    setCheckWallet,
    setCurrency,
    setTransaction,
    setSumValue,
    setRemainingTime,
    setReplenishData,
    setMinMax,
    setError,
    setCopied,
    setActive,
    setNext,
    setOperationsList,
    setIsProcessingTransaction,
} = analyticsSlice.actions;

export default analyticsSlice.reducer;