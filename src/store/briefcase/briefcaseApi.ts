import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Project } from 'src/types/types';

const BASE_URL = "http://145.223.99.13:8080/api/rest/";

// Define response types
interface BriefcaseProductsResponse {
    content: Project[];
    [key: string]: any;
}

interface BriefcaseCategoriesResponse {
    categories: string[];
    [key: string]: any;
}

export interface InvestRequestData {
    // Define the structure based on your API needs
    [key: string]: any;
}

export const briefcaseApi = createApi({
    reducerPath: 'briefcaseApi',
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
        prepareHeaders: (headers) => {
            let token = '';
            try {
                const userAuth = localStorage.getItem('userAuth');
                if (userAuth) {
                    const parsedAuth = JSON.parse(userAuth);
                    token = parsedAuth.token || '';
                }
            } catch (error) {
                console.error("Error parsing auth token:", error);
            }

            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            headers.set('Accept', 'application/json');
            headers.set('Content-Type', 'application/json');

            return headers;
        },
    }),
    endpoints: (builder) => ({
        getBriefcaseProducts: builder.mutation<BriefcaseProductsResponse, string>({
            query: (category = 'all') => ({
                url: 'portfolios/list',
                method: 'POST',
                body: {
                    category: category === 'all' ? null : category,
                },
            }),
        }),
        getBriefcaseCategories: builder.query<BriefcaseCategoriesResponse, void>({
            query: () => ({
                url: 'portfolios/categories',
                method: 'GET',
            }),
        }),
        addBriefcaseProduct: builder.mutation<any, { prodId: string; requestData: InvestRequestData }>({
            query: ({ prodId, requestData }) => ({
                url: `projects/${prodId}/invest`,
                method: 'POST',
                body: requestData,
            }),
        }),
    }),
});

export const {
    useGetBriefcaseProductsMutation,
    useGetBriefcaseCategoriesQuery,
    useAddBriefcaseProductMutation,
} = briefcaseApi;