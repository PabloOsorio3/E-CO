import { IonApp, IonRouterOutlet, IonSplitPane, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route } from 'react-router-dom';
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
import { MenuAdmin } from './pages/admin/menu/menuAdmin';
import './pages/css/app.css';

setupIonicReact();

const App: React.FC = () => {
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
                <Route path="/admin/home">
                  <Home />
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
