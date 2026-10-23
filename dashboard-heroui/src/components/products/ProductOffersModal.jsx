import {useState} from 'react';
import {Button} from '@heroui/react';
import {AppModal} from '../ui/AppModal';
import {Icon,IconButton} from '../ui/Icon';
export const normalizeNumber=value=>String(value).trim().replace(/[٠-٩]/g,char=>'٠١٢٣٤٥٦٧٨٩'.indexOf(char)).replace(/[۰-۹]/g,char=>'۰۱۲۳۴۵۶۷۸۹'.indexOf(char)).replace(/٫/g,'.');
export function validateOffers(rows,cost){
  return rows.map((row,index)=>{const quantity=Number(normalizeNumber(row.quantity)),price=Number(normalizeNumber(row.price));return {
    quantity:!/^\d+$/.test(normalizeNumber(row.quantity))||!Number.isSafeInteger(quantity)||quantity<1?'أدخل عدد قطع صحيحًا أكبر من صفر.':rows.some((other,i)=>i!==index&&Number(normalizeNumber(other.quantity))===quantity)?'عدد القطع مكرر في عرض آخر.':'',
    price:!/^\d+(\.\d{1,2})?$/.test(normalizeNumber(row.price))||!Number.isFinite(price)||price<=0?'أدخل سعر بيع فعليًا، بحد أقصى منزلتين عشريتين.':Number.isSafeInteger(quantity)&&quantity>0&&Math.round(price*100)<Math.round(quantity*cost*100)?`إجمالي سعر العرض لا يقل عن ${(quantity*cost).toFixed(2)} ر.س (تكلفة القطع).`:'',
  }})
}
export default function ProductOffersModal({product,initialOffers,onClose,onSave}){
  const [rows,setRows]=useState(()=>initialOffers?.map(offer=>({quantity:String(offer.quantity),price:String(offer.price)}))||[1,2,3].map(quantity=>({quantity:String(quantity),price:''})));
  const [submitted,setSubmitted]=useState(false);
  const errors=validateOffers(rows,product.cost);
  function update(index,key,value){setRows(current=>current.map((row,i)=>i===index?{...row,[key]:value}:row))}
  function submit(event){event.preventDefault();setSubmitted(true);const first=errors.findIndex(error=>error.quantity||error.price);if(first!==-1){document.getElementById(`offer-${first}-${errors[first].quantity?'quantity':'price'}`)?.focus();return}onSave(rows.map(row=>({quantity:Number(normalizeNumber(row.quantity)),price:Number(normalizeNumber(row.price))})).sort((a,b)=>a.quantity-b.quantity))}
  return <AppModal open setOpen={open=>{if(!open)onClose()}} title={initialOffers?'تعديل عروض المنتج':'إضافة المنتج إلى قائمتي'} footer={<><Button variant="secondary" onPress={onClose}>رجوع</Button><Button className={!initialOffers?"product-add-button":undefined} type="submit" form="product-offers-form"><Icon name="circle-check"/>{initialOffers?'حفظ التعديلات':'حفظ العروض وإضافة المنتج'}</Button></>}>
    {product.testing?<div className="catalog-testing-notice" role="note"><Icon name="warning"/><p>منتج اختبار بدون مخزون؛ سيتم خصم تكاليف تأكيد الطلبات (الكونفرميشن).</p></div>:null}
    <div className="offer-product-summary"><img src={product.image} alt=""/><div><strong>{product.name}</strong><span>تكلفة القطعة <bdi dir="ltr">{product.cost.toFixed(2)}</bdi> ر.س</span></div></div>
    <div className="offer-explanation"><Icon name="headset"/><div><h3>عروضك هي أداة الكول سنتر للأب سيل</h3><p>فريق الكول سنتر بيستخدم العروض دي أثناء تأكيد الطلب عشان يقترح على العميل كمية أكبر. اكتب عدد القطع وأسعار البيع الفعلية اللي تقدر تلتزم بيها؛ دقة عروضك بتساعد الفريق يحقق لك أب سيل أعلى.</p></div></div>
    <form id="product-offers-form" className="product-offers-form" onSubmit={submit} noValidate>
      <div className="offers-form-heading"><h3>عروض البيع</h3><span>{rows.length} من 5 عروض</span></div>
      <p className="offers-price-help">السعر هو إجمالي بيع العرض بكل قطعه بالريال، وليس سعر القطعة الواحدة.</p>
      {rows.map((row,index)=>{const quantity=Number(normalizeNumber(row.quantity)),price=Number(normalizeNumber(row.price));return <fieldset className="offer-row" key={index}><legend>العرض {index+1}</legend><div className="offer-fields"><label htmlFor={`offer-${index}-quantity`}>عدد القطع<input id={`offer-${index}-quantity`} inputMode="numeric" value={row.quantity} onChange={event=>update(index,'quantity',event.target.value)} aria-invalid={submitted&&!!errors[index].quantity} aria-describedby={submitted&&errors[index].quantity?`offer-${index}-quantity-error`:undefined}/>{submitted&&errors[index].quantity?<small id={`offer-${index}-quantity-error`} className="offer-error">{errors[index].quantity}</small>:null}</label><label htmlFor={`offer-${index}-price`}>إجمالي سعر البيع <span>(ر.س)</span><input id={`offer-${index}-price`} inputMode="decimal" placeholder="أدخل سعر العرض" value={row.price} onChange={event=>update(index,'price',event.target.value)} aria-invalid={submitted&&!!errors[index].price} aria-describedby={submitted&&errors[index].price?`offer-${index}-price-error`:undefined}/>{submitted&&errors[index].price?<small id={`offer-${index}-price-error`} className="offer-error">{errors[index].price}</small>:null}</label>{index>=3?<IconButton icon="trash" label={`حذف العرض ${index+1}`} onPress={()=>setRows(current=>current.filter((_,i)=>i!==index))}/>:null}</div>{!errors[index].quantity&&!errors[index].price?<p className="offer-unit-price">سعر القطعة: <bdi dir="ltr">{(price/quantity).toFixed(2)}</bdi> ر.س</p>:null}</fieldset>})}
      <Button type="button" size="sm" variant="secondary" className="add-offer-button" isDisabled={rows.length>=5} onPress={()=>setRows(current=>[...current,{quantity:String(Math.max(...current.map(row=>Number(normalizeNumber(row.quantity))||0))+1),price:''}])}><Icon name="plus"/>{rows.length>=5?'وصلت للحد الأقصى — 5 عروض':'إضافة عرض'}</Button>
      {submitted&&errors.some(error=>error.quantity||error.price)?<p role="alert" className="offer-error">راجع الحقول الموضحة قبل حفظ العروض.</p>:null}
      <small className="offers-preview-note">حفظ محلي للمعاينة خلال الجلسة فقط؛ لا تُرسل العروض إلى الكول سنتر حاليًا.</small>
    </form>
  </AppModal>
}
