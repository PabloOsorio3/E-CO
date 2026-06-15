import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { TypeUserResponse } from '../../interface/typeuser.interface';
import { getTypeUser } from '../../api/admin/get/get_typeuser';

interface TypeUserState {
    items: TypeUserResponse[];
    loading: boolean;
    error: string | null;
}

const initialState: TypeUserState = {
    items: [],
    loading: false,
    error: null,
};

export const fetchTypeUser = createAsyncThunk(
    'typeuser/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            return await getTypeUser();
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || 'Error al cargar tipos de usuario');
        }
    }
);

const typeUserSlice = createSlice({
    name: 'typeuser',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTypeUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTypeUser.fulfilled, (state, action: PayloadAction<TypeUserResponse[]>) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchTypeUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearError } = typeUserSlice.actions;
export default typeUserSlice.reducer;