import {useState} from 'react';
import {Button,Card} from '@heroui/react';
import data from '../data/dashboard.json';
import cancellations from '../data/order-cancellations.json';
import failures from '../data/shipping-failures.json';
import {chartPresentation} from '../config/chartPresentation';
import {DashboardFilters} from '../components/dashboard/DashboardFilters';
import {PeriodBoundary} from '../components/dashboard/PeriodBoundary';
import {ReasonsList} from '../components/dashboard/ReasonsList';
import {TopProducts} from '../components/dashboard/TopProducts';
import {FinancialSummary} from '../components/dashboard/Summaries';
import {AnimatedNumber} from '../components/ui/AnimatedNumber';
import {Icon,colors} from '../components/ui/Icon';

function StatusCard({item,percentage=false}){
  return <article className="dashboard-two-status">
    <h3>{item.label}</h3>
    <span className={'dashboard-two-status-icon tone-'+item.tone}><Icon name={item.icon} color={colors[item.tone]}/></span>
    <bdi dir="ltr" className="dashboard-two-value"><AnimatedNumber value={item.value}/></bdi>
    {percentage?<bdi dir="ltr" className={'dashboard-two-share share-'+item.tone}>{item.percentage}</bdi>:null}
  </article>;
}
function MinorStatus({item}){
  return <div className="dashboard-two-minor"><Icon name={item.icon} color={colors[item.tone]}/><span>{item.label}</span><bdi dir="ltr"><AnimatedNumber value={item.value}/></bdi></div>;
}
function StatusLane({group,title,icon,primary,secondary}){
  const total=data[group][0];
  return <section className={'dashboard-two-lane lane-'+group} aria-labelledby={group+'-two-title'}>
    <header className="dashboard-two-lane-heading"><h2 id={group+'-two-title'}><Icon name={icon}/>{title}</h2><span className="dashboard-two-total"><span>{total.label}</span><bdi dir="ltr"><AnimatedNumber value={total.value}/></bdi></span></header>
    <div className="dashboard-two-status-grid">{primary.map(index=><StatusCard key={index} item={data[group][index]} percentage={group==='orders'&&[1,3].includes(index)}/>)}</div>
    <div className="dashboard-two-minors">{secondary.map(index=><MinorStatus key={index} item={data[group][index]}/>)}
      {group==='shipments'?<div className="dashboard-two-shipping-rate"><span>نسبة الشحن</span><bdi dir="ltr">{chartPresentation.shippingPercentage}%</bdi><progress max="100" value={chartPresentation.shippingPercentage} aria-label="نسبة الشحن"/></div>:null}
    </div>
  </section>;
}
function ExpandableSection({id,title,icon,children}){
  const [open,setOpen]=useState(false);
  return <div className="dashboard-two-expandable"><Button variant="ghost" className="dashboard-two-expand-button" onPress={()=>setOpen(value=>!value)} aria-expanded={open} aria-controls={id}><span><Icon name={icon}/>{title}</span><Icon name={open?'chevron-down':'chevron-left'}/></Button><div id={id} className="dashboard-two-expanded" hidden={!open}>{open?children:null}</div></div>;
}
export default function DashboardTwoPage(){
  return <div className="dashboard-two"><DashboardFilters/><PeriodBoundary>
    <div className="dashboard-two-content">
      <StatusLane group="orders" title="متابعة الطلبات" icon="shopping-cart" primary={[2,1,6,3]} secondary={[4,5,7]}/>
      <StatusLane group="shipments" title="متابعة الشحنات" icon="truck" primary={[1,4,5,6]} secondary={[2,3,7]}/>
      <div className="dashboard-two-diagnostics">
        <Card className="dashboard-two-reasons" aria-labelledby="orders-two-reasons"><h2 id="orders-two-reasons" className="dashboard-two-cancellations"><Icon name="circle-x"/>أسباب إلغاء الطلبات</h2><ReasonsList items={cancellations.reasons}/></Card>
        <Card className="dashboard-two-reasons" aria-labelledby="shipments-two-reasons"><h2 id="shipments-two-reasons" className="dashboard-two-failures"><Icon name="truck"/>أسباب فشل الشحنات</h2><ReasonsList items={failures.reasons}/></Card>
      </div>
      <div className="dashboard-two-extras"><ExpandableSection id="dashboard-two-products" title="أفضل ٥ منتجات" icon="package"><TopProducts/></ExpandableSection><ExpandableSection id="dashboard-two-financial" title="المالية" icon="wallet"><FinancialSummary/></ExpandableSection></div>
    </div>
  </PeriodBoundary></div>;
}
