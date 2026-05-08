import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { getCategory } from '../../api/admin/get/get_category.ts';
import { postCategory } from '../../api/admin/post/post_category.ts';
import { deleteCategory } from '../../api/admin/delete/delete_category.ts';
import type { CategoryResponse, CategoryCreate } from '../../interface/category.interface.ts';


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

export const createCategoryThunk = createAsyncThunk(
    'categories/create',
    async (data: CategoryCreate, { rejectWithValue }) => {
        try {
            return await postCategory(data);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || 'Error al crear categoría');
        }
    }
);

export const deleteCategoryThunk = createAsyncThunk(
    'categories/delete',
    async (id: number, { rejectWithValue }) => {
        try {
            await deleteCategory(id);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || 'Error al eliminar categoría');
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
            // Fetch
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
            })
            // Create
            .addCase(createCategoryThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(createCategoryThunk.fulfilled, (state, action: PayloadAction<CategoryResponse>) => {
                state.loading = false;
                state.items.push(action.payload);
            })
            .addCase(createCategoryThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Delete
            .addCase(deleteCategoryThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteCategoryThunk.fulfilled, (state, action: PayloadAction<number>) => {
                state.loading = false;
                state.items = state.items.filter(item => item.id_category !== action.payload);
            })
            .addCase(deleteCategoryThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearError } = categorySlice.actions;
export default categorySlice.reducer;