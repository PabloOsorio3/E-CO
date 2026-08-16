import React, { useEffect, useMemo, useState } from 'react';
import { IonIcon } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import {
    pricetagOutline,
    hardwareChipOutline,
    shirtOutline,
    homeOutline,
    arrowForwardOutline,
} from 'ionicons/icons';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchProducts } from '../../../store/slices/product.slice';
import { fetchBrands } from '../../../store/slices/brand.slice';
import { fetchCategory } from '../../../store/slices/category.slice';
import { fetchPromotions } from '../../../store/slices/promotion.slice';
import { getBestSellingProducts } from '../../../api/admin/get/get_best_selling_products';
import { LoadingSpinner } from '../../../components/shared';
import ProductCard from '../components/ProductCard';
import type { ProductResponse } from '../../../interface/product.interface';
import type { BestSellingProductItem } from '../../../interface/dashboard.interface';
import './landing.css';

const categoryIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('electr')) return hardwareChipOutline;
    if (n.includes('ropa') || n.includes('moda') || n.includes('accesor')) return shirtOutline;
    if (n.includes('hogar') || n.includes('jard')) return homeOutline;
    return pricetagOutline;
};

const Landing: React.FC = () => {
    const dispatch = useAppDispatch();
    const history = useHistory();
    const { items: products, loading } = useAppSelector((state) => state.products);
    const { items: brands } = useAppSelector((state) => state.brand);
    const { items: categories } = useAppSelector((state) => state.category);
    const { items: promotions } = useAppSelector((state) => state.promotions);

    const [heroIndex, setHeroIndex] = useState(0);
    const [bestSelling, setBestSelling] = useState<BestSellingProductItem[]>([]);
    const [bestSellingLoading, setBestSellingLoading] = useState(true);

    useEffect(() => {
        dispatch(fetchProducts());
        if (brands.length === 0) dispatch(fetchBrands());
        if (categories.length === 0) dispatch(fetchCategory());
        dispatch(fetchPromotions());
        getBestSellingProducts(8)
            .then(setBestSelling)
            .catch(() => setBestSelling([]))
            .finally(() => setBestSellingLoading(false));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);

    const activePromotions = useMemo(() => promotions.filter((p) => p.active), [promotions]);
    const activeProducts = useMemo(
        () => products.filter((p) => p.status_id === 1 || p.status_id === 5),
        [products]
    );
    const featuredProducts = useMemo(() => activeProducts.slice(0, 8), [activeProducts]);

    const bestSellingProducts = useMemo(
        () =>
            bestSelling
                .map((item) => activeProducts.find((p) => p.id_product === item.id_product))
                .filter((p): p is ProductResponse => !!p),
        [bestSelling, activeProducts]
    );

    const getBrandName = (brandId: number) => brands.find((b) => b.id_brand === brandId)?.brand_name ?? '';

    useEffect(() => {
        if (activePromotions.length < 2) return;
        const timer = setInterval(() => {
            setHeroIndex((i) => (i + 1) % activePromotions.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [activePromotions.length]);

    const currentPromo = activePromotions[heroIndex] ?? null;

    return (
        <div className="store-page landing-page">
            <section className="landing-hero">
                {currentPromo ? (
                    <>
                        <span className="landing-hero-eyebrow">Oferta activa</span>
                        <h1>{currentPromo.name}</h1>
                        <p className="landing-hero-discount">
                            -{currentPromo.discount_percentage}% en productos seleccionados
                        </p>
                    </>
                ) : (
                    <>
                        <span className="landing-hero-eyebrow">Bienvenido</span>
                        <h1>Todo lo que buscás, en un solo lugar</h1>
                        <p>Explorá el catálogo completo y encontrá lo que necesitás.</p>
                    </>
                )}
                <button className="landing-hero-cta" onClick={() => history.push('/store/catalog')}>
                    Ver catálogo
                </button>
                {activePromotions.length > 1 && (
                    <div className="landing-hero-dots">
                        {activePromotions.map((_, i) => (
                            <button
                                key={i}
                                className={`landing-hero-dot ${i === heroIndex ? 'active' : ''}`}
                                onClick={() => setHeroIndex(i)}
                            />
                        ))}
                    </div>
                )}
            </section>

            {categories.length > 0 && (
                <section className="landing-section">
                    <div className="landing-section-header">
                        <h2>Explorá por categoría</h2>
                    </div>
                    <div className="landing-category-row">
                        {categories.map((cat) => (
                            <button
                                key={cat.id_category}
                                className="landing-category-pill"
                                onClick={() => history.push(`/store/catalog?category=${cat.id_category}`)}
                            >
                                <span className="landing-category-icon">
                                    <IonIcon icon={categoryIcon(cat.name)} />
                                </span>
                                <span>{cat.name}</span>
                            </button>
                        ))}
                    </div>
                </section>
            )}

            <section className="landing-section">
                <div className="landing-section-header">
                    <h2>Destacados</h2>
                    <button className="landing-see-all" onClick={() => history.push('/store/catalog')}>
                        Ver todo <IonIcon icon={arrowForwardOutline} />
                    </button>
                </div>
                {loading && products.length === 0 ? (
                    <LoadingSpinner text="Cargando productos..." />
                ) : featuredProducts.length === 0 ? (
                    <p className="landing-empty-hint">Todavía no hay productos disponibles.</p>
                ) : (
                    <div className="store-product-grid">
                        {featuredProducts.map((product) => (
                            <ProductCard
                                key={product.id_product}
                                product={product}
                                brandName={getBrandName(product.brand_id)}
                                onOpen={() => history.push(`/store/product/${product.id_product}`)}
                            />
                        ))}
                    </div>
                )}
            </section>

            {!bestSellingLoading && bestSellingProducts.length > 0 && (
                <section className="landing-section">
                    <div className="landing-section-header">
                        <h2>Más vendidos</h2>
                    </div>
                    <div className="store-product-grid">
                        {bestSellingProducts.map((product) => {
                            const stat = bestSelling.find((b) => b.id_product === product.id_product);
                            return (
                                <ProductCard
                                    key={product.id_product}
                                    product={product}
                                    brandName={getBrandName(product.brand_id)}
                                    onOpen={() => history.push(`/store/product/${product.id_product}`)}
                                    badge={stat ? `${stat.quantity_sold} vendidos` : undefined}
                                />
                            );
                        })}
                    </div>
                </section>
            )}
        </div>
    );
};

export default Landing;
