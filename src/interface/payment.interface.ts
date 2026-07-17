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