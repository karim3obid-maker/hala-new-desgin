import {useState} from 'react';
import paymentMethodsImage from '../../assets/land-payment-methods.png';
import {Icon} from '../ui/Icon';
import {AppModal} from '../ui/AppModal';
import {halaLandPolicies} from '../../config/halaLandPolicies';

const policies={
  returns:{title:'سياسة الاسترجاع',text:halaLandPolicies.returns+' تواصل مع دعم المتجر برقم الطلب لمعرفة الشروط وترتيب الإرجاع.'},
  exchange:{title:'سياسة الاستبدال',text:'لطلب الاستبدال، تواصل مع دعم المتجر برقم الطلب وتفاصيل المنتج. يؤكد لك الفريق شروط الاستبدال وتوفر البديل قبل التنفيذ.'},
  shipping:{title:'الشحن والتوصيل',text:halaLandPolicies.shipping+' تتحدد تفاصيل التوصيل حسب عنوانك عند تأكيد الطلب.'},
};
export default function LandStoreFooter({store}){
  const [policy,setPolicy]=useState(null);
  return <><footer className="land-store-footer land-trust-footer">
    <div className="land-footer-trust"><Icon name="shield"/><strong>متجر سعودي مضمون وموثوق</strong></div>
    <img className="land-payment-methods-image" src={paymentMethodsImage} alt="وسائل الدفع: ماستركارد، فيزا، مدى، تابي، تمارا، Apple Pay" loading="lazy"/>
    <small>الدفع أونلاين بانتظار التفعيل في هذه المعاينة</small>
    <nav className="land-footer-policies" aria-label="سياسات المتجر">{Object.entries(policies).map(([key,item])=><button type="button" key={key} onClick={()=>setPolicy(key)}>{item.title}</button>)}</nav>
    {store.showWhatsapp&&store.whatsapp?<a href={'https://wa.me/'+store.whatsapp.replace('+','')} target="_blank" rel="noopener noreferrer"><Icon name="whatsapp"/>تواصل معنا على واتساب</a>:null}
    <div>{[['instagram','Instagram'],['facebook','Facebook'],['tiktok','TikTok']].map(([key,label])=>store[key]&&/^https:\/\//.test(store[key])?<a key={key} href={store[key]} target="_blank" rel="noopener noreferrer">{label}</a>:null)}</div>
    <small>{store.name} · معاينة بواسطة هلا لاند</small>
  </footer><AppModal open={!!policy} setOpen={open=>{if(!open)setPolicy(null)}} title={policies[policy]?.title||'سياسات المتجر'} className="land-policy-dialog"><p>{policies[policy]?.text}</p>{store.showWhatsapp&&store.whatsapp?<a className="land-text-link" href={'https://wa.me/'+store.whatsapp.replace('+','')} target="_blank" rel="noopener noreferrer">تواصل مع دعم المتجر</a>:<p className="land-help">دعم العملاء طوال أيام الأسبوع. تُضاف وسيلة التواصل من إعدادات المتجر.</p>}</AppModal></>;
}
