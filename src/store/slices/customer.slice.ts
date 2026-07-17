import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { getCustomer } from '../../api/admin/get/get_customer';
import type { CustomerResponse } from '../../interface/customer.interface';

interface CustomerState {
    customers: CustomerResponse[];
    loading: boolean;
    error: string | null;
}

// Estado inicial
const initialState: CustomerState = {
    customers: [],
    loading: false,
    error: null,
};

// Thunk para obtener clientes
export const fetchCustomersThunk = createAsyncThunk(
    'customers/fetchCustomers',
    async (_, { rejectWithValue }) => {
        try {
            return await getCustomer();
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || 'Error al cargar clientes');
        }
    }
);

// Slice de clientes
export const customerSlice = createSlice({
    name: 'customers',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCustomersThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCustomersThunk.fulfilled, (state, action: PayloadAction<CustomerResponse[]>) => {
                state.loading = false;
                state.customers = action.payload;
            })
            .addCase(fetchCustomersThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default customerSlice.reducer;
