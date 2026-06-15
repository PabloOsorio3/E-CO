import axiosInstance from "../../instance/instance";
import type { TypeUserResponse } from "../../../interface/typeuser.interface";

export const getTypeUser = async (): Promise<TypeUserResponse[]> => {
    try {
        const response = await axiosInstance.get(`/get_type_user`);
        return response.data;
    } catch (error) {
        console.error('Error fetching type users:', error);
        return [];
    }
};
