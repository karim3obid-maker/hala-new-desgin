import {useEffect,useRef,useState} from 'react';
import {Button,Card} from '@heroui/react';
import {Link,useLocation,useNavigate,useOutletContext,useParams} from 'react-router';
import {Icon,IconButton} from '../components/ui/Icon';
import {AppModal} from '../components/ui/AppModal';
import LandDraftCanvas from '../components/land/LandDraftCanvas';
import LandOffersEditor from '../components/land/LandOffersEditor';
import LandPageSettings from '../components/land/LandPageSettings';
import {BlobImage,Field,LandNotice} from '../components/land/LandFields';
import {useLandData} from '../components/land/useLandData';
import {useLandExit} from '../components/land/useLandExit';
import {LandLoadState} from './HalaLandPage';
import {useProductOffers} from '../context/ProductOffersContext';
import {products} from '../data/products';
import {halaLandService} from '../services/halaLand';
import {emptyPage,validatePage,validateStore,normalizePage} from '../services/halaLandValidation';

function Editor({initial,pages,store,onSaved}){
  const location=useLocation();
  const navigate=useNavigate(),{notify}=useOutletContext(),{offersByProduct}=useProductOffers();
  const [page,setPage]=useState(()=>normalizePage(initial)),[dirty,setDirty]=useState(false),[errors,setErrors]=useState({}),[message,setMessage]=useState(''),[busy,setBusy]=useState(false),[settingsOpen,setSettingsOpen]=useState(false),[saving,setSaving]=useState(false),[saved,setSaved]=useState(!!location.state?.landSaved),[failed,setFailed]=useState(false);
  useEffect(()=>{if(location.state?.landSaved)navigate(location.pathname,{replace:true,state:null})},[location.state,location.pathname,navigate]);
  const lock=useRef(false);
  const product=products.find(product=>product.id===page.productId),offers=offersByProduct[page.productId]||[];
  const selectedOffer=offers.findIndex(offer=>String(offer.quantity)===String(page.quantity)&&String(offer.price)===String(page.price));
  const {destination,setDestination}=useLandExit(dirty,busy);
  const update=(key,value)=>{setPage(current=>({...current,[key]:value}));setDirty(true);setSaved(false);setFailed(false);setMessage('');setErrors(current=>({...current,[key]:undefined,...(['quantity','price'].includes(key)?{offer:undefined}:{})}))};
  function changeProduct(id){setPage(current=>normalizePage({...current,productId:id,quantity:'',price:'',offers:undefined}));setDirty(true);setSaved(false);setFailed(false);setMessage('')}
  function changeOffers(offers){setPage(current=>({...current,offers,quantity:offers[0].quantity,price:offers[0].price}));setDirty(true);setSaved(false);setFailed(false);setErrors(current=>({...current,offer:undefined}));setMessage('')}
  function changeSettings(key,value){setPage(current=>({...current,settings:{...current.settings,[key]:value}}));setDirty(true);setSaved(false);setFailed(false);setErrors(current=>({...current,[key]:undefined}));setMessage('')}
  async function upload(event){const files=Array.from(event.target.files||[]);event.target.value='';if(!files.length||lock.current)return;lock.current=true;setBusy(true);setMessage('');try{const images=await halaLandService.prepareImages(files,page.images.length);update('images',[...page.images,...images])}catch(error){setSaved(false);setFailed(true);setMessage(error.message)}finally{lock.current=false;setBusy(false);setSaving(false)}}
  function changeContent(key,value){setPage(current=>({...current,content:{...current.content,[key]:value}}));setDirty(true);setSaved(false);setFailed(false);setErrors(current=>({...current,content:undefined}));setMessage('')}
  function changeForm(key,value){setPage(current=>({...current,form:{...current.form,[key]:value}}));setDirty(true);setSaved(false);setFailed(false);setErrors(current=>({...current,form:undefined}));setMessage('')}
  async function replaceImage(event,id){const file=event.target.files?.[0];event.target.value='';if(!file||lock.current)return;lock.current=true;setBusy(true);try{const [asset]=await halaLandService.prepareImages([file]);setPage(current=>({...current,images:current.images.map(image=>image.id===id?asset:image)}));setDirty(true);setSaved(false);setFailed(false);setMessage('')}catch(error){setSaved(false);setFailed(true);setMessage(error.message)}finally{lock.current=false;setBusy(false);setSaving(false)}}
  async function save(preview=false){
    if(lock.current)return;const errors=validatePage(page,pages,products);setErrors(errors);setMessage('');setSaved(false);setFailed(false);if(Object.keys(errors).length){setFailed(true);setMessage('راجع الحقول الموضحة قبل حفظ الصفحة.');if(errors.ctaText||errors.formPlacement||errors.expiresAt)setSettingsOpen(true);return}lock.current=true;setBusy(true);setSaving(true);
    try{const saved=await halaLandService.savePage(page,products);setPage(saved);onSaved(saved);setDirty(false);setSaved(true);notify('تم حفظ مسودة الصفحة وصورها على هذا المتصفح.');if(preview)navigate('/hala-land/preview/'+saved.id);else if(!page.id)navigate('/hala-land/pages/'+saved.id+'/edit',{replace:true,state:{landSaved:true}});else setMessage('تم حفظ المسودة المحلية بنجاح.')}catch(error){setSaved(false);setFailed(true);setMessage(error.message)}finally{lock.current=false;setBusy(false);setSaving(false)}
  }
  function move(index,step){const images=[...page.images];[images[index],images[index+step]]=[images[index+step],images[index]];update('images',images)}
  return <div className="land-page land-editor">
    <div className="land-editor-heading"><div><Button variant="ghost" size="sm" isDisabled={busy} onPress={()=>dirty?setDestination('/hala-land'):navigate('/hala-land')}><Icon name="chevron-right"/>صفحات الهبوط</Button><h2>{page.id?'تعديل صفحة الهبوط':'إنشاء صفحة هبوط'}</h2><p>{dirty?'تغييرات غير محفوظة':'مسودة محلية'} · صور مرتبة وفورم شراء</p></div><div className="land-editor-actions"><Button variant="secondary" isDisabled={busy} onPress={()=>setSettingsOpen(true)}><Icon name="settings"/>إعدادات الصفحة</Button><Button variant="secondary" isDisabled={busy} onPress={()=>save(true)}><Icon name="eye"/>حفظ ومعاينة</Button><Button isDisabled={busy} onPress={()=>save()}>{saving?'جارٍ الحفظ…':busy?'جارٍ تجهيز الصور…':saved?<><Icon name="circle-check"/>تم الحفظ</>:'حفظ المسودة'}</Button></div></div>
    {message?<p className={failed?'land-error':'land-feedback'} role={failed?'alert':'status'}>{message}</p>:null}
    <LandDraftCanvas page={page} store={store} busy={busy} onImages={images=>update('images',images)} onMove={move} onReplace={replaceImage} onUpload={upload} onSettings={changeSettings} onForm={changeForm} onOffers={changeOffers} onContent={changeContent} product={product}/>
    {errors.content?<p className="land-error" role="alert">{errors.content}</p>:null}
    {errors.form?<p className="land-error" role="alert">{errors.form}</p>:null}
    <fieldset className="land-editor-layout" disabled={busy}>
      <div className="land-editor-main">
        <Card className="land-card"><header className="land-section-title"><span className="land-step">1</span><div><h2>بيانات الصفحة</h2><p>اسم واضح ورابط خاص بالصفحة.</p></div></header><div className="land-grid"><Field label="اسم الصفحة الداخلي" value={page.name} onChange={value=>update('name',value)} error={errors.name} maxLength={100} placeholder="مثال: عرض منتج الصيف"/><Field label="جزء رابط الصفحة" value={page.slug} onChange={value=>update('slug',value)} error={errors.slug} dir="ltr" maxLength={64} placeholder="product-offer"/></div><div className="land-link-hint"><Icon name="link"/><span>مسار النشر المستقبلي:</span><bdi dir="ltr">/{store.slug||'store'}/{page.slug||'page'}</bdi><small>غير منشور</small></div></Card>
        <Card className="land-card"><header className="land-section-title"><span className="land-step">2</span><div><h2>المنتج وعرض البيع</h2><p>منتج واحد وعرض واضح لعملائك.</p></div></header><Field label="منتج من كتالوج هلا" value={page.productId} onChange={changeProduct} error={errors.productId}><option value="">اختر المنتج</option>{products.map(product=><option value={product.id} key={product.id}>{product.name}</option>)}</Field>
          {product?<div className="land-product-summary"><img src={product.image} alt="" width="56" height="56"/><div><strong>{product.name}</strong><small><bdi dir="ltr">{product.sku}</bdi> · مخزون الكتالوج: <bdi>{product.stock}</bdi></small></div></div>:null}
          {offers.length?<Field label="عرض محفوظ في قائمتي" value={selectedOffer>=0?String(selectedOffer):'manual'} onChange={value=>{const offer=value==='manual'?{quantity:'',price:''}:offers[Number(value)];changeOffers(page.offers.map((current,index)=>index===0?{...current,quantity:String(offer.quantity),price:String(offer.price)}:current))}}><option value="manual">إدخال عرض يدوي</option>{offers.map((offer,index)=><option key={index} value={String(index)}>{offer.quantity} قطعة — {offer.price} ر.س إجمالي العرض</option>)}</Field>:null}
          <LandOffersEditor offers={page.offers} onChange={changeOffers} error={errors.offer}/>

        </Card>
        <Card className="land-card"><header className="land-section-title"><span className="land-step">3</span><div><h2>صور صفحة الهبوط</h2><p>تظهر في معرض المنتج بهذا الترتيب داخل القالب الثابت.</p></div><span className="land-count"><bdi dir="ltr">{page.images.length} / 20</bdi></span></header>
          <label className={'land-upload-zone '+(page.images.length>=20?'is-disabled':'')}><Icon name="plus"/><strong>أضف صور التصميم</strong><span>PNG أو JPEG أو WebP · حتى 5 ميجابايت للصورة</span><input type="file" multiple accept="image/png,image/jpeg,image/webp" disabled={busy||page.images.length>=20} onChange={upload} aria-label="إضافة صور صفحة الهبوط"/></label>
          {errors.images?<p className="land-error" role="alert">{errors.images}</p>:null}
          <ol className="land-images-list">{page.images.map((asset,index)=><li key={asset.id}><div className="land-image-thumb"><BlobImage asset={asset} alt={'الصورة '+(index+1)} loading="lazy"/></div><div className="land-image-info"><strong>الصورة {index+1}</strong><small dir="auto">{asset.name}</small><small><bdi>{asset.width} × {asset.height}</bdi></small></div><div className="land-image-actions"><IconButton icon="chevron-right" label={'تقديم الصورة '+(index+1)} isDisabled={index===0||busy} onPress={()=>move(index,-1)}/><IconButton icon="chevron-left" label={'تأخير الصورة '+(index+1)} isDisabled={index===page.images.length-1||busy} onPress={()=>move(index,1)}/><IconButton icon="trash" label={'حذف الصورة '+(index+1)} isDisabled={busy} onPress={()=>update('images',page.images.filter(item=>item.id!==asset.id))}/></div></li>)}</ol>
        </Card>
      </div>
      <aside className="land-editor-aside"><Card className="land-card land-publish"><Icon name="world"/><h2>النشر العام</h2><p>النشر العام واستقبال الطلبات الفعلية يتطلبان ربط النظام.</p><Button variant="secondary" isDisabled>النشر · يتطلب ربط النظام</Button>{Object.keys(validateStore(store)).length?<Link className="land-text-link" to="/hala-land/settings">أكمل إعدادات المتجر</Link>:null}</Card>
      </aside>
    </fieldset>
    <LandNotice>احفظ المسودة قبل مغادرة المحرر. المعاينة الخارجية تستخدم النسخة المحفوظة، والطلبات التجريبية لا تُرسل لفريق هلا.</LandNotice>
    <LandPageSettings open={settingsOpen} onClose={()=>setSettingsOpen(false)} settings={page.settings} onChange={changeSettings} errors={errors}/>
    <AppModal className="land-dialog" open={!!destination} setOpen={open=>{if(!open)setDestination(null)}} title="مغادرة المحرر؟" footer={<><Button variant="secondary" onPress={()=>setDestination(null)}>متابعة التعديل</Button><Button onPress={()=>navigate(destination)}>مغادرة دون حفظ</Button></>}><p>لديك تغييرات لم تُحفظ على هذا المتصفح.</p></AppModal>
  </div>;
}
export default function HalaLandEditorPage(){const {pageId}=useParams();const {data,setData,error,retry}=useLandData();if(!data)return <LandLoadState error={error} retry={retry}/>;const page=pageId?data.pages.find(page=>page.id===pageId):emptyPage();if(!page)return <Card className="land-card land-empty"><h2>الصفحة غير موجودة</h2><Link className="land-text-link" to="/hala-land">العودة لصفحات الهبوط</Link></Card>;return <Editor key={pageId||'new'} initial={page} pages={data.pages} store={data.store} onSaved={saved=>setData(current=>({...current,pages:[saved,...current.pages.filter(page=>page.id!==saved.id)]}))}/>}
