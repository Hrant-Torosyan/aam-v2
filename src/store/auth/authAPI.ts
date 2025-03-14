import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = "http://145.223.99.13:8080/api/rest/";

export const authApi = createApi({
	reducerPath: "authApi",
	baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
	endpoints: (builder) => ({
		login: builder.mutation<{ token: string }, { email: string; password: string }>({
			query: (userData) => ({
				url: "auth/signin",
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: userData,
			}),
			transformResponse: (response: { token: string }) => {
				localStorage.setItem("userAuth", JSON.stringify(response));
				return response;
			},
		}),
		signup: builder.mutation({
			query: ({
						email,
						password,
						fullName,
						companyName = "",
						investmentAmount = "",
						investmentExperience = "",
						referral = null
					}) => ({
				url: "auth/signup",
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email,
					password,
					full_name: fullName,
					company_name: companyName,
					investment_amount: investmentAmount,
					investment_experience: investmentExperience,
					referral
				}),
			}),
		}),
		checkEmail: builder.mutation({
			query: (email: string) => ({
				url: "reset/password/check",
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: { email },
			}),
		}),
		validateCode: builder.mutation<any, { email: string, code: string }>({
			query: ({ email, code }) => ({
				url: "reset/password/validate",
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, code }),
			}),
		}),
		resetPassword: builder.mutation({
			query: (data) => ({
				url: "reset/password/reset",
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: data,
			}),
		}),
		getNotifications: builder.query({
			query: () => {
				const token = JSON.parse(localStorage.getItem("userAuth") || "{}").token;
				if (!token) throw new Error("User is not authenticated");
				return {
					url: "notifications/list",
					method: "GET",
					headers: { Authorization: `Bearer ${token}` },
				};
			},
		}),
		readNotification: builder.mutation({
			query: (notificationIds) => {
				const token = JSON.parse(localStorage.getItem("userAuth") || "{}").token;
				if (!token) throw new Error("User is not authenticated");
				return {
					url: "notifications/read",
					method: "PUT",
					headers: { Authorization: `Bearer ${token}` },
					body: { notificationIds },
				};
			},
		}),
		addLinkedUser: builder.mutation({
			query: (userData) => {
				const token = JSON.parse(localStorage.getItem("userAuth") || "{}").token;
				if (!token) throw new Error("User is not authenticated");
				return {
					url: "linked-users/add",
					method: "POST",
					headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
					body: userData,
				};
			},
		}),
		logout: builder.mutation<void, void>({
			queryFn: async () => {
				localStorage.removeItem("userAuth");
				window.location.href = "/login";
				return { data: undefined };
			},
		}),
	}),
});

export const {
	useLoginMutation,
	useSignupMutation,
	useCheckEmailMutation,
	useValidateCodeMutation,
	useResetPasswordMutation,
	useGetNotificationsQuery,
	useReadNotificationMutation,
	useAddLinkedUserMutation,
	useLogoutMutation,
} = authApi;
