import axiosInstance from "../instance/instance.ts";
import type { SignupInterface, SignupResponseInterface } from "../../interface/signup.interface.ts";

export const signupApi = async (signupData: SignupInterface): Promise<SignupResponseInterface> => {
    const response = await axiosInstance.post("/post_user", signupData);
    return response.data;
};