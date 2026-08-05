import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { getPromotions } from '../../api/admin/get/get_promotions';
import { postPromotion } from '../../api/admin/post/post_promotion';
import { putPromotion } from '../../api/admin/put/put_promotion';
import { deletePromotion } from '../../api/admin/delete/delete_promotion';
import type { PromotionResponse, PromotionCreate, PromotionUpdate } from '../../interface/promotion.interface';

interface PromotionState {
    items: PromotionResponse[];
    loading: boolean;
    error: string | null;
}

const initialState: PromotionState = {
    items: [],
    loading: false,
    error: null,
};

export const fetchPromotions = createAsyncThunk(
    'promotions/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            return await getPromotions();
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || 'Error al cargar las promociones');
        }
    }
);

// post_promotion / put_promotion solo devuelven un mensaje, no el objeto
// actualizado — se vuelve a pedir la lista completa tras cada mutación.
export const createPromotionThunk = createAsyncThunk(
    'promotions/create',
    async (data: PromotionCreate, { rejectWithValue }) => {
        try {
            await postPromotion(data);
            return await getPromotions();
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || 'Error al crear la promoción');
        }
    }
);

export const updatePromotionThunk = createAsyncThunk(
    'promotions/update',
    async ({ id, data }: { id: number; data: PromotionUpdate }, { rejectWithValue }) => {
        try {
            await putPromotion(id, data);
            return await getPromotions();
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || 'Error al actualizar la promoción');
        }
    }
);

export const deletePromotionThunk = createAsyncThunk(
    'promotions/delete',
    async (id: number, { rejectWithValue }) => {
        try {
            await deletePromotion(id);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || 'Error al eliminar la promoción');
        }
    }
);

const promotionSlice = createSlice({
    name: 'promotions',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPromotions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPromotions.fulfilled, (state, action: PayloadAction<PromotionResponse[]>) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchPromotions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        builder
            .addCase(createPromotionThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(createPromotionThunk.fulfilled, (state, action: PayloadAction<PromotionResponse[]>) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(createPromotionThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        builder
            .addCase(updatePromotionThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(updatePromotionThunk.fulfilled, (state, action: PayloadAction<PromotionResponse[]>) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(updatePromotionThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        builder
            .addCase(deletePromotionThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(deletePromotionThunk.fulfilled, (state, action: PayloadAction<number>) => {
                state.loading = false;
                state.items = state.items.filter((p) => p.id_promotion !== action.payload);
            })
            .addCase(deletePromotionThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearError } = promotionSlice.actions;
export default promotionSlice.reducer;
