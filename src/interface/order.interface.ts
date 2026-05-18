export interface OrderItem {
    product_id: number;
    quantity: number;
    unit_price: number;
}

export interface OrderResponse {
    id_order: number;
    user_id: number;
    total_amount: number;
    status_id: number;
    shipping_method_id: number;
    order_date: string;
    order_item: OrderItem[];
}

export interface OrderStatusUpdate {
    status_id: number;
}
