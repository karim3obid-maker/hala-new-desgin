import {halaLandPolicies} from '../../config/halaLandPolicies';
import {Icon} from '../ui/Icon';

export default function LandOfferPicker({page,selectedId,onSelect,preview=false}){
  const single=page.offers.find(offer=>Number(offer.quantity)===1&&Number(offer.price)>0);
  function content(offer){
    const quantity=Number(offer.quantity),price=Number(offer.price),original=single?Number(single.price)*quantity:0;
    const saving=original>price?Math.round((original-price)/original*100):0;
    return <>{quantity>=2?<span className="land-bundle-ribbon">{quantity===2?'عرض القطعتين':quantity===3?'عرض الثلاث قطع':'عرض الكمية'}</span>:null}<span className="land-bundle-copy"><strong>{offer.ctaText||(page.settings.hideQuantity?'عرض المنتج':quantity===1?'اشتري قطعة واحدة':quantity===2?'اشتري قطعتين':quantity===3?'اشتري ثلاث قطع':`اشتري ${quantity} قطع`)}</strong>{saving>0?<small className="land-bundle-saving">توفير {saving}%</small>:null}{offer.helperText?<small>{offer.helperText}</small>:null}{offer.helperDescription?<small>{offer.helperDescription}</small>:null}{!offer.hideUnitPrice&&!page.settings.hideQuantity?<small>سعر القطعة: <bdi>{(price/quantity).toFixed(2)}</bdi> ر.س</small>:null}{halaLandPolicies.freeShipping||page.settings.freeShipping||offer.freeShipping?<small className="land-free-shipping">شحن مجاني</small>:null}</span><span className="land-bundle-price"><b><bdi>{price>0?price.toFixed(2):'—'}</bdi> <small>ر.س</small></b>{saving>0?<del><bdi>{original.toFixed(2)}</bdi> ر.س</del>:null}</span></>;
  }
  const classFor=offer=>'land-bundle-card '+(Number(offer.quantity)===2?'is-duo ':Number(offer.quantity)>=3?'is-trio ':'')+(selectedId===offer.id?'selected':'');
  if(preview)return <div className="land-bundle-offers"><span className="land-bundle-heading"><Icon name="package"/>اختر العرض المناسب لك</span>{page.offers.map(offer=><span key={offer.id} className={classFor(offer)}>{content(offer)}</span>)}</div>;
  return <fieldset className="land-preview-offers land-bundle-offers"><legend><Icon name="package"/>اختر العرض المناسب لك</legend>{page.offers.map(offer=><label key={offer.id} className={classFor(offer)}><input type="radio" name="offer" checked={selectedId===offer.id} onChange={()=>onSelect(offer.id)} aria-label={offer.ctaText||`${offer.quantity} قطعة · ${offer.price} ر.س`}/>{content(offer)}</label>)}</fieldset>;
}
