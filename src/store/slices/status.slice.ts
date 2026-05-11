import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { StatusResponse, StatusCreate, StatusUpdate } from '../../interface/status.interface';
import { getStatus } from '../../api/admin/get/get_status';
import { postStatus } from '../../api/admin/post/post_status';
import { updateStatusApi } from '../../api/admin/put/put_status';
import { deleteStatusApi } from '../../api/admin/delete/delete_status';

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
            return rejectWithValue(error.response?.data?.detail || 'Error al cargar estados');
        }
    }
);

export const createStatusThunk = createAsyncThunk(
    'status/create',
    async (data: StatusCreate, { rejectWithValue }) => {
        try {
            return await postStatus(data);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || 'Error al crear el estado');
        }
    }
);

export const updateStatusThunk = createAsyncThunk(
    'status/update',
    async ({ id, data }: { id: number; data: StatusUpdate }, { rejectWithValue }) => {
        try {
            return await updateStatusApi(id, data);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || 'Error al actualizar el estado');
        }
    }
);

export const deleteStatusThunk = createAsyncThunk(
    'status/delete',
    async (id: number, { rejectWithValue }) => {
        try {
            await deleteStatusApi(id);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || 'Error al eliminar el estado');
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
            // Fetch
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
            })
            // Create
            .addCase(createStatusThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(createStatusThunk.fulfilled, (state, action: PayloadAction<StatusResponse>) => {
                state.loading = false;
                state.items.push(action.payload);
            })
            .addCase(createStatusThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Update
            .addCase(updateStatusThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateStatusThunk.fulfilled, (state, action: PayloadAction<StatusResponse>) => {
                state.loading = false;
                const index = state.items.findIndex(item => item.id_status === action.payload.id_status);
                if (index !== -1) state.items[index] = action.payload;
            })
            .addCase(updateStatusThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Delete
            .addCase(deleteStatusThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteStatusThunk.fulfilled, (state, action: PayloadAction<number>) => {
                state.loading = false;
                state.items = state.items.filter(item => item.id_status !== action.payload);
            })
            .addCase(deleteStatusThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearError } = statusSlice.actions;
export default statusSlice.reducer;