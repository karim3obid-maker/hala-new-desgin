import {useState} from 'react';
import {useNavigate,useLocation} from 'react-router';
import {Button,Card,Input,TextField} from '@heroui/react';
import {MetricRows,Section} from '../components/dashboard/Metrics';
import {Icon,IconButton} from '../components/ui/Icon';
import {AppModal} from '../components/ui/AppModal';
import {useOrdersPreview} from '../context/OrdersPreviewContext';
import {draftMetrics,draftOrders,draftColumns} from '../data/draftOrders';
import {snapshotMetrics,orderStatuses,screenshotOrders,orderColumns,defaultColumns} from '../data/orders';

const normalize=value=>value.trim().toLowerCase().replace(/[أإآ]/g,'ا');
const amount=value=>value.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});

export default function OrdersPage({draft=false}){
  const navigate=useNavigate();
  const location=useLocation();
  const {newOrders}=useOrdersPreview();
  const promoted=new Set(newOrders.map(order=>order.sourceDraftId).filter(Boolean));
  const statuses=orderStatuses.map(item=>({...item,count:item.count+(['all','new'].includes(item.id)?newOrders.length:0)}));
  const pageColumns=draft?draftColumns:orderColumns;
  const initialColumns=draft?draftColumns.map(([id])=>id):defaultColumns;
  const records=draft?draftOrders.filter(order=>!promoted.has(order.id)):[...newOrders,...screenshotOrders];
  const metrics=draft?draftMetrics.map(item=>({...item,value:String(31-promoted.size)})):snapshotMetrics.map((item,index)=>{
    const value=Number(item.value)+(index<2?newOrders.length:0);
    return {...item,value:String(value),percentage:item.percentage&&newOrders.length?(value/(336+newOrders.length)*100).toFixed(2)+'%':item.percentage};
  });
  const [status,setStatus]=useState(location.state?.newOrderId?'new':'all');
  const [query,setQuery]=useState('');
  const [columns,setColumns]=useState(initialColumns);
  const [columnsOpen,setColumnsOpen]=useState(false);
  const shownColumns=pageColumns.filter(([id])=>columns.includes(id));
  const rows=records.filter(row=>(status==='all'||row.status===status)&&normalize(`${row.id} ${row.name} ${row.phone}`).includes(normalize(query)));
  function reset(){setStatus('all');setQuery('');setColumns(initialColumns)}
  function cell(row,id){
    switch(id){
      case 'id':return <span className="order-id"><Icon name="copy"/><bdi dir="ltr">{row.id}</bdi></span>;
      case 'reason':return <span className="draft-failure-reason"><Icon name="warning"/>{row.reason}</span>;
      case 'payment':return <span className="order-payment">{row.payment}</span>;
      case 'quantity':return <bdi dir="ltr">{row.quantity}</bdi>;
      case 'status':return draft?<span className="order-status tone-red"><Icon name="warning"/>غير مكتمل</span>: <span className={'order-status tone-'+orderStatuses.find(item=>item.id===row.status).tone}><Icon name={row.status==='cancelled'?'circle-x':row.status==='confirmed'?'circle-check':'clock'}/>{row.statusLabel}</span>;
      case 'customer':return <div className="order-customer"><span>{row.name}</span><bdi dir="ltr">{row.phone}</bdi></div>;
      case 'country':return <div className="order-country">{row.city?<span>{row.city}</span>:null}<small>{row.country}</small></div>;
      case 'amount':return <span className="order-amount"><bdi dir="ltr">{amount(row.amount)}</bdi><span>ر.س</span></span>;
      case 'attempts':return <bdi dir="ltr">{row.attempts}</bdi>;
      default:return <span className={['reason','date','product'].includes(id)?'order-muted':''}>{row[id]??'غير متاح'}</span>;
    }
  }
  return <div className={'orders-page '+(draft?'draft-orders-page':'')}>
    <div className="orders-intro">
      <div><h2>{draft?'إدارة طلبات الدرافت':'إدارة الطلبات'}</h2><p>{draft?'الطلبات التي فشل إنشاؤها أو لم تكتمل بياناتها، مع توضيح سبب المشكلة.':'تابع طلبات متجرك وحالاتها في مكان واحد.'}</p></div>
      <div className="orders-actions" aria-label="إجراءات الطلبات">
        <Button size="sm" onPress={()=>navigate('/orders/new')}><Icon name="plus"/>طلب جديد</Button>
        <Button size="sm" variant="secondary" isDisabled><Icon name="file-import"/>استيراد Excel</Button>
        <Button size="sm" variant="secondary" isDisabled><Icon name="download"/>تصدير</Button>
      </div>
    </div>
    {newOrders.length?<p className="orders-local-preview-note"><Icon name="info"/>تغييرات المعاينة محلية وتُمسح عند تحديث الصفحة.</p>:null}
    <Section id={draft?'draft-orders':'orders'} title={draft?'الطلبات غير المكتملة':'ملخص الطلبات'} icon={draft?'clock':'shopping-cart'}><MetricRows items={metrics} group={draft?'draft-orders':'orders'}/></Section>
    <section className="orders-list-section" aria-labelledby="orders-list-title">
      <div className="orders-list-heading"><div className="section-heading"><Icon name="layout-grid"/><h2 id="orders-list-title">{draft?'قائمة طلبات الدرافت':'قائمة الطلبات'}</h2></div><div className="orders-reference-actions"><span className="orders-snapshot-note">معاينة من الصورة المرجعية</span>{!draft?<Button className="orders-preview" size="sm" variant="ghost" onPress={()=>navigate('/orders/ORD-LGZM')}><Icon name="eye"/>تفاصيل الطلب المرجعي</Button>:null}</div></div>
      <Card className="orders-list-card">
        <div className="orders-list-toolbar">
          <TextField aria-label="البحث في الطلبات الظاهرة" className="orders-search" value={query} onChange={setQuery}><div className="search-control"><Icon name="search"/><Input placeholder="ابحث برقم الطلب، اسم العميل أو الهاتف…"/></div></TextField>
          <div className="orders-table-tools"><Button size="sm" variant="secondary" onPress={()=>setColumnsOpen(true)}><Icon name="layout-grid"/>عرض الأعمدة</Button><IconButton icon="reset" label="إعادة ضبط العرض" onPress={reset}/></div>
        </div>
        {!draft?<div className="order-tabs" role="group" aria-label="تصفية حسب حالة الطلب">
          {statuses.map(item=><Button key={item.id} size="sm" variant="ghost" className={'order-tab '+(status===item.id?'selected':'')} aria-pressed={status===item.id} onPress={()=>setStatus(item.id)}>{item.label}<bdi dir="ltr">{item.count}</bdi></Button>)}
        </div>:null}
        <div className="orders-filters">
          <div className="orders-filter"><label htmlFor="orders-date">تاريخ الطلب</label><div className="orders-filter-control"><Icon name="calendar"/><input id="orders-date" placeholder="من تاريخ — إلى تاريخ" disabled/></div></div>
          <div className="orders-filter"><label htmlFor="orders-country">الدولة</label><select id="orders-country" disabled defaultValue="all"><option value="all">كل الدول</option></select></div>
          <div className="orders-filter"><label htmlFor="orders-product">المنتج</label><select id="orders-product" disabled defaultValue="all"><option value="all">كل المنتجات</option></select></div>
          <span className="orders-visible-count"><bdi dir="ltr">{rows.length}</bdi> طلبات ظاهرة</span>
        </div>
        <div className="orders-table-scroll" role="region" aria-label="جدول الطلبات، قابل للتمرير أفقيًا" tabIndex={0}>
          <table className="orders-table"><caption className="sr-only">الطلبات الظاهرة في الصورة المرجعية، بعض النصوص مختصرة كما في المصدر.</caption>
            <thead><tr><th scope="col">العمليات</th>{shownColumns.map(([id,label])=><th key={id} scope="col">{label}</th>)}</tr></thead>
            <tbody>{rows.length?rows.map(row=><tr key={row.id} className={location.state?.newOrderId===row.id?'preview-new-row':undefined}><td><div className="order-row-actions"><IconButton icon="eye" label={'عرض الطلب '+row.id} onPress={()=>navigate('/orders/'+row.id)}/>{draft?<><IconButton icon="edit" label={'تعديل الطلب '+row.id} onPress={()=>navigate('/orders/drafts/'+row.id+'/edit')}/><IconButton icon="trash" label={'حذف الطلب '+row.id} isDisabled/></>:null}</div></td>{shownColumns.map(([id])=><td key={id} className={'order-cell-'+id}>{cell(row,id)}</td>)}</tr>):<tr><td colSpan={shownColumns.length+1}><div className="orders-no-results"><Icon name="search"/><p>لا توجد طلبات مطابقة ضمن الصفوف المتاحة</p><Button size="sm" variant="secondary" onPress={reset}>عرض الطلبات المتاحة</Button></div></td></tr>}</tbody>
          </table>
        </div>
        <div className="orders-list-footer"><p>المتاح للمعاينة <bdi dir="ltr">{records.length}</bdi> طلبات من أصل <bdi dir="ltr">{draft?31-promoted.size:336+newOrders.length}</bdi> في المعاينة. بعض البيانات مختصرة في المصدر.</p><div className="orders-pagination"><IconButton icon="chevron-right" label="الصفحة السابقة" isDisabled/><span aria-current="page">1</span><IconButton icon="chevron-left" label="الصفحة التالية" isDisabled/></div></div>
      </Card>
    </section>
    <AppModal open={columnsOpen} setOpen={setColumnsOpen} title="الأعمدة الظاهرة" footer={<Button size="sm" onPress={()=>setColumnsOpen(false)}>تم</Button>}><div className="orders-column-options">{pageColumns.map(([id,label])=><label key={id}><input type="checkbox" checked={columns.includes(id)} disabled={columns.length===1&&columns.includes(id)} onChange={event=>setColumns(current=>event.target.checked?[...current,id]:current.filter(item=>item!==id))}/>{label}</label>)}</div></AppModal>
  </div>;
}
