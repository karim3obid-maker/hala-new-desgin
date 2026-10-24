import {useEffect,useState} from 'react';
import {Icon} from '../ui/Icon';
export default function LandCountdown({deadline,prominent=false,offerBanner=false}){
 const [now,setNow]=useState(Date.now());
 useEffect(()=>{setNow(Date.now());const interval=setInterval(()=>setNow(Date.now()),1000);return ()=>clearInterval(interval)},[deadline]);
 const left=Math.max(0,Math.floor((Date.parse(deadline)-now)/1000));
 const days=Math.floor(left/86400),hours=Math.floor(left%86400/3600),minutes=Math.floor(left%3600/60),seconds=left%60;
 if(offerBanner)return <div className="land-limited-countdown"><div className="land-limited-heading"><Icon name="gift"/><div><strong>{left?'عرض لفترة محدودة':'انتهت مدة العرض'}</strong>{left?<span>ينتهي العرض خلال:</span>:null}</div></div>{left?<div className="land-limited-units" role="timer" aria-live="off" aria-label={`${Math.floor(left/3600)} ساعات و${minutes} دقائق و${seconds} ثوانٍ`}>{[[Math.floor(left/3600),'ساعة'],[minutes,'دقيقة'],[seconds,'ثانية']].map(([value,label])=><div key={label}><bdi>{String(value).padStart(2,'0')}</bdi><span>{label}</span></div>)}</div>:null}</div>;
 const units=[[days,'أيام'],[hours,'ساعات'],[minutes,'دقائق'],[seconds,'ثواني']];
 return <div className={'land-countdown'+(prominent?' land-countdown-prominent':'')}><span className="land-countdown-heading">{prominent?<Icon name="clock"/>:null}{left?(prominent?'الوقت المتبقي للخصم':'ينتهي العرض خلال'):'انتهت مدة العرض'}</span>{left?(prominent?<div className="land-countdown-units" role="timer" aria-live="off" aria-label={`${days} أيام و${hours} ساعات و${minutes} دقائق و${seconds} ثوانٍ`}>{units.map(([value,label])=><div key={label}><bdi dir="ltr">{String(value).padStart(2,'0')}</bdi><span>{label}</span></div>)}</div>:<bdi dir="ltr">{days?days+' يوم · ':''}{[hours,minutes,seconds].map(n=>String(n).padStart(2,'0')).join(':')}</bdi>):null}<small>حتى {new Intl.DateTimeFormat('ar-EG',{dateStyle:'short',timeStyle:'short',timeZone:'Africa/Cairo'}).format(new Date(deadline))} بتوقيت القاهرة</small></div>;
}
