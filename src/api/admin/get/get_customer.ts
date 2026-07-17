import apiInstance from "../../instance/instance";
import type { CustomerResponse } from "../../../interface/customer.interface";

// NOTA: esta ruta lleva el prefijo `/admin`, a diferencia del resto de
// `api/admin/get/*` que usan rutas planas (ej. `/get_brand`). Es una
// inconsistencia conocida (ver CLAUDE.md) que no se corrige aquí porque
// no está confirmado que el backend exponga también la ruta plana.
export const getCustomer = async (): Promise<CustomerResponse[]> => {
    try {
        const response = await apiInstance.get('/admin/get_customers');
        return response.data;
    } catch (error) {
        console.error('Error fetching customers:', error);
        throw error;
    }
};