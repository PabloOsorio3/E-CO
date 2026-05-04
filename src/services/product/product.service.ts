import { createProduct } from "../../api/admin/post/post_product";
import type { ProductCreate, ProductResponse } from "../../interface/product.interface";

const saveProduct = async (product: ProductCreate): Promise<ProductResponse> => {
    return await createProduct(product);
};

export const productService = {
    saveProduct
};