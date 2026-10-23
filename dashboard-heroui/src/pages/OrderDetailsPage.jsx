import {Button,Card} from '@heroui/react';
import {Link,useParams,useOutletContext,useNavigate} from 'react-router';
import {Icon,IconButton} from '../components/ui/Icon';
import {OrderProgress,getOrderStage} from '../components/ui/OrderProgress';
import {MetricRows} from '../components/dashboard/Metrics';
import {useOrdersPreview} from '../context/OrdersPreviewContext';
import {referenceOrder} from '../data/orderDetail';
import {screenshotOrders} from '../data/orders';
import {draftOrders} from '../data/draftOrders';

function Field({label,icon,children}){return <div className="order-detail-field"><span className="detail-field-icon"><Icon name={icon}/></span><div><dt>{label}</dt><dd>{children??'غير متاح في المصدر'}</dd></div></div>}
function DetailCard({title,icon,children,className=''}){return <Card className={'order-detail-card '+className}><div className="detail-card-heading"><Icon name={icon}/><h2>{title}</h2></div>{children}</Card>}
const money=value=><bdi dir="ltr">SAR {value.toFixed(2)}</bdi>;
export default function OrderDetailsPage(){
  const {orderId}=useParams();
  const navigate=useNavigate();
  const {newOrders}=useOrdersPreview();
  const {notify}=useOutletContext();
  const reference=orderId===referenceOrder.id;
  const draft=draftOrders.find(order=>order.id===orderId);
  const order=reference?referenceOrder:draft||newOrders.find(order=>order.id===orderId)||screenshotOrders.find(order=>order.id===orderId);
  const back=draft?'/orders/drafts':'/orders';
  if(!order)return <Card className="empty-state"><Icon name="package-off"/><h2>تفاصيل الطلب غير متاحة</h2><p>لا يوجد هذا الطلب ضمن البيانات المتاحة للمعاينة.</p><Link className="platform-link" to="/orders">العودة إلى الطلبات</Link></Card>;
  const stage=getOrderStage(order,reference);
  async function copyOrderId(){
    try{await navigator.clipboard.writeText(order.id);notify('تم نسخ رقم الطلب')}
    catch{notify('تعذّر النسخ تلقائيًا. رقم الطلب: '+order.id)}
  }
  const metrics=[{label:'إجمالي الأنشطة',value:reference?'13':null,icon:'chart-bar',tone:'purple'},{label:'محاولات التواصل',value:String(order.attempts),icon:'headset',tone:'blue'}];
  return <div className="order-details-page">
    <div className="order-detail-intro"><div><div className="order-detail-title"><div className="order-number-heading"><h2>تفاصيل الطلب <bdi dir="ltr">{order.id}</bdi></h2><IconButton className="order-number-copy" icon="copy" label="نسخ رقم الطلب" title="نسخ رقم الطلب" onPress={copyOrderId}/></div><span className={'order-status tone-'+stage.tone}><Icon name={stage.icon}/>{order.statusLabel}</span></div><p>بيانات الطلب ومتابعة التواصل مع العميل.</p></div><Link className="order-back-link" to={back}><Icon name="chevron-right"/>{draft?'طلبات الدرافت':'كل الطلبات'}</Link></div>
    {draft?<Card className="draft-detail-warning"><Icon name="warning"/><div><h2>الطلب غير مكتمل</h2><p>{order.reason}</p></div><Button size="sm" variant="secondary" onPress={()=>navigate('/orders/drafts/'+order.id+'/edit')}><Icon name="edit"/>تعديل البيانات</Button></Card>:null}
    <div className="order-details-grid">
      <div className="order-details-sidebar">
        <DetailCard className="detail-customer-card" title="بيانات العميل" icon="users"><dl className="order-detail-fields"><Field label="اسم العميل" icon="users">{order.name}</Field><Field label="رقم الهاتف" icon="headset"><bdi dir="ltr">{order.phone}</bdi></Field><Field label="الدولة" icon="world">{order.country}</Field><Field label="المدينة" icon="building-store">{order.city}</Field><Field label="العنوان" icon="package">{order.address}</Field><Field label="العنوان الوطني" icon="link">{order.nationalAddress?<bdi dir="ltr">{order.nationalAddress}</bdi>:null}</Field></dl></DetailCard>
        <DetailCard className="detail-billing-card" title="الدفع ومصدر الطلب" icon="wallet"><dl className="order-detail-fields"><Field label="المبلغ الإجمالي" icon="currency-dollar"><span className="detail-total">{money(order.amount)}</span></Field><Field label="طريقة الدفع" icon="wallet">{order.payment}</Field><Field label="مصدر الطلب" icon="building-store">{order.source}</Field><Field label="تاريخ الطلب" icon="calendar">{order.date?<bdi dir="ltr">{order.date}</bdi>:null}</Field></dl></DetailCard>
        <DetailCard className="detail-notes-card" title="ملاحظات الطلب" icon="file-import"><dl className="order-notes">{['ملاحظات العميل','ملاحظات فريق هلا','سبب الإلغاء','ملاحظات سبب الإلغاء'].map(label=><div key={label}><dt>{label}</dt><dd>{label==='ملاحظات العميل'&&order.notes?order.notes:'غير متاح في المصدر'}</dd></div>)}</dl></DetailCard>
      </div>
      <div className="order-details-main">
        <Card className="order-detail-stats"><div className="detail-counts">{metrics.map((item,index)=>item.value!==null?<MetricRows key={item.label} items={[item]} group={'detail-'+index}/>:<div className="detail-text-stat" key={item.label}><span>{item.label}</span><strong>غير متاح</strong></div>)}</div><div className="detail-text-stat"><span>طريقة الدفع</span><strong className="order-payment">{order.payment??'غير متاح'}</strong></div><div className="detail-text-stat"><span>أب سيل</span><strong>{order.upsell??'غير متاح'}</strong></div></Card>
        <DetailCard className="detail-progress-card" title="مراحل الطلب" icon="clock"><OrderProgress order={order} reference={reference}/></DetailCard>
        <DetailCard className="detail-products-card" title="منتجات الطلب" icon="package"><div className="detail-products-scroll">{order.products?<table className="detail-products-table"><thead><tr><th scope="col">المنتج</th><th scope="col">SKU</th><th scope="col">الكمية</th><th scope="col">الحالة</th></tr></thead><tbody>{order.products.map(product=><tr key={product.id??product.sku}><td><span className="detail-product-name"><span className="detail-product-icon"><Icon name="package"/></span>{product.name}</span></td><td><bdi dir="ltr">{product.sku??'غير متاح'}</bdi></td><td><bdi dir="ltr">{product.quantity}</bdi></td><td><span className={'order-status '+(product.status==='متاح'?'tone-green':'')}>{product.status}</span></td></tr>)}</tbody></table>:<p className="detail-unavailable">تفاصيل المنتجات غير متاحة في صورة قائمة الطلبات.</p>}</div><div className="detail-payment-summary"><span>المجموع الفرعي</span><strong>{reference||order.origin==='local-preview'?money(order.amount):'غير متاح'}</strong></div></DetailCard>
        <DetailCard className="detail-calls-card" title="سجل المكالمات" icon="headset"><div className="call-log-caption"><p>متابعة نتائج التواصل مع العميل</p><span>{reference?'9 مكالمات':'السجل غير متاح'}</span></div>{order.calls?<ol className="order-call-log">{order.calls.map((call,index)=><li key={index}><span className={'call-result-icon tone-'+call.tone}><Icon name={call.tone==='green'?'circle-check':'headset'}/></span><div className="call-log-content"><strong>{call.result}</strong><bdi dir="ltr">{call.date}</bdi>{call.note?<p>{call.note}</p>:null}</div><span className={'order-status tone-'+call.tone}>{call.badge}</span></li>)}</ol>:<p className="detail-unavailable">لا تتوفر تفاصيل المكالمات لهذا الطلب في الصورة المرجعية.</p>}</DetailCard>
      </div>
    </div>
  </div>;
}
