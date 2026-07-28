import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { CartItemCreate, CartItemResponse, CartItemUpdate } from '../../interface/cart.interface';
import type { ShippingMethodResponse } from '../../interface/shipping.interface';
import type { OrderCreate } from '../../interface/order.interface';
import { getCart } from '../../api/store/get_cart';
import { postCartItem } from '../../api/store/post_cart_item';
import { putCartItem } from '../../api/store/put_cart_item';
import { deleteCartItem } from '../../api/store/delete_cart_item';
import { deleteCartClear } from '../../api/store/delete_cart_clear';
import { getShippingMethods } from '../../api/store/get_shipping_methods';
import { postOrder, type PostOrderResponse } from '../../api/store/post_order';
import { postCheckoutSession } from '../../api/store/post_checkout';

interface CartState {
    items: CartItemResponse[];
    shippingMethods: ShippingMethodResponse[];
    loading: boolean;
    checkoutLoading: boolean;
    error: string | null;
    lastOrderId: number | null;
}

const initialState: CartState = {
    items: [],
    shippingMethods: [],
    loading: false,
    checkoutLoading: false,
    error: null,
    lastOrderId: null,
};

export const fetchCartThunk = createAsyncThunk(
    'cart/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            return await getCart();
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || 'Error al cargar el carrito');
        }
    }
);

export const addToCartThunk = createAsyncThunk(
    'cart/add',
    async (data: CartItemCreate, { rejectWithValue }) => {
        try {
            await postCartItem(data);
            return await getCart();
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || 'Error al agregar al carrito');
        }
    }
);

export const updateCartItemThunk = createAsyncThunk(
    'cart/update',
    async ({ id, data }: { id: number; data: CartItemUpdate }, { rejectWithValue }) => {
        try {
            await putCartItem(id, data);
            return await getCart();
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || 'Error al actualizar el carrito');
        }
    }
);

export const removeCartItemThunk = createAsyncThunk(
    'cart/remove',
    async (id: number, { rejectWithValue }) => {
        try {
            await deleteCartItem(id);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || 'Error al eliminar el producto del carrito');
        }
    }
);

export const clearCartThunk = createAsyncThunk(
    'cart/clear',
    async (_, { rejectWithValue }) => {
        try {
            await deleteCartClear();
            return true;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || 'Error al vaciar el carrito');
        }
    }
);

export const fetchShippingMethodsThunk = createAsyncThunk(
    'cart/fetchShippingMethods',
    async (_, { rejectWithValue }) => {
        try {
            return await getShippingMethods();
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || 'Error al cargar los métodos de envío');
        }
    }
);

export const createOrderThunk = createAsyncThunk(
    'cart/createOrder',
    async (data: OrderCreate, { rejectWithValue }) => {
        try {
            return await postOrder(data);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || 'Error al crear la orden');
        }
    }
);

export const createCheckoutSessionThunk = createAsyncThunk(
    'cart/checkout',
    async (orderId: number, { rejectWithValue }) => {
        try {
            return await postCheckoutSession(orderId);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || 'Error al procesar el pago');
        }
    }
);

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        clearCartError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCartThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCartThunk.fulfilled, (state, action: PayloadAction<CartItemResponse[]>) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchCartThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        builder
            .addCase(addToCartThunk.fulfilled, (state, action: PayloadAction<CartItemResponse[]>) => {
                state.items = action.payload;
            })
            .addCase(addToCartThunk.rejected, (state, action) => {
                state.error = action.payload as string;
            });

        builder
            .addCase(updateCartItemThunk.fulfilled, (state, action: PayloadAction<CartItemResponse[]>) => {
                state.items = action.payload;
            })
            .addCase(updateCartItemThunk.rejected, (state, action) => {
                state.error = action.payload as string;
            });

        builder
            .addCase(removeCartItemThunk.fulfilled, (state, action: PayloadAction<number>) => {
                state.items = state.items.filter((i) => i.id_shopping_cart !== action.payload);
            })
            .addCase(removeCartItemThunk.rejected, (state, action) => {
                state.error = action.payload as string;
            });

        builder
            .addCase(clearCartThunk.fulfilled, (state) => {
                state.items = [];
            })
            .addCase(clearCartThunk.rejected, (state, action) => {
                state.error = action.payload as string;
            });

        builder
            .addCase(fetchShippingMethodsThunk.fulfilled, (state, action: PayloadAction<ShippingMethodResponse[]>) => {
                state.shippingMethods = action.payload;
            })
            .addCase(fetchShippingMethodsThunk.rejected, (state, action) => {
                state.error = action.payload as string;
            });

        builder
            .addCase(createOrderThunk.pending, (state) => {
                state.checkoutLoading = true;
                state.error = null;
            })
            .addCase(createOrderThunk.fulfilled, (state, action: PayloadAction<PostOrderResponse>) => {
                state.lastOrderId = action.payload.order_id;
            })
            .addCase(createOrderThunk.rejected, (state, action) => {
                state.checkoutLoading = false;
                state.error = action.payload as string;
            });

        builder
            .addCase(createCheckoutSessionThunk.fulfilled, (state) => {
                state.checkoutLoading = false;
                state.items = [];
            })
            .addCase(createCheckoutSessionThunk.rejected, (state, action) => {
                state.checkoutLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearCartError } = cartSlice.actions;
export default cartSlice.reducer;
