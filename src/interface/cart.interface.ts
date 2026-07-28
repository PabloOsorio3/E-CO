import type { ProductResponse } from './product.interface';

export interface CartItemCreate {
    product_id: number;
    quantity?: number;
}

export interface CartItemUpdate {
    quantity: number;
}

export interface CartItemResponse {
    id_shopping_cart: number;
    product_id: number;
    quantity: number;
    user_id: number;
    product: ProductResponse;
}
