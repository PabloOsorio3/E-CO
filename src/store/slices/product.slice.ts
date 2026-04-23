import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
interface Product {
    id: number;
    name: string;
    price: number;
    stock: number;
}

interface ProductState {
    items: Product[];
}

const initialState: ProductState = {
    items: [
        { id: 1, name: 'Laptop Pro', price: 1200, stock: 5 },
        { id: 2, name: 'Mouse Gamer', price: 50, stock: 20 },
    ],
};

const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        addProduct: (state, action: PayloadAction<Product>) => {
            state.items.push(action.payload);
        },
        deleteProduct: (state, action: PayloadAction<number>) => {
            state.items = state.items.filter(p => p.id !== action.payload);
        }
    },
});

export const { addProduct, deleteProduct } = productSlice.actions;
export default productSlice.reducer;