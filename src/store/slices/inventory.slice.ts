import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { postInventoryMovement } from '../../api/admin/post/post_inventory_movement';
import type { InventoryMovementCreate } from '../../interface/inventory.interface';

interface InventoryState {
    loading: boolean;
    error: string | null;
}

const initialState: InventoryState = {
    loading: false,
    error: null,
};

export const createInventoryMovementThunk = createAsyncThunk(
    'inventory/createMovement',
    async (data: InventoryMovementCreate, { rejectWithValue }) => {
        try {
            return await postInventoryMovement(data);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || 'Error al registrar el movimiento de inventario');
        }
    }
);

export const inventorySlice = createSlice({
    name: 'inventory',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createInventoryMovementThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createInventoryMovementThunk.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(createInventoryMovementThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default inventorySlice.reducer;
