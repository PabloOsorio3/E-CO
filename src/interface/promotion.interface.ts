export interface PromotionResponse {
    id_promotion: number;
    name: string;
    discount_percentage: number;
    active: boolean;
}

export interface PromotionCreate {
    name: string;
    discount_percentage: number;
    active: boolean;
}

export interface PromotionUpdate {
    name?: string;
    discount_percentage?: number;
    active?: boolean;
}
