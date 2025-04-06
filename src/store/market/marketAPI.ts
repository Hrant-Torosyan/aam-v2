import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {ApiResponse, Project, UserAuth} from "@/types/types";

// Define paginated response interface
interface PaginatedResponse<T> {
    content: T[];
    empty: boolean;
    first: boolean;
    last: boolean;
    number: number;
    numberOfElements: number;
    pageable: {
        pageNumber: number;
        pageSize: number;
        sort: {
            sorted: boolean;
            empty: boolean;
            unsorted: boolean;
        };
        offset: number;
    };
    size: number;
    sort: {
        sorted: boolean;
        empty: boolean;
        unsorted: boolean;
    };
    totalElements: number;
    totalPages: number;
}

// Use PaginatedResponse for the projects endpoint
type ProjectsResponse = PaginatedResponse<Project>;

interface CategoriesResponse extends ApiResponse<{ id: string; name: string }[]> {}

interface ProjectListParams {
    category?: string | null;
    type?: string | null;
    title?: string | null;
    tags?: string[] | null;
}

// Use the environment variable directly
const BASE_URL = process.env.REACT_APP_BASE_URL || 'https://aams.live/api/rest/';

// Get auth token from localStorage - ensuring exact same format as your working code
const getAuthToken = (): string => {
    try {
        // This is exactly how you retrieve it in your working code
        return JSON.parse(localStorage.getItem("userAuth") || '{}').token || '';
    } catch (error) {
        console.error("Error getting auth token:", error);
        return '';
    }
};

export const marketApi = createApi({
    reducerPath: 'marketApi',
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
        prepareHeaders: (headers) => {
            // Get token exactly the same way as your working code
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

                // Construct body data exactly as in your working code
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