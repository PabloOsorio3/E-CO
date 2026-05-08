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
import Login from './pages/login/Login';
import Home from './pages/admin/home/Home';
import Products from './pages/admin/products/Products';
import { MenuAdmin } from './pages/admin/menu/MenuAdmin';
import './pages/css/app.css';
import { useAppInit } from './hooks/useAppInit';
import Setting from './pages/admin/settings/Setting';
import Categories from './pages/admin/settings/categories/Categories';

setupIonicReact();

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

          <Route path="/admin">
            <IonSplitPane contentId="admin-content">
              <MenuAdmin />
              <IonRouterOutlet id="admin-content" animated={false}>
                <Route exact path="/admin">
                  <Redirect to="/admin/home" />
                </Route>
                <Route path="/admin/home">
                  <Home />
                </Route>
                <Route path="/admin/products">
                  <Products />
                </Route>
                <Route path="/admin/settings">
                  <Setting />
                </Route>
                <Route path="/admin/settings-categories">
                  <Categories />
                </Route>
              </IonRouterOutlet>
            </IonSplitPane>
          </Route>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
