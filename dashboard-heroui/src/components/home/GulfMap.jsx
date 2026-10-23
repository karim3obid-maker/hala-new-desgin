import {useEffect,useRef,useState} from 'react';
import geography from '../../data/gulf-map.json';
import logo from '../../assets/hala-logo.png';
const origin=[410.8,260.1];
const places=[
 {name:'السعودية',x:410.8,y:260.1,lx:410.8,ly:293,anchor:'middle'},
 {name:'الكويت',x:447.4,y:129.6,lx:447.4,ly:109,anchor:'middle'},
 {name:'البحرين',x:520.2,y:217.8,lx:498,ly:197,anchor:'end'},
 {name:'قطر',x:546.8,y:244.2,lx:567,ly:241,anchor:'start'},
 {name:'الإمارات',x:626.4,y:267.4,lx:624,ly:302,anchor:'middle'},
 {name:'عُمان',x:739.2,y:291.2,lx:760,ly:282,anchor:'start'},
];
const routes=places.slice(1).map((p,i)=>`M${origin[0]},${origin[1]} Q${(origin[0]+p.x)/2},${Math.min(origin[1],p.y)-45-i*5} ${p.x},${p.y}`);
export default function GulfMap(){
 const [paused,setPaused]=useState(false);const [motionOverride,setMotionOverride]=useState(false);const [reduced,setReduced]=useState(()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches);const [offscreen,setOffscreen]=useState(false);const ref=useRef(null);
 useEffect(()=>{const media=window.matchMedia('(prefers-reduced-motion: reduce)');const change=()=>setReduced(media.matches);media.addEventListener('change',change);let observer;if('IntersectionObserver' in window){observer=new IntersectionObserver(([e])=>setOffscreen(!e.isIntersecting),{threshold:0});observer.observe(ref.current)}return()=>{media.removeEventListener('change',change);observer?.disconnect()}},[]);
 const stopped=paused||(reduced&&!motionOverride);
 return <div ref={ref} className={'home-gulf-map '+(stopped||offscreen?'is-paused ':'')+(motionOverride?'motion-enabled':'')}>
 <svg viewBox="60 20 810 575" role="img" aria-labelledby="gulf-map-title gulf-map-desc"><title id="gulf-map-title">هلا في أسواق الخليج</title><desc id="gulf-map-desc">خريطة توضيحية للسعودية والكويت والبحرين وقطر والإمارات وعُمان، مع مسارات شحن زخرفية وليست تتبعًا لشحنات فعلية.</desc>
 <defs><radialGradient id="gulf-land"><stop stopColor="#D8C7F5"/><stop offset="1" stopColor="#ECE5FC"/></radialGradient><radialGradient id="gulf-glow"><stop stopColor="#B999E6" stopOpacity=".25"/><stop offset="1" stopColor="#E9DFFD" stopOpacity="0"/></radialGradient><filter id="gulf-pin-shadow"><feDropShadow dx="0" dy="5" stdDeviation="7" floodColor="#270A5E" floodOpacity=".14"/></filter></defs>
 <ellipse className="gulf-aura" cx="465" cy="270" rx="330" ry="240" fill="url(#gulf-glow)"/>
 <g className="gulf-geography">{geography.map(p=><path key={p.code} d={p.d} className={p.gulf?'gulf-land':'gulf-neighbor'} />)}</g>
 <g fill="none">{routes.map((d,i)=><path key={d} d={d} className="gulf-route" style={{'--route-delay':`${-i*1.3}s`}}/>)}</g>
 <g aria-hidden="true">{routes.map((d,i)=><circle key={d} r={i===3?5:3.5} className={'gulf-moving-dot '+(i===3?'is-orange':'')} style={{offsetPath:`path('${d}')`,'--route-delay':`${-i*1.8}s`,'--route-duration':`${8+i*1.4}s`}}/>)}</g>
 <g className="gulf-markers">{places.map((p,i)=><g key={p.name}><circle cx={p.x} cy={p.y} r="14" className="gulf-pulse" style={{'--pulse-delay':`${-i*.6}s`,transformOrigin:`${p.x}px ${p.y}px`}}/><circle cx={p.x} cy={p.y} r="5.6" fill="#48148C" stroke="#F9F6FF" strokeWidth="2"/><text x={p.lx} y={p.ly} textAnchor={p.anchor} className="gulf-label">{p.name}</text></g>)}</g>
 <g className="gulf-logo-pin" filter="url(#gulf-pin-shadow)" aria-hidden="true"><path d="M411 256 C400 242 378 225 378 205 A33 33 0 1 1 444 205 C444 225 422 242 411 256Z" fill="white"/><svg x="385" y="187" width="52" height="35" viewBox="60 255 1220 670"><image href={logo} width="1339" height="1174"/></svg></g>
 </svg>
 <div className="gulf-map-caption"><span>شبكة تشغيل تجمع أسواق الخليج</span><button type="button" onClick={()=>{if(reduced&&!motionOverride){setMotionOverride(true);setPaused(false)}else setPaused(!paused)}} aria-pressed={!stopped}>{stopped?'تشغيل الحركة':'إيقاف الحركة'}<span aria-hidden="true">{stopped?'▷':'Ⅱ'}</span></button></div>
 </div>
}
