import type { AdminUserResponse } from "../../../interface/user.interface";
import apiInstance from "../../instance/instance";

export const getAllUsers = async (): Promise<AdminUserResponse[]> => {
    try {
        const response = await apiInstance.get('/admin/get_all_users');
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};
