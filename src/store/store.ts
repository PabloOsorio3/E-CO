import { configureStore } from '@reduxjs/toolkit';
import productReducer from './slices/product.slice';
import subCategoryReducer from './slices/subcategory.slice';
import statusReducer from './slices/status.slice';
import brandReducer from './slices/brand.slice';
import categoryReducer from './slices/category.slice';
import paymentReducer from './slices/payment.slice';
import orderReducer from './slices/order.slice';

export const store = configureStore({
  reducer: {
    products: productReducer,
    subcategory: subCategoryReducer,
    status: statusReducer,
    brand: brandReducer,
    category: categoryReducer,
    payment: paymentReducer,
    order: orderReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;