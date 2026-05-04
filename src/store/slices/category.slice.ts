import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { getCategory } from '../../api/admin/get/get_category.ts';
import type { CategoryResponse } from '../../interface/category.interface.ts';


interface CategoryState {
    items: CategoryResponse[];
    loading: boolean;
    error: string | null;
}

const initialState: CategoryState = {
    items: [],
    loading: false,
    error: null,
};

export const fetchCategories = createAsyncThunk(
    'categories/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            return await getCategory();
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || 'Error al cargar categorías');
        }
    }
);

const categorySlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<CategoryResponse[]>) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearError } = categorySlice.actions;
export default categorySlice.reducer;