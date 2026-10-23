import {Link} from 'react-router';
import {Section} from './Metrics';
import {Icon} from '../ui/Icon';
import {AnimatedNumber} from '../ui/AnimatedNumber';

// Design examples only. These counts are independent of all snapshot metrics.
const exampleTasks=[
  {id:'incomplete',title:'طلبات درافت',count:6,icon:'edit',action:'فتح الدرافت',path:'/orders/drafts'},
  {id:'delivery',title:'شحنات تحتاج متابعة',count:4,icon:'truck',action:'متابعة الشحنات',path:'/shipments?status=failed'},
  {id:'followup',title:'طلبات مؤجلة',count:3,icon:'clock',action:'عرض المؤجل',path:'/orders?status=deferred'},
  {id:'stock',title:'منتجات مخزونها منخفض',count:2,icon:'package',action:'مراجعة المخزون',path:'/products?sort=stock-asc'},
];

export function TodayTasks(){
  return <>
    <Section id="today-tasks" title="مهام اليوم" icon="clock">
      <div className="today-tasks-intro"><p>ابدأ بالحالات التي تحتاج تدخلك</p><span className="today-tasks-demo"><Icon name="info"/>أعداد توضيحية</span></div>
      <div className="today-tasks-grid">{exampleTasks.map(task=><article key={task.id} className="today-task" aria-labelledby={'today-task-'+task.id}>
        <div className="today-task-heading"><span className="today-task-icon"><Icon name={task.icon}/></span><bdi dir="ltr"><AnimatedNumber value={task.count}/></bdi><h3 id={'today-task-'+task.id}>{task.title}</h3></div>
        <Link className="today-task-action" to={task.path}>{task.action}<Icon name="chevron-left"/></Link>
      </article>)}</div>
    </Section>
  </>;
}
