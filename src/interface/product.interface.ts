export interface ProductBase {
  name: string;
  description: string;
  price: number;
  category_id: number;
  subcategorie_id: number;
  status_id: number;
  brand_id: number;
}

export interface ProductCreate {
  name: string;
  description: string;
  price: number;
  category_id: number;
  subcategorie_id: number;
  status_id: number;
  brand_id: number;
}

export interface ProductUpdate {
  name?: string;
  description?: string;
  price?: number;
  category_id?: number;
  subcategorie_id?: number;
  status_id?: number;
  brand_id?: number;
}

export interface ProductResponse extends ProductBase {
  id_product: number;
}

export interface ProductDelete {
  id_product: number;
}

export interface ProductGetById {
  id_product: number;
}