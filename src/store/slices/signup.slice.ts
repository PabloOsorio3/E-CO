import type { SignupInterface, SignupResponseInterface } from "../../interface/signup.interface.ts";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { signupApi } from "../../api/signup/signup.ts";

export const signup = createAsyncThunk<
    SignupResponseInterface,
    SignupInterface,
    { rejectValue: SignupResponseInterface }
>(
    "signup/signup",
    async (user: SignupInterface, { rejectWithValue }) => {
        try {
            const response = await signupApi(user);
            return response;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || { status: error.response?.status || 500, message: error.message || 'Error al registrar el usuario' }
            );
        }
    }
);

interface SignupState {
    item: SignupResponseInterface | null;
    loading: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
}

const initialState: SignupState = {
    item: null,
    loading: "idle",
    error: null,
};

const signupSlice = createSlice({
    name: "signup",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(signup.pending, (state) => {
                state.loading = "loading";
            })
            .addCase(signup.fulfilled, (state, action) => {
                state.loading = "idle";
                state.item = action.payload;
            })
            .addCase(signup.rejected, (state, action) => {
                state.loading = "idle";
                state.error = action.payload?.message || action.error.message || null;
            });
    },
});

export default signupSlice.reducer;
