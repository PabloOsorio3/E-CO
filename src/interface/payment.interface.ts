export interface PaymentResponse {
    id_payment: number;
    payment_name: string;
}

export interface PaymentCreate {
    payment_name: string;
    description: string;
}

export interface PaymentUpdate {
    id_payment: number;
    payment_name: string;
    description: string;
}

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