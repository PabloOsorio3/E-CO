export interface PaymentResponse {
    id_payment: number;
    payment_name: string;
}

export interface PaymentCreate {
    payment_name: string;
}

export interface PaymentUpdate {
    id_payment: number;
    payment_name: string;
}
