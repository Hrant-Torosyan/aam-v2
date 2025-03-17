import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = "http://145.223.99.13:8080/api/rest/";

interface ProfileCareerData {
    referral: string;
    levelName: string;
    levelValue: number;
    nextLevelUserCount: number;
    nextLevelInvestAmount: number;
    referralLinkedUserCount: number;
    registeredUserCount: number;
    investedCount: number;
    referralProfitAmount: number;
    referralEarnedAmount: number;
}

interface ProfitData {
    amount: number;
}

export const careerApi = createApi({
    reducerPath: "careerApi",
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
        prepareHeaders: (headers) => {
            const userAuth = localStorage.getItem("userAuth");
            if (userAuth) {
                const token = JSON.parse(userAuth).token;
                if (token) {
                    headers.set("Authorization", `Bearer ${token}`);
                }
            }
            headers.set("Accept", "application/json");
            headers.set("Content-Type", "application/json");
            return headers;
        },
    }),
    endpoints: (builder) => ({
        getProfileCareer: builder.query<ProfileCareerData, void>({
            query: () => "users/profiles/career", // Fixed endpoint
        }),
        getProfit: builder.query<ProfitData, void>({
            query: () => "users/profiles/profit",
        }),
    }),
});

export const {
    useGetProfileCareerQuery,
    useGetProfitQuery
} = careerApi;