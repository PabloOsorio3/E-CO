import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { getPaymentMethod } from '../../api/admin/get/get_pyment_method.ts';
import { postPaymentMethod } from '../../api/admin/post/post_pyment_method.ts';
import { updatePaymentMethod } from '../../api/admin/put/put_pyment_method.ts';
import { deletePaymentMethod } from '../../api/admin/delete/delete_pyment_method.ts';
import type { PaymentMethodResponse, PaymentMethodCreate, PaymentMethodUpdate } from '../../interface/payment.interface';

interface PaymentState {
    items: PaymentMethodResponse[];
    loading: boolean;
    error: string | null;
}

const initialState: PaymentState = {
    items: [],
    loading: false,
    error: null,
};

export const fetchPaymentMethods = createAsyncThunk(
    'payments/fetchAll',
    async () => {
        const result = await getPaymentMethod();
        return result;
    }
);

export const createPaymentMethodThunk = createAsyncThunk(
    'payments/create',
    async (data: PaymentMethodCreate) => {
        const result = await postPaymentMethod(data);
        return result;
    }
);

export const updatePaymentMethodThunk = createAsyncThunk(
    'payments/update',
    async ({ id, data }: { id: number; data: PaymentMethodUpdate }, { rejectWithValue }) => {
        try {
            return await updatePaymentMethod(id, data);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || 'Error al actualizar el tipo de pago');
        }
    }
);

export const deletePaymentMethodThunk = createAsyncThunk(
    'payments/delete',
    async (id: number, { rejectWithValue }) => {
        try {
            await deletePaymentMethod(id);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || 'Error al eliminar el tipo de pago');
        }
    }
);

const paymentSlice = createSlice({
    name: 'payments',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchPaymentMethods.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPaymentMethods.fulfilled, (state, action: PayloadAction<PaymentMethodResponse[]>) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchPaymentMethods.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Create
            .addCase(createPaymentMethodThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(createPaymentMethodThunk.fulfilled, (state, action: PayloadAction<PaymentMethodResponse>) => {
                state.loading = false;
                state.items.push(action.payload);
            })
            .addCase(createPaymentMethodThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Update
            .addCase(updatePaymentMethodThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(updatePaymentMethodThunk.fulfilled, (state, action: PayloadAction<PaymentMethodResponse>) => {
                state.loading = false;
                const index = state.items.findIndex(item => item.id_payment_method === action.payload.id_payment_method);
                if (index !== -1) state.items[index] = action.payload;
            })
            .addCase(updatePaymentMethodThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Delete
            .addCase(deletePaymentMethodThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(deletePaymentMethodThunk.fulfilled, (state, action: PayloadAction<number>) => {
                state.loading = false;
                state.items = state.items.filter(item => item.id_payment_method !== action.payload);
            })
            .addCase(deletePaymentMethodThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearError } = paymentSlice.actions;
export default paymentSlice.reducer;
