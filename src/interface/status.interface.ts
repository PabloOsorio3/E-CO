export interface StatusResponse {
    id_status: number;
    name: string;
}

export interface StatusCreate {
    name: string;
}

export interface StatusUpdate {
    id_status: number;
    name: string;
}