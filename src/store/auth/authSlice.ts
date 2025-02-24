import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { signup, login, checkEmail, validateCode, resetPass, getNotifications, readNotification, addLinkedUser } from "./authAPI";

interface AuthState {
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
    userAuth: { token: string | null; [key: string]: any } | null;
    notifications: any[];
    step: number;
    email: string;
    enteredCode: string;
    password: string;
    newPassword: string;
    confirmPassword: string;
    repeatPassword: string;
    fullName: string;
    register: string;
    confirmOne: boolean;
    confirmTwo: boolean;
    companyName: string;
    investmentAmount: string;
    investmentExperience: string;
    page: string;
}

const initialState: AuthState = {
    status: "idle",
    error: null,
    userAuth: null,
    notifications: [],
    step: 0,
    email: "",
    enteredCode: "",
    password: "",
    newPassword: "",
    confirmPassword: "",
    repeatPassword: "",
    fullName: "",
    register: "",
    confirmOne: false,
    confirmTwo: false,
    companyName: "",
    investmentAmount: "",
    investmentExperience: "",
    page: "register",
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout(state) {
            state.userAuth = null;
            localStorage.removeItem("userAuth");
        },
        setStep(state, action: PayloadAction<number>) {
            state.step = action.payload;
        },
        setEmail(state, action: PayloadAction<string>) {
            state.email = action.payload;
        },
        setEnteredCode(state, action: PayloadAction<string>) {
            state.enteredCode = action.payload;
        },
        setNewPassword(state, action: PayloadAction<string>) {
            state.newPassword = action.payload;
        },
        setConfirmPassword(state, action: PayloadAction<string>) {
            state.confirmPassword = action.payload;
        },
        setRepeatPassword(state, action: PayloadAction<string>) {
            state.repeatPassword = action.payload;
        },
        setFullName(state, action: PayloadAction<string>) {
            state.fullName = action.payload;
        },
        setRegister(state, action: PayloadAction<string>) {
            state.register = action.payload;
        },
        setConfirmOne(state, action: PayloadAction<boolean>) {
            state.confirmOne = action.payload;
        },
        setConfirmTwo(state, action: PayloadAction<boolean>) {
            state.confirmTwo = action.payload;
        },
        // Add reducers for new fields
        setCompanyName(state, action: PayloadAction<string>) {
            state.companyName = action.payload;
        },
        setInvestmentAmount(state, action: PayloadAction<string>) {
            state.investmentAmount = action.payload;
        },
        setInvestmentExperience(state, action: PayloadAction<string>) {
            state.investmentExperience = action.payload;
        },
        setPage(state, action: PayloadAction<string>) {
            state.page = action.payload;
        },
    },
    extraReducers: (builder) => {
        const handlePending = (state: AuthState) => {
            state.status = "loading";
            state.error = null;
        };

        const handleFulfilled = (
            state: AuthState,
            action: { payload: any; type: string },
            isUserAuthUpdate: boolean = false,
            isNotificationsUpdate: boolean = false
        ) => {
            state.status = "succeeded";
            if (isUserAuthUpdate) {
                state.userAuth = action.payload;
            } else if (isNotificationsUpdate) {
                state.notifications = action.payload;
            }
        };

        const handleRejected = (state: AuthState, action: { payload: any }) => {
            state.status = "failed";
            state.error = action.payload as string;
        };

        builder
            .addCase(signup.pending, handlePending)
            .addCase(signup.fulfilled, (state, action) => handleFulfilled(state, action, true))
            .addCase(signup.rejected, handleRejected)
            .addCase(login.pending, handlePending)
            .addCase(login.fulfilled, (state, action) => handleFulfilled(state, action, true))
            .addCase(login.rejected, handleRejected)
            .addCase(checkEmail.pending, handlePending)
            .addCase(checkEmail.fulfilled, (state) => {
                state.status = "succeeded";
            })
            .addCase(checkEmail.rejected, handleRejected)
            .addCase(validateCode.pending, handlePending)
            .addCase(validateCode.fulfilled, (state) => {
                state.status = "succeeded";
            })
            .addCase(validateCode.rejected, handleRejected)
            .addCase(resetPass.pending, handlePending)
            .addCase(resetPass.fulfilled, (state) => {
                state.status = "succeeded";
            })
            .addCase(resetPass.rejected, handleRejected)
            .addCase(getNotifications.pending, handlePending)
            .addCase(getNotifications.fulfilled, (state, action) =>
                handleFulfilled(state, action, false, true)
            )
            .addCase(getNotifications.rejected, handleRejected)
            .addCase(readNotification.pending, handlePending)
            .addCase(readNotification.fulfilled, (state) => {
                state.status = "succeeded";
            })
            .addCase(readNotification.rejected, handleRejected)
            .addCase(addLinkedUser.pending, handlePending)
            .addCase(addLinkedUser.fulfilled, (state) => {
                state.status = "succeeded";
            })
            .addCase(addLinkedUser.rejected, handleRejected);
    },
});

export const {
    logout,
    setStep,
    setEmail,
    setEnteredCode,
    setNewPassword,
    setConfirmPassword,
    setRepeatPassword,
    setFullName,
    setRegister,
    setConfirmOne,
    setConfirmTwo,
    setCompanyName,
    setInvestmentAmount,
    setInvestmentExperience,
    setPage,
} = authSlice.actions;

export default authSlice.reducer;