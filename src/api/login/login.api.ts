import axiosInstance from "../instance/instance";
import type { LoginInterface } from "../../interface/login.Interface";

export const loginApi = async (loginData: LoginInterface) => {
    const response = await axiosInstance.post('/login', loginData);

    try {
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error('Error al iniciar sesión');
        }
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        throw error;
    }

};