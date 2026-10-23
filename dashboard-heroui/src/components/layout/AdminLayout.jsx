import {useEffect,useState} from 'react';
import {Button,Input,Modal,TextField} from '@heroui/react';
import {Outlet,useLocation,useNavigate} from 'react-router';
import data from '../../data/dashboard.json';
import {walletMetrics} from '../../data/wallet';
import {snapshotMetrics} from '../../data/orders';
import {metricGroups,pageTitles} from '../../config/navigation';
import {sellerAccount} from '../../config/account';
import {useDashboard} from '../../context/DashboardContext';
import {AppModal} from '../ui/AppModal';
import {Icon,IconButton} from '../ui/Icon';
import {Account} from './Account';
import {Sidebar} from './Sidebar';

const normalize=text=>text.trim().replace(/[أإآ]/g,'ا').replace(/ة/g,'ه').replace(/[ًٌٍَُِّْ]/g,'');
const allMetrics=Object.entries(metricGroups).flatMap(([group])=>(group==='orders'?snapshotMetrics:group==='financial'?walletMetrics:data[group]).map((metric,index)=>({...metric,group,index})));
export function AdminLayout(){
  const [helpOpen,setHelpOpen]=useState(false);
  const [drawerOpen,setDrawerOpen]=useState(false);
  const [query,setQuery]=useState('');
  const [notice,setNotice]=useState('');
  const {available}=useDashboard();
  const location=useLocation();
  const navigate=useNavigate();
  const title=pageTitles[location.pathname]||(location.pathname.startsWith('/shipments/')?'تفاصيل الشحنة':location.pathname.startsWith('/products/item/')?'تفاصيل المنتج':location.pathname.startsWith('/orders/drafts/')?'تعديل طلب درافت':location.pathname.startsWith('/orders/')?'تفاصيل الطلب':'الصفحة غير موجودة');
  const term=normalize(query);
  const matches=term&&available?allMetrics.filter(metric=>normalize(metric.label+' '+metricGroups[metric.group].label).includes(term)):[];
  useEffect(()=>{if(!notice)return;const id=setTimeout(()=>setNotice(''),2800);return()=>clearTimeout(id)},[notice]);
  useEffect(()=>{
    document.title='هلا كوميرس | '+title;
    const target=location.state?.metricId?document.getElementById(location.state.metricId):document.getElementById('dashboard-content');
    target?.scrollIntoView({behavior:'instant',block:location.state?.metricId?'center':'start'});
    target?.focus({preventScroll:true});
  },[location.key,title]);
  function selectResult(metric){
    setQuery('');setDrawerOpen(false);
    navigate(metricGroups[metric.group].path,{state:{metricId:`${metric.group}-metric-${metric.index}`}});
  }
  async function copySellerId(){try{await navigator.clipboard.writeText(sellerAccount.sellerId);setNotice('تم نسخ معرّف البائع')}catch{setNotice('تعذّر النسخ تلقائيًا. المعرّف: '+sellerAccount.sellerId)}}
  async function fullscreen(){try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen()}catch{setNotice('ملء الشاشة غير متاح في هذا المتصفح')}}
  const sidebar=<Sidebar onNavigate={()=>{setDrawerOpen(false);setQuery('')}} onHelp={()=>{setDrawerOpen(false);setHelpOpen(true)}}/>;
  return <div id="overview">
    <a className="skip-link" href="#dashboard-content" onClick={e=>{e.preventDefault();document.getElementById('dashboard-content')?.focus()}}>تخطي إلى المحتوى</a>
    <aside className="sidebar" aria-label="القائمة الرئيسية">{sidebar}</aside>
    <div className="app-shell">
      <header className="topbar">
        <div className="search-area">
          <IconButton className="mobile-menu" icon="menu-2" label="فتح القائمة" aria-expanded={drawerOpen} onPress={()=>setDrawerOpen(true)}/>
          <TextField aria-label="بحث في اللوحة" value={query} onChange={setQuery} className="dashboard-search"><div className="search-control"><Icon name="search"/><Input placeholder="ابحث في الطلبات أو المنتجات أو الشحنات…" onKeyDown={event=>{if(event.key==='Escape')setQuery('')}}/></div></TextField>
          {term?<div className="search-results" aria-label="نتائج البحث" role="region">{matches.length?matches.map(metric=><Button variant="ghost" className="search-result" key={metric.group+metric.index} onPress={()=>selectResult(metric)}><span>{metric.label}<small>{metricGroups[metric.group].label}</small></span><bdi dir="ltr">{metric.currency}{metric.value}</bdi></Button>):<p>{available?'لا توجد نتائج مطابقة.':'لا تتوفر بيانات في الفترة المختارة.'}</p>}</div>:null}
        </div>
        <Account onCopy={copySellerId} onFullscreen={fullscreen}/>
      </header>
      <main id="dashboard-content" tabIndex={-1}><div className="page-heading"><h1>{title}</h1></div><Outlet context={{notify:setNotice}}/></main>
    </div>
    <AppModal open={helpOpen} setOpen={setHelpOpen} title="محتاج مساعدة؟" footer={<Button variant="secondary" onPress={()=>setHelpOpen(false)}>إغلاق</Button>}><p>يمكنك التواصل مع فريق هلا من خلال مركز المساعدة في حسابك على المنصة.</p><a className="platform-link" href="https://seller.halakommers.com/" target="_blank" rel="noopener noreferrer">فتح منصة هلا</a></AppModal>
    <Modal><Modal.Backdrop isOpen={drawerOpen} onOpenChange={setDrawerOpen}><Modal.Container className="drawer-container"><Modal.Dialog className="drawer-dialog"><Modal.CloseTrigger aria-label="إغلاق القائمة"/><Modal.Heading className="sr-only">القائمة الرئيسية</Modal.Heading>{sidebar}</Modal.Dialog></Modal.Container></Modal.Backdrop></Modal>
    {notice?<div className="notice" role="status">{notice}</div>:null}
  </div>;
}
