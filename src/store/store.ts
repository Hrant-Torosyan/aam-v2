import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import { analyticsApi } from './analytics/analyticsAPI';
import { authApi } from './auth/authAPI';
import analyticsReducer from './analytics/analyticsSlice';
import { careerApi } from './career/career';
import { profileApi } from './profile/profileAPI';
import userReducer from './profile/profileSlice';
import { marketApi } from './market/marketAPI';
import { projectsApi } from 'src/store/product/product';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        analytics: analyticsReducer,
        [analyticsApi.reducerPath]: analyticsApi.reducer,
        [authApi.reducerPath]: authApi.reducer,
        [careerApi.reducerPath]: careerApi.reducer,
        [profileApi.reducerPath]: profileApi.reducer,
        [marketApi.reducerPath]: marketApi.reducer,
        [projectsApi.reducerPath]: projectsApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(analyticsApi.middleware)
            .concat(authApi.middleware)
            .concat(careerApi.middleware)
            .concat(profileApi.middleware)
            .concat(marketApi.middleware)
            .concat(projectsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;