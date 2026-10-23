import {Fragment,useState} from 'react';
import {Button,Card} from '@heroui/react';
import {NavLink,useLocation} from 'react-router';
import logo from '../../assets/hala-logo.png';
import {navigation} from '../../config/navigation';
import {Icon,colors} from '../ui/Icon';

export function Sidebar({onNavigate,onHelp}){
  const {pathname}=useLocation();
  const [productsExpanded,setProductsExpanded]=useState(true);
  return <>
    <NavLink to="/" onClick={onNavigate} className="brand" aria-label="هلا كوميرس — الرئيسية"><span className="logo-crop"><img src={logo} alt="Hala kommers"/></span></NavLink>
    <nav className="side-nav" aria-label="أقسام هلا">
      <p className="nav-caption">إدارة المتجر</p>
      {navigation.map(({icon,label,path,children},index)=><Fragment key={label}>{index===8?<p className="nav-caption nav-caption-tools">أدوات الحساب</p>:null}{path?<NavLink end={!children&&path!=='/shipments'} to={path} key={label} aria-expanded={path==='/products'?pathname.startsWith(path)&&productsExpanded:undefined} onClick={event=>{if(path==='/products'){if(pathname.startsWith(path)){event.preventDefault();setProductsExpanded(value=>!value);return}setProductsExpanded(true)}onNavigate?.()}} className={({isActive})=>'side-link '+(isActive?'current':'')}>
        {({isActive})=><><Icon name={icon} color={isActive?colors.purple:undefined}/><span>{label}</span>{children?<Icon name="chevron-down" className="nav-group-indicator"/>:null}</>}
      </NavLink>:<span className="side-link static" key={label}><Icon name={icon}/><span>{label}</span></span>}{children&&pathname.startsWith(path)&&(path!=='/products'||productsExpanded)?<div className="side-subnav" aria-label={'صفحات '+label}>{children.map(child=><NavLink end={child.path==='/orders'||child.path==='/products'} to={child.path} title={child.description} key={child.path} onClick={onNavigate} className={({isActive})=>'side-link side-sublink '+(isActive?'current':'')}>{child.label}</NavLink>)}</div>:null}</Fragment>)}
    </nav>
    <Card className="help-card" variant="secondary"><Icon name="headset" color={colors.purple}/><h3>محتاج مساعدة؟</h3><p>فريق هلا جاهز لمساعدتك<br/>والإجابة على استفساراتك</p><Button size="sm" onPress={onHelp}>تواصل الآن</Button></Card>
  </>;
}
