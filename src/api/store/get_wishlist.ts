import type { WishListItemResponse } from "../../interface/wishlist.interface";
import axiosInstance from "../instance/instance";

export const getWishlist = async (): Promise<WishListItemResponse[]> => {
    const response = await axiosInstance.get(`/get_wish_list`);
    return response.data;
};
