export interface DataUserResponse {
    id_data_user: number;
    user_id: number;
    name: string;
    phone: string;
    address: string;
    city_id: number | null;
}

export interface DataUserUpdate {
    name?: string;
    phone?: string;
    address?: string;
    city_id?: number;
}
