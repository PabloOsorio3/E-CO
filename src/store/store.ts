import { configureStore } from '@reduxjs/toolkit';
import productReducer from './slices/product.slice';
import subCategoryReducer from './slices/subcategory.slice';
import statusReducer from './slices/status.slice';
import brandReducer from './slices/brand.slice';
import categoryReducer from './slices/category.slice';
import paymentReducer from './slices/payment.slice';
import orderReducer from './slices/order.slice';
import typeUserReducer from './slices/typeuser.slice';
import signupReducer from './slices/signup.slice.ts';
import customerReducer from './slices/customer.slice';
import dashboardReducer from './slices/dashboard.slice';
import inventoryReducer from './slices/inventory.slice';

export const store = configureStore({
  reducer: {
    products: productReducer,
    subcategory: subCategoryReducer,
    status: statusReducer,
    brand: brandReducer,
    category: categoryReducer,
    payment: paymentReducer,
    order: orderReducer,
    typeuser: typeUserReducer,
    signup: signupReducer,
    customer: customerReducer,
    dashboard: dashboardReducer,
    inventory: inventoryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;