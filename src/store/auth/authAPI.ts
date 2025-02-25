import { createAsyncThunk } from "@reduxjs/toolkit";

const BASE_URL = "http://145.223.99.13:8080/api/rest/";
const URLS = {
    LOGIN: "auth/signin",
    SIGNUP: "auth/signup",
    CHECK_EMAIL: "reset/password/check",
    VALIDATE_CODE: "reset/password/validate",
    RESET_PASSWORD: "reset/password/reset",
    NOTIFICATIONS: "notifications/list",
    NOTIFICATIONS_READ: "notifications/read",
};

const fetchData = async (url: string, options: RequestInit) => {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            const errorBody = await response.json();
            throw new Error(errorBody.message || "Request failed");
        }
        return await response.json();
    } catch (err) {
        if (err instanceof Error) {
            throw new Error(err.message);
        }
        throw new Error("An unknown error occurred");
    }
};

export const login = createAsyncThunk(
    "auth/login",
    async (userData: { email: string; password: string }, { rejectWithValue }) => {
        try {
            const res = await fetchData(BASE_URL + URLS.LOGIN, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });
            if (res.token) {
                localStorage.setItem("userAuth", JSON.stringify(res));
            }
            return res;
        } catch (err) {
            return rejectWithValue(err instanceof Error ? err.message : "An unknown error occurred");
        }
    }
);
export const signup = createAsyncThunk(
    "auth/signup",
    async (userData: { email: string; password: string; confirmPassword: string; fullName: string }, { rejectWithValue }) => {
        try {
            const { confirmPassword, fullName, email, password } = userData;
            const signupData = {
                full_name: fullName,
                email,
                password,
                company_name: "",
                investment_amount: "",
                investment_experience: "",
                referral: null,
            };

            const res = await fetchData(BASE_URL + URLS.SIGNUP, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ...signupData, confirmPassword }),
            });

            if (res.token) {
                localStorage.setItem("userAuth", JSON.stringify(res));
            }
            return res;
        } catch (err) {
            return rejectWithValue(err instanceof Error ? err.message : "An unknown error occurred");
        }
    }
);

export const checkEmail = createAsyncThunk(
    "auth/checkEmail",
    async (email: string, { rejectWithValue }) => {
        try {
            const res = await fetchData(BASE_URL + URLS.CHECK_EMAIL, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });
            return res;
        } catch (err) {
            return rejectWithValue(err instanceof Error ? err.message : "An unknown error occurred");
        }
    }
);

export const validateCode = createAsyncThunk(
    "auth/validateCode",
    async (data: { email: string; code: string }, { rejectWithValue }) => {
        try {
            const res = await fetchData(BASE_URL + URLS.VALIDATE_CODE, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            return res;
        } catch (err) {
            return rejectWithValue(err instanceof Error ? err.message : "An unknown error occurred");
        }
    }
);

export const resetPass = createAsyncThunk(
    "auth/resetPass",
    async (data: { email: string; code: string; password: string; passwordConfirm: string }, { rejectWithValue }) => {
        try {
            const res = await fetch(BASE_URL + URLS.RESET_PASSWORD, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (res.status === 200) {
                const responseData = await res.json();
                return responseData;
            } else {
                const errorData = await res.json();
                return rejectWithValue(errorData.message || "Something went wrong");
            }
        } catch (err) {
            return rejectWithValue(err instanceof Error ? err.message : "An unknown error occurred");
        }
    }
);

export const getNotifications = createAsyncThunk(
    "auth/getNotifications",
    async (_, { rejectWithValue }) => {
        try {
            const token = JSON.parse(localStorage.getItem("userAuth") || "{}").token;
            if (!token) throw new Error("User is not authenticated");

            const res = await fetchData(BASE_URL + URLS.NOTIFICATIONS, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            return res;
        } catch (err) {
            return rejectWithValue(err instanceof Error ? err.message : "An unknown error occurred");
        }
    }
);

export const readNotification = createAsyncThunk(
    "auth/readNotification",
    async (notificationIds: string[], { rejectWithValue }) => {
        try {
            const token = JSON.parse(localStorage.getItem("userAuth") || "{}").token;
            if (!token) throw new Error("User is not authenticated");

            const res = await fetchData(BASE_URL + URLS.NOTIFICATIONS_READ, {
                method: "PUT",
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ notificationIds }),
            });
            return res;
        } catch (err) {
            return rejectWithValue(err instanceof Error ? err.message : "An unknown error occurred");
        }
    }
);

export const addLinkedUser = createAsyncThunk(
    "auth/addLinkedUser",
    async (userData: { email: string; fullName: string }, { rejectWithValue }) => {
        try {
            const token = JSON.parse(localStorage.getItem("userAuth") || "{}").token;
            if (!token) throw new Error("User is not authenticated");

            const res = await fetchData(BASE_URL + "linked-users/add", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(userData),
            });
            return res;
        } catch (err) {
            return rejectWithValue(err instanceof Error ? err.message : "An unknown error occurred");
        }
    }
);

export const logout = createAsyncThunk("auth/logout", async (_, { rejectWithValue }) => {
    try {
        localStorage.removeItem("userAuth");
        window.location.href = "/login";
    } catch (err) {
        return rejectWithValue(err instanceof Error ? err.message : "Logout failed");
    }
});
