import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { getPayments } from '../../api/admin/get/get_payment';
import { postPayment } from '../../api/admin/post/post_payment';
import { updatePaymentApi } from '../../api/admin/put/put_payment';
import { deletePaymentApi } from '../../api/admin/delete/delete_payment';
import type { PaymentResponse, PaymentCreate, PaymentUpdate } from '../../interface/payment.interface';

interface PaymentState {
    items: PaymentResponse[];
    loading: boolean;
    error: string | null;
}

const initialState: PaymentState = {
    items: [],
    loading: false,
    error: null,
};

export const fetchPayments = createAsyncThunk(
    'payments/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            return await getPayments();
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || 'Error al cargar tipos de pago');
        }
    }
);

export const createPaymentThunk = createAsyncThunk(
    'payments/create',
    async (data: PaymentCreate, { rejectWithValue }) => {
        try {
            return await postPayment(data);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || 'Error al crear el tipo de pago');
        }
    }
);

export const updatePaymentThunk = createAsyncThunk(
    'payments/update',
    async ({ id, data }: { id: number; data: PaymentUpdate }, { rejectWithValue }) => {
        try {
            return await updatePaymentApi(id, data);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || 'Error al actualizar el tipo de pago');
        }
    }
);

export const deletePaymentThunk = createAsyncThunk(
    'payments/delete',
    async (id: number, { rejectWithValue }) => {
        try {
            await deletePaymentApi(id);
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
            .addCase(fetchPayments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPayments.fulfilled, (state, action: PayloadAction<PaymentResponse[]>) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchPayments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Create
            .addCase(createPaymentThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(createPaymentThunk.fulfilled, (state, action: PayloadAction<PaymentResponse>) => {
                state.loading = false;
                state.items.push(action.payload);
            })
            .addCase(createPaymentThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Update
            .addCase(updatePaymentThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(updatePaymentThunk.fulfilled, (state, action: PayloadAction<PaymentResponse>) => {
                state.loading = false;
                const index = state.items.findIndex(item => item.id_payment === action.payload.id_payment);
                if (index !== -1) state.items[index] = action.payload;
            })
            .addCase(updatePaymentThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Delete
            .addCase(deletePaymentThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(deletePaymentThunk.fulfilled, (state, action: PayloadAction<number>) => {
                state.loading = false;
                state.items = state.items.filter(item => item.id_payment !== action.payload);
            })
            .addCase(deletePaymentThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearError } = paymentSlice.actions;
export default paymentSlice.reducer;
