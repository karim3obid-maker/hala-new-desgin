export function ReasonsList({items,compact=false}){return <ul className={'shipping-failure-list'+(compact?' reasons-list-compact':'')}>
  {items.map(reason=><li key={reason.label} className="shipping-failure-row">
    <span className="shipping-failure-label">{reason.label}</span>
    <span className={'shipping-failure-track failure-'+reason.tone} aria-hidden="true"><span style={{width:reason.percentage+'%'}}/></span>
    <bdi dir="ltr" className="shipping-failure-count">{reason.count}</bdi>
    <bdi dir="ltr" className="shipping-failure-percentage">{reason.percentage}%</bdi>
  </li>)}
</ul>}
