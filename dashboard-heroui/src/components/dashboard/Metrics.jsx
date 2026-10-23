import {Card,Chip} from '@heroui/react';
import {Icon,colors} from '../ui/Icon';
import {AnimatedNumber} from '../ui/AnimatedNumber';
export function Metric({item,group,index}){return <article id={`${group}-metric-${index}`} tabIndex={-1} className={'metric '+(item.highlight?'highlight':'')} data-search={item.label} data-section={group} data-value={(item.currency||'')+item.value}>
  <h3 className="metric-label">{item.label}</h3><span className={'metric-icon tone-'+item.tone}><Icon name={item.icon} color={colors[item.tone]}/></span>
  <bdi dir="ltr" className="metric-value">{item.currency?<span className="currency">{item.currency}</span>:null}<AnimatedNumber value={item.value}/></bdi>{item.percentage?<bdi dir="ltr" className="metric-percentage">{item.percentage}</bdi>:null}
  {item.caption?<p className="metric-caption">{item.caption}</p>:null}
  </article>}
export function MetricRows({items,group}){return <div className={'metrics '+(group==='financial'?'money-metrics':'')}>{items.map((item,index)=><Metric key={item.label} item={item} group={group} index={index}/>)}</div>}
export function Section({id,title,icon,children,after}){return <section className="dashboard-section" id={id} aria-labelledby={id+'-title'}><div className="section-heading"><Icon name={icon} color={colors.purple}/><h2 id={id+'-title'}>{title}</h2></div><Card className="section-card">{children}</Card>{after}</section>}
export function TotalChip({children='211 إجمالي'}){return <Chip size="sm" color="accent" variant="soft" className="total-chip">{children}</Chip>}
