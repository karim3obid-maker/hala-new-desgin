import {useState} from 'react';
import {useNavigate} from 'react-router';
import {Button,Card,Input,TextField} from '@heroui/react';
import {MetricRows,Section} from '../components/dashboard/Metrics';
import {Icon,IconButton} from '../components/ui/Icon';
import {AppModal} from '../components/ui/AppModal';
import {products} from '../data/products';
import {editorProduct} from '../data/draftEditor';
import {shipmentStatuses,shipmentMetrics,screenshotShipments,shipmentColumns} from '../data/shipments';
const normalize=value=>value.trim().toLowerCase().replace(/[أإآ]/g,'ا');
const catalog=[editorProduct,...products];
const money=value=><bdi dir="ltr">{value.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})} <small>SAR</small></bdi>;
export default function ShipmentsPage(){
  const navigate=useNavigate();
  const [query,setQuery]=useState(''),[status,setStatus]=useState('all'),[product,setProduct]=useState('all');
  const [order,setOrder]=useState(''),[tracking,setTracking]=useState(''),[from,setFrom]=useState(''),[to,setTo]=useState('');
  const [country,setCountry]=useState('all'),[city,setCity]=useState('all');
  const [columns,setColumns]=useState(shipmentColumns.map(([id])=>id)),[columnsOpen,setColumnsOpen]=useState(false);
  const shown=shipmentColumns.filter(([id])=>columns.includes(id));
  const invalidRange=from&&to&&from>to;
  const rows=screenshotShipments.filter(row=>(status==='all'||row.status===status)&&normalize(`${row.id} ${row.name} ${row.phone}`).includes(normalize(query))&&row.orderId.includes(order.trim())&&(!tracking.trim()||normalize(row.tracking||'').includes(normalize(tracking)))&&(product==='all'||product==='unknown'&&!row.productIds.length||row.productIds.includes(product))&&(!from||row.date>=from)&&(!to||row.date<=to)&&(country==='all'||!row.country)&&(city==='all'||city==='unknown'&&!row.city||row.city===city));
  function reset(){setQuery('');setStatus('all');setProduct('all');setOrder('');setTracking('');setFrom('');setTo('');setCountry('all');setCity('all')}
  function cell(row,id){
    switch(id){
      case 'status':return <span className="order-status tone-orange"><Icon name="clock"/>في الانتظار</span>;
      case 'id':case 'orderId':return <bdi className="shipment-reference" dir="ltr">{row[id]}</bdi>;
      case 'customer':return <div className="order-customer"><span>{row.name}</span><bdi dir="ltr">{row.phone}</bdi></div>;
      case 'amount':return <span className="shipment-amount">{money(row.amount)}</span>;
      case 'items':return <span>{row.items} عنصر</span>;
      case 'date':return <bdi dir="ltr">{row.date.replaceAll('-','/')}</bdi>;
      case 'country':return <span className={row.city?'':'order-muted'}>{row.city??'غير متاح'}</span>;
      default:return <span className="order-muted">{row[id]??'غير متاح'}</span>;
    }
  }
  return <div className="orders-page shipments-page">
    <div className="orders-intro"><div><h2>إدارة الشحنات</h2><p>تابع الشحنات وحالات التسليم، وابحث عن الشحنة المطلوبة بسهولة.</p></div><div className="orders-actions"><Button size="sm" variant="secondary" isDisabled><Icon name="warning"/>بلاغاتي</Button><Button size="sm" variant="secondary" isDisabled><Icon name="download"/>تصدير</Button></div></div>
    <Section id="shipment-overview" title="ملخص الشحنات" icon="truck"><MetricRows items={shipmentMetrics} group="shipment-list"/></Section>
    <section className="orders-list-section" aria-labelledby="shipment-list-title">
      <div className="orders-list-heading"><div className="section-heading"><Icon name="truck"/><h2 id="shipment-list-title">قائمة الشحنات</h2></div><span className="orders-snapshot-note">معاينة من الصورة المرجعية</span></div>
      <Card className="orders-list-card">
        <div className="orders-list-toolbar"><TextField className="orders-search" aria-label="البحث في الشحنات" value={query} onChange={setQuery}><div className="search-control"><Icon name="search"/><Input placeholder="رقم الشحنة، اسم العميل أو الهاتف…"/></div></TextField><div className="orders-table-tools"><Button size="sm" variant="secondary" onPress={()=>setColumnsOpen(true)}><Icon name="layout-grid"/>عرض الأعمدة</Button><IconButton icon="reset" label="مسح فلاتر الشحنات" onPress={reset}/></div></div>
        <div className="order-tabs" role="group" aria-label="حالة الشحنة">{shipmentStatuses.map(item=><Button key={item.id} size="sm" variant="ghost" className={'order-tab '+(status===item.id?'selected':'')} aria-pressed={status===item.id} onPress={()=>setStatus(item.id)}>{item.label}{item.count!==null?<bdi dir="ltr">{item.count}</bdi>:null}</Button>)}</div>
        <div className="shipments-filter-grid">
          <div className="orders-filter shipment-product-filter"><label htmlFor="shipment-product">المنتج</label><select id="shipment-product" value={product} onChange={event=>setProduct(event.target.value)}><option value="all">كل المنتجات</option><option value="unknown">منتج غير محدد في المصدر</option>{catalog.map(item=><option key={item.id} value={item.id}>{item.name}{item.sku?' — '+item.sku:''}</option>)}</select></div>
          <div className="orders-filter"><label htmlFor="shipment-order">رقم الطلب</label><input id="shipment-order" value={order} onChange={event=>setOrder(event.target.value)} placeholder="ابحث برقم الطلب" dir="ltr"/></div>
          <div className="orders-filter"><label htmlFor="shipment-tracking">رقم التتبع</label><input id="shipment-tracking" value={tracking} onChange={event=>setTracking(event.target.value)} placeholder="ابحث برقم التتبع" dir="ltr"/></div>
          <div className="orders-filter"><label htmlFor="shipment-from">من تاريخ</label><input id="shipment-from" type="date" value={from} onInput={event=>setFrom(event.currentTarget.value)} aria-invalid={!!invalidRange}/></div>
          <div className="orders-filter"><label htmlFor="shipment-to">إلى تاريخ</label><input id="shipment-to" type="date" value={to} onInput={event=>setTo(event.currentTarget.value)} aria-invalid={!!invalidRange}/></div>
          <div className="orders-filter"><label htmlFor="shipment-country">الدولة</label><select id="shipment-country" value={country} onChange={event=>setCountry(event.target.value)}><option value="all">كل الدول</option><option value="unknown">غير متاحة في المصدر</option></select></div>
          <div className="orders-filter"><label htmlFor="shipment-city">المدينة</label><select id="shipment-city" value={city} onChange={event=>setCity(event.target.value)}><option value="all">كل المدن</option><option value="جدة">جدة</option><option value="unknown">غير متاحة في المصدر</option></select></div>
        </div>
        {invalidRange?<p className="shipment-data-note shipment-date-error" role="alert">تاريخ البداية يجب أن يسبق تاريخ النهاية.</p>:null}
        <div className="shipment-filter-summary"><p className="shipment-data-note"><Icon name="info"/>فلتر المنتج يعتمد على بيانات الربط المتاحة؛ بعض الشحنات لا تتوفر لها تفاصيل منتجات.</p><span className="orders-visible-count" role="status">{rows.length} شحنة ظاهرة</span></div>
        <div className="orders-table-scroll" role="region" aria-label="جدول الشحنات، قابل للتمرير أفقيًا" tabIndex={0}><table className="orders-table shipments-table"><caption className="sr-only">الشحنات المتاحة في الصورة المرجعية. البيانات الغائبة غير متاحة.</caption><thead><tr><th scope="col">العمليات</th>{shown.map(([id,label])=><th scope="col" key={id}>{label}</th>)}</tr></thead><tbody>{rows.length?rows.map(row=><tr key={row.id}><td><IconButton icon="eye" label={'عرض الشحنة '+row.id} onPress={()=>navigate('/shipments/'+row.id)}/></td>{shown.map(([id])=><td key={id}>{cell(row,id)}</td>)}</tr>):<tr><td colSpan={shown.length+1}><div className="orders-no-results"><Icon name="search"/><p>{product!=='all'&&product!=='unknown'?'لا توجد شحنات مرتبطة بهذا المنتج ضمن البيانات المتاحة':'لا توجد شحنات مطابقة ضمن الصفوف المتاحة'}</p><Button size="sm" variant="secondary" onPress={reset}>مسح الفلاتر</Button></div></td></tr>}</tbody></table></div>
        <div className="orders-list-footer"><p>المتاح للمعاينة {screenshotShipments.length} شحنة من أصل 89. الأعداد الإجمالية من الصورة ولا تتغير بالفلاتر.</p><div className="orders-pagination"><IconButton icon="chevron-right" label="الصفحة السابقة" isDisabled/><span aria-current="page">1</span><IconButton icon="chevron-left" label="الصفحة التالية" isDisabled/></div></div>
      </Card>
    </section>
    <AppModal open={columnsOpen} setOpen={setColumnsOpen} title="أعمدة الشحنات" footer={<Button size="sm" onPress={()=>setColumnsOpen(false)}>تم</Button>}><div className="orders-column-options">{shipmentColumns.map(([id,label])=><label key={id}><input type="checkbox" checked={columns.includes(id)} disabled={columns.length===1&&columns.includes(id)} onChange={event=>setColumns(current=>event.target.checked?[...current,id]:current.filter(item=>item!==id))}/>{label}</label>)}</div></AppModal>

  </div>;
}
