import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {CategoriesResponse, PaginatedResponse, Project, ProjectListParams} from 'src/types/types';


type ProjectsResponse = PaginatedResponse<Project>;

const BASE_URL = process.env.REACT_APP_BASE_URL;

export const marketApi = createApi({
    reducerPath: 'marketApi',
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
        getProjects: builder.mutation<ProjectsResponse, ProjectListParams>({
            query: (params = {}) => {
                const bodyData: Record<string, any> = {};

                if (params.title && params.title.trim() !== "") {
                    bodyData.title = params.title.trim();
                }

                if (params.category && params.category !== "all") {
                    bodyData.category = params.category;
                }

                if (params.type && params.type !== "all") {
                    bodyData.type = params.type;
                }

                if (params.tags && params.tags.length > 0) {
                    bodyData.tags = params.tags;
                }

                return {
                    url: 'projects/list',
                    method: 'POST',
                    body: bodyData,
                };
            },
        }),

        filterByTags: builder.mutation<ProjectsResponse, string[]>({
            query: (tags) => ({
                url: 'projects/list',
                method: 'POST',
                body: { tags },
            }),
        }),

        getCategories: builder.query<CategoriesResponse, string>({
            query: (selectedType) => {
                if (selectedType === "") {
                    return 'projects/categories';
                }
                return `projects/categories?projectType=${selectedType}`;
            },
        }),
    }),
});

export const {
    useGetProjectsMutation,
    useFilterByTagsMutation,
    useGetCategoriesQuery,
} = marketApi;