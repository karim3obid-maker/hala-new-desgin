import {Button} from '@heroui/react';
import {Field,Toggle} from './LandFields';
import {Icon} from '../ui/Icon';
import {offerPresentation} from '../../services/landOfferCopy';
export default function LandOffersEditor({offers,onChange,error}){
  function update(index,key,value){onChange(offers.map((offer,i)=>i===index?{...offer,[key]:value}:offer))}
  return <div className="land-offers-editor">
    <div className="land-offers-intro"><Icon name="package"/><div><strong>حوّل الكمية إلى سبب للشراء</strong><p>نصوص جاهزة تتغير مع الكمية والسعر. التوفير محسوب من عرض القطعة الواحدة، ويمكنك تعديل كل نص.</p></div><span><bdi dir="ltr">{offers.length} / 5</bdi></span></div>
    {offers.map((offer,index)=>{const view=offerPresentation(offer,offers);return <fieldset className="land-offer-editor" key={offer.id}>
      <legend>العرض {index+1}</legend>
      <div className="land-offer-editor-heading"><span>الكمية والسعر</span>{offers.length>1?<Button size="sm" variant="ghost" aria-label={'حذف العرض '+(index+1)} onPress={()=>onChange(offers.filter((_,i)=>i!==index))}><Icon name="trash"/>حذف</Button>:null}</div>
      <div className="land-grid"><Field label={'عدد قطع العرض '+(index+1)} value={offer.quantity} onChange={value=>update(index,'quantity',value)} inputMode="numeric" maxLength={3}/><Field label={'إجمالي سعر العرض '+(index+1)+' (ر.س)'} value={offer.price} onChange={value=>update(index,'price',value)} inputMode="decimal" maxLength={9}/></div>
      <div className="land-offer-sales-preview" aria-label={'معاينة محتوى العرض '+(index+1)}><div><small>كما يظهر للعميل</small><strong>{view.copy.ctaText}</strong><span>{view.copy.helperText}</span><p>{view.copy.helperDescription}</p></div>{view.valid?<div className="land-offer-sales-price"><b><bdi>{view.price.toFixed(2)}</bdi> ر.س</b>{view.saving>0?<><del><bdi>{view.original.toFixed(2)}</bdi> ر.س</del><small>توفير <bdi>{view.percent}</bdi>%</small></>:null}</div>:null}</div>
      <div className="land-offer-editor-heading"><span>المحتوى البيعي · اختياري، نكمل الفارغ تلقائيًا</span><Button size="sm" variant="secondary" onPress={()=>onChange(offers.map((item,i)=>i===index?{...item,...view.suggested}:item))}>استخدام النص المقترح</Button></div>
      <div className="land-offer-copy-grid"><Field label={'عنوان الشراء للعرض '+(index+1)} value={offer.ctaText} onChange={value=>update(index,'ctaText',value)} maxLength={160} placeholder={view.suggested.ctaText}/><Field label={'عبارة تشجيعية للعرض '+(index+1)} value={offer.helperText} onChange={value=>update(index,'helperText',value)} maxLength={160} placeholder={view.suggested.helperText}/><Field label={'تفاصيل قيمة العرض '+(index+1)} value={offer.helperDescription} onChange={value=>update(index,'helperDescription',value)} maxLength={160} placeholder={view.suggested.helperDescription}/></div>
      <div className="land-offer-toggles"><Toggle label={'إخفاء سعر القطعة للعرض '+(index+1)} checked={offer.hideUnitPrice} onChange={value=>update(index,'hideUnitPrice',value)}/><Toggle label={'شحن مجاني للعرض '+(index+1)} checked={offer.freeShipping} onChange={value=>update(index,'freeShipping',value)}/></div>
      {!offer.hideUnitPrice&&view.valid?<p className="land-help">سعر القطعة: <bdi dir="ltr">{(view.price/view.quantity).toFixed(2)}</bdi> ر.س</p>:null}
    </fieldset>})}
    {error?<p className="land-error" role="alert">{error}</p>:null}<Button variant="secondary" size="sm" isDisabled={offers.length>=5} onPress={()=>onChange([...offers,{id:crypto.randomUUID(),quantity:'',price:'',ctaText:'',helperText:'',helperDescription:'',hideUnitPrice:false,freeShipping:false}])}><Icon name="plus"/>إضافة عرض{offers.length>=5?' · الحد الأقصى 5':''}</Button>
  </div>;
}
