import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { SubCategorieResponse } from '../../interface/subcategorie.interface';
import { getSubCategories } from '../../api/admin/get/get_subcategorie';

interface SubCategorieState {
    items: SubCategorieResponse[];
    loading: boolean;
    error: string | null;
}

const initialState: SubCategorieState = {
    items: [],
    loading: false,
    error: null,
};

export const fetchSubCategories = createAsyncThunk(
    'subcategories/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            return await getSubCategories();
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || 'Error al cargar subcategorias');
        }
    }
);

const subCategorieSlice = createSlice({
    name: 'subcategories',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSubCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSubCategories.fulfilled, (state, action: PayloadAction<SubCategorieResponse[]>) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchSubCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearError } = subCategorieSlice.actions;
export default subCategorieSlice.reducer;