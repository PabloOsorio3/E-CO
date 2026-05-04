import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { StatusResponse } from '../../interface/status.interface';
import { getStatus } from '../../api/admin/get/get_status';

interface StatusState {
    items: StatusResponse[];
    loading: boolean;
    error: string | null;
}

const initialState: StatusState = {
    items: [],
    loading: false,
    error: null,
};

export const fetchStatus = createAsyncThunk(
    'status/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            return await getStatus();
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || 'Error al cargar status');
        }
    }
);

const statusSlice = createSlice({
    name: 'status',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStatus.fulfilled, (state, action: PayloadAction<StatusResponse[]>) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearError } = statusSlice.actions;
export default statusSlice.reducer;