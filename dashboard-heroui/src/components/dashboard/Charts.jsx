import {useEffect,useRef} from 'react';
import Chart from 'chart.js/auto';
import data from '../../data/dashboard.json';
import failures from '../../data/shipping-failures.json';
import cancellations from '../../data/order-cancellations.json';
import {ReasonsList} from './ReasonsList';
import {chartPresentation} from '../../config/chartPresentation';
import {colors} from '../ui/Icon';
import {TotalChip} from './Metrics';

function chartConfig(kind,value,color){
  const common={responsive:true,maintainAspectRatio:false,animation:false,plugins:{legend:{display:false},tooltip:{enabled:false}}};
  if(kind==='donut')return {type:'doughnut',data:{datasets:[{data:[value,100-value],backgroundColor:[color,'#EBEBF2'],borderWidth:0,borderRadius:[7,0],hoverOffset:0}]},options:{...common,cutout:'78%',events:[]}};
  if(kind==='distribution')return {type:'bar',data:{labels:data.distribution.labels,datasets:[{data:data.distribution.values,backgroundColor:[colors.orange,colors.blue,colors.green,'#E5E7EE'],barThickness:19,borderRadius:4,borderSkipped:false,grouped:false,order:0},{data:[80,80,80,80],backgroundColor:'#F0F2F6',barThickness:19,borderRadius:4,grouped:false,order:1}]},plugins:[{id:'values',afterDatasetsDraw(chart){const ctx=chart.ctx;ctx.save();ctx.fillStyle='#15132B';ctx.font='500 12px "IBM Plex Sans Arabic"';ctx.textAlign='left';ctx.textBaseline='middle';chart.getDatasetMeta(0).data.forEach((bar,i)=>ctx.fillText(String(data.distribution.values[i]),chart.chartArea.right+10,bar.y));ctx.restore()}}],options:{...common,indexAxis:'y',layout:{padding:{right:25}},scales:{x:{min:0,max:80,ticks:{stepSize:20,font:{size:10}},border:{display:false},grid:{color:'#E9EBF2',drawTicks:false}},y:{border:{display:false},grid:{display:false},ticks:{color:'#15132B',font:{size:11},padding:10}}}}};
  return {type:'line',data:{labels:data.revenue.labels,datasets:[{data:data.revenue.visualValues,borderColor:colors.purple,backgroundColor:'#F1ECF9',borderWidth:2,tension:.3,pointRadius:0,fill:true}]},options:{...common,scales:{y:{min:0,max:160,ticks:{stepSize:40,font:{size:10},padding:8},border:{display:false,dash:[3,4]},grid:{color:'#E7E9F1',drawTicks:false}},x:{border:{color:'#E7E9F1'},grid:{display:false},ticks:{maxRotation:0,autoSkip:false,font:{size:9},callback(value,index,ticks){const last=ticks.length-1;const step=Math.ceil(last/(window.innerWidth<600?3:8));return index===last||(index%step===0&&last-index>=step)?this.getLabelForValue(value):''}}}}}};
}
export function DataChart({kind='donut',value,color,label}){
  const ref=useRef(null);
  useEffect(()=>{let chart;let cancelled=false;document.fonts.ready.then(()=>{if(cancelled)return;Chart.defaults.font.family='IBM Plex Sans Arabic';Chart.defaults.color='#626B82';chart=new Chart(ref.current,chartConfig(kind,value,color))});return()=>{cancelled=true;chart?.destroy()}},[kind,value,color]);
  return <canvas ref={ref} role="img" aria-label={label}/>;
}
export function Donut({value,color,label,caption}){return <div className="donut"><DataChart value={value} color={color} label={`${label} ${value}%`}/><div className="donut-center"><strong dir="ltr">{value}%</strong>{caption?<span>{caption}</span>:null}</div></div>}
export function Ratios(){return <div className="ratios">{data.ratios.filter(ratio=>['نسبة التأكيد','نسبة الإلغاء'].includes(ratio.label)).map(ratio=><article className="ratio" key={ratio.label}><div className="ratio-heading"><h3>{ratio.label}</h3><TotalChip/></div><p className="ratio-caption">{ratio.caption}</p><Donut value={ratio.value} color={colors[ratio.tone]} label={ratio.label}/></article>)}<article className="ratio order-cancellation-reasons"><header className="ratio-heading"><h3>أسباب إلغاء الطلبات</h3></header><p className="ratio-caption">أكثر أسباب إلغاء الطلبات</p><ReasonsList items={cancellations.reasons}/></article></div>}
function ShippingFailures(){return <div className="shipping-failures" aria-labelledby="shipping-failures-title">
  <header className="chart-heading"><h3 id="shipping-failures-title">أسباب فشل الشحنات</h3></header>
  <ReasonsList items={failures.reasons}/>
</div>}
export function ShippingCharts(){return <div className="shipping-insights">
  <div className="shipping-ratios-card" aria-label="نسبة الشحن"><div className="shipping-ratios">
    <article className="shipping-rate"><div className="ratio-heading"><h3>نسبة الشحن</h3><TotalChip>{data.shipments[0].value} إجمالي</TotalChip></div><p className="ratio-caption">{data.shipments[4].value} شحنة تم شحنها</p><Donut value={chartPresentation.shippingPercentage} color={colors.blue} label="نسبة الشحن"/></article>
  </div></div>
  <ShippingFailures/>
</div>}
export function RevenueChart(){return <div className="chart-block revenue-block"><header className="revenue-heading"><div className="chart-heading"><h3>الإيرادات والطلبات</h3><p>اتجاه الإيرادات وعدد الطلبات خلال الفترة المختارة.</p></div><TotalChip>USD</TotalChip></header><div className="revenue"><DataChart kind="revenue" label="منحنى توضيحي للإيرادات خلال أكتوبر 2026"/></div><p className="chart-footnote">منحنى توضيحي.</p></div>}
