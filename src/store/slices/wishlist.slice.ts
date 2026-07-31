import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { WishListItemCreate, WishListItemResponse } from '../../interface/wishlist.interface';
import { getWishlist } from '../../api/store/get_wishlist';
import { postWishlistItem } from '../../api/store/post_wishlist_item';
import { deleteWishlistItem } from '../../api/store/delete_wishlist_item';

interface WishlistState {
    items: WishListItemResponse[];
    loading: boolean;
    error: string | null;
}

const initialState: WishlistState = {
    items: [],
    loading: false,
    error: null,
};

export const fetchWishlistThunk = createAsyncThunk(
    'wishlist/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            return await getWishlist();
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || 'Error al cargar la lista de deseos');
        }
    }
);

export const addToWishlistThunk = createAsyncThunk(
    'wishlist/add',
    async (data: WishListItemCreate, { rejectWithValue }) => {
        try {
            await postWishlistItem(data);
            return await getWishlist();
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || 'Error al agregar a la lista de deseos');
        }
    }
);

export const removeFromWishlistThunk = createAsyncThunk(
    'wishlist/remove',
    async (id: number, { rejectWithValue }) => {
        try {
            await deleteWishlistItem(id);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || 'Error al eliminar de la lista de deseos');
        }
    }
);

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchWishlistThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchWishlistThunk.fulfilled, (state, action: PayloadAction<WishListItemResponse[]>) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchWishlistThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        builder
            .addCase(addToWishlistThunk.fulfilled, (state, action: PayloadAction<WishListItemResponse[]>) => {
                state.items = action.payload;
            })
            .addCase(addToWishlistThunk.rejected, (state, action) => {
                state.error = action.payload as string;
            });

        builder
            .addCase(removeFromWishlistThunk.fulfilled, (state, action: PayloadAction<number>) => {
                state.items = state.items.filter((i) => i.id_wish_list !== action.payload);
            })
            .addCase(removeFromWishlistThunk.rejected, (state, action) => {
                state.error = action.payload as string;
            });
    },
});

export default wishlistSlice.reducer;
