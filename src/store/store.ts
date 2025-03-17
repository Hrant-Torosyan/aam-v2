import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import userReducer from './profile/profileSlice';
import { analyticsApi } from './analytics/analyticsAPI';
import { authApi } from './auth/authAPI';
import analyticsReducer from './analytics/analyticsSlice';
import { careerApi } from './career/career';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        analytics: analyticsReducer,
        [analyticsApi.reducerPath]: analyticsApi.reducer,
        [authApi.reducerPath]: authApi.reducer,
        [careerApi.reducerPath]: careerApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(analyticsApi.middleware)
            .concat(authApi.middleware)
            .concat(careerApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;