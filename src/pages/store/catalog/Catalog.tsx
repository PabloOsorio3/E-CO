import React, { useEffect, useMemo, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchProducts } from '../../../store/slices/product.slice';
import { fetchBrands } from '../../../store/slices/brand.slice';
import { fetchCategory } from '../../../store/slices/category.slice';
import { SearchBar, LoadingSpinner, EmptyState } from '../../../components/shared';
import PromotionsBanner from './PromotionsBanner';
import ProductCard from '../components/ProductCard';
import StorePageHeader from '../components/StorePageHeader';

const Catalog: React.FC = () => {
    const dispatch = useAppDispatch();
    const history = useHistory();
    const location = useLocation();
    const { items: products, loading } = useAppSelector((state) => state.products);
    const { items: brands } = useAppSelector((state) => state.brand);
    const { items: categories } = useAppSelector((state) => state.category);

    const categoryId = useMemo(() => {
        const raw = new URLSearchParams(location.search).get('category');
        return raw ? Number(raw) : null;
    }, [location.search]);

    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        dispatch(fetchProducts());
        if (brands.length === 0) {
            dispatch(fetchBrands());
        }
        if (categories.length === 0) {
            dispatch(fetchCategory());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);

    const activeProducts = useMemo(
        () => products.filter((p) => p.status_id === 1 || p.status_id === 5),
        [products]
    );

    const categoryProducts = useMemo(
        () => (categoryId ? activeProducts.filter((p) => p.category_id === categoryId) : activeProducts),
        [activeProducts, categoryId]
    );

    const filteredProducts = useMemo(() => {
        const term = searchTerm.toLowerCase();
        if (!term) return categoryProducts;
        return categoryProducts.filter((p) => {
            const brandObj = brands.find((b) => b.id_brand === p.brand_id);
            const brandName = brandObj ? brandObj.brand_name.toLowerCase() : '';
            return p.name.toLowerCase().includes(term) || brandName.includes(term);
        });
    }, [categoryProducts, brands, searchTerm]);

    const getBrandName = (brandId: number) => brands.find((b) => b.id_brand === brandId)?.brand_name ?? '';
    const activeCategoryName = categoryId ? categories.find((c) => c.id_category === categoryId)?.name : null;

    return (
        <div className="store-page">
            <PromotionsBanner />
            <StorePageHeader
                title={activeCategoryName ?? 'Catálogo'}
                action={
                    <SearchBar
                        value={searchTerm}
                        onSearch={setSearchTerm}
                        placeholder="Buscar por nombre, marca..."
                    />
                }
            />
            {categoryId && (
                <button className="store-clear-filter-btn" onClick={() => history.push('/store/catalog')}>
                    Quitar filtro de categoría
                </button>
            )}

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
