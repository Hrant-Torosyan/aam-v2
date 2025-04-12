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
            query: (params) => {
                // Create body with only defined values to keep payload small
                const bodyData: Record<string, any> = {};

                // Only add properties that actually have values
                if (params.title && params.title.trim() !== "") {
                    bodyData.title = params.title.trim();
                }

                if (params.category !== null && params.category !== undefined) {
                    bodyData.category = params.category;
                }

                if (params.type !== null && params.type !== undefined) {
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
                // Handle empty string case properly
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