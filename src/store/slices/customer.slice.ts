import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { getCustomer } from '../../api/admin/get/get_customer';
import { postCustomer } from '../../api/admin/post/post_customer';
import { updateCustomerApi } from '../../api/admin/put/put_customer';
import type { CustomerCreate, CustomerResponse, CustomerUpdate } from '../../interface/customer.interface';

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

// Thunk para crear un cliente (vincula un usuario existente)
export const createCustomerThunk = createAsyncThunk(
    'customers/create',
    async (data: CustomerCreate, { rejectWithValue }) => {
        try {
            return await postCustomer(data);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || 'Error al crear el cliente');
        }
    }
);

// Thunk para actualizar el status de un cliente (editar / desactivar)
export const updateCustomerThunk = createAsyncThunk(
    'customers/update',
    async ({ id, data }: { id: number; data: CustomerUpdate }, { rejectWithValue }) => {
        try {
            await updateCustomerApi(id, data);
            // El backend solo confirma el update, no devuelve el customer;
            // se reconstruye localmente combinando el id con el payload enviado.
            return { id, data };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || 'Error al actualizar el cliente');
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

        builder
            .addCase(createCustomerThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createCustomerThunk.fulfilled, (state, action: PayloadAction<CustomerResponse>) => {
                state.loading = false;
                state.customers.push(action.payload);
            })
            .addCase(createCustomerThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        builder
            .addCase(updateCustomerThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCustomerThunk.fulfilled, (state, action: PayloadAction<{ id: number; data: CustomerUpdate }>) => {
                state.loading = false;
                const index = state.customers.findIndex(c => c.id_customer === action.payload.id);
                if (index !== -1) {
                    state.customers[index] = { ...state.customers[index], status_id: action.payload.data.status_id };
                }
            })
            .addCase(updateCustomerThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default customerSlice.reducer;
