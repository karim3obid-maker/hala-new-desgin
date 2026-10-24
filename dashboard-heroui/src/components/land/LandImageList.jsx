import {useRef,useState} from 'react';
import {BlobImage} from './LandFields';
import {Icon,IconButton} from '../ui/Icon';

export default function LandImageList({images,selected,busy,onSelect,onImages,onMove}){
  const gesture=useRef(null),list=useRef(null);
  const [drag,setDrag]=useState(null),[announcement,setAnnouncement]=useState('');
  function clear(){gesture.current=null;setDrag(null)}
  function move(index,step){onMove(index,step);setAnnouncement('تم نقل الصورة '+(index+1)+' إلى الموضع '+(index+step+1)+'.')}
  function start(event,id){
    if(busy||images.length<2||!event.isPrimary||event.button!==0)return;
    event.currentTarget.setPointerCapture(event.pointerId);
    gesture.current={id,pointerId:event.pointerId,startY:event.clientY,targetId:id,active:false};
  }
  function track(event){
    const current=gesture.current;
    if(!current||current.pointerId!==event.pointerId||busy)return;
    if(!current.active&&Math.abs(event.clientY-current.startY)<6)return;
    current.active=true;
    const rows=Array.from(list.current?.children||[]);
    const bounds=list.current.getBoundingClientRect();
    if(event.clientX<bounds.left-40||event.clientX>bounds.right+40){current.targetId=current.id;setDrag({id:current.id,targetId:current.id});return}
    let nearest=null,distance=Infinity;
    for(const row of rows){const rect=row.getBoundingClientRect(),delta=Math.abs(event.clientY-(rect.top+rect.height/2));if(delta<distance){nearest=row;distance=delta}}
    current.targetId=nearest?.dataset.imageId||current.id;
    setDrag({id:current.id,targetId:current.targetId});
    if(event.clientY>window.innerHeight-65)window.scrollBy(0,16);
    else if(event.clientY<80)window.scrollBy(0,-16);
  }
  function finish(event){
    const current=gesture.current;
    if(!current||current.pointerId!==event.pointerId)return;
    if(!busy&&current.active&&current.id!==current.targetId){
      const from=images.findIndex(image=>image.id===current.id),to=images.findIndex(image=>image.id===current.targetId);
      if(from>=0&&to>=0){const reordered=[...images];reordered.splice(to,0,reordered.splice(from,1)[0]);onImages(reordered);setAnnouncement('تم نقل الصورة '+(from+1)+' إلى الموضع '+(to+1)+'.')}
    }
    clear();
  }
  return <><p className="land-help" id="land-image-sort-help">اسحب من مقبض الصورة لترتيبها، أو استخدم الأسهم. على لوحة المفاتيح استخدم سهم أعلى أو أسفل عند التركيز على المقبض.</p><ol ref={list} className="land-inspector-image-list" aria-label="ترتيب صور اللاند">{images.map((image,i)=><li key={image.id} data-image-id={image.id} className={(drag?.id===image.id?'is-dragging ':'')+(drag&&drag.targetId===image.id&&drag.id!==image.id?'is-drop-target':'')}><button type="button" className="land-image-drag-handle" disabled={busy||images.length<2} aria-label={'سحب وترتيب الصورة '+(i+1)} aria-describedby="land-image-sort-help" onPointerDown={event=>start(event,image.id)} onPointerMove={track} onPointerUp={finish} onPointerCancel={clear} onLostPointerCapture={clear} onKeyDown={event=>{if(event.key==='Escape'){clear();return}if(busy)return;if(event.key==='ArrowUp'&&i>0){event.preventDefault();move(i,-1)}else if(event.key==='ArrowDown'&&i<images.length-1){event.preventDefault();move(i,1)}}}><Icon name="menu-2"/></button><button type="button" className="land-inspector-image-select" aria-label={'تعديل الصورة '+(i+1)+' من القائمة'} aria-pressed={selected===image.id} disabled={busy} onClick={()=>onSelect(image.id)}><BlobImage asset={image} alt="" loading="lazy"/><span><strong>الصورة {i+1}</strong><small>{image.name}</small></span></button><div className="land-inspector-image-order"><IconButton icon="chevron-up" label={'تحريك الصورة '+(i+1)+' لأعلى'} isDisabled={busy||i===0} onPress={()=>move(i,-1)}/><IconButton icon="chevron-down" label={'تحريك الصورة '+(i+1)+' لأسفل'} isDisabled={busy||i===images.length-1} onPress={()=>move(i,1)}/></div></li>)}</ol><p className="land-sort-status" role="status" aria-live="polite">{drag?'أفلت الصورة في الموضع المحدد، أو اضغط Escape للإلغاء.':announcement}</p></>;
}
