import axiosInstance from "../instance/instance";

export const deleteCartItem = async (id: number) => {
    const response = await axiosInstance.delete(`/delete_shopping_cart_item/${id}`);
    return response.data;
};
