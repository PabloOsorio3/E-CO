import React, { useEffect } from 'react';
import { IonIcon } from '@ionic/react';
import { cartOutline, heart, heartOutline, imageOutline } from 'ionicons/icons';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchImagesThunk } from '../../../store/slices/image.slice';
import { addToCartThunk } from '../../../store/slices/cart.slice';
import { addToWishlistThunk, removeFromWishlistThunk } from '../../../store/slices/wishlist.slice';
import { STATIC_BASE_URL } from '../../../api/instance/instance';
import { showSuccessAlert } from '../../../alerts/success/success-alert';
import { showErrorAlert } from '../../../alerts/error/error-alert';
import type { ProductResponse } from '../../../interface/product.interface';

interface ProductCardProps {
    product: ProductResponse;
    brandName: string;
    onOpen: () => void;
    badge?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, brandName, onOpen, badge }) => {
    const dispatch = useAppDispatch();
    const { items: images } = useAppSelector((state) => state.images);
    const { items: wishlist } = useAppSelector((state) => state.wishlist);

    useEffect(() => {
        dispatch(fetchImagesThunk(product.id_product));
    }, [dispatch, product.id_product]);

    const mainImage = images.find((img) => img.product_id === product.id_product && img.is_main)
        ?? images.find((img) => img.product_id === product.id_product);

    const wishlistEntry = wishlist.find((w) => w.product_id === product.id_product);

    const formatPrice = (price: number) =>
        new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(price);

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await dispatch(addToCartThunk({ product_id: product.id_product, quantity: 1 })).unwrap();
            showSuccessAlert('Producto agregado al carrito');
        } catch (error: any) {
            showErrorAlert(error || 'Error al agregar el producto al carrito');
        }
    };

    const handleToggleWishlist = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            if (wishlistEntry) {
                await dispatch(removeFromWishlistThunk(wishlistEntry.id_wish_list)).unwrap();
            } else {
                await dispatch(addToWishlistThunk({ product_id: product.id_product })).unwrap();
            }
        } catch (error: any) {
            showErrorAlert(error || 'Error al actualizar la lista de deseos');
        }
    };

    return (
        <div className="store-product-card" onClick={onOpen}>
            <div className="store-product-image">
                {mainImage ? (
                    <img src={`${STATIC_BASE_URL}${mainImage.url_image}`} alt={product.name} />
                ) : (
                    <IonIcon icon={imageOutline} />
                )}
                {badge && <span className="store-product-badge">{badge}</span>}
                <button
                    className={`store-wishlist-btn ${wishlistEntry ? 'active' : ''}`}
                    onClick={handleToggleWishlist}
                    title={wishlistEntry ? 'Quitar de la lista de deseos' : 'Agregar a la lista de deseos'}
                >
                    <IonIcon icon={wishlistEntry ? heart : heartOutline} />
                </button>
            </div>
            <div className="store-product-info">
                <span className="store-product-brand">{brandName}</span>
                <span className="store-product-name">{product.name}</span>
                <span className="store-product-price">{formatPrice(product.price)}</span>
            </div>
            <button className="store-add-to-cart-btn" onClick={handleAddToCart} disabled={product.stock <= 0}>
                <IonIcon icon={cartOutline} />
                {product.stock > 0 ? 'Agregar' : 'Sin stock'}
            </button>
        </div>
    );
};

export default ProductCard;
