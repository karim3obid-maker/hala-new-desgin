import {useRef,useState} from 'react';
import {Button,Card} from '@heroui/react';
import {MetricRows} from '../components/dashboard/Metrics';
import {AppModal} from '../components/ui/AppModal';
import {Icon} from '../components/ui/Icon';
import logo from '../assets/hala-logo.png';
import {sellerAccount} from '../config/account';
import {TransferLedger,useWalletTransfers} from '../components/wallet/WalletTransfers';
import {walletMetrics,serviceFees,additionalExpenses,currentServicePrices} from '../data/wallet';

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
function InvoicePreview(){
  return <section className="wallet-invoices" aria-labelledby="invoice-section-title">
    <div className="wallet-invoices-intro"><h2 id="invoice-section-title">الفواتير</h2><p>لا تتوفر فواتير فعلية حاليًا. هذا نموذج لشكل الفاتورة عند إصدارها.</p></div>
    <Card className="wallet-invoice" aria-label="معاينة نموذج فاتورة هلا">
      <header className="wallet-invoice-header"><div><span className="wallet-invoice-label">معاينة فاتورة</span><h3>فاتورة خدمات</h3><p>رقم الفاتورة: <span>يُحدّد عند الإصدار</span></p></div><span className="logo-crop"><img src={logo} alt="هلا كوميرس"/></span></header>
      <div className="wallet-invoice-parties"><div><span>من</span><strong>هلا كوميرس</strong></div><div><span>إلى</span><strong>{sellerAccount.name}</strong><small>معرّف البائع: <bdi dir="ltr">{sellerAccount.sellerId}</bdi></small></div></div>
      <dl className="wallet-invoice-dates"><div><dt><Icon name="calendar"/>تاريخ الإصدار</dt><dd>غير محدد</dd></div><div><dt><Icon name="clock"/>موعد الاستحقاق</dt><dd>التاريخ والوقت غير محددين</dd></div></dl>
      <div className="wallet-table-scroll" tabIndex={0} role="region" aria-label="بنود الفاتورة"><table className="wallet-invoice-table"><caption className="sr-only">بنود نموذج الفاتورة</caption><thead><tr><th scope="col">الخدمة</th><th scope="col">الكمية</th><th scope="col">سعر الوحدة</th><th scope="col">الإجمالي</th></tr></thead><tbody><tr><td colSpan={4}>تظهر الخدمات والمبالغ هنا عند إصدار الفاتورة.</td></tr></tbody></table></div>
      <div className="wallet-invoice-total"><span>إجمالي الفاتورة <small>بالدولار الأمريكي</small></span><strong>غير متاح</strong></div>
      <footer className="wallet-invoice-note"><Icon name="info"/>هذه معاينة للشكل، وليست فاتورة صادرة أو مبلغًا مستحقًا.</footer>
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
      {activeTab==='summary'?<div className="wallet-summary-stack"><p className="wallet-source-note">الملخص يعرض تكاليف لقطة سابقة. الأسعار الحالية متاحة من «أسعار الرسوم».</p>{groups.map(group=><ServiceSummary key={group.name} group={group}/>)}<ExtraExpenses summary/></div>:activeTab==='invoices'?<InvoicePreview/>:activeTab==='expenses'?<ExtraExpenses/>:<TransferLedger kind={activeTab} requests={transfers.requests[activeTab]} onAdd={activeTab==='withdrawals'?transfers.openWithdrawal:transfers.openDeposit}/>}
    </div>
    <p id="wallet-preview-note" className="wallet-source-note wallet-snapshot-note">معاينة تصميم · الأرقام من لقطة المالية، مستقلة عن ملخص الرئيسية. طلبات السحب والإيداع محلية فقط ولا تغيّر الرصيد الفعلي. إعادة التحميل تمسح المعاينة. الفترة غير محددة في المصدر.</p>
    <AppModal open={pricesOpen} setOpen={setPricesOpen} title="أسعار الخدمات" footer={<Button variant="secondary" onPress={()=>setPricesOpen(false)}>إغلاق</Button>}>
      <div className="wallet-prices wallet-current-prices"><p>أسعار الخدمات الحالية بالدولار الأمريكي.</p>{currentServicePrices.map(group=><section className="wallet-price-section" key={group.name} aria-label={group.name}><h3><span className="wallet-price-section-icon"><Icon name={group.icon}/></span>{group.name}</h3><dl>{group.items.map(item=><div key={item.name}><dt><Icon name={item.icon}/><span>{item.name}<small>{item.unit}</small></span></dt><dd><Money value={item.rate}/></dd></div>)}</dl></section>)}</div>
    </AppModal>
    {transfers.dialogs}
  </div>;
}
