import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { getOrders } from '../../api/admin/get/get_orders';
import { updateOrderStatus } from '../../api/admin/put/put_order';
import { getMyOrders } from '../../api/store/get_my_orders';
import type { OrderResponse, OrderStatusUpdate } from '../../interface/order.interface';

interface OrderState {
    items: OrderResponse[];
    myOrders: OrderResponse[];
    myOrdersLoading: boolean;
    loading: boolean;
    error: string | null;
}

const initialState: OrderState = {
    items: [],
    myOrders: [],
    myOrdersLoading: false,
    loading: false,
    error: null,
};

export const fetchOrdersThunk = createAsyncThunk(
    'orders/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            return await getOrders();
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || 'Error al cargar órdenes');
        }
    }
);

export const fetchMyOrdersThunk = createAsyncThunk(
    'orders/fetchMine',
    async (_, { rejectWithValue }) => {
        try {
            return await getMyOrders();
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || 'Error al cargar tus pedidos');
        }
    }
);

export const updateOrderStatusThunk = createAsyncThunk(
    'orders/updateStatus',
    async ({ id, data }: { id: number; data: OrderStatusUpdate }, { rejectWithValue }) => {
        try {
            await updateOrderStatus(id, data);
            return { id, data };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || 'Error al actualizar el estado de la orden');
        }
    }
);

const orderSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchOrdersThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrdersThunk.fulfilled, (state, action: PayloadAction<OrderResponse[]>) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchOrdersThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Update
            .addCase(updateOrderStatusThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateOrderStatusThunk.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.items.findIndex(item => item.id_order === action.payload.id);
                if (index !== -1) {
                    state.items[index].status_id = action.payload.data.status_id;
                }
            })
            .addCase(updateOrderStatusThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // My orders (customer storefront)
            .addCase(fetchMyOrdersThunk.pending, (state) => {
                state.myOrdersLoading = true;
                state.error = null;
            })
            .addCase(fetchMyOrdersThunk.fulfilled, (state, action: PayloadAction<OrderResponse[]>) => {
                state.myOrdersLoading = false;
                state.myOrders = action.payload;
            })
            .addCase(fetchMyOrdersThunk.rejected, (state, action) => {
                state.myOrdersLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearError } = orderSlice.actions;
export default orderSlice.reducer;
