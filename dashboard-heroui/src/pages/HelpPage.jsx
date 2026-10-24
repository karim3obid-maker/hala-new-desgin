import {useRef,useState} from 'react';
import {Card} from '@heroui/react';
import {Icon} from '../components/ui/Icon';
import {helpSections} from '../data/help';

export default function HelpPage(){
  const [active,setActive]=useState(helpSections[0].id);
  const tabs=useRef([]);
  function onTabKey(event,index){
    let next;
    if(event.key==='ArrowLeft')next=(index+1)%helpSections.length;
    else if(event.key==='ArrowRight')next=(index-1+helpSections.length)%helpSections.length;
    else if(event.key==='Home')next=0;
    else if(event.key==='End')next=helpSections.length-1;
    else return;
    event.preventDefault();setActive(helpSections[next].id);tabs.current[next]?.focus();
  }
  return <div className="help-page">
    <div className="help-intro"><span className="help-intro-icon"><Icon name="headset"/></span><p>تعلّم استخدام المنصة واطّلع على إرشادات العمل مع هلا</p></div>
    <Card className="help-card">
      <div className="help-tabs" role="tablist" aria-label="أقسام المساعدة" aria-orientation="horizontal">{helpSections.map((section,index)=><button key={section.id} ref={element=>{tabs.current[index]=element}} type="button" role="tab" id={`help-tab-${section.id}`} aria-selected={active===section.id} aria-controls={`help-panel-${section.id}`} tabIndex={active===section.id?0:-1} onClick={()=>setActive(section.id)} onKeyDown={event=>onTabKey(event,index)}><Icon name={section.icon}/>{section.label}</button>)}</div>
      {helpSections.map(section=>{
        const items=section.type==='videos'?section.videos:section.articles;
        return <section key={section.id} className="help-panel" role="tabpanel" id={`help-panel-${section.id}`} aria-labelledby={`help-tab-${section.id}`} hidden={active!==section.id} tabIndex={0}>
          <header className="help-section-heading"><h2>{section.label}</h2><p>{section.description}</p></header>
          {!items.length?<div className="help-empty"><span><Icon name={section.icon}/></span><h3>{section.emptyTitle}</h3><p>{section.emptyText}</p></div>:section.type==='videos'?<div className="help-video-grid">{items.map(video=><article className="help-video" key={video.id}><span className="help-video-icon"><Icon name="circle-play"/></span><h3>{video.title}</h3><p>{video.description}</p><a href={video.url} target="_blank" rel="noopener noreferrer">مشاهدة الفيديو<Icon name="share"/><span className="sr-only"> (يفتح في تبويب جديد)</span></a></article>)}</div>:<div className="help-articles">{items.map(article=><article key={article.id}><h3>{article.title}</h3>{article.sections.map((part,index)=><section key={index}><h4>{part.heading}</h4>{part.paragraphs.map((paragraph,i)=><p key={i}>{paragraph}</p>)}</section>)}</article>)}</div>}
        </section>
      })}
    </Card>
  </div>
}
