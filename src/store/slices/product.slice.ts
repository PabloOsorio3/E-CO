import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { ProductResponse, ProductCreate, ProductUpdate } from '../../interface/product.interface';
import { getProducts } from '../../api/admin/get/get_products';
import { createProduct as apiCreateProduct } from '../../api/admin/post/post_product';
import { updateProduct as apiUpdateProduct } from '../../api/admin/put/put_product';

interface ProductState {
  items: ProductResponse[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await getProducts();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Error al cargar productos');
    }
  }
);

export const createProductThunk = createAsyncThunk(
  'products/create',
  async (product: ProductCreate, { rejectWithValue }) => {
    try {
      return await apiCreateProduct(product);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Error al crear producto');
    }
  }
);

export const updateProductThunk = createAsyncThunk(
  'products/update',
  async ({ id, data }: { id: number; data: ProductUpdate }, { rejectWithValue }) => {
    try {
      return await apiUpdateProduct(id, data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Error al actualizar producto');
    }
  }
);

export const deleteProductThunk = createAsyncThunk(
  'products/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await apiDeleteProduct(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Error al eliminar producto');
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<ProductResponse[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(createProductThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProductThunk.fulfilled, (state, action: PayloadAction<ProductResponse>) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(createProductThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(updateProductThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProductThunk.fulfilled, (state, action: PayloadAction<ProductResponse>) => {
        state.loading = false;
        const index = state.items.findIndex(p => p.id_product === action.payload.id_product);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateProductThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(deleteProductThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProductThunk.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.items = state.items.filter(p => p.id_product !== action.payload);
      })
      .addCase(deleteProductThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = productSlice.actions;
export default productSlice.reducer;