import {useMemo} from 'react';
import LandCountdown from './LandCountdown';
import {getPromotionPreview} from '../../services/landPromotionPreview';

export default function LandOfferBanner({page}){
  const promo=useMemo(()=>getPromotionPreview(page.productId||page.id),[page.productId,page.id]);
  return <div className="land-form-offer-banner"><LandCountdown offerBanner deadline={page.settings.expiresAt||promo.deadline}/>{!page.settings.expiresAt?<small className="land-fixed-demo">عداد توضيحي للمعاينة · الموعد محفوظ ولا يبدأ من جديد بعد انتهائه</small>:null}</div>;
}
