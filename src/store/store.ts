import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import userReducer from './profile/profileSlice';
import { analyticsApi } from './analytics/analyticsAPI';
import analyticsReducer from './analytics/analyticsSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        analytics: analyticsReducer,
        [analyticsApi.reducerPath]: analyticsApi.reducer,  // Adding the analytics API reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(analyticsApi.middleware),  // Adding middleware for the analytics API
});

export type RootState = ReturnType<typeof store.getState>;  // Extracting the type of the RootState
export type AppDispatch = typeof store.dispatch;  // Extracting the type for dispatch