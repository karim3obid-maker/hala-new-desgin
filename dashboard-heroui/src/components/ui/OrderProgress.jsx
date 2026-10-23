import {Icon,colors} from './Icon';

export function getOrderStage(order,reference=false){
  if(reference)return {index:1,label:'قيد المعالجة',icon:'headset',tone:'blue',description:'الفريق يتواصل مع العميل لتأكيد الطلب.'};
  const stages={
    new:{index:0,icon:'shopping-cart',tone:'purple'},
    incomplete:{index:0,icon:'warning',tone:'red',description:'يلزم تصحيح البيانات لإكمال الطلب.'},
    confirming:{index:1,icon:'headset',tone:'blue'},
    confirmed:{index:2,icon:'circle-check',tone:'green'},
    deferred:{index:1,icon:'clock',tone:'amber'},
    cancelled:{index:2,icon:'circle-x',tone:'red'},
    stock:{index:1,icon:'package-off',tone:'cyan'},
  };
  return {index:1,icon:'clock',tone:'purple',...stages[order.status],label:order.statusLabel};
}

export function OrderProgress({order,reference=false}){
  const current=getOrderStage(order,reference);
  const steps=[{label:'جديد',icon:'shopping-cart'},{label:'قيد المعالجة',icon:'headset'},{label:'التنفيذ / التأكيد',icon:'circle-check'}];
  steps[current.index]={label:current.label,icon:current.icon};
  return <ol className="order-progress" aria-label="مراحل الطلب">
    {steps.map((step,index)=>{
      const active=index===current.index;
      // Previous history is available only for the separate reference detail snapshot.
      const complete=reference&&index<current.index;
      return <li key={index} className={active?'active':complete?'complete':''} aria-current={active?'step':undefined} style={active?{'--stage-color':colors[current.tone]}:undefined}>
        <span className="order-stage-icon"><Icon name={complete?'circle-check':step.icon}/>{active?<span className="stage-current-dot"/>:null}</span>
        <div><strong>{step.label}</strong>{active?<><span className="stage-current-label">الحالة الحالية</span>{current.description?<small>{current.description}</small>:null}</>:complete?<span className="stage-complete-label">مكتملة</span>:null}</div>
      </li>;
    })}
  </ol>;
}
