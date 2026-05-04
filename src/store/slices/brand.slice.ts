import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { getBrands } from '../../api/admin/get/get_brand.ts';
import type { BrandResponse } from '../../interface/brand.interface.ts';


interface BrandState {
    items: BrandResponse[];
    loading: boolean;
    error: string | null;
}

const initialState: BrandState = {
    items: [],
    loading: false,
    error: null,
};

export const fetchBrands = createAsyncThunk(
    'brands/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            return await getBrands();
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || 'Error al cargar marcas');
        }
    }
);

const brandSlice = createSlice({
    name: 'brands',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBrands.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBrands.fulfilled, (state, action: PayloadAction<BrandResponse[]>) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchBrands.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearError } = brandSlice.actions;
export default brandSlice.reducer;