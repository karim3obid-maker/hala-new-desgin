import {Icon} from '../ui/Icon';

export function VideoCards({videos,icon,openLesson,setOpenLesson}){
  return <div className="help-video-grid">{videos.map(video=><article className="help-video" key={video.id}>
    <div className="help-video-cover" aria-hidden="true"><span className="help-video-cover-mark"><Icon name={icon}/></span><span className="help-video-play"><Icon name="circle-play"/></span><small>معاينة المحتوى</small></div>
    <div className="help-video-body"><h3>{video.title}</h3><p>{video.description}</p>
      <div className="help-video-actions">{video.url?<a href={video.url} target="_blank" rel="noopener noreferrer">مشاهدة الفيديو<Icon name="share"/><span className="sr-only"> (يفتح في تبويب جديد)</span></a>:<span>الفيديو غير متاح بعد</span>}
        {video.points?.length?<button type="button" aria-expanded={openLesson===video.id} aria-controls={`help-lesson-${video.id}`} onClick={()=>setOpenLesson(openLesson===video.id?null:video.id)}>{openLesson===video.id?'إخفاء الملخص':'اقرأ ملخص الشرح'}<Icon name="chevron-down"/></button>:null}
      </div>
      {video.points?.length?<div id={`help-lesson-${video.id}`} className="help-video-lesson" hidden={openLesson!==video.id}><strong>في هذا الشرح</strong><ol>{video.points.map((point,index)=><li key={index}>{point}</li>)}</ol></div>:null}
    </div>
  </article>)}</div>
}
