import {useState} from 'react';
import {Button,Card,Input,TextField} from '@heroui/react';
import {useNavigate} from 'react-router';
import {useImportOrders} from '../context/ImportOrdersContext';
import {AppModal} from '../components/ui/AppModal';
import {Icon,IconButton} from '../components/ui/Icon';
import {importColumns} from '../data/importOrders';
import {ImportCountryCards,CountryLabel} from '../components/imports/ImportCountries';
const normalize=value=>value.trim().toLowerCase().replace(/[أإآ]/g,'ا');
export default function ImportOrdersPage(){
  const navigate=useNavigate();
  const {records}=useImportOrders();
  const [query,setQuery]=useState(''),[status,setStatus]=useState('all'),[payment,setPayment]=useState('all');
  const [columns,setColumns]=useState(['id','name','origin','status','payment','date']),[columnsOpen,setColumnsOpen]=useState(false),[page,setPage]=useState(1),[pageSize,setPageSize]=useState(5);
  const shown=importColumns.filter(([id])=>columns.includes(id));
  const filtered=records.filter(row=>normalize(`${row.id} ${row.name} ${row.origin}`).includes(normalize(query))&&(status==='all'||row.status===status)&&(payment==='all'||row.payment===payment));
  const pages=Math.max(1,Math.ceil(filtered.length/pageSize)),currentPage=Math.min(page,pages),rows=filtered.slice((currentPage-1)*pageSize,currentPage*pageSize);
  function reset(){setQuery('');setStatus('all');setPayment('all');setPage(1)}
  function cell(row,id){if(id==='status')return <span className="order-status tone-purple"><Icon name="clock"/>معاينة محلية</span>;if(id==='name')return <div className="import-table-product"><img src={row.images[0].src} alt=""/><span>{row.name}<small>{row.quantity} قطعة · {row.destination}</small></span></div>;if(id==='origin')return <CountryLabel code={row.originCode} name={row.origin}/>;if(id==='id'||id==='date')return <bdi dir="ltr">{row[id]}</bdi>;return row[id]||<span className="order-muted">غير متاح</span>}
  return <div className="orders-page import-orders-page">
    <div className="orders-intro"><div><h2>طلبات الاستيراد</h2><p>من بلد المصدر إلى مخزنك، تابع كل طلب في مكان واحد.</p></div><div className="orders-actions"><Button size="sm" onPress={()=>navigate('/import-orders/new')}><Icon name="plus"/>طلب استيراد جديد</Button></div></div>
    <section className="import-source-section" aria-labelledby="import-source-heading"><div className="import-section-intro"><div><h3 id="import-source-heading">ابدأ باختيار بلد المصدر</h3><p>اختر البلد للاطلاع على وسائل الشحن المتاحة وإضافة طلبك.</p></div><span>3 دول متاحة</span></div><ImportCountryCards onSelect={code=>navigate('/import-orders/new?origin='+code)}/><p className="import-duration-note">مدد الشحن تقديرية وبأيام العمل.</p></section>
    <div className="import-list-heading"><h3>طلباتك</h3><span>{records.length} طلب</span></div>
    {records.length?<p className="orders-local-preview-note"><Icon name="info"/>طلبات المعاينة محلية وتُمسح عند تحديث الصفحة؛ لا يتم إرسال طلب أو تحصيل دفعة.</p>:null}
    <Card className="orders-list-card">
      <div className="orders-list-toolbar"><TextField className="orders-search" aria-label="البحث عن طلب استيراد" value={query} onChange={value=>{setQuery(value);setPage(1)}}><div className="search-control"><Icon name="search"/><Input placeholder="رقم الطلب، المنتج أو بلد المصدر…"/></div></TextField><div className="orders-table-tools"><Button size="sm" variant="secondary" onPress={()=>setColumnsOpen(true)}><Icon name="layout-grid"/>عرض الأعمدة</Button><IconButton icon="reset" label="مسح فلاتر الاستيراد" onPress={reset}/></div></div>
      <div className="orders-filters import-list-filters"><div className="orders-filter"><label htmlFor="import-status">الحالة</label><select id="import-status" value={status} onChange={event=>{setStatus(event.target.value);setPage(1)}}><option value="all">كل الحالات</option><option value="local">معاينة محلية</option></select></div><div className="orders-filter"><label htmlFor="import-payment">حالة الدفع</label><select id="import-payment" value={payment} onChange={event=>{setPayment(event.target.value);setPage(1)}}><option value="all">كل حالات الدفع</option><option value="غير محددة">غير محددة</option></select></div><span className="orders-visible-count" role="status">{filtered.length} نتيجة</span></div>
      <div className="orders-table-scroll" role="region" aria-label="جدول طلبات الاستيراد، قابل للتمرير أفقيًا" tabIndex={0}><table className="orders-table import-orders-table"><caption className="sr-only">قائمة طلبات الاستيراد</caption><thead><tr><th scope="col">العمليات</th>{shown.map(([id,label])=><th key={id} scope="col">{label}</th>)}</tr></thead><tbody>{rows.length?rows.map(row=><tr key={row.id}><td><IconButton icon="eye" label={'عرض طلب الاستيراد '+row.id} onPress={()=>navigate('/import-orders/'+row.id)}/></td>{shown.map(([id])=><td key={id}>{cell(row,id)}</td>)}</tr>):null}</tbody></table></div>
      {!rows.length?<div className="import-empty"><span><Icon name="file-import"/></span><h3>{records.length?'لا توجد طلبات مطابقة':'لا توجد طلبات استيراد بعد'}</h3><p>{records.length?'غيّر البحث أو امسح الفلاتر.':'ابدأ باختيار بلد المصدر، ثم أضف تفاصيل المنتج.'}</p><Button size="sm" variant="secondary" onPress={()=>records.length?reset():navigate('/import-orders/new')}><Icon name={records.length?'reset':'plus'}/>{records.length?'مسح الفلاتر':'إضافة أول طلب'}</Button></div>:null}
      <div className="orders-list-footer"><p>{filtered.length?`عرض ${(currentPage-1)*pageSize+1}–${Math.min(currentPage*pageSize,filtered.length)} من ${filtered.length} طلب`:'0 طلبات'} · المعاينة محلية</p><div className="import-pagination"><label>لكل صفحة<select aria-label="عدد الطلبات لكل صفحة" value={pageSize} onChange={event=>{setPageSize(Number(event.target.value));setPage(1)}}>{[5,10,25].map(size=><option key={size} value={size}>{size}</option>)}</select></label><IconButton icon="chevron-right" label="الصفحة السابقة" isDisabled={currentPage===1} onPress={()=>setPage(currentPage-1)}/><span>{currentPage} / {pages}</span><IconButton icon="chevron-left" label="الصفحة التالية" isDisabled={currentPage===pages} onPress={()=>setPage(currentPage+1)}/></div></div>
    </Card>
    <AppModal open={columnsOpen} setOpen={setColumnsOpen} title="أعمدة طلبات الاستيراد" footer={<Button size="sm" onPress={()=>setColumnsOpen(false)}>تم</Button>}><div className="orders-column-options">{importColumns.map(([id,label])=><label key={id}><input type="checkbox" checked={columns.includes(id)} disabled={columns.length===1&&columns.includes(id)} onChange={event=>setColumns(current=>event.target.checked?[...current,id]:current.filter(item=>item!==id))}/>{label}</label>)}</div></AppModal>

  </div>;
}