import axiosInstance from "../instance/instance";
import type { LoginInterface } from "../../interface/login.Interface";

export const loginApi = async (loginData: LoginInterface) => {
    const response = await axiosInstance.post('/login', loginData);
    return response.data;
};