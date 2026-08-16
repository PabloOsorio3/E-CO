import React from 'react';
import { IonIcon } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { arrowBackOutline } from 'ionicons/icons';

interface StorePageHeaderProps {
    title?: string;
    backTo?: string;
    backLabel?: string;
    action?: React.ReactNode;
}

const StorePageHeader: React.FC<StorePageHeaderProps> = ({ title, backTo, backLabel = 'Volver', action }) => {
    const history = useHistory();

    return (
        <>
            {backTo && (
                <button className="store-back-link" onClick={() => history.push(backTo)}>
                    <IonIcon icon={arrowBackOutline} />
                    {backLabel}
                </button>
            )}
            {title && (
                <div className="store-page-header">
                    <h1>{title}</h1>
                    {action}
                </div>
            )}
        </>
    );
};

export default StorePageHeader;
