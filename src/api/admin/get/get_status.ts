import axiosInstance from "../../instance/instance";

import type { StatusResponse } from "../../../interface/status.interface";

export const getStatus = async (): Promise<StatusResponse[]> => {
    try {
        const response = await axiosInstance.get(`/get_status`);

        return response.data;
    } catch (error) {
        console.error('Error fetching statuses:', error);
        return {};
    }
}