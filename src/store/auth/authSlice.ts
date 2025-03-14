import { createSlice } from "@reduxjs/toolkit";
import { authApi } from "./authAPI";

interface AuthState {
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
    userAuth: { token: string | null } | null;
    notifications: any[];
}

const initialState: AuthState = {
    status: "idle",
    error: null,
    userAuth: null,
    notifications: [],
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // RTK Query automatically handles the state updates here
        builder
            .addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
                state.userAuth = action.payload; // This assumes the payload is { token: string }
                state.status = "succeeded";
            })
            .addMatcher(authApi.endpoints.login.matchRejected, (state, action) => {
                state.error = action.error.message || "Login failed"; // Ensures error is a string or null
                state.status = "failed";
            })
            .addMatcher(authApi.endpoints.signup.matchFulfilled, (state, action) => {
                state.userAuth = action.payload; // This assumes the payload is { token: string }
                state.status = "succeeded";
            })
            .addMatcher(authApi.endpoints.signup.matchRejected, (state, action) => {
                state.error = action.error.message || "Signup failed"; // Ensures error is a string or null
                state.status = "failed";
            })
            .addMatcher(authApi.endpoints.getNotifications.matchFulfilled, (state, action) => {
                state.notifications = action.payload;
                state.status = "succeeded";
            })
            .addMatcher(authApi.endpoints.getNotifications.matchRejected, (state, action) => {
                state.error = action.error.message || "Failed to fetch notifications"; // Ensures error is a string or null
                state.status = "failed";
            });
    },
});

export default authSlice.reducer;