import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { SubCategoryResponse, SubCategoryCreate } from '../../interface/subcategory.interface';
import { getSubCategory } from '../../api/admin/get/get_subcategory';
import { postSubCategory } from '../../api/admin/post/post_subcategory';
import { deleteSubCategory } from '../../api/admin/delete/delete_subcategory';

interface SubCategoryState {
    items: SubCategoryResponse[];
    loading: boolean;
    error: string | null;
}

const initialState: SubCategoryState = {
    items: [],
    loading: false,
    error: null,
};

export const fetchSubCategory = createAsyncThunk(
    'subcategory/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            return await getSubCategory();
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || 'Error al cargar subcategorias');
        }
    }
);

export const createSubCategoryThunk = createAsyncThunk(
    'subcategory/create',
    async (data: SubCategoryCreate, { rejectWithValue }) => {
        try {
            return await postSubCategory(data);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || 'Error al crear subcategoría');
        }
    }
);

export const deleteSubCategoryThunk = createAsyncThunk(
    'subcategory/delete',
    async (id: number, { rejectWithValue }) => {
        try {
            await deleteSubCategory(id);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || 'Error al eliminar subcategoría');
        }
    }
);

const subCategorySlice = createSlice({
    name: 'subcategory',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchSubCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSubCategory.fulfilled, (state, action: PayloadAction<SubCategoryResponse[]>) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchSubCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Create
            .addCase(createSubCategoryThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(createSubCategoryThunk.fulfilled, (state, action: PayloadAction<SubCategoryResponse>) => {
                state.loading = false;
                state.items.push(action.payload);
            })
            .addCase(createSubCategoryThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Delete
            .addCase(deleteSubCategoryThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteSubCategoryThunk.fulfilled, (state, action: PayloadAction<number>) => {
                state.loading = false;
                state.items = state.items.filter(item => item.id_subcategory !== action.payload);
            })
            .addCase(deleteSubCategoryThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearError } = subCategorySlice.actions;
export default subCategorySlice.reducer;
