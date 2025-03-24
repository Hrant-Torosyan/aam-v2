import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { profileApi } from './profileAPI';
import { UserInfo, ProfileProduct, ProfitData } from "src/types/types";

interface ProfileState {
    loading: boolean;
    error: string | null;
    userInfo: UserInfo | null;
    profileProducts: ProfileProduct[];
    profitData: ProfitData | null;
    careerInfo: any | null;
    activeFilter: string;
    searchQuery: string;
}

const initialState: ProfileState = {
    loading: false,
    error: null,
    userInfo: null,
    profileProducts: [],
    profitData: null,
    careerInfo: null,
    activeFilter: 'all',
    searchQuery: '',
};

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        setActiveFilter: (state, action: PayloadAction<string>) => {
            state.activeFilter = action.payload;
        },
        setSearchQuery: (state, action: PayloadAction<string>) => {
            state.searchQuery = action.payload;
        },
        clearUserData: (state) => {
            state.userInfo = null;
            state.profileProducts = [];
            state.profitData = null;
            state.careerInfo = null;
        },
    },
    extraReducers: (builder) => {
        // Handle getUserInfo query results
        builder.addMatcher(
            profileApi.endpoints.getUserInfo.matchPending,
            (state) => {
                state.loading = true;
                state.error = null;
            }
        );
        builder.addMatcher(
            profileApi.endpoints.getUserInfo.matchFulfilled,
            (state, action) => {
                state.loading = false;
                state.userInfo = action.payload;
            }
        );
        builder.addMatcher(
            profileApi.endpoints.getUserInfo.matchRejected,
            (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch user info';
            }
        );

        // Handle getProfileProducts query results
        builder.addMatcher(
            profileApi.endpoints.getProfileProducts.matchFulfilled,
            (state, action) => {
                if (action.payload?.items && action.payload.items.length > 0) {
                    state.profileProducts = action.payload.items;
                } else if (action.payload?.content && action.payload.content.length > 0) {
                    state.profileProducts = action.payload.content;
                } else {
                    state.profileProducts = [];
                }
            }
        );

        // Handle getProfit query results
        builder.addMatcher(
            profileApi.endpoints.getProfit.matchFulfilled,
            (state, action) => {
                state.profitData = action.payload;
            }
        );

        // Handle getProfileCareer query results
        builder.addMatcher(
            profileApi.endpoints.getProfileCareer.matchFulfilled,
            (state, action) => {
                state.careerInfo = action.payload;
            }
        );

        // Handle update user info mutation
        builder.addMatcher(
            profileApi.endpoints.updateUserInfo.matchFulfilled,
            (state) => {
                state.loading = false;
            }
        );
        builder.addMatcher(
            profileApi.endpoints.updateUserInfo.matchRejected,
            (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to update user info';
            }
        );
    },
});

export const { setError, setActiveFilter, setSearchQuery, clearUserData } = profileSlice.actions;
export default profileSlice.reducer;