import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import { analyticsApi } from './analytics/analyticsAPI';
import { authApi } from './auth/authAPI';
import analyticsReducer from './analytics/analyticsSlice';
import { careerApi } from './career/career';
import { profileApi } from './profile/profileAPI';
import userReducer from './profile/profileSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        analytics: analyticsReducer,
        [analyticsApi.reducerPath]: analyticsApi.reducer,
        [authApi.reducerPath]: authApi.reducer,
        [careerApi.reducerPath]: careerApi.reducer,
        [profileApi.reducerPath]: profileApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(analyticsApi.middleware)
            .concat(authApi.middleware)
            .concat(careerApi.middleware)
            .concat(profileApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;