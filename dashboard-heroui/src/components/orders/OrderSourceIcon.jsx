import {Icon} from '../ui/Icon';
import {integrationPlatforms,integrationSnapshot} from '../../data/integrations';

const sourceAliases={
  'ايزي اورد':'easyorders','إيزي أوردر':'easyorders',easyorders:'easyorders',
  'يوكان':'youcan',youcan:'youcan',
  'لايت فنلز':'lightfunnels','لايت فينلز':'lightfunnels',lightfunnels:'lightfunnels',
  'شوبيفاي':'shopify',shopify:'shopify',
  'إكسل':'excel','اكسل':'excel',excel:'excel','excel sheet':'excel','ملف excel':'excel','ملف إكسل':'excel',
};

function platformForOrder(order){
  const source=String(order.source??'').trim();
  const store=integrationSnapshot.find(item=>item.name===source);
  return order.platform||store?.platform||sourceAliases[source.toLowerCase()]||null;
}

export function OrderSourceIcon({order}){
  const platformId=platformForOrder(order);
  const platform=integrationPlatforms.find(item=>item.id===platformId);
  const isExcel=platformId==='excel';
  const label=platform?.name||(isExcel?'Excel':order.source||'غير معروف');
  const description=platform&&order.source!==platform.name?`${platform.name} · ${order.source}`:label;
  return <span className={'order-source-icon'+(isExcel?' is-excel':'')+(platform?' has-logo':'')} tabIndex={0} title={description} aria-label={'مصدر الطلب: '+description}>
    {platform?.logo?<img src={platform.logo} alt="" width="24" height="24"/>:isExcel?<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.8"/><path d="M3 9h18M9 9v12m5-12v12M3 15h18" stroke="currentColor" strokeWidth="1.4"/></svg>:<Icon name={order.source==='هلا لاند'?'layout-grid':order.source==='إضافة يدوية'?'person':'building-store'}/>}
  </span>;
}
