import {halaLandPolicies} from '../../config/halaLandPolicies';
import {Icon} from '../ui/Icon';
import {offerPresentation} from '../../services/landOfferCopy';

export default function LandOfferPicker({page,selectedId,onSelect,preview=false}){
  function content(offer){
    const {quantity,price,original,percent:saving,copy}=offerPresentation(offer,page.offers);
    return <>{quantity>=2?<span className="land-bundle-ribbon">{quantity===2?'عرض القطعتين':quantity===3?'عرض الثلاث قطع':'عرض الكمية'}</span>:null}<span className="land-bundle-copy"><strong>{copy.ctaText}</strong>{saving>0?<small className="land-bundle-saving">توفير {saving}%</small>:null}{copy.helperText?<small>{copy.helperText}</small>:null}{copy.helperDescription?<small>{copy.helperDescription}</small>:null}{!offer.hideUnitPrice?<small>سعر القطعة: <bdi>{(price/quantity).toFixed(2)}</bdi> ر.س</small>:null}{halaLandPolicies.freeShipping||offer.freeShipping?<small className="land-free-shipping">شحن مجاني</small>:null}</span><span className="land-bundle-price"><b><bdi>{price>0?price.toFixed(2):'—'}</bdi> <small>ر.س</small></b>{saving>0?<del><bdi>{original.toFixed(2)}</bdi> ر.س</del>:null}</span></>;
  }
  const classFor=offer=>'land-bundle-card '+(Number(offer.quantity)===2?'is-duo ':Number(offer.quantity)>=3?'is-trio ':'')+(selectedId===offer.id?'selected':'');
  if(preview)return <div className="land-bundle-offers"><span className="land-bundle-heading"><Icon name="package"/>اختر العرض المناسب لك</span>{page.offers.map(offer=><span key={offer.id} className={classFor(offer)}>{content(offer)}</span>)}</div>;
  return <fieldset className="land-preview-offers land-bundle-offers"><legend><Icon name="package"/>اختر العرض المناسب لك</legend>{page.offers.map(offer=><label key={offer.id} className={classFor(offer)}><input type="radio" name="offer" checked={selectedId===offer.id} onChange={()=>onSelect(offer.id)} aria-label={offer.ctaText||`${offer.quantity} قطعة · ${offer.price} ر.س`}/>{content(offer)}</label>)}</fieldset>;
}
