import { IonApp, IonRouterOutlet, IonSplitPane, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route, Redirect } from 'react-router-dom';
import { Toaster } from 'sonner';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

// Importing Custom Pages
import Login from './pages/login/Login.tsx';
import Home from './pages/admin/home/Home.tsx';
import Products from './pages/admin/products/Products.tsx';
import AddProduct from './pages/admin/products/AddProduct.tsx';
import Orders from './pages/admin/orders/Orders.tsx';
import { MenuAdmin } from './pages/admin/menu/menuAdmin.tsx';
import './pages/css/app.css';
import { useAppInit } from './hooks/useAppInit';
import Setting from './pages/admin/settings/Setting.tsx';
import Transaction from './pages/admin/transaction/Transaction.tsx';
import Signup from './pages/signup/Signup.tsx';
import Customer from './pages/admin/customer/Customer.tsx';
import Profile from './pages/admin/profile/Profile.tsx';
import ProtectedRoute from './components/auth/ProtectedRoute.tsx';


setupIonicReact();

// Layout de las rutas /admin/*, protegido por sesión via ProtectedRoute.
const AdminLayout: React.FC = () => (
  <IonSplitPane contentId="admin-content">
    <MenuAdmin />
    <IonRouterOutlet id="admin-content" animated={false}>
      <Route exact path="/admin">
        <Redirect to="/admin/home" />
      </Route>
      <Route path="/admin/home">
        <Home />
      </Route>
      <Route exact path="/admin/products">
        <Products />
      </Route>
      <Route path="/admin/products/add">
        <AddProduct />
      </Route>
      <Route path="/admin/orders">
        <Orders />
      </Route>
      <Route exact path="/admin/settings/:tab?">
        <Setting />
      </Route>
      <Route exact path="/admin/transaction">
        <Transaction />
      </Route>
      <Route path="/admin/customers">
        <Customer />
      </Route>
      <Route path="/admin/profile">
        <Profile />
      </Route>
    </IonRouterOutlet>
  </IonSplitPane>
);

const App: React.FC = () => {
  useAppInit();

  return (
    <IonApp>
      <IonReactRouter>
        <Toaster richColors position="top-right" />
        <IonRouterOutlet id="main" animated={false}>
          <Route exact path="/">
            <Login />
          </Route>
          <Route exact path="/signup">
            <Signup />
          </Route>

          <ProtectedRoute path="/admin" component={AdminLayout} />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
