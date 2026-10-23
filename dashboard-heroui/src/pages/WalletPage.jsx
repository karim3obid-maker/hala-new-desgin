import {useRef,useState} from 'react';
import {Button,Card} from '@heroui/react';
import {MetricRows} from '../components/dashboard/Metrics';
import {AppModal} from '../components/ui/AppModal';
import {Icon} from '../components/ui/Icon';
import {BrandLogo} from '../components/ui/BrandLogo';
import {downloadInvoice,printInvoice} from '../lib/invoiceExport';
import {sellerAccount} from '../config/account';
import {TransferLedger,useWalletTransfers} from '../components/wallet/WalletTransfers';
import {walletMetrics,serviceFees,additionalExpenses,currentServicePrices,walletInvoices} from '../data/wallet';

const tabs=[{id:'summary',label:'الملخص'},{id:'invoices',label:'الفواتير'},{id:'withdrawals',label:'طلبات السحب'},{id:'deposits',label:'طلبات الإيداع'},{id:'expenses',label:'مصاريف أخرى'}];
const groups=[{name:'التأكيد',icon:'users'},{name:'الشحن',icon:'truck'}];
function Money({value}){return <bdi dir="ltr" className="wallet-money">{value} <small>USD</small></bdi>}
function Rate({fee}){return <span className="wallet-rate"><bdi dir="ltr">{fee.rate}{!fee.percentage?' USD':''}</bdi><small>{fee.unit}</small></span>}

function ServiceSummary({group}){
  const title='خدمات '+group.name;
  return <Card className="wallet-panel wallet-service-panel"><header className="wallet-panel-heading"><h2>{title}</h2><Icon name={group.icon}/></header>
    <div className="wallet-table-scroll" tabIndex={0} role="region" aria-label={title}>
      <table className="wallet-table"><caption className="sr-only">{title} — السعر وعدد الطلبات والإجمالي بالدولار الأمريكي</caption><thead><tr><th scope="col">الخدمة</th><th scope="col">السعر</th><th scope="col">الطلبات</th><th scope="col">الإجمالي</th></tr></thead>
        <tbody>{serviceFees.filter(fee=>fee.group===group.name).map(fee=><tr key={fee.name}><th scope="row">{fee.name}</th><td><Rate fee={fee}/></td><td><bdi dir="ltr">{fee.orders}</bdi></td><td><Money value={fee.total}/></td></tr>)}</tbody>
      </table>
    </div>
  </Card>;
}
function ExtraExpenses({summary=false}){
  return <Card className="wallet-panel wallet-extra-panel"><header className="wallet-panel-heading"><h2>{summary?'مصاريف إضافية':'مصاريف أخرى'}</h2><Icon name="currency-dollar"/></header>
    <table className="wallet-extra-table"><caption className="sr-only">المصاريف الإضافية بالدولار الأمريكي</caption><thead><tr><th scope="col">البند</th><th scope="col">الإجمالي</th></tr></thead><tbody>
      {additionalExpenses.map(expense=><tr key={expense.name}><th scope="row">{expense.name}</th><td>{expense.total!==null?<Money value={expense.total}/>:<span className="wallet-unavailable">— <small>غير متاحة</small></span>}</td></tr>)}
    </tbody></table>
    <footer className="wallet-fees-total"><span>{summary?'إجمالي المصروفات':'إجمالي المصاريف الإضافية المتاحة'}{summary?<small>حسب لقطة المالية</small>:null}</span><Money value={summary?'221.87':'8.00'}/></footer>
    <p className="wallet-source-note wallet-expenses-note">مبالغ النقل والاستيراد وإعلانات تيك توك غير متاحة حاليًا، ولا تُحتسب ضمن الإجمالي المعروض.</p>
  </Card>;
}
function InvoiceDate({value,withTime=false}){
  if(!value)return <span className="wallet-unavailable">غير محدد</span>;
  const date=new Date(value);if(Number.isNaN(date.getTime()))return <span className="wallet-unavailable">غير محدد</span>;
  return <time dateTime={value}>{new Intl.DateTimeFormat('ar-EG',{dateStyle:'medium',...(withTime?{timeStyle:'short'}:{}),timeZone:'Africa/Cairo'}).format(date)}</time>;
}
function InvoiceLedger(){
  const [selected,setSelected]=useState(null);
  const preview=selected==='preview';const invoice=preview?null:selected;
  return <><Card className="wallet-panel wallet-invoice-ledger"><header className="wallet-panel-heading"><div><h2>كل الفواتير</h2><p>فواتير تجريبية للمعاينة فقط؛ ليست مطالبات مالية ولا تؤثر على رصيدك.</p></div><Button size="sm" variant="secondary" onPress={()=>setSelected('preview')}><Icon name="eye"/>عرض نموذج فاتورة</Button></header><div className="wallet-table-scroll" tabIndex={0} role="region" aria-label="جدول الفواتير"><table className="wallet-invoice-list"><caption className="sr-only">كل الفواتير — تاريخ الإصدار والاستحقاق والمبلغ والحالة</caption><thead><tr><th scope="col">رقم الفاتورة</th><th scope="col">تاريخ الإصدار</th><th scope="col">موعد الاستحقاق</th><th scope="col">الإجمالي</th><th scope="col">الحالة</th><th scope="col">التفاصيل</th></tr></thead><tbody>{walletInvoices.length?walletInvoices.map(row=><tr key={row.id}><th scope="row"><bdi dir="ltr">{row.id}</bdi>{row.demo?<small className="wallet-invoice-demo">تجريبية</small>:null}</th><td><InvoiceDate value={row.issuedAt}/></td><td><InvoiceDate value={row.dueAt} withTime/></td><td>{row.total!=null?<Money value={row.total}/>:<span>غير متاح</span>}</td><td><span className="wallet-local-status">{row.status||'غير محددة'}</span></td><td><Button size="sm" variant="secondary" aria-label={'عرض الفاتورة '+row.id} onPress={()=>setSelected(row)}><Icon name="eye"/>عرض</Button></td></tr>):<tr><td colSpan={6}><div className="wallet-invoice-list-empty"><Icon name="file-import"/><strong>لا توجد فواتير صادرة حاليًا</strong><span>ستظهر كل فاتورة هنا بتاريخ إصدارها، ويمكنك فتحها من زر «عرض».</span></div></td></tr>}</tbody></table></div></Card><AppModal open={selected!==null} setOpen={value=>{if(!value)setSelected(null)}} title={preview?'نموذج فاتورة هلا':invoice?'الفاتورة '+invoice.id:'عرض الفاتورة'} footer={<Button variant="secondary" onPress={()=>setSelected(null)}>إغلاق</Button>}><InvoicePreview invoice={invoice}/></AppModal></>;
}
function InvoicePreview({invoice=null}){
  const [exporting,setExporting]=useState(null);const [exportError,setExportError]=useState('');
  async function exportDocument(kind){setExportError('');setExporting(kind);try{await (kind==='pdf'?downloadInvoice:printInvoice)(invoice,sellerAccount)}catch{setExportError('تعذّر تجهيز الفاتورة. حاول مرة أخرى.')}finally{setExporting(null)}}
  return <section className="wallet-invoices" aria-labelledby="invoice-section-title">
    <div className="wallet-invoice-toolbar"><div className="wallet-invoices-intro"><h2 id="invoice-section-title">{invoice?'تفاصيل الفاتورة':'نموذج فاتورة'}</h2>{!invoice?<p>هذا نموذج لشكل الفاتورة عند إصدارها.</p>:null}</div><div className="wallet-invoice-export-actions"><Button size="sm" variant="secondary" isDisabled={!!exporting} onPress={()=>exportDocument('print')}>{exporting==='print'?'جارٍ التجهيز…':'طباعة'}</Button><Button size="sm" isDisabled={!!exporting} onPress={()=>exportDocument('pdf')}><Icon name="download"/>{exporting==='pdf'?'جارٍ التجهيز…':'تنزيل PDF'}</Button></div></div>{exportError?<p role="alert" className="draft-field-error">{exportError}</p>:null}
    <Card className="wallet-invoice" aria-label={invoice?'فاتورة هلا '+invoice.id:'معاينة نموذج فاتورة هلا'}>
      <header className="wallet-invoice-header"><div><span className="wallet-invoice-label">{invoice?(invoice.demo?'فاتورة تجريبية · ':'')+(invoice.status||'فاتورة صادرة'):'معاينة فاتورة'}</span><h3>فاتورة خدمات</h3><span className="wallet-invoice-english" lang="en">SERVICE INVOICE</span><p>رقم الفاتورة: <bdi dir="ltr">{invoice?.id||'يُحدّد عند الإصدار'}</bdi></p></div><span className="logo-crop"><BrandLogo/></span></header>
      <div className="wallet-invoice-parties"><div><span>من</span><strong>هلا كوميرس</strong></div><div><span>إلى</span><strong>{sellerAccount.name}</strong><small>معرّف البائع: <bdi dir="ltr">{sellerAccount.sellerId}</bdi></small></div></div>
      <dl className="wallet-invoice-dates"><div><dt><Icon name="calendar"/>تاريخ الإصدار</dt><dd><InvoiceDate value={invoice?.issuedAt}/></dd></div><div><dt><Icon name="clock"/>موعد الاستحقاق</dt><dd><InvoiceDate value={invoice?.dueAt} withTime/></dd></div></dl>
      <div className="wallet-table-scroll" tabIndex={0} role="region" aria-label="بنود الفاتورة"><table className="wallet-invoice-table"><caption className="sr-only">بنود نموذج الفاتورة</caption><thead><tr><th scope="col">الخدمة</th><th scope="col">الكمية</th><th scope="col">سعر الوحدة</th><th scope="col">الإجمالي</th></tr></thead><tbody>{invoice?.items?.length?invoice.items.map((item,index)=><tr key={item.id||index}><th scope="row">{item.name}</th><td>{item.quantity??'—'}</td><td>{item.unitPrice!=null?<Money value={item.unitPrice}/>:<span>غير متاح</span>}</td><td>{item.total!=null?<Money value={item.total}/>:<span>غير متاح</span>}</td></tr>):<tr><td colSpan={4}>{invoice?'تفاصيل البنود غير متاحة.':'تظهر الخدمات والمبالغ هنا عند إصدار الفاتورة.'}</td></tr>}</tbody></table></div>
      <div className="wallet-invoice-total"><span>إجمالي الفاتورة <small>بالدولار الأمريكي</small></span><strong>{invoice?.total!=null?<Money value={invoice.total}/>: "غير متاح"}</strong></div>
      {!invoice||invoice.demo?<footer className="wallet-invoice-note"><Icon name="info"/>هذه فاتورة تجريبية للمعاينة، وليست فاتورة صادرة أو مبلغًا مستحقًا.</footer>:null}
    </Card>
  </section>;
}

export default function WalletPage(){
  const [activeTab,setActiveTab]=useState('summary');
  const [pricesOpen,setPricesOpen]=useState(false);
  const transfers=useWalletTransfers({onCreated:setActiveTab});
  const tabRefs=useRef([]);
  function navigateTabs(event,index){
    let next;
    if(event.key==='ArrowLeft')next=(index+1)%tabs.length;
    else if(event.key==='ArrowRight')next=(index-1+tabs.length)%tabs.length;
    else if(event.key==='Home')next=0;
    else if(event.key==='End')next=tabs.length-1;
    else return;
    event.preventDefault();setActiveTab(tabs[next].id);tabRefs.current[next]?.focus();
  }
  return <div className="wallet-page wallet-redesign">
    <p className="wallet-intro">رصيدك، مصروفاتك وطلباتك المالية في مكان واحد.</p>
    <Card className="section-card wallet-overview" aria-label="ملخص المالية"><MetricRows items={walletMetrics} group="financial"/></Card>
    <div className="wallet-control-row">
      <Button variant="secondary" className="wallet-prices-trigger" onPress={()=>setPricesOpen(true)} aria-haspopup="dialog"><Icon name="calculator"/>أسعار الرسوم<Icon name="chevron-left"/></Button>
      <div className="wallet-actions" aria-describedby="wallet-preview-note"><Button size="sm" onPress={transfers.openDeposit}><Icon name="plus"/>إيداع رصيد</Button><Button size="sm" variant="secondary" onPress={transfers.openWithdrawal}><Icon name="download"/>طلب سحب</Button><Button size="sm" variant="tertiary" onPress={transfers.openAccounts}><Icon name="wallet"/>الحسابات البنكية</Button></div>
    </div>
    <div className="wallet-tabs" role="tablist" aria-label="أقسام المالية">{tabs.map((tab,index)=><button type="button" key={tab.id} ref={node=>{tabRefs.current[index]=node}} id={'wallet-tab-'+tab.id} role="tab" className={'button wallet-tab'+(activeTab===tab.id?' selected':'')} aria-selected={activeTab===tab.id} aria-controls="wallet-tabpanel" tabIndex={activeTab===tab.id?0:-1} onKeyDown={event=>navigateTabs(event,index)} onClick={()=>setActiveTab(tab.id)}>{tab.label}</button>)}</div>
    <div id="wallet-tabpanel" role="tabpanel" aria-labelledby={'wallet-tab-'+activeTab} tabIndex={0} className="wallet-tabpanel">
      {activeTab==='summary'?<div className="wallet-summary-stack"><p className="wallet-source-note">الملخص يعرض تكاليف لقطة سابقة. الأسعار الحالية متاحة من «أسعار الرسوم».</p>{groups.map(group=><ServiceSummary key={group.name} group={group}/>)}<ExtraExpenses summary/></div>:activeTab==='invoices'?<InvoiceLedger/>:activeTab==='expenses'?<ExtraExpenses/>:<TransferLedger kind={activeTab} requests={transfers.requests[activeTab]} onAdd={activeTab==='withdrawals'?transfers.openWithdrawal:transfers.openDeposit}/>}
    </div>
    <p id="wallet-preview-note" className="wallet-source-note wallet-snapshot-note">معاينة تصميم · الأرقام من لقطة المالية، مستقلة عن ملخص الرئيسية. طلبات السحب والإيداع محلية فقط ولا تغيّر الرصيد الفعلي. إعادة التحميل تمسح المعاينة. الفترة غير محددة في المصدر.</p>
    <AppModal open={pricesOpen} setOpen={setPricesOpen} title="أسعار الخدمات" footer={<Button variant="secondary" onPress={()=>setPricesOpen(false)}>إغلاق</Button>}>
      <div className="wallet-prices wallet-current-prices"><p>أسعار الخدمات الحالية بالدولار الأمريكي.</p>{currentServicePrices.map(group=><section className="wallet-price-section" key={group.name} aria-label={group.name}><h3><span className="wallet-price-section-icon"><Icon name={group.icon}/></span>{group.name}</h3><dl>{group.items.map(item=><div key={item.name}><dt><Icon name={item.icon}/><span>{item.name}<small>{item.unit}</small></span></dt><dd><Money value={item.rate}/></dd></div>)}</dl></section>)}</div>
    </AppModal>
    {transfers.dialogs}
  </div>;
}
