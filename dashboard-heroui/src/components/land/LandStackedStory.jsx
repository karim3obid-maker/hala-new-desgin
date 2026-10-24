import {Fragment} from 'react';
import {BlobImage} from './LandFields';
import {Icon} from '../ui/Icon';

export default function LandStackedStory({page,product,offer,onBuy,onEdit,expired=false,empty,children}){
  const image=(asset,index)=><div className="land-story-image">{onEdit?<button type="button" className="land-canvas-image" onClick={()=>onEdit(asset.id)} aria-label={'تعديل صورة اللاند '+(index+1)}><BlobImage asset={asset} alt={(product?.name||page.name)+' — '+(index+1)} loading={index?'lazy':'eager'}/><span>تعديل الصورة</span></button>:<BlobImage asset={asset} alt={(product?.name||page.name)+' — '+(index+1)} width={asset.width} height={asset.height} loading={index?'lazy':'eager'}/>}</div>;
  const cta=<button type="button" className="land-sitar-primary" disabled={expired} onClick={onBuy}><Icon name="building-store"/>{page.settings.ctaText||'اطلب الآن'}</button>;
  return <section className="land-stacked-story" aria-label="صفحة صور المنتج والطلب">
    {page.images[0]?image(page.images[0],0):empty}
    <div className="land-story-intro"><h1>{page.name||product?.name}</h1>{page.content.subtitle?<p className="land-story-subtitle">{page.content.subtitle}</p>:null}{cta}<div className="land-story-price-rating"><strong><bdi>{Number(offer?.price||0).toFixed(2)}</bdi> <small>ر.س</small></strong><div className="land-story-rating"><span aria-hidden="true">{Array.from({length:5},(_,i)=><Icon name="star" key={i}/>)}</span><span>٤٫٨ من ٥ <small>· تقييم توضيحي</small></span></div></div></div>
    {page.images.slice(1).map((asset,index)=><Fragment key={asset.id}>{image(asset,index+1)}{index<page.images.length-2?<div className="land-story-image-cta">{cta}</div>:null}</Fragment>)}
    {children?<div className="land-story-form">{children}</div>:null}
  </section>;
}
