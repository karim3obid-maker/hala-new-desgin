import {Card} from '@heroui/react';
import {Link,useOutletContext,useParams} from 'react-router';
import {useImportOrders} from '../context/ImportOrdersContext';
import {Icon,IconButton} from '../components/ui/Icon';
import {CountryLabel} from '../components/imports/ImportCountries';

export default function ImportOrderThankYouPage(){
  const {importId}=useParams(),{records}=useImportOrders(),{notify}=useOutletContext();
  const order=records.find(record=>record.id===importId);
  if(!order)return <Card className="empty-state"><Icon name="file-import"/><h2>بيانات الطلب غير متاحة</h2><p>طلبات المعاينة محفوظة خلال الجلسة فقط. يمكنك إضافة طلب استيراد جديد.</p><Link className="platform-link" to="/import-orders">الرجوع لطلبات الاستيراد</Link></Card>;
  async function copy(){try{await navigator.clipboard.writeText(order.id);notify('تم نسخ رقم طلب الاستيراد')}catch{notify('تعذّر النسخ. رقم الطلب: '+order.id)}}
  return <div className="import-thank-page"><Card className="import-thank-card"><span className="import-thank-icon"><Icon name="circle-check"/></span><p className="import-thank-eyebrow">طلب الاستيراد</p><h2>شكرًا لك، تمت إضافة طلبك</h2><p className="import-thank-description">بيانات منتجك جاهزة، ويمكنك مراجعتها ومتابعة تفاصيلها من صفحة الطلب.</p><div className="import-thank-id"><span>رقم الطلب</span><bdi dir="ltr">{order.id}</bdi><IconButton icon="copy" label="نسخ رقم طلب الاستيراد" onPress={copy}/></div>
    <div className="import-thank-product"><img src={order.images[0].src} alt=""/><div><h3>{order.name}</h3><p>{order.quantity} قطعة · {order.shippingLabel}</p></div></div>
    <div className="import-thank-route"><CountryLabel code={order.originCode} name={order.origin}/><Icon name="chevron-left"/><CountryLabel name={order.destination}/></div>
    <div className="import-thank-next"><Icon name="file-import"/><div><h3>كل تفاصيل طلبك في مكان واحد</h3><p>افتح صفحة الطلب لمراجعة الصور والكمية والشحن، أو ارجع إلى قائمة طلباتك.</p></div></div>
    <p className="import-preview-banner"><Icon name="info"/><span>تم الحفظ في المعاينة المحلية فقط، ولم يُرسل طلب فعلي إلى فريق الاستيراد. البيانات متاحة حتى تحديث الصفحة.</span></p>
    <div className="import-thank-actions"><Link className="import-primary-link" to={'/import-orders/'+order.id}>عرض تفاصيل الطلب<Icon name="chevron-left"/></Link><Link className="import-secondary-link" to="/import-orders">الرجوع للطلبات</Link></div><Link className="import-thank-another" to="/import-orders/new"><Icon name="plus"/>إضافة طلب آخر</Link>
  </Card></div>;
}
