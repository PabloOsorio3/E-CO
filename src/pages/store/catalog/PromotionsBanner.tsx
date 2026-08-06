import React, { useEffect } from 'react';
import { IonIcon } from '@ionic/react';
import { pricetagOutline } from 'ionicons/icons';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchPromotions } from '../../../store/slices/promotion.slice';

const PromotionsBanner: React.FC = () => {
    const dispatch = useAppDispatch();
    const { items: promotions } = useAppSelector((state) => state.promotions);

    useEffect(() => {
        dispatch(fetchPromotions());
    }, [dispatch]);

    const activePromotions = promotions.filter((p) => p.active);

    if (activePromotions.length === 0) return null;

    return (
        <div className="store-promotions-banner">
            {activePromotions.map((promo) => (
                <div className="store-promotion-pill" key={promo.id_promotion}>
                    <IonIcon icon={pricetagOutline} />
                    <span>{promo.name}</span>
                    <span className="store-promotion-discount">-{promo.discount_percentage}%</span>
                </div>
            ))}
        </div>
    );
};

export default PromotionsBanner;
