import React, { useEffect } from 'react';
import { IonRouterOutlet, IonIcon } from '@ionic/react';
import { Route, useHistory, useLocation } from 'react-router-dom';
import { cartOutline, heartOutline, logOutOutline, personCircleOutline, storefrontOutline } from 'ionicons/icons';
import { clearSession } from '../../core/current_user';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchCartThunk } from '../../store/slices/cart.slice';
import { fetchWishlistThunk } from '../../store/slices/wishlist.slice';
import Catalog from './catalog/Catalog';
import ProductDetail from './product/ProductDetail';
import Cart from './cart/Cart';
import Wishlist from './wishlist/Wishlist';
import OrderHistory from './orders/OrderHistory';
import Account from './account/Account';
import './store.css';

const StoreLayout: React.FC = () => {
    const dispatch = useAppDispatch();
    const history = useHistory();
    const location = useLocation();
    const { items: cartItems } = useAppSelector((state) => state.cart);
    const { items: wishlistItems } = useAppSelector((state) => state.wishlist);

    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const wishlistCount = wishlistItems.length;

    useEffect(() => {
        dispatch(fetchCartThunk());
        dispatch(fetchWishlistThunk());
    }, [dispatch]);

    const handleLogout = () => {
        clearSession();
        window.location.href = '/';
    };

    return (
        <div className="store-shell">
            <header className="store-header">
                <div className="store-header-inner">
                    <div className="store-logo" onClick={() => history.push('/store/catalog')}>
                        <IonIcon icon={storefrontOutline} />
                        <span>E-CO</span>
                    </div>

                    <nav className="store-nav">
                        <button
                            className={`store-nav-link ${location.pathname === '/store/catalog' ? 'active' : ''}`}
                            onClick={() => history.push('/store/catalog')}
                        >
                            Catálogo
                        </button>
                        <button
                            className={`store-nav-link ${location.pathname === '/store/orders' ? 'active' : ''}`}
                            onClick={() => history.push('/store/orders')}
                        >
                            Mis Pedidos
                        </button>
                    </nav>

                    <div className="store-header-actions">
                        <button className="store-cart-btn" onClick={() => history.push('/store/wishlist')} title="Lista de deseos">
                            <IonIcon icon={heartOutline} />
                            {wishlistCount > 0 && <span className="store-cart-badge">{wishlistCount}</span>}
                        </button>
                        <button className="store-cart-btn" onClick={() => history.push('/store/cart')}>
                            <IonIcon icon={cartOutline} />
                            {cartCount > 0 && <span className="store-cart-badge">{cartCount}</span>}
                        </button>
                        <button className="store-cart-btn" onClick={() => history.push('/store/account')} title="Mi cuenta">
                            <IonIcon icon={personCircleOutline} />
                        </button>
                        <button className="store-logout-btn" onClick={handleLogout} title="Cerrar sesión">
                            <IonIcon icon={logOutOutline} />
                        </button>
                    </div>
                </div>
            </header>

            <IonRouterOutlet animated={false}>
                <Route exact path="/store/catalog">
                    <Catalog />
                </Route>
                <Route exact path="/store/product/:id">
                    <ProductDetail />
                </Route>
                <Route exact path="/store/cart">
                    <Cart />
                </Route>
                <Route exact path="/store/wishlist">
                    <Wishlist />
                </Route>
                <Route exact path="/store/orders">
                    <OrderHistory />
                </Route>
                <Route exact path="/store/account">
                    <Account />
                </Route>
            </IonRouterOutlet>
        </div>
    );
};

export default StoreLayout;
