import type { SignupInterface } from "../../interface/signup.interface.ts";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { signupApi } from "../../api/signup/signup.ts";

export const signup = createAsyncThunk("signup/signup", async (user: SignupInterface) => {
    const response = await signupApi(user);
    return response;
});

interface SignupState {
    item: any;
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
                state.error = action.error.message;
            });
    },
});

export default signupSlice.reducer;
