import apiInstance from "../../instance/instance";
import type { DataUserResponse } from "../../../interface/dataUser.interface";

export const getDataUser = async (): Promise<DataUserResponse | null> => {
    const response = await apiInstance.get('/get_data_user');
    return response.data;
};
