import apiInstance from '../../instance/instance';
import type { InventoryMovementCreate } from '../../../interface/inventory.interface';

export const postInventoryMovement = async (data: InventoryMovementCreate): Promise<{ message: string }> => {
    const response = await apiInstance.post('/post_inventory_movement', data);
    return response.data;
};
