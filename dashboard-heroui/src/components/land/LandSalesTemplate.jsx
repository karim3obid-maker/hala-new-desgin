import LandReviews from './LandReviews';
import {halaLandPolicies} from '../../config/halaLandPolicies';
import {useMemo,useState} from 'react';
import {getPromotionPreview,previewOriginalPrice} from '../../services/landPromotionPreview';
import {BlobImage} from './LandFields';
import {Icon} from '../ui/Icon';

export function LandTemplateHeader({page,store,onBuy}){
  const c=page.content;
  return <>{c.announcement?<div className="land-sitar-announcement">{c.announcement}</div>:null}{!page.settings.hideHeader?<header className="land-sitar-header"><div className="land-sitar-brand">{store.logo?<BlobImage asset={store.logo} alt={'شعار '+store.name}/>:<Icon name="building-store"/>}<strong>{store.name||'اسم المتجر'}</strong></div><nav aria-label="أقسام صفحة المنتج"><button type="button" onClick={onBuy}>اطلب الآن</button>{c.showInformation!==false?<button type="button" onClick={event=>event.currentTarget.closest('.land-sitar')?.querySelector('#land-information')?.scrollIntoView({block:'start'})}>معلومات المنتج</button>:null}{c.showFaq!==false?<button type="button" onClick={event=>event.currentTarget.closest('.land-sitar')?.querySelector('#land-faq')?.scrollIntoView({block:'start'})}>الأسئلة الشائعة</button>:null}</nav></header>:null}</>;
}
export function LandSalesGallery({page,product,onEdit,empty}){
  const [selected,setSelected]=useState(null);const image=page.images.find(i=>i.id===selected)||page.images[0];
  if(!image)return empty||null;
  if(page.settings.imageLayout==='stacked')return <div className="land-stacked-images" aria-label="صور اللاند المتتابعة">{page.images.map((asset,index)=><div className="land-sitar-main-image" key={asset.id}>{onEdit?<button type="button" className="land-canvas-image" onClick={()=>onEdit(asset.id)} aria-label={'تعديل صورة اللاند '+(index+1)}><BlobImage asset={asset} alt={'تصميم '+(product?.name||page.name)+' — '+(index+1)} loading={index?'lazy':'eager'}/><span>تعديل الصورة</span></button>:<BlobImage asset={asset} alt={(product?.name||page.name)+' — '+(index+1)} width={asset.width} height={asset.height} loading={index?'lazy':'eager'}/>}</div>)}</div>;
  return <div className="land-sitar-gallery"><div className="land-sitar-main-image">{onEdit?<button type="button" className="land-canvas-image" onClick={()=>onEdit(image.id)} aria-label={'تعديل صورة اللاند '+(page.images.indexOf(image)+1)}><BlobImage asset={image} alt={'تصميم '+(product?.name||page.name)}/><span>تعديل الصورة</span></button>:<BlobImage asset={image} alt={product?.name||page.name} width={image.width} height={image.height}/>}</div>{page.images.length>1?<div className="land-sitar-thumbs" role="group" aria-label="صور المنتج">{page.images.map((asset,index)=><button type="button" key={asset.id} aria-label={'عرض الصورة '+(index+1)} aria-pressed={asset.id===image.id} onClick={()=>{setSelected(asset.id);if(onEdit)onEdit(asset.id)}}><BlobImage asset={asset} alt="" loading="lazy"/></button>)}</div>:null}</div>;
}
export function LandProductIntro({page,product,offer,onBuy,editing=false}){
  const promo=useMemo(()=>getPromotionPreview(product?.id||page.id),[product?.id,page.id]);
  const previousPrice=previewOriginalPrice(offer?.price);
  const c=page.content;return <div className="land-sitar-product-intro"><small className="land-sitar-eyebrow">{product?.sku||'تفاصيل المنتج'}</small><h2>{page.name||product?.name||'اختر المنتج من الكتالوج'}</h2>{c.subtitle?<p>{c.subtitle}</p>:null}<div className="land-sitar-price"><div className="land-discount-current"><small>بعد الخصم</small><strong><bdi>{Number(offer?.price||0).toFixed(2)}</bdi> <small>ر.س</small></strong></div>{previousPrice?<div className="land-discount-before"><small>قبل الخصم · توضيحي</small><del><bdi>{previousPrice.toFixed(2)}</bdi> ر.س</del></div>:null}{!page.settings.hideQuantity?<span>{offer?.quantity||'—'} قطعة في العرض</span>:null}</div><div className="land-promotion-demo"><span className="land-promotion-demo-label">بيانات تجريبية للمعاينة</span><div className="land-demo-visitors"><Icon name="users"/><span>عدد زوار الموقع</span><strong className="land-visitors-badge"><bdi>{promo.visitors.toLocaleString('ar-EG')}</bdi><small>زائر</small></strong><small>رقم توضيحي ثابت لهذا المنتج</small></div></div><p className="land-sitar-delivery-note">{halaLandPolicies.freeShipping||page.settings.freeShipping||offer?.freeShipping?'الشحن مجاني لهذا العرض':'السعر للمنتجات؛ رسوم التوصيل لم تُحدّد في المعاينة.'}</p>{c.benefits?<ul className="land-sitar-benefits">{c.benefits.split('\n').filter(line=>line.trim()).map((line,i)=><li key={i}><Icon name="circle-check"/>{line}</li>)}</ul>:null}{onBuy?<button className="land-sitar-primary" type="button" onClick={onBuy}>{editing?'تعديل زر الشراء':page.settings.ctaText}<Icon name="chevron-left"/></button>:null}</div>;
}
export function LandTrustStrip({page,store,onBuy}){
  const services=[['shield','منتج أصلي ١٠٠٪','مع ضمان الجودة'],['wallet','خيارات دفع واضحة',store.cod?'الدفع عند الاستلام متاح':'أونلاين عند التفعيل'],['truck','شحن مجاني','لجميع مناطق المملكة']];
  return <section className="land-service-section land-fixed-sections" aria-label="مزايا المتجر"><h2>لماذا تختار منتجنا؟</h2><div className="land-fixed-benefits">{services.map(([icon,title,text])=><div key={title}><Icon name={icon}/><h3>{title}</h3><p>{text}</p></div>)}</div>{onBuy?<div className="land-section-cta"><button type="button" className="land-sitar-primary" onClick={onBuy}><Icon name="building-store"/>{store.cod?'اطلب الآن - الدفع عند الاستلام':'اطلب الآن'}</button><small>شحن مجاني · إرجاع مجاني خلال ١٤ يومًا</small></div>:null}</section>;
}
export function LandTrustSections({page,store,onBuy,editing=false,onEdit}){
  const c=page.content,contact=store.showWhatsapp&&store.whatsapp?'https://wa.me/'+store.whatsapp.replace('+',''):null;
  const policies=[['privacy','الخصوصية واستخدام البيانات',c.privacy]].filter(([, ,text])=>text?.trim());
  const faq=[
    {question:'هل الشحن مجاني؟',answer:halaLandPolicies.shipping+(c.shipping?' '+c.shipping:' تتحدد تفاصيل التوصيل حسب عنوانك عند تأكيد الطلب.')},
    {question:'كيف أطلب استبدال المنتج؟',answer:'تواصل مع دعم المتجر برقم الطلب وتفاصيل المنتج المطلوب استبداله، وسيؤكد لك الفريق الشروط والتوفر قبل تنفيذ الاستبدال.'},
    {question:'هل يمكنني إرجاع المنتج؟',answer:halaLandPolicies.returns+(c.returns?' '+c.returns:' تواصل مع دعم المتجر برقم الطلب لمعرفة الشروط وترتيب الإرجاع.')},
    {question:'ما طرق الدفع المتاحة؟',answer:'تظهر طرق الدفع المتاحة في نموذج الطلب. يمكنك اختيار الدفع عند الاستلام عند تفعيله؛ الدفع أونلاين في هذه المعاينة بانتظار الربط ولا يجري أي تحصيل.'},
    ...c.faqs.filter(f=>f.question.trim()&&f.answer.trim())
  ];
  return <>{c.showInformation!==false?<section id="land-information" className="land-sitar-information"><div><span className="land-sitar-eyebrow">تفاصيل تهمك قبل الطلب</span><h2>معلومات المنتج</h2>{c.description?<p className="land-sitar-copy">{c.description}</p>:<p className="land-sitar-copy">راجع صور المنتج والعرض المختار قبل إتمام الطلب.</p>}{editing?<button type="button" className="land-text-link" onClick={onEdit}>تعديل المحتوى والثقة</button>:null}</div><div className="land-sitar-policies">{policies.map(([id,title,text])=><details key={id}><summary>{title}<Icon name="chevron-down"/></summary><p>{text}</p></details>)}</div></section>:null}
  {c.showReviews!==false?<LandReviews onBuy={onBuy} rating={page.settings.imageLayout==='stacked'?'٤٫٨':'٤٫٩'}/>:null}
  {c.showFaq!==false?<section className="land-sitar-faq" id="land-faq"><div><span className="land-sitar-eyebrow">الأسئلة والأجوبة</span><h2>الأسئلة الشائعة</h2><p>كل التفاصيل تساعدك تختار براحة.</p>{contact?<a className="land-sitar-primary" href={contact} target="_blank" rel="noopener noreferrer"><Icon name="whatsapp"/>اسأل المتجر على واتساب</a>:null}</div><div>{faq.map((item,i)=><details key={i}><summary>{item.question}<Icon name="chevron-down"/></summary><p>{item.answer}</p></details>)}</div></section>:null}
  {c.sellerName||c.sellerDetails?<section className="land-sitar-seller"><Icon name="building-store"/><div><strong>{c.sellerName||store.name}</strong><p>{c.sellerDetails}</p></div></section>:null}
  </>;
}
