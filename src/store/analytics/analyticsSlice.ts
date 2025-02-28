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
    selectValue: 'WEEKLY',  // Default value is set here
    analyticsData: { profitability: 0 },
};

const analyticsSlice = createSlice({
    name: 'analytics',
    initialState,
    reducers: {
        setSelectValue: (state, action: PayloadAction<string>) => {
            // Only update if it's different to prevent unnecessary re-renders
            if (state.selectValue !== action.payload) {
                state.selectValue = action.payload;
            }
        },

        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },

        setError: (state, action: PayloadAction<{ message: string; code?: string } | null>) => {
            state.error = action.payload;
        },

        setAnalyticsData: (state, action: PayloadAction<ProcessedBalanceChart | null>) => {
            // Check if data is different before updating
            const isDifferent = JSON.stringify(action.payload) !== JSON.stringify(state.analyticsData);
            if (isDifferent) {
                state.analyticsData = action.payload ?? { profitability: 0 };
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

export const { setSelectValue, setLoading, setError, setAnalyticsData } = analyticsSlice.actions;

export default analyticsSlice.reducer;