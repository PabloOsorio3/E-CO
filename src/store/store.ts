import { configureStore } from '@reduxjs/toolkit';
import productReducer from './slices/product.slice';
import subCategorieReducer from './slices/subcategorie.slice';
import statusReducer from './slices/status.slice';
import brandReducer from './slices/brand.slice';
import categoryReducer from './slices/category.slice';

export const store = configureStore({
  reducer: {
    products: productReducer,
    subcategorie: subCategorieReducer,
    status: statusReducer,
    brand: brandReducer,
    category: categoryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;