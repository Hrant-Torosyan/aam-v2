import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../profile/profileAPI";

interface UserState {
    userInfo: any | null;
    profileProducts: any[];
    profit: any | null;
    career: any | null;
    loading: boolean;
    error: string | null;
}

const initialState: UserState = {
    userInfo: null,
    profileProducts: [],
    profit: null,
    career: null,
    loading: false,
    error: null,
};

export const fetchUserInfo = createAsyncThunk(
    "user/fetchUserInfo",
    async (_, { rejectWithValue }) => {
        try {
            return await api.getUserInfo();
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateUserInfo = createAsyncThunk(
    "user/updateUserInfo",
    async (userData: any, { rejectWithValue }) => {
        try {
            return await api.setUserInfo(userData);
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const uploadUserImage = createAsyncThunk(
    "user/uploadUserImage",
    async (userData: File[], { rejectWithValue }) => {
        try {
            return await api.setUserImage(userData);
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const resetUserPassword = createAsyncThunk(
    "user/resetUserPassword",
    async (userData: any, { rejectWithValue }) => {
        try {
            return await api.resetPassword(userData);
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchProfileProducts = createAsyncThunk(
    "user/fetchProfileProducts",
    async (queryData: any, { rejectWithValue }) => {
        try {
            return await api.getProfileProducts(queryData);
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchProfit = createAsyncThunk(
    "user/fetchProfit",
    async (_, { rejectWithValue }) => {
        try {
            return await api.getProfit();
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchProfileCareer = createAsyncThunk(
    "user/fetchProfileCareer",
    async (_, { rejectWithValue }) => {
        try {
            return await api.getProfileCareer();
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserInfo.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserInfo.fulfilled, (state, action) => {
                state.loading = false;
                state.userInfo = action.payload;
            })
            .addCase(fetchUserInfo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        builder
            .addCase(updateUserInfo.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUserInfo.fulfilled, (state, action) => {
                state.loading = false;
                state.userInfo = action.payload;
            })
            .addCase(updateUserInfo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        builder
            .addCase(uploadUserImage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(uploadUserImage.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(uploadUserImage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        builder
            .addCase(resetUserPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(resetUserPassword.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(resetUserPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        builder
            .addCase(fetchProfileProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProfileProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.profileProducts = action.payload;
            })
            .addCase(fetchProfileProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        builder
            .addCase(fetchProfit.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProfit.fulfilled, (state, action) => {
                state.loading = false;
                state.profit = action.payload;
            })
            .addCase(fetchProfit.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        builder
            .addCase(fetchProfileCareer.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProfileCareer.fulfilled, (state, action) => {
                state.loading = false;
                state.career = action.payload;
            })
            .addCase(fetchProfileCareer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default userSlice.reducer;