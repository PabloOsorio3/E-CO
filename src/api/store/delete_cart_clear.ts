import axiosInstance from "../instance/instance";

export const deleteCartClear = async () => {
    const response = await axiosInstance.delete(`/delete_clear_shopping_cart`);
    return response.data;
};
