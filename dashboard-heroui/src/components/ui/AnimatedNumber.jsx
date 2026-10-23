import {useEffect,useRef,useState} from 'react';

// Keep the exact source value for assistive technology and the final frame.
export function AnimatedNumber({value}){
  const target=String(value);
  const ref=useRef(null);
  const [display,setDisplay]=useState(()=>{
    const number=Number(target);
    const reduce=typeof window==='undefined'||window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return reduce||!Number.isFinite(number)||number===0?target:(0).toFixed(target.split('.')[1]?.length||0);
  });
  useEffect(()=>{
    const number=Number(target);
    const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
    if(!Number.isFinite(number)||number===0||motion.matches){setDisplay(target);return;}
    const decimals=target.split('.')[1]?.length||0;
    let frame=0,observer,started=false,cancelled=false;
    function finish(){cancelAnimationFrame(frame);setDisplay(target)}
    function start(){
      if(started||cancelled||motion.matches)return;
      started=true;
      const beginning=performance.now();
      setDisplay((0).toFixed(decimals));
      function tick(now){
        if(cancelled)return;
        const progress=Math.min((now-beginning)/400,1);
        setDisplay(progress===1?target:(number*(1-Math.pow(1-progress,3))).toFixed(decimals));
        if(progress<1)frame=requestAnimationFrame(tick);
      }
      frame=requestAnimationFrame(tick);
    }
    function onMotionChange(){if(motion.matches){observer?.disconnect();finish()}}
    motion.addEventListener('change',onMotionChange);
    if('IntersectionObserver' in window){
      observer=new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting)){observer.disconnect();start()}},{threshold:0.25});
      observer.observe(ref.current);
    }else start();
    return()=>{cancelled=true;cancelAnimationFrame(frame);observer?.disconnect();motion.removeEventListener('change',onMotionChange)};
  },[target]);
  return <><span ref={ref} aria-hidden="true">{display}</span><span className="sr-only">{target}</span></>;
}
