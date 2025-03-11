import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

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

export interface ReplenishData {
    paymentStatus: boolean;
    payAddress: string;
    payAmount: number;
    payCurrency: string;
    amountReceived: number;
    priceCurrency: string;
}

export const analyticsApi = createApi({
    reducerPath: 'analyticsApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
    endpoints: (builder) => ({
        getBalanceChart: builder.query<BalanceChartData, void>({
            query: () => '/balance-chart',
        }),
        getOperationsList: builder.query<Operation[], void>({
            query: () => '/operations',
        }),
        getReplenishData: builder.query<ReplenishData, void>({
            query: () => '/replenish',
        }),
    }),
});


interface AnalyticsState {
    loading: boolean;
    error: string | null;
    operationsArr: Operation[];
    balanceChartData: BalanceChartData | null;
    replenishData: ReplenishData | null;
}

const initialState: AnalyticsState = {
    loading: false,
    error: null,
    operationsArr: [],
    balanceChartData: null,
    replenishData: null,
};

const analyticsSlice = createSlice({
    name: 'analytics',
    initialState,
    reducers: {
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addMatcher(
            analyticsApi.endpoints.getBalanceChart.matchFulfilled,
            (state, action) => {
                state.balanceChartData = action.payload;
            }
        );
        builder.addMatcher(
            analyticsApi.endpoints.getOperationsList.matchFulfilled,
            (state, action) => {
                state.operationsArr = action.payload;
            }
        );
        builder.addMatcher(
            analyticsApi.endpoints.getReplenishData.matchFulfilled,
            (state, action) => {
                state.replenishData = action.payload;
            }
        );
    },
});

export const { setError } = analyticsSlice.actions;
export default analyticsSlice.reducer;
