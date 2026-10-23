import {Fragment,useState} from 'react';
import {Card} from '@heroui/react';
import {NavLink,useLocation} from 'react-router';
import logo from '../../assets/hala-logo.png';
import {navigation} from '../../config/navigation';
import {accountManager} from '../../config/account';
import {Icon,colors} from '../ui/Icon';

export function Sidebar({onNavigate,collapsed=false}){
  const {pathname}=useLocation();
  const [productsExpanded,setProductsExpanded]=useState(true);
  return <>
    <NavLink to="/" onClick={onNavigate} className="brand" aria-label="هلا كوميرس — الرئيسية"><span className="logo-crop"><img src={logo} alt="Hala kommers"/></span></NavLink>
    <nav className="side-nav" aria-label="أقسام هلا">
      <p className="nav-caption">إدارة المتجر</p>
      {navigation.map(({icon,label,path,children},index)=><Fragment key={label}>{path==='/calculator'?<p className="nav-caption nav-caption-tools">أدوات الحساب</p>:null}{path?<NavLink end={!children&&!['/shipments','/import-orders','/offers'].includes(path)} to={path} key={label} aria-label={label} title={collapsed?label:undefined} aria-expanded={!collapsed&&path==='/products'?pathname.startsWith(path)&&productsExpanded:undefined} onClick={event=>{if(path==='/products'&&!collapsed){if(pathname.startsWith(path)){event.preventDefault();setProductsExpanded(value=>!value);return}setProductsExpanded(true)}onNavigate?.()}} className={({isActive})=>'side-link '+(isActive?'current':'')}>
        {({isActive})=><><Icon name={icon} color={isActive?colors.purple:undefined}/><span>{label}</span>{children?<Icon name="chevron-down" className="nav-group-indicator"/>:null}</>}
      </NavLink>:<span className="side-link static" key={label}><Icon name={icon}/><span>{label}</span></span>}{!collapsed&&children&&pathname.startsWith(path)&&(path!=='/products'||productsExpanded)?<div className="side-subnav" aria-label={'صفحات '+label}>{children.map(child=><NavLink end={child.path==='/orders'||child.path==='/products'} to={child.path} title={child.description} key={child.path} onClick={onNavigate} className={({isActive})=>'side-link side-sublink '+(isActive?'current':'')}>{child.label}</NavLink>)}</div>:null}</Fragment>)}
    </nav>
    <Card className="account-manager-card" variant="secondary" aria-label="تواصل مع مدير حسابك">
      <div className="account-manager-heading"><span className="account-manager-avatar" aria-hidden="true">{accountManager.initials}</span><div><p>مدير حسابك</p><h3>{accountManager.name}</h3></div></div>
      <p className="account-manager-support">{accountManager.supportMessage}</p>
      <bdi className="account-manager-phone" dir="ltr">{accountManager.phone}</bdi>
      <a className="account-manager-whatsapp" href={'https://wa.me/'+accountManager.whatsappNumber} target="_blank" rel="noopener noreferrer" aria-label={'تواصل مع '+accountManager.name+' على واتساب'} title={collapsed?'تواصل مع مدير حسابك على واتساب':undefined}>
        <Icon name="whatsapp"/><span>تواصل عبر واتساب</span>
      </a>
    </Card>
  </>;
}
