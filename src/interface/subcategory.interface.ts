export interface SubCategoryResponse {
    id_subcategory: number;
    name: string;
    category_id: number;
}

export interface SubCategoryCreate {
    name: string;
    category_id: number;
}
