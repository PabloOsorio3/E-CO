export interface CustomerResponse {
    id_customer: number;
    status_id: number;
    user_id: number;
    status?: string;
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    order_count?: number;
    total_spend?: number;
}

export interface CustomerCreate {
    status_id: number;
    user_id: number;
}

export interface CustomerUpdate {
    status_id: number;
}
