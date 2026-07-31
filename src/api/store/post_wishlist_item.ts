import type { WishListItemCreate } from "../../interface/wishlist.interface";
import axiosInstance from "../instance/instance";

export const postWishlistItem = async (data: WishListItemCreate) => {
    const response = await axiosInstance.post(`/post_wish_list_item`, data);
    return response.data;
};
