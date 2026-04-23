import axiosInstance from "../instance/instance";
import type { LoginInterface } from "../../interface/login.Interface";
import { loginService } from "../../services/login/login.service";

export const loginApi = async (loginData: LoginInterface) => {
    const response = await axiosInstance.post('/login', loginData);

    const res = await loginService(response.data);

    return res;

};