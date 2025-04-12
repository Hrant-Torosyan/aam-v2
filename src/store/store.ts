import { configureStore } from '@reduxjs/toolkit';
import { analyticsApi } from './analytics/analyticsAPI';
import { authApi } from './auth/authAPI';
import { careerApi } from './career/careerApi';
import { profileApi } from './profile/profileAPI';
import { marketApi } from './market/marketAPI';
import { productApi } from './product/productApi';
import {briefcaseApi} from "./briefcase/briefcaseApi";

export const store = configureStore({
    reducer: {
        [analyticsApi.reducerPath]: analyticsApi.reducer,
        [authApi.reducerPath]: authApi.reducer,
        [careerApi.reducerPath]: careerApi.reducer,
        [profileApi.reducerPath]: profileApi.reducer,
        [marketApi.reducerPath]: marketApi.reducer,
        [productApi.reducerPath]: productApi.reducer,
        [briefcaseApi.reducerPath]: briefcaseApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(analyticsApi.middleware)
            .concat(authApi.middleware)
            .concat(careerApi.middleware)
            .concat(profileApi.middleware)
            .concat(marketApi.middleware)
            .concat(productApi.middleware)
            .concat(briefcaseApi.middleware)
});
