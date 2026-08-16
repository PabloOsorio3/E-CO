import React, { useEffect } from 'react';
import { IonIcon } from '@ionic/react';
import { cartOutline, heartOutline, imageOutline, trashOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchWishlistThunk, removeFromWishlistThunk } from '../../../store/slices/wishlist.slice';
import { addToCartThunk } from '../../../store/slices/cart.slice';
import { LoadingSpinner, EmptyState } from '../../../components/shared';
import StorePageHeader from '../components/StorePageHeader';
import { showSuccessAlert } from '../../../alerts/success/success-alert';
import { showErrorAlert } from '../../../alerts/error/error-alert';

const Wishlist: React.FC = () => {
    const dispatch = useAppDispatch();
    const history = useHistory();
    const { items, loading } = useAppSelector((state) => state.wishlist);

    useEffect(() => {
        dispatch(fetchWishlistThunk());
    }, [dispatch]);

    const formatPrice = (price: number) =>
        new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(price);

    const handleAddToCart = async (productId: number) => {
        try {
            await dispatch(addToCartThunk({ product_id: productId, quantity: 1 })).unwrap();
            showSuccessAlert('Producto agregado al carrito');
        } catch (error: any) {
            showErrorAlert(error || 'Error al agregar el producto al carrito');
        }
    };

    const handleRemove = async (id: number) => {
        try {
            await dispatch(removeFromWishlistThunk(id)).unwrap();
        } catch (error: any) {
            showErrorAlert(error || 'Error al eliminar de la lista de deseos');
        }
    };

    if (loading && items.length === 0) {
        return (
            <div className="store-page">
                <LoadingSpinner text="Cargando lista de deseos..." />
            </div>
        );
    }

    return (
        <div className="store-page">
            <StorePageHeader title="Tu Lista de Deseos" backTo="/store/catalog" backLabel="Seguir comprando" />

            {items.length === 0 ? (
                <EmptyState
                    icon={heartOutline}
                    title="Tu lista de deseos está vacía"
                    description="Guardá los productos que te interesan desde el catálogo para verlos acá."
                    actionText="Ir al catálogo"
                    onAction={() => history.push('/store/catalog')}
                />
            ) : (
                <div className="store-cart-items">
                    <div className="store-cart-items-header">
                        <span>{items.length} producto{items.length !== 1 ? 's' : ''}</span>
                    </div>
                    {items.map((item) => (
                        <div className="store-cart-item" key={item.id_wish_list}>
                            <div className="store-cart-item-image">
                                <IonIcon icon={imageOutline} />
                            </div>
                            <div className="store-cart-item-info">
                                <span className="store-cart-item-name">{item.product.name}</span>
                                <span className="store-cart-item-price">{formatPrice(item.product.price)}</span>
                            </div>
                            <button
                                className="store-add-to-cart-btn"
                                onClick={() => handleAddToCart(item.product_id)}
                                disabled={item.product.stock <= 0}
                            >
                                <IonIcon icon={cartOutline} />
                                {item.product.stock > 0 ? 'Agregar' : 'Sin stock'}
                            </button>
                            <button className="store-icon-btn delete" onClick={() => handleRemove(item.id_wish_list)}>
                                <IonIcon icon={trashOutline} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Wishlist;
