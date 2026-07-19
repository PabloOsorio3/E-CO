export interface InventoryMovementCreate {
    product_id: number;
    type: 'entrada' | 'salida';
    quantity: number;
    description: string;
}
