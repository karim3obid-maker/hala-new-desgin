import {useEffect,useState} from 'react';
import {Button,Input,Modal,TextField} from '@heroui/react';
import {Outlet,useLocation,useNavigate} from 'react-router';
import data from '../../data/dashboard.json';
import {walletMetrics} from '../../data/wallet';
import {snapshotMetrics} from '../../data/orders';
import {metricGroups,pageTitles} from '../../config/navigation';
import {sellerAccount} from '../../config/account';
import {useDashboard} from '../../context/DashboardContext';
import {Icon,IconButton} from '../ui/Icon';
import {Account} from './Account';
import {Sidebar} from './Sidebar';

const normalize=text=>text.trim().replace(/[أإآ]/g,'ا').replace(/ة/g,'ه').replace(/[ًٌٍَُِّْ]/g,'');
const allMetrics=Object.entries(metricGroups).flatMap(([group])=>(group==='orders'?snapshotMetrics:group==='financial'?walletMetrics:data[group]).map((metric,index)=>({...metric,group,index})));
export function AdminLayout(){
  const [drawerOpen,setDrawerOpen]=useState(false);
  const [sidebarCollapsed,setSidebarCollapsed]=useState(()=>{try{return (localStorage.getItem('hala-sidebar-collapsed')??localStorage.getItem('hala-sidebar-hidden'))==='true'}catch{return false}});
  const [query,setQuery]=useState('');
  const [notice,setNotice]=useState('');
  const {available}=useDashboard();
  const location=useLocation();
  const navigate=useNavigate();
  const title=pageTitles[location.pathname]||(location.pathname.startsWith('/help/learning/')?'فيديوهات تعليمية':location.pathname.startsWith('/hala-land/pages/')?'تعديل صفحة هبوط':location.pathname.startsWith('/import-orders/')&&location.pathname.endsWith('/thank-you')?'تمت إضافة طلب الاستيراد':location.pathname.startsWith('/import-orders/')?'تفاصيل طلب الاستيراد':location.pathname.startsWith('/shipments/')?'تفاصيل الشحنة':location.pathname.startsWith('/products/item/')?'تفاصيل المنتج':location.pathname.startsWith('/orders/drafts/')?'تعديل طلب درافت':location.pathname.startsWith('/orders/')?'تفاصيل الطلب':'الصفحة غير موجودة');
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
  function toggleSidebar(){
    const next=!sidebarCollapsed;
    setSidebarCollapsed(next);
    try{localStorage.setItem('hala-sidebar-collapsed',String(next))}catch{/* The toggle still works when browser storage is unavailable. */}
  }
  async function copySellerId(){try{await navigator.clipboard.writeText(sellerAccount.sellerId);setNotice('تم نسخ معرّف البائع')}catch{setNotice('تعذّر النسخ تلقائيًا. المعرّف: '+sellerAccount.sellerId)}}
  async function fullscreen(){try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen()}catch{setNotice('ملء الشاشة غير متاح في هذا المتصفح')}}
  const sidebar=<Sidebar onNavigate={()=>{setDrawerOpen(false);setQuery('')}}/>;
  return <div id="overview" className={sidebarCollapsed?'sidebar-collapsed':undefined}>
    <a className="skip-link" href="#dashboard-content" onClick={e=>{e.preventDefault();document.getElementById('dashboard-content')?.focus()}}>تخطي إلى المحتوى</a>
    <aside id="desktop-navigation" className="sidebar" aria-label="القائمة الرئيسية"><Sidebar collapsed={sidebarCollapsed} onNavigate={()=>{setDrawerOpen(false);setQuery('')}}/></aside>
    <div className="app-shell">
      <header className="topbar">
        <div className="search-area">
          <IconButton className="desktop-sidebar-toggle" icon="menu-2" label={sidebarCollapsed?'توسيع القائمة الجانبية':'تصغير القائمة إلى أيقونات'} title={sidebarCollapsed?'توسيع القائمة الجانبية':'تصغير القائمة إلى أيقونات'} aria-expanded={!sidebarCollapsed} aria-controls="desktop-navigation" onPress={toggleSidebar}/>
          <IconButton className="mobile-menu" icon="menu-2" label="فتح القائمة" aria-expanded={drawerOpen} onPress={()=>setDrawerOpen(true)}/>
          <TextField aria-label="بحث في اللوحة" value={query} onChange={setQuery} className="dashboard-search"><div className="search-control"><Icon name="search"/><Input placeholder="ابحث في الطلبات أو المنتجات أو الشحنات…" onKeyDown={event=>{if(event.key==='Escape')setQuery('')}}/></div></TextField>
          {term?<div className="search-results" aria-label="نتائج البحث" role="region">{matches.length?matches.map(metric=><Button variant="ghost" className="search-result" key={metric.group+metric.index} onPress={()=>selectResult(metric)}><span>{metric.label}<small>{metricGroups[metric.group].label}</small></span><bdi dir="ltr">{metric.currency}{metric.value}</bdi></Button>):<p>{available?'لا توجد نتائج مطابقة.':'لا تتوفر بيانات في الفترة المختارة.'}</p>}</div>:null}
        </div>
        <Account onCopy={copySellerId} onFullscreen={fullscreen}/>
      </header>
      <main id="dashboard-content" tabIndex={-1}><div className="page-heading"><h1>{title}</h1></div><Outlet context={{notify:setNotice}}/></main>
    </div>
    <Modal><Modal.Backdrop isOpen={drawerOpen} onOpenChange={setDrawerOpen}><Modal.Container className="drawer-container"><Modal.Dialog className="drawer-dialog"><Modal.CloseTrigger aria-label="إغلاق القائمة"/><Modal.Heading className="sr-only">القائمة الرئيسية</Modal.Heading>{sidebar}</Modal.Dialog></Modal.Container></Modal.Backdrop></Modal>
    {notice?<div className="notice" role="status">{notice}</div>:null}
  </div>;
}
