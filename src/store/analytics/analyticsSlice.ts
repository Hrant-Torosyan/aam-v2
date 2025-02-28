import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { analyticsApi } from './analyticsAPI';

interface ProcessedBalanceChart {
    lab?: string[];
    data?: number[];
    mainData?: { month: string; average: number }[];
    profitability: number;
}

interface AnalyticsState {
    loading: boolean;
    error: { message: string; code?: string } | null;
    selectValue: string;
    analyticsData: ProcessedBalanceChart | null;
}

const initialState: AnalyticsState = {
    loading: false,
    error: null,
    selectValue: 'WEEKLY',
    analyticsData: { profitability: 0 },
};

const analyticsSlice = createSlice({
    name: 'analytics',
    initialState,
    reducers: {
        setSelectValue: (state, action: PayloadAction<string>) => {
            if (state.selectValue !== action.payload) {
                state.selectValue = action.payload;
            }
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
                }
            );
    },
});

export const { setSelectValue } = analyticsSlice.actions;

export default analyticsSlice.reducer;