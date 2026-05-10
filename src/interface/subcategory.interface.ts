export interface SubCategoryResponse {
    id_subcategory: number;
    name: string;
    category: {
        id_category: number;
        name: string;
    }
}

export interface SubCategoryCreate {
    name: string;
    category_id: number;
}
