import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {ApiResponse, PaginatedResponse, Project, UserAuth} from "@/types/types";



type ProjectsResponse = PaginatedResponse<Project>;

interface CategoriesResponse extends ApiResponse<{ id: string; name: string }[]> {}

interface ProjectListParams {
    category?: string | null;
    type?: string | null;
    title?: string | null;
    tags?: string[] | null;
}

const BASE_URL = process.env.REACT_APP_BASE_URL || 'https://aams.live/api/rest/';

export const marketApi = createApi({
    reducerPath: 'marketApi',
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
        prepareHeaders: (headers) => {
            const token = JSON.parse(localStorage.getItem("userAuth") || '{}').token;

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
                const { category, type, title, tags } = params;

                let bodyData;
                if (title) {
                    bodyData = {
                        title,
                        category: category === "all" ? null : category,
                        type: type === "all" ? null : type,
                        tags: tags && tags.length > 0 ? tags : null,
                    };
                } else {
                    bodyData = {
                        category: category === "all" ? null : category,
                        type: type === "all" ? null : type,
                    };
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
            query: (selectedType) => `projects/categories?projectType=${selectedType}`,
        }),
    }),
});

export const {
    useGetProjectsMutation,
    useFilterByTagsMutation,
    useGetCategoriesQuery,
} = marketApi;