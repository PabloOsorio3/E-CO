import React, { useEffect, useMemo, useState } from 'react';
import { IonIcon } from '@ionic/react';
import { cartOutline, heart, heartOutline, imageOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchProducts } from '../../../store/slices/product.slice';
import { fetchBrands } from '../../../store/slices/brand.slice';
import { fetchImagesThunk } from '../../../store/slices/image.slice';
import { addToCartThunk } from '../../../store/slices/cart.slice';
import { addToWishlistThunk, removeFromWishlistThunk } from '../../../store/slices/wishlist.slice';
import { STATIC_BASE_URL } from '../../../api/instance/instance';
import { SearchBar, LoadingSpinner, EmptyState } from '../../../components/shared';
import { showSuccessAlert } from '../../../alerts/success/success-alert';
import { showErrorAlert } from '../../../alerts/error/error-alert';
import type { ProductResponse } from '../../../interface/product.interface';

const ProductCard: React.FC<{ product: ProductResponse; brandName: string; onOpen: () => void }> = ({ product, brandName, onOpen }) => {
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

const Catalog: React.FC = () => {
    const dispatch = useAppDispatch();
    const history = useHistory();
    const { items: products, loading } = useAppSelector((state) => state.products);
    const { items: brands } = useAppSelector((state) => state.brand);

    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        dispatch(fetchProducts());
        if (brands.length === 0) {
            dispatch(fetchBrands());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);

    const activeProducts = useMemo(
        () => products.filter((p) => p.status_id === 1 || p.status_id === 5),
        [products]
    );

    const filteredProducts = useMemo(() => {
        const term = searchTerm.toLowerCase();
        if (!term) return activeProducts;
        return activeProducts.filter((p) => {
            const brandObj = brands.find((b) => b.id_brand === p.brand_id);
            const brandName = brandObj ? brandObj.brand_name.toLowerCase() : '';
            return p.name.toLowerCase().includes(term) || brandName.includes(term);
        });
    }, [activeProducts, brands, searchTerm]);

    const getBrandName = (brandId: number) => brands.find((b) => b.id_brand === brandId)?.brand_name ?? '';

    return (
        <div className="store-page">
            <div className="store-page-header">
                <h1>Catálogo</h1>
                <SearchBar
                    value={searchTerm}
                    onSearch={setSearchTerm}
                    placeholder="Buscar por nombre, marca..."
                />
            </div>

            {loading && products.length === 0 ? (
                <LoadingSpinner text="Cargando productos..." />
            ) : filteredProducts.length === 0 ? (
                <EmptyState
                    title={searchTerm ? 'Sin resultados' : 'Sin productos'}
                    description={
                        searchTerm
                            ? `No se encontraron productos para "${searchTerm}"`
                            : 'Todavía no hay productos disponibles.'
                    }
                />
            ) : (
                <div className="store-product-grid">
                    {filteredProducts.map((product) => (
                        <ProductCard
                            key={product.id_product}
                            product={product}
                            brandName={getBrandName(product.brand_id)}
                            onOpen={() => history.push(`/store/product/${product.id_product}`)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Catalog;
