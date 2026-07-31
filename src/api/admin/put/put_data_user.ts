import apiInstance from "../../instance/instance";
import type { DataUserResponse, DataUserUpdate } from "../../../interface/dataUser.interface";

export const putDataUser = async (data: DataUserUpdate): Promise<DataUserResponse> => {
    const response = await apiInstance.put('/put_data_user', data);
    return response.data;
};
