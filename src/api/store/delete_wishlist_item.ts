import axiosInstance from "../instance/instance";

export const deleteWishlistItem = async (id: number) => {
    const response = await axiosInstance.delete(`/delete_wish_list_item/${id}`);
    return response.data;
};
