import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { UserInfo, ProfileProducts, ProfitData } from "src/types/types";
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const getAuthToken = (): string => {
    try {
        const userAuth = localStorage.getItem("userAuth");
        if (!userAuth) return "";
        return `Bearer ${JSON.parse(userAuth).token}`;
    } catch (error) {
        console.error("Error retrieving auth token:", error);
        return "";
    }
};

const uploadImageFile = async (files: File[]): Promise<string> => {
    if (!files || files.length === 0) {
        throw new Error("No files provided for upload");
    }

    const formData = new FormData();
    let imageName = null;

    for (let index = 0; index < files.length; index++) {
        const file = files[index];
        imageName = file.name;
        formData.append(`files[${index}].image`, file);
        formData.append(`files[${index}].imageName`, file.name);
        formData.append(`files[${index}].type`, "USER");
    }

    console.log("Uploading image:", imageName);

    const response = await fetch(`${BASE_URL}media/store`, {
        method: 'POST',
        headers: {
            Authorization: getAuthToken()
        },
        body: formData
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Upload failed:", response.status, errorText);
        throw new Error(`Image upload failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (data?.data && imageName && data.data[imageName]) {
        return data.data[imageName];
    }

    throw new Error("Image upload response missing expected data");
};

export const profileApi = createApi({
    reducerPath: 'profileApi',
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
        prepareHeaders: (headers) => {
            headers.set('Accept', 'application/json');
            headers.set('Content-Type', 'application/json');

            const token = getAuthToken();
            if (token) {
                headers.set('Authorization', token);
            }

            return headers;
        },
    }),
    tagTypes: ['UserInfo', 'ProfileProducts', 'Profit', 'ProfileCareer'],
    endpoints: (builder) => ({
        getUserInfo: builder.query<UserInfo, undefined>({
            query: () => ({
                url: 'users/profiles/me',
                method: 'GET',
                params: { _t: Date.now() }
            }),
            providesTags: ['UserInfo']
        }),

        updateUserInfo: builder.mutation<any, any>({
            query: (userData) => ({
                url: 'users/profiles',
                method: 'POST',
                body: userData,
            }),
            invalidatesTags: ['UserInfo', 'ProfileProducts', 'Profit', 'ProfileCareer']
        }),

        uploadUserImage: builder.mutation<string, File[]>({
            queryFn: async (files) => {
                try {
                    const result = await uploadImageFile(files);
                    return { data: result };
                } catch (error: any) {
                    return {
                        error: {
                            status: error.status || 500,
                            data: error.message || 'Unknown error'
                        } as FetchBaseQueryError
                    };
                }
            },
            invalidatesTags: ['UserInfo']
        }),

        resetUserPassword: builder.mutation<any, { oldPassword: string; newPassword: string }>({
            query: (passwordData) => ({
                url: 'users/profiles/change-password',
                method: 'POST',
                body: passwordData,
            })
        }),

        getProfileProducts: builder.query<ProfileProducts, { filter: string; query: string }>({
            query: (queryParams) => ({
                url: `portfolios/list?${new URLSearchParams(queryParams as any).toString()}`,
                method: 'POST',
                body: {},
                params: { _t: Date.now() }
            }),
            providesTags: ['ProfileProducts']
        }),

        getProfit: builder.query<ProfitData, undefined>({
            query: () => ({
                url: 'users/profiles/profit',
                method: 'GET',
                params: { _t: Date.now() }
            }),
            providesTags: ['Profit']
        }),

        getProfileCareer: builder.query<any, undefined>({
            query: () => ({
                url: 'users/profiles/career',
                method: 'GET',
                params: { _t: Date.now() }
            }),
            providesTags: ['ProfileCareer']
        }),
    }),
});

export const {
    useGetUserInfoQuery,
    useUpdateUserInfoMutation,
    useUploadUserImageMutation,
    useResetUserPasswordMutation,
    useGetProfileProductsQuery,
    useGetProfitQuery,
    useGetProfileCareerQuery,
} = profileApi;