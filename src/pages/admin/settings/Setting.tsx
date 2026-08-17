import React from 'react';
import { IonPage, IonContent } from '@ionic/react';
import { useHistory, useParams } from 'react-router-dom';
import { AdminTopBar } from '../../../components/shared';
import Category from './category/Category';
import Subcategory from './subcategory/Subcategory';
import Brand from './brand/Brand';
import StatusPage from './status/StatusPage';
import '../../css/settings.css';

type SettingsTab = 'category' | 'subcategory' | 'brand' | 'status';

const TABS: { key: SettingsTab; label: string }[] = [
    { key: 'category', label: 'Categorías' },
    { key: 'subcategory', label: 'Subcategorías' },
    { key: 'brand', label: 'Marcas' },
    { key: 'status', label: 'Estados' },
];

const PANELS: Record<SettingsTab, React.FC> = {
    category: Category,
    subcategory: Subcategory,
    brand: Brand,
    status: StatusPage,
};

const Setting: React.FC = () => {
    const history = useHistory();
    const { tab } = useParams<{ tab?: string }>();
    const activeTab: SettingsTab = TABS.some((t) => t.key === tab) ? (tab as SettingsTab) : 'category';
    const ActivePanel = PANELS[activeTab];

    return (
        <IonPage>
            <AdminTopBar title="Configuración" />
            <IonContent className="settings-page">
                <div className="settings-tabs">
                    {TABS.map((t) => (
                        <button
                            key={t.key}
                            className={`settings-tab ${activeTab === t.key ? 'active' : ''}`}
                            onClick={() => history.push(`/admin/settings/${t.key}`)}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                <ActivePanel />
            </IonContent>
        </IonPage>
    );
};

export default Setting;
