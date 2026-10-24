import {Button} from '@heroui/react';
import {Icon} from '../ui/Icon';

export default function LandStickyPurchaseBar({offer,store,onBuy,expired=false,staticBar=false}){
  const price=Number(offer?.price);
  return <div className={'land-sticky-cta land-purchase-bar'+(staticBar?' is-static':'')}>
    <div className="land-purchase-price"><span className="land-purchase-payment"><Icon name="wallet"/>{store.cod?'الدفع عند الاستلام متاح':'الدفع الإلكتروني · غير مفعّل'}</span><strong><bdi>{Number.isFinite(price)&&price>0?new Intl.NumberFormat('en-US',{maximumFractionDigits:2}).format(price):'—'}</bdi><small> ر.س</small></strong></div>
    <Button className="land-purchase-button" isDisabled={expired} onPress={onBuy}><Icon name="building-store"/><span>{expired?'انتهت مدة العرض':store.cod?'اطلب الآن - الدفع عند الاستلام':'اطلب الآن'}</span></Button>
  </div>;
}
