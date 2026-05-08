export interface CategoryCreate {
    name: string;
    slug: string;
}

export interface CategoryResponse {
    id_category: number;
    name: string;
    slug: string;
}