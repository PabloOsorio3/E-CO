import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { getAllUsers } from '../../api/admin/get/get_all_users';
import type { AdminUserResponse } from '../../interface/user.interface';

interface UserState {
    items: AdminUserResponse[];
    loading: boolean;
    error: string | null;
}

const initialState: UserState = {
    items: [],
    loading: false,
    error: null,
};

export const fetchAllUsersThunk = createAsyncThunk(
    'users/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            return await getAllUsers();
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || 'Error al cargar usuarios');
        }
    }
);

export const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllUsersThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllUsersThunk.fulfilled, (state, action: PayloadAction<AdminUserResponse[]>) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchAllUsersThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default userSlice.reducer;
