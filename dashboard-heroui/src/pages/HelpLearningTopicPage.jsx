import {useState} from 'react';
import {Card} from '@heroui/react';
import {Link,Navigate,useParams} from 'react-router';
import {Icon} from '../components/ui/Icon';
import {VideoCards} from '../components/help/VideoCards';
import {helpSections} from '../data/help';

const groups=helpSections.find(section=>section.id==='learning')?.groups??[];

export default function HelpLearningTopicPage(){
  const {topicId}=useParams();
  const group=groups.find(item=>item.id===topicId);
  const [openLesson,setOpenLesson]=useState(null);
  if(!group)return <Navigate to="/help" replace/>;
  return <div className="help-page help-topic-page">
    <nav className="help-breadcrumb" aria-label="مسار الصفحة"><Link to="/help">المساعدة</Link><Icon name="chevron-left"/><Link to="/help" state={{helpTab:'learning'}}>فيديوهات تعليمية</Link><Icon name="chevron-left"/><span aria-current="page">{group.label}</span></nav>
    <Card className="help-topic-page-card">
      <header className="help-topic-hero"><span className="help-topic-icon"><Icon name={group.icon}/></span><div><span className="help-topic-kicker">فيديوهات تعليمية</span><h2>{group.label}</h2><p>{group.description}</p></div><span className="help-topic-count">{group.videos.length} دروس</span></header>
      <p className="help-demo-note"><Icon name="info"/>هذه الدروس معاينة تعليمية بنصوص وملخصات؛ روابط الفيديو لم تُضف بعد.</p>
      <nav className="help-topic-nav" aria-label="أقسام الفيديوهات التعليمية">{groups.map(item=><Link key={item.id} to={`/help/learning/${item.id}`} aria-current={item.id===group.id?'page':undefined}><Icon name={item.icon}/>{item.label}</Link>)}</nav>
      <VideoCards videos={group.videos} icon={group.icon} openLesson={openLesson} setOpenLesson={setOpenLesson}/>
    </Card>
  </div>
}
