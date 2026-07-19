import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { getImagesByProduct } from '../../api/admin/get/get_images_product';
import { postImageProduct } from '../../api/admin/post/post_image_product';
import { deleteImageProduct } from '../../api/admin/delete/delete_image_product';
import type { ImageProductResponse } from '../../interface/image.interface';

interface ImageState {
    items: ImageProductResponse[];
    loading: boolean;
    error: string | null;
}

const initialState: ImageState = {
    items: [],
    loading: false,
    error: null,
};

export const fetchImagesThunk = createAsyncThunk(
    'images/fetchByProduct',
    async (productId: number, { rejectWithValue }) => {
        try {
            return await getImagesByProduct(productId);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || 'Error al cargar las imágenes');
        }
    }
);

export const uploadImageThunk = createAsyncThunk(
    'images/upload',
    async ({ productId, file, isMain }: { productId: number; file: File; isMain: boolean }, { rejectWithValue }) => {
        try {
            return await postImageProduct(productId, file, isMain);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || 'Error al subir la imagen');
        }
    }
);

export const deleteImageThunk = createAsyncThunk(
    'images/delete',
    async (idImage: number, { rejectWithValue }) => {
        try {
            await deleteImageProduct(idImage);
            return idImage;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || 'Error al eliminar la imagen');
        }
    }
);

export const imageSlice = createSlice({
    name: 'images',
    initialState,
    reducers: {
        clearImages: (state) => {
            state.items = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchImagesThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchImagesThunk.fulfilled, (state, action: PayloadAction<ImageProductResponse[]>) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchImagesThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        builder
            .addCase(uploadImageThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(uploadImageThunk.fulfilled, (state, action: PayloadAction<ImageProductResponse>) => {
                state.loading = false;
                state.items.push(action.payload);
            })
            .addCase(uploadImageThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        builder
            .addCase(deleteImageThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteImageThunk.fulfilled, (state, action: PayloadAction<number>) => {
                state.loading = false;
                state.items = state.items.filter(i => i.id_image !== action.payload);
            })
            .addCase(deleteImageThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearImages } = imageSlice.actions;
export default imageSlice.reducer;
