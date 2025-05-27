import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../models/user";
import api from "./api";

type AuthState = {
    user: User | null;
    token: string | null;
    loading: boolean;
    error: string | null;
};

const initialState: AuthState = {
    user: null,
    token: sessionStorage.getItem("token") || null,
    loading: false,
    error:

        null,
};
export const loginUser = createAsyncThunk(
    "auth/login",
    async ({ email, password }: { email: string; password: string }, thunkAPI) => {
        try {

            const response = await api.post("Auth/login", { email, password });
            console.log(response);

            const { token, name, address, city, phone, lastLogin, roles } = response.data.userLogin as {
                token: string;
                name: string;
                address: string;
                city: string;
                phone: string;
                lastLogin: Date;
                roles: string[];
            };
            const user: User = { name, address, city, phone, lastLogin, roles };
            sessionStorage.setItem("token", token);
            return { token, user };
        } catch (error: any) {
            console.log(error);

            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const registerUser = createAsyncThunk(
    "auth/register",
    async (
        { name, email, password, address, city, phone }:
            { name: string; email: string; password: string; address: string; city: string; phone: string },
        thunkAPI
    ) => {
        try {

            const response = await api.post("Auth/register", { name, email, password, address, city, phone });
            return response.data;
        } catch (error: any) {
            console.log(error);
            return thunkAPI.rejectWithValue(error.response?.data || "Registration failed");
        }
    }
);

export const forgotPassword = createAsyncThunk(
    "auth/forgotPassword",
    async (email: string, thunkAPI) => {
        try {
            await api.post("Auth/forgot-password", { email });
            return "success";
        } catch (error: any) {
            console.error(error);
            return thunkAPI.rejectWithValue("שליחת מייל נכשלה");
        }
    }
);

export const resetPassword = createAsyncThunk(
    "auth/resetPassword",
    async ({ email, token, newPassword }: { email: string; token: string; newPassword: string }, thunkAPI) => {
        try {
            console.log("Resetting password for:", email, "with token:", token);
            
            await api.post("Auth/reset-password", { email, token, newPassword });
            return "success";
        } catch (error: any) {
            console.error(error);
            return thunkAPI.rejectWithValue("איפוס סיסמה נכשל");
        }
    }
);

const userSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("user");
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action: PayloadAction<{ token: string; user: User }>) => {
                state.loading = false;
                state.token = action.payload.token;
                state.user = action.payload.user;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(forgotPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(forgotPassword.fulfilled, (state) => {
                state.loading = false;
                // אפשר להוסיף הודעת הצלחה אם רוצים
            })
            .addCase(forgotPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(resetPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(resetPassword.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    },

});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
