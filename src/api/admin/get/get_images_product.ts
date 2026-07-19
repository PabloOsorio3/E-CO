import type { ImageProductResponse } from "../../../interface/image.interface";
import apiInstance from "../../instance/instance";

export const getImagesByProduct = async (productId: number): Promise<ImageProductResponse[]> => {
    const response = await apiInstance.get(`/get_images/${productId}`);
    return response.data;
};
