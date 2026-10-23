import {useState} from 'react';
import {Button,Card} from '@heroui/react';
import {AppModal} from '../components/ui/AppModal';
import {Link,useParams} from 'react-router';
import {Icon} from '../components/ui/Icon';
import {accountManager} from '../config/account';

const offers=[
  {id:'100-products',title:'100 بروكت',icon:'package',description:'عرض من هلا كوميرس. تفاصيل العرض ستُضاف هنا عند توفرها.'},
  {id:'hala-partner',title:'Hala Partner',icon:'users',description:'منتجات، براند، دعم تسويقي وتشغيل في السعودية. ركّز على البيع وتكبير شغلك.'},
];
const benefits=[
  ['package','منتجات وأسعار جملة','منتجات بأسعار جملة مميزة، ومساعدة في اختيار المنتجات المناسبة.'],
  ['gift','براند تشتغل عليه','نوفر لك White Label Brand تقدر تشتغل وتسوق عليه.'],
  ['file-import','مواد تسويقية جاهزة','دعم بكريتفات إعلانية، لاندينج بيجز، فيديوهات ومواد تسويقية للمنتجات.'],
  ['chart-bar','دعم حملاتك الإعلانية','مساعدة في الإعلانات الممولة على TikTok وSnapchat وMeta، وتحسين نتائج الحملات.'],
  ['truck','التشغيل في السعودية','نتولى التخزين وتأكيد الطلبات والشحن والتوصيل في السعودية.'],
  ['layout-grid','متابعة شغلك من مكان واحد','سيستم تتابع منه طلباتك ومبيعاتك.'],
];
const rates=[['الشحن','3 دولار','حتى 5 كيلو'],['الطلب الموصّل','2 دولار','لكل طلب موصّل'],['المرتجع','مجانًا','دون رسوم إرجاع'],['الكول سنتر','1.5 دولار','لكل طلب مرفوع'],['رسوم التحصيل COD','15%','من قيمة الطلب المسلّم']];

function PartnerApplication(){
  const [open,setOpen]=useState(false);const [sent,setSent]=useState(false);const [values,setValues]=useState({name:'',orders:'',experience:''});const [errors,setErrors]=useState({});
  const close=()=>{setOpen(false);setValues({name:'',orders:'',experience:''});setErrors({})};
  const update=(key,value)=>{setValues(current=>({...current,[key]:value}));setErrors(current=>({...current,[key]:null}))};
  function submit(event){event.preventDefault();const next={};const count=values.orders.replace(/[٠-٩]/g,digit=>'٠١٢٣٤٥٦٧٨٩'.indexOf(digit));if(values.name.trim().split(/\s+/).length<2)next.name='اكتب اسمك بالكامل.';if(!/^\d{1,7}$/.test(count))next.orders='أدخل متوسط الطلبات كعدد صحيح، ويمكن إدخال صفر.';if(values.experience.trim().length<20)next.experience='اكتب تفاصيل خبرتك في 20 حرفًا على الأقل.';setErrors(next);if(Object.keys(next).length){requestAnimationFrame(()=>document.querySelector('#partner-application [aria-invalid="true"]')?.focus());return}setSent(true)}
  return <><Button onPress={()=>{setValues({name:'',orders:'',experience:''});setErrors({});setSent(false);setOpen(true)}}>التقديم لبرنامج Hala Partner<Icon name="chevron-left"/></Button><AppModal open={open} setOpen={value=>{if(!value)close()}} title="التقديم لبرنامج Hala Partner" footer={sent?<Button onPress={close}>إغلاق</Button>:<><Button variant="secondary" onPress={close}>إلغاء</Button><Button type="submit" form="partner-application">حفظ معاينة الطلب</Button></>}>
  {sent?<div className="partner-application-success" role="status"><Icon name="circle-check"/><h3>تم حفظ معاينة طلبك</h3><p>لم يُرسل الطلب لفريق هلا. ربط التقديم بالنظام الفعلي غير متاح حاليًا.</p><a href={'https://wa.me/'+accountManager.whatsappNumber} target="_blank" rel="noopener noreferrer">تواصل مع فريق هلا</a></div>:<form id="partner-application" className="partner-application" onSubmit={submit} noValidate><p>عرّفنا بنفسك وبشغلك عشان نعرف البرنامج مناسب لك إزاي.</p><div className="draft-form-field"><label htmlFor="partner-name">الاسم بالكامل *</label><input id="partner-name" autoComplete="name" maxLength={120} value={values.name} onChange={e=>update('name',e.target.value)} aria-invalid={!!errors.name} aria-describedby={errors.name?'partner-name-error':undefined}/>{errors.name?<span id="partner-name-error" className="draft-field-error" role="alert">{errors.name}</span>:null}</div><div className="draft-form-field"><label htmlFor="partner-orders">متوسط عدد الطلبات اليومي *</label><input id="partner-orders" inputMode="numeric" maxLength={7} value={values.orders} onChange={e=>update('orders',e.target.value)} placeholder="مثال: 20" aria-invalid={!!errors.orders} aria-describedby={errors.orders?'partner-orders-error':undefined}/>{errors.orders?<span id="partner-orders-error" className="draft-field-error" role="alert">{errors.orders}</span>:null}</div><div className="draft-form-field"><label htmlFor="partner-experience">خبرتك بالتفصيل *</label><textarea id="partner-experience" rows={5} maxLength={3000} value={values.experience} onChange={e=>update('experience',e.target.value)} placeholder="احكي لنا عن خبرتك في التجارة الإلكترونية، الأسواق اللي اشتغلت فيها والمنصات الإعلانية اللي استخدمتها. ولو لسه بتبدأ، قول لنا." aria-invalid={!!errors.experience} aria-describedby={errors.experience?'partner-experience-error':undefined}/>{errors.experience?<span id="partner-experience-error" className="draft-field-error" role="alert">{errors.experience}</span>:null}</div><p className="offer-link-note">معاينة محلية فقط؛ البيانات لا تُرسل ولا تُحفظ بعد إغلاق النموذج.</p></form>}</AppModal></>;
}

function PartnerDetails(){return <>
  <Card className="offer-intro"><span className="offer-eyebrow">برنامج الشراكة من هلا كوميرس</span><h2 dir="ltr">Hala Partner</h2><p>نساعدك تشتغل في السوق السعودي وتكبر شغلك بأقل مخاطرة ممكنة، ونوفر لك المنتجات والتسويق والتشغيل.</p><div className="offer-highlights"><div><strong><bdi>60%</bdi></strong><span>من أرباح المنتجات ليك</span></div><div><strong>1 ريال</strong><span>بونص على كل طلب مؤكّد</span></div></div></Card>
  <section aria-labelledby="partner-benefits"><h2 id="partner-benefits" className="offer-section-title">إيه اللي هتاخده معانا؟</h2><div className="offer-benefits">{benefits.map(([icon,title,body])=><Card className="offer-benefit" key={title}><span className="offer-icon"><Icon name={icon}/></span><div><h3>{title}</h3><p>{body}</p></div></Card>)}</div></section>
  <Card className="offer-prices"><header><Icon name="wallet"/><div><h2>أسعار خاصة لشركاء هلا</h2><p>أسعار الخدمات ضمن برنامج Hala Partner.</p></div></header><dl>{rates.map(([service,price,unit])=><div key={service}><dt>{service}<small>{unit}</small></dt><dd>{price}</dd></div>)}</dl></Card>
  <Card className="offer-start"><div><h2>جاهز تكبّر شغلك مع هلا؟</h2><p>إحنا نوفر لك المنتجات والبراند والدعم التسويقي والتشغيل، وإنت تركز على البيع.</p><p className="offer-link-note">املأ نموذج التقديم، وبعد التسجيل تواصل مع فريق هلا لبدء البرنامج.</p></div><PartnerApplication/></Card>
</>}

export default function OffersPage(){
  const {offerId}=useParams();const offer=offers.find(item=>item.id===offerId);
  if(offerId)return <div className="offers-page"><Link className="offer-back" to="/offers"><Icon name="chevron-right"/>كل عروض هلا</Link>{!offer?<Card className="offer-unavailable"><Icon name="info"/><h2>العرض غير موجود</h2><p>ارجع لقائمة العروض للاطلاع على العروض المتاحة.</p></Card>:offerId==='hala-partner'?<PartnerDetails/>:<Card className="offer-unavailable"><span className="offer-icon"><Icon name="package"/></span><h2>{offer.title}</h2><p>تفاصيل هذا العرض غير متاحة حاليًا.</p></Card>}</div>;
  return <div className="offers-page"><p className="page-description">اكتشف عروض وبرامج هلا، واختار المناسب لشغلك.</p><div className="offers-grid">{offers.map(offer=><Card className="offer-card" key={offer.id}><span className="offer-icon"><Icon name={offer.icon}/></span><span className="offer-eyebrow">{offer.id==='hala-partner'?'برنامج شراكة':'عرض هلا'}</span><h2 dir="auto">{offer.title}</h2><p>{offer.description}</p>{offer.id==='hala-partner'?<div className="offer-card-points"><span><bdi>60%</bdi> من أرباح المنتجات</span><span>1 ريال لكل طلب مؤكّد</span></div>:null}<Link className="button button--secondary offer-details-link" to={'/offers/'+offer.id} aria-label={'تفاصيل '+offer.title}>عرض التفاصيل<Icon name="chevron-left"/></Link></Card>)}</div></div>;
}
