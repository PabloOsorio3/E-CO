export interface BrandResponse {
    id_brand: number;
    brand_name: string;
}

export interface BrandCreate {
    brand_name: string;
}

export interface BrandUpdate {
    id_brand: number;
    brand_name: string;
}