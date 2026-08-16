import React, { useEffect } from 'react';
import { IonRouterOutlet, IonIcon } from '@ionic/react';
import { Route, Redirect, useHistory, useLocation } from 'react-router-dom';
import {
    cartOutline,
    heartOutline,
    logInOutline,
    logOutOutline,
    personAddOutline,
    personCircleOutline,
    storefrontOutline,
} from 'ionicons/icons';
import { clearSession, getCurrentToken } from '../../core/current_user';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchCartThunk } from '../../store/slices/cart.slice';
import { fetchWishlistThunk } from '../../store/slices/wishlist.slice';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import Landing from './landing/Landing';
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
    const isLoggedIn = !!getCurrentToken();
    const { items: cartItems } = useAppSelector((state) => state.cart);
    const { items: wishlistItems } = useAppSelector((state) => state.wishlist);

    const cartCount = isLoggedIn ? cartItems.reduce((sum, item) => sum + item.quantity, 0) : 0;
    const wishlistCount = isLoggedIn ? wishlistItems.length : 0;

    useEffect(() => {
        if (!isLoggedIn) return;
        dispatch(fetchCartThunk());
        dispatch(fetchWishlistThunk());
    }, [dispatch, isLoggedIn]);

    const handleLogout = () => {
        clearSession();
        window.location.href = '/';
    };

    return (
        <div className="store-shell">
            <header className="store-header">
                <div className="store-header-inner">
                    <div className="store-logo" onClick={() => history.push('/store/home')}>
                        <IonIcon icon={storefrontOutline} />
                        <span>E-CO</span>
                    </div>

                    <nav className="store-nav">
                        <button
                            className={`store-nav-link ${location.pathname === '/store/home' ? 'active' : ''}`}
                            onClick={() => history.push('/store/home')}
                        >
                            Inicio
                        </button>
                        <button
                            className={`store-nav-link ${location.pathname === '/store/catalog' ? 'active' : ''}`}
                            onClick={() => history.push('/store/catalog')}
                        >
                            Catálogo
                        </button>
                        {isLoggedIn && (
                            <button
                                className={`store-nav-link ${location.pathname === '/store/orders' ? 'active' : ''}`}
                                onClick={() => history.push('/store/orders')}
                            >
                                Mis Pedidos
                            </button>
                        )}
                    </nav>

                    <div className="store-header-actions">
                        {isLoggedIn ? (
                            <>
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
                            </>
                        ) : (
                            <>
                                <button className="store-guest-btn" onClick={() => history.push('/')}>
                                    <IonIcon icon={logInOutline} />
                                    Iniciar sesión
                                </button>
                                <button className="store-guest-btn primary" onClick={() => history.push('/signup')}>
                                    <IonIcon icon={personAddOutline} />
                                    Crear cuenta
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </header>

            <IonRouterOutlet animated={false}>
                <Route exact path="/store">
                    <Redirect to="/store/home" />
                </Route>
                <Route exact path="/store/home">
                    <Landing />
                </Route>
                <Route exact path="/store/catalog">
                    <Catalog />
                </Route>
                <Route exact path="/store/product/:id">
                    <ProductDetail />
                </Route>
                <ProtectedRoute exact path="/store/cart" component={Cart} allowedRoles={['2']} />
                <ProtectedRoute exact path="/store/wishlist" component={Wishlist} allowedRoles={['2']} />
                <ProtectedRoute exact path="/store/orders" component={OrderHistory} allowedRoles={['2']} />
                <ProtectedRoute exact path="/store/account" component={Account} allowedRoles={['2']} />
            </IonRouterOutlet>

            <footer className="store-footer">
                <div className="store-footer-inner">
                    <div className="store-footer-brand">
                        <div className="store-logo">
                            <IonIcon icon={storefrontOutline} />
                            <span>E-CO</span>
                        </div>
                        <p>Comercio electrónico para tu negocio, de punta a punta.</p>
                    </div>

                    <div className="store-footer-col">
                        <h3>Explorar</h3>
                        <button onClick={() => history.push('/store/home')}>Inicio</button>
                        <button onClick={() => history.push('/store/catalog')}>Catálogo</button>
                    </div>

                    <div className="store-footer-col">
                        <h3>Mi cuenta</h3>
                        <button onClick={() => history.push('/store/orders')}>Mis pedidos</button>
                        <button onClick={() => history.push('/store/wishlist')}>Lista de deseos</button>
                        <button onClick={() => history.push('/store/cart')}>Carrito</button>
                        <button onClick={() => history.push('/store/account')}>Mi cuenta</button>
                    </div>
                </div>
                <p className="store-footer-copyright">© {new Date().getFullYear()} E-CO. Todos los derechos reservados.</p>
            </footer>
        </div>
    );
};

export default StoreLayout;
