import type { CustomerUpdate } from "../../../interface/customer.interface";
import axiosInstance from "../../instance/instance";

// El backend solo responde {"message": "..."} en esta ruta (no el customer actualizado),
// por eso el slice reconstruye el item localmente combinando el payload enviado.
export const updateCustomerApi = async (id: number, customer: CustomerUpdate): Promise<{ message: string }> => {
    const response = await axiosInstance.put(`/admin/put_customer/${id}`, customer);
    return response.data;
};
