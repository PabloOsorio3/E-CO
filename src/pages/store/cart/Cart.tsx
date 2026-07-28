import React, { useEffect, useMemo, useState } from 'react';
import { IonIcon } from '@ionic/react';
import { addOutline, arrowBackOutline, cartOutline, imageOutline, removeOutline, trashOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
    fetchCartThunk,
    updateCartItemThunk,
    removeCartItemThunk,
    clearCartThunk,
    fetchShippingMethodsThunk,
    createOrderThunk,
    createCheckoutSessionThunk,
} from '../../../store/slices/cart.slice';
import { LoadingSpinner, EmptyState, ConfirmModal } from '../../../components/shared';
import { showSuccessAlert } from '../../../alerts/success/success-alert';
import { showErrorAlert } from '../../../alerts/error/error-alert';

const Cart: React.FC = () => {
    const dispatch = useAppDispatch();
    const history = useHistory();
    const { items, shippingMethods, loading, checkoutLoading } = useAppSelector((state) => state.cart);

    const [selectedShipping, setSelectedShipping] = useState<number | null>(null);
    const [showCheckout, setShowCheckout] = useState(false);
    const [showClearConfirm, setShowClearConfirm] = useState(false);
    const [removingId, setRemovingId] = useState<number | null>(null);

    useEffect(() => {
        dispatch(fetchCartThunk());
    }, [dispatch]);

    const formatPrice = (price: number) =>
        new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(price);

    const subtotal = useMemo(
        () => items.reduce((sum, item) => sum + item.quantity * item.product.price, 0),
        [items]
    );

    const selectedShippingPrice = shippingMethods.find((s) => s.id_shipping_method === selectedShipping)?.price ?? 0;

    const handleUpdateQuantity = async (id: number, quantity: number) => {
        if (quantity < 1) return;
        try {
            await dispatch(updateCartItemThunk({ id, data: { quantity } })).unwrap();
        } catch (error: any) {
            showErrorAlert(error || 'Error al actualizar la cantidad');
        }
    };

    const handleRemove = async () => {
        if (removingId === null) return;
        try {
            await dispatch(removeCartItemThunk(removingId)).unwrap();
        } catch (error: any) {
            showErrorAlert(error || 'Error al eliminar el producto');
        }
        setRemovingId(null);
    };

    const handleClearCart = async () => {
        try {
            await dispatch(clearCartThunk()).unwrap();
        } catch (error: any) {
            showErrorAlert(error || 'Error al vaciar el carrito');
        }
        setShowClearConfirm(false);
    };

    const handleOpenCheckout = async () => {
        try {
            await dispatch(fetchShippingMethodsThunk()).unwrap();
            setShowCheckout(true);
        } catch (error: any) {
            showErrorAlert(error || 'Error al cargar los métodos de envío');
        }
    };

    const handleConfirmCheckout = async () => {
        if (!selectedShipping) {
            showErrorAlert('Seleccioná un método de envío');
            return;
        }
        try {
            const order = await dispatch(createOrderThunk({ shipping_method_id: selectedShipping })).unwrap();
            await dispatch(createCheckoutSessionThunk(order.order_id)).unwrap();
            showSuccessAlert('¡Compra realizada con éxito!');
            setShowCheckout(false);
            history.push('/store/catalog');
        } catch (error: any) {
            showErrorAlert(error || 'Error al procesar la compra');
        }
    };

    if (loading && items.length === 0) {
        return (
            <div className="store-page">
                <LoadingSpinner text="Cargando carrito..." />
            </div>
        );
    }

    return (
        <div className="store-page">
            <button className="store-back-link" onClick={() => history.push('/store/catalog')}>
                <IonIcon icon={arrowBackOutline} />
                Seguir comprando
            </button>

            <h1>Tu Carrito</h1>

            {items.length === 0 ? (
                <EmptyState
                    icon={cartOutline}
                    title="Tu carrito está vacío"
                    description="Agregá productos desde el catálogo para verlos acá."
                    actionText="Ir al catálogo"
                    onAction={() => history.push('/store/catalog')}
                />
            ) : (
                <div className="store-cart-layout">
                    <div className="store-cart-items">
                        <div className="store-cart-items-header">
                            <span>{items.length} producto{items.length !== 1 ? 's' : ''}</span>
                            <button className="store-clear-cart-btn" onClick={() => setShowClearConfirm(true)}>
                                Vaciar carrito
                            </button>
                        </div>
                        {items.map((item) => (
                            <div className="store-cart-item" key={item.id_shopping_cart}>
                                <div className="store-cart-item-image">
                                    <IonIcon icon={imageOutline} />
                                </div>
                                <div className="store-cart-item-info">
                                    <span className="store-cart-item-name">{item.product.name}</span>
                                    <span className="store-cart-item-price">{formatPrice(item.product.price)}</span>
                                </div>
                                <div className="store-quantity-stepper small">
                                    <button
                                        onClick={() => handleUpdateQuantity(item.id_shopping_cart, item.quantity - 1)}
                                        disabled={item.quantity <= 1}
                                    >
                                        <IonIcon icon={removeOutline} />
                                    </button>
                                    <span>{item.quantity}</span>
                                    <button
                                        onClick={() => handleUpdateQuantity(item.id_shopping_cart, item.quantity + 1)}
                                        disabled={item.quantity >= item.product.stock}
                                    >
                                        <IonIcon icon={addOutline} />
                                    </button>
                                </div>
                                <span className="store-cart-item-total">
                                    {formatPrice(item.quantity * item.product.price)}
                                </span>
                                <button
                                    className="store-icon-btn delete"
                                    onClick={() => setRemovingId(item.id_shopping_cart)}
                                >
                                    <IonIcon icon={trashOutline} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="store-cart-summary">
                        <h2>Resumen</h2>
                        <div className="store-cart-summary-row">
                            <span>Subtotal</span>
                            <span>{formatPrice(subtotal)}</span>
                        </div>

                        {showCheckout && (
                            <div className="store-shipping-options">
                                <span className="store-shipping-title">Método de envío</span>
                                {shippingMethods.map((method) => (
                                    <label key={method.id_shipping_method} className="store-shipping-option">
                                        <input
                                            type="radio"
                                            name="shipping"
                                            checked={selectedShipping === method.id_shipping_method}
                                            onChange={() => setSelectedShipping(method.id_shipping_method)}
                                        />
                                        <span>{method.name} — {method.estimated_delivery}</span>
                                        <span>{formatPrice(method.price)}</span>
                                    </label>
                                ))}
                                {selectedShipping && (
                                    <div className="store-cart-summary-row total">
                                        <span>Total</span>
                                        <span>{formatPrice(subtotal + selectedShippingPrice)}</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {!showCheckout ? (
                            <button className="store-checkout-btn" onClick={handleOpenCheckout}>
                                Finalizar compra
                            </button>
                        ) : (
                            <button
                                className="store-checkout-btn"
                                onClick={handleConfirmCheckout}
                                disabled={checkoutLoading || !selectedShipping}
                            >
                                {checkoutLoading ? 'Procesando...' : 'Confirmar y pagar'}
                            </button>
                        )}
                    </div>
                </div>
            )}

            <ConfirmModal
                isOpen={removingId !== null}
                onClose={() => setRemovingId(null)}
                onConfirm={handleRemove}
                title="¿Eliminar producto?"
                message="Se quitará este producto de tu carrito."
                confirmText="Eliminar"
                variant="danger"
            />

            <ConfirmModal
                isOpen={showClearConfirm}
                onClose={() => setShowClearConfirm(false)}
                onConfirm={handleClearCart}
                title="¿Vaciar el carrito?"
                message="Se eliminarán todos los productos de tu carrito."
                confirmText="Vaciar"
                variant="danger"
            />
        </div>
    );
};

export default Cart;
