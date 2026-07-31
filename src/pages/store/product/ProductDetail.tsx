import React, { useEffect, useState } from 'react';
import { IonIcon } from '@ionic/react';
import { addOutline, arrowBackOutline, cartOutline, heart, heartOutline, imageOutline, removeOutline } from 'ionicons/icons';
import { useHistory, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchProducts } from '../../../store/slices/product.slice';
import { fetchBrands } from '../../../store/slices/brand.slice';
import { fetchSubCategory } from '../../../store/slices/subcategory.slice';
import { fetchImagesThunk } from '../../../store/slices/image.slice';
import { addToCartThunk } from '../../../store/slices/cart.slice';
import { addToWishlistThunk, removeFromWishlistThunk } from '../../../store/slices/wishlist.slice';
import { STATIC_BASE_URL } from '../../../api/instance/instance';
import { LoadingSpinner, EmptyState } from '../../../components/shared';
import { showSuccessAlert } from '../../../alerts/success/success-alert';
import { showErrorAlert } from '../../../alerts/error/error-alert';

const ProductDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const productId = Number(id);
    const dispatch = useAppDispatch();
    const history = useHistory();

    const { items: products, loading } = useAppSelector((state) => state.products);
    const { items: brands } = useAppSelector((state) => state.brand);
    const { items: subcategories } = useAppSelector((state) => state.subcategory);
    const { items: images } = useAppSelector((state) => state.images);
    const { items: wishlist } = useAppSelector((state) => state.wishlist);

    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState<string | null>(null);

    useEffect(() => {
        if (products.length === 0) {
            dispatch(fetchProducts());
        }
        if (brands.length === 0) {
            dispatch(fetchBrands());
        }
        if (subcategories.length === 0) {
            dispatch(fetchSubCategory());
        }
        dispatch(fetchImagesThunk(productId));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, productId]);

    const product = products.find((p) => p.id_product === productId);
    const productImages = images.filter((img) => img.product_id === productId);
    const brandName = product ? brands.find((b) => b.id_brand === product.brand_id)?.brand_name ?? 'N/A' : '';
    const subcategoryName = product ? subcategories.find((s) => s.id_subcategory === product.subcategory_id)?.name ?? 'N/A' : '';
    const wishlistEntry = wishlist.find((w) => w.product_id === productId);

    const displayedImage = activeImage
        ?? productImages.find((img) => img.is_main)?.url_image
        ?? productImages[0]?.url_image
        ?? null;

    const formatPrice = (price: number) =>
        new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(price);

    const handleAddToCart = async () => {
        if (!product) return;
        try {
            await dispatch(addToCartThunk({ product_id: product.id_product, quantity })).unwrap();
            showSuccessAlert('Producto agregado al carrito');
        } catch (error: any) {
            showErrorAlert(error || 'Error al agregar el producto al carrito');
        }
    };

    const handleToggleWishlist = async () => {
        if (!product) return;
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

    if (loading && !product) {
        return (
            <div className="store-page">
                <LoadingSpinner text="Cargando producto..." />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="store-page">
                <EmptyState title="Producto no encontrado" description="Puede que ya no esté disponible." />
            </div>
        );
    }

    return (
        <div className="store-page">
            <button className="store-back-link" onClick={() => history.push('/store/catalog')}>
                <IonIcon icon={arrowBackOutline} />
                Volver al catálogo
            </button>

            <div className="store-product-detail">
                <div className="store-detail-gallery">
                    <div className="store-detail-main-image">
                        {displayedImage ? (
                            <img src={`${STATIC_BASE_URL}${displayedImage}`} alt={product.name} />
                        ) : (
                            <IonIcon icon={imageOutline} />
                        )}
                    </div>
                    {productImages.length > 1 && (
                        <div className="store-detail-thumbs">
                            {productImages.map((img) => (
                                <button
                                    key={img.id_image}
                                    className={`store-detail-thumb ${displayedImage === img.url_image ? 'active' : ''}`}
                                    onClick={() => setActiveImage(img.url_image)}
                                >
                                    <img src={`${STATIC_BASE_URL}${img.url_image}`} alt={product.name} />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="store-detail-info">
                    <span className="store-product-brand">{brandName}</span>
                    <h1>{product.name}</h1>
                    <span className="store-detail-price">{formatPrice(product.price)}</span>
                    <p className="store-detail-description">{product.description}</p>

                    <div className="store-detail-meta">
                        <span>Categoría: {subcategoryName}</span>
                        <span>{product.stock > 0 ? `${product.stock} disponibles` : 'Sin stock'}</span>
                    </div>

                    <div className="store-quantity-stepper">
                        <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} disabled={quantity <= 1}>
                            <IonIcon icon={removeOutline} />
                        </button>
                        <span>{quantity}</span>
                        <button onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))} disabled={quantity >= product.stock}>
                            <IonIcon icon={addOutline} />
                        </button>
                    </div>

                    <div className="store-detail-actions">
                        <button className="store-add-to-cart-btn large" onClick={handleAddToCart} disabled={product.stock <= 0}>
                            <IonIcon icon={cartOutline} />
                            {product.stock > 0 ? 'Agregar al carrito' : 'Sin stock'}
                        </button>
                        <button
                            className={`store-detail-wishlist-btn ${wishlistEntry ? 'active' : ''}`}
                            onClick={handleToggleWishlist}
                            title={wishlistEntry ? 'Quitar de la lista de deseos' : 'Agregar a la lista de deseos'}
                        >
                            <IonIcon icon={wishlistEntry ? heart : heartOutline} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
