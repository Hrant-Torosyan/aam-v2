import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import userReducer from './profile/profileSlice';
import { analyticsApi } from './analytics/analyticsAPI';
import { authApi } from './auth/authAPI';
import analyticsReducer from './analytics/analyticsSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        analytics: analyticsReducer,
        [analyticsApi.reducerPath]: analyticsApi.reducer,
        [authApi.reducerPath]: authApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            analyticsApi.middleware,
            authApi.middleware
        ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;