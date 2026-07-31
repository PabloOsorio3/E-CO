import type { ProductResponse } from './product.interface';

export interface WishListItemCreate {
    product_id: number;
}

export interface WishListItemResponse {
    id_wish_list: number;
    user_id: number;
    product_id: number;
    added_date: string;
    product: ProductResponse;
}
