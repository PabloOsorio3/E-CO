import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { getBrands } from '../../api/admin/get/get_brand.ts';
import { postBrand } from '../../api/admin/post/post_brand.ts';
import { deleteBrandApi } from '../../api/admin/delete/delete_brand.ts';
import { updateBrandApi } from '../../api/admin/put/put_brand.ts';
import type { BrandResponse, BrandCreate, BrandUpdate } from '../../interface/brand.interface.ts';


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

export const createBrandThunk = createAsyncThunk(
    'brands/create',
    async (brandData: BrandCreate, { rejectWithValue }) => {
        try {
            return await postBrand(brandData);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || 'Error al crear la marca');
        }
    }
);

export const deleteBrandThunk = createAsyncThunk(
    'brands/delete',
    async (id: number, { rejectWithValue }) => {
        try {
            await deleteBrandApi(id);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || 'Error al eliminar la marca');
        }
    }
);

export const updateBrandThunk = createAsyncThunk(
    'brands/update',
    async ({ id, data }: { id: number, data: BrandUpdate }, { rejectWithValue }) => {
        try {
            return await updateBrandApi(id, data);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || 'Error al actualizar la marca');
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
            // Fetch Brands
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
            })
            // Create Brand
            .addCase(createBrandThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(createBrandThunk.fulfilled, (state, action: any) => {
                state.loading = false;
                state.items.push(action.payload);
            })
            .addCase(createBrandThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Delete Brand
            .addCase(deleteBrandThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteBrandThunk.fulfilled, (state, action: PayloadAction<number>) => {
                state.loading = false;
                state.items = state.items.filter(item => item.id_brand !== action.payload);
            })
            .addCase(deleteBrandThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Update Brand
            .addCase(updateBrandThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateBrandThunk.fulfilled, (state, action: PayloadAction<BrandResponse>) => {
                state.loading = false;
                const index = state.items.findIndex(item => item.id_brand === action.payload.id_brand);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            .addCase(updateBrandThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearError } = brandSlice.actions;
export default brandSlice.reducer;