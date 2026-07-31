export interface PaymentMethodResponse {
    id_payment_method: number;
    name: string;
    description: string;
}

export interface PaymentMethodCreate {
    name: string;
    description: string;
}

export interface PaymentMethodUpdate {
    id_payment_method: number;
    name: string;
    description: string;
}

export interface PaymentResponse {
    id_payment: number;
    order_id: number;
    payment_date: string;
    amount: number;
    payment_method_id: number;
    status_id: number;
}