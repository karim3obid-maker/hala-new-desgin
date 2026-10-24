import {useEffect,useRef,useState} from 'react';
import {Button,Card} from '@heroui/react';
import {Link,useNavigate,useSearchParams} from 'react-router';
import {useImportOrders} from '../context/ImportOrdersContext';
import {Icon,IconButton} from '../components/ui/Icon';
import {CountryLabel,ImportCountryCards} from '../components/imports/ImportCountries';
import {importOrigins,importDestinationCountries,importCategories,validateImport} from '../data/importOrders';

const initialValues={origin:'',name:'',url:'',quantity:'',destination:'',category:'',shipping:'',description:'',notes:'',width:'',height:'',length:'',weight:''};
export default function ImportOrderCreatePage(){
  const navigate=useNavigate(),[params]=useSearchParams(),{addImportOrder}=useImportOrders();
  const [values,setValues]=useState(()=>({...initialValues,origin:importOrigins.some(item=>item.id===params.get('origin'))?params.get('origin'):''}));
  const [images,setImages]=useState([]),[errors,setErrors]=useState({}),[fileError,setFileError]=useState(''),[loading,setLoading]=useState(false);
  const submitted=useRef(false),fileRef=useRef(),saving=useRef(false),pending=useRef(false),readers=useRef(new Set());
  const origin=importOrigins.find(item=>item.id===values.origin),route=origin?.routes.find(item=>item.id===values.shipping);
  useEffect(()=>()=>{readers.current.forEach(reader=>reader.abort());readers.current.clear()},[]);
  function focus(key){const element=document.getElementById('import-field-'+key);const details=element?.closest('details');if(details)details.open=true;element?.focus();element?.scrollIntoView({block:'center',behavior:'instant'})}
  function update(key,value){const next={...values,[key]:value,...(key==='origin'&&value!==values.origin?{shipping:''}:{})};setValues(next);if(submitted.current)setErrors(validateImport(next,images))}
  async function addImages(event){
    const files=Array.from(event.target.files||[]);event.target.value='';if(!files.length||pending.current)return;
    if(images.length+files.length>5){setFileError('يمكنك إضافة 5 صور بحد أقصى.');return}
    if(files.some(file=>!['image/jpeg','image/png','image/webp'].includes(file.type)||!file.size||file.size>5*1024*1024)){setFileError('استخدم صور JPG أو PNG أو WebP، حتى 5 ميجابايت للصورة.');return}
    pending.current=true;setLoading(true);setFileError('');
    try{
      const added=await Promise.all(files.map(file=>new Promise((resolve,reject)=>{
        const reader=new FileReader();readers.current.add(reader);
        reader.onload=()=>{readers.current.delete(reader);resolve({name:file.name,src:reader.result})};
        reader.onerror=()=>{readers.current.delete(reader);reject(new Error('image'))};
        reader.onabort=()=>{readers.current.delete(reader);reject(new Error('aborted'))};
        reader.readAsDataURL(file);
      })));
      const next=[...images,...added];setImages(next);if(submitted.current)setErrors(validateImport(values,next));
    }catch{setFileError('تعذّر قراءة الصور. حاول مرة أخرى.')}
    finally{pending.current=false;setLoading(false)}
  }
  function submit(event){
    event.preventDefault();if(saving.current||pending.current)return;
    submitted.current=true;const problems=validateImport(values,images);setErrors(problems);
    if(Object.keys(problems).length){focus(Object.keys(problems)[0]);return}
    saving.current=true;
    const record={...values,id:'IMPORT-LOCAL-'+crypto.randomUUID().slice(0,8).toUpperCase(),origin:origin.name,originCode:origin.id,shippingLabel:route.label,status:'local',payment:'غير محددة',requestedBy:'إضافة يدوية',date:new Intl.DateTimeFormat('en-GB',{timeZone:'Africa/Cairo',dateStyle:'short'}).format(new Date()),images};
    addImportOrder(record);
    navigate('/import-orders/'+record.id+'/thank-you',{replace:true});
  }
  function field(key,label,{type='text',required=false,placeholder,options,disabled=false,hint}={}){
    return <div className="draft-form-field"><label htmlFor={'import-field-'+key}>{label}{required?<span className="field-required" aria-label="مطلوب">*</span>:<span className="field-optional">اختياري</span>}</label>
      {options?<select id={'import-field-'+key} value={values[key]} onChange={event=>update(key,event.target.value)} disabled={disabled} aria-required={required} aria-invalid={!!errors[key]} aria-describedby={errors[key]?'import-error-'+key:hint?'import-hint-'+key:undefined}><option value="">{disabled?'اختر بلد المصدر أولًا':'اختر '+label}</option>{options.map(item=><option key={item.value||item} value={item.value||item}>{item.label||item}</option>)}</select>:<input id={'import-field-'+key} type={type} value={values[key]} onChange={event=>update(key,event.target.value)} placeholder={placeholder} min={type==='number'?(key==='quantity'?1:0):undefined} step={key==='quantity'?1:'any'} dir={type==='url'||type==='number'?'ltr':undefined} aria-required={required} aria-invalid={!!errors[key]} aria-describedby={errors[key]?'import-error-'+key:hint?'import-hint-'+key:undefined}/>}
      {errors[key]?<p className="draft-field-error" id={'import-error-'+key}>{errors[key]}</p>:hint?<p className="draft-field-hint" id={'import-hint-'+key}>{hint}</p>:null}
    </div>;
  }
  return <div className="import-create-page">
    <div className="import-page-intro"><div><p>طلب استيراد جديد</p><h2>كل تفاصيل منتجك، في خطوة واحدة</h2><span>اختر بلد المصدر وأضف البيانات لنجهّز ملخص طلبك.</span></div><Link className="order-back-link" to="/import-orders"><Icon name="chevron-right"/>الرجوع للطلبات</Link></div>
    <p className="import-preview-banner"><Icon name="info"/><span>معاينة محلية: تُحفظ البيانات خلال هذه الجلسة فقط، دون إرسال فعلي أو تحصيل دفعة.</span></p>
    <form id="import-order-form" className="import-create-layout" noValidate onSubmit={submit}>
      <div className="import-create-main">
        {Object.keys(errors).length?<div className="import-error-summary" role="alert"><Icon name="warning"/><span>راجع الحقول الموضحة لإكمال طلبك.</span></div>:null}
        <Card className="import-form-section"><header><span>1</span><div><h3>بلد المصدر</h3><p id="import-origin-hint">وسائل الشحن المتاحة تختلف حسب البلد.</p></div></header><ImportCountryCards selection error={errors.origin} value={values.origin} onSelect={code=>update('origin',code)}/>{errors.origin?<p id="import-error-origin" className="draft-field-error">{errors.origin}</p>:null}</Card>
        <Card className="import-form-section"><header><span>2</span><div><h3>بيانات المنتج</h3><p>رابط واضح وصور المنتج يساعدان في مراجعته.</p></div></header>
          <div className="draft-form-grid">{field('name','اسم المنتج',{required:true,placeholder:'اكتب اسم المنتج'})}{field('category','فئة المنتج',{required:true,options:importCategories})}{field('url','رابط المنتج',{type:'url',required:true,placeholder:'https://…'})}{field('quantity','الكمية المطلوبة',{type:'number',required:true,placeholder:'مثال: 500'})}</div>
          <div className="import-upload-field"><label htmlFor="import-photo-input">صور المنتج <span className="field-required">*</span><small>{images.length} / 5</small></label><div className="import-upload-zone"><span className="import-upload-icon"><Icon name="package"/></span><div><strong>أضف صورًا واضحة للمنتج</strong><p id="import-images-hint">JPG، PNG، WebP · حتى 5 ميجابايت للصورة</p></div><Button id="import-field-images" type="button" size="sm" variant="secondary" onPress={()=>fileRef.current?.click()} isDisabled={loading||images.length>=5} aria-invalid={!!errors.images} aria-describedby={errors.images?'import-error-images':'import-images-hint'}><Icon name="plus"/>{loading?'تجهيز الصور…':'اختيار الصور'}</Button><input ref={fileRef} id="import-photo-input" hidden type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={addImages} disabled={loading||images.length>=5}/></div>
            {errors.images?<p className="draft-field-error" id="import-error-images">{errors.images}</p>:null}{fileError?<p className="draft-field-error" role="alert">{fileError}</p>:null}
            <div className="import-image-previews">{images.map((img,index)=><div key={img.src+index}><img src={img.src} alt={'صورة المنتج '+(index+1)}/><IconButton icon="trash" label={'إزالة الصورة '+(index+1)} isDisabled={loading} onPress={()=>{const next=images.filter((_,i)=>i!==index);setImages(next);setFileError('');if(submitted.current)setErrors(validateImport(values,next))}}/></div>)}</div>
          </div>
        </Card>
        <Card className="import-form-section"><header><span>3</span><div><h3>الشحن والوجهة</h3><p>حدد وجهة المنتج ووسيلة الشحن المناسبة.</p></div></header><div className="draft-form-grid">{field('destination','دولة الوصول',{required:true,options:importDestinationCountries.map(country=>({value:country.name,label:country.flag+' '+country.name}))})}{field('shipping','وسيلة الشحن',{required:true,disabled:!origin,options:origin?.routes.map(item=>({value:item.id,label:item.label+' · '+item.duration}))||[],hint:route?'مدة النقل تقديرية وبأيام العمل.':undefined})}</div></Card>
        <Card className="import-form-section"><details className="import-create-extra"><summary><span><Icon name="file-import"/>تفاصيل إضافية <small>اختياري</small></span><Icon name="chevron-down"/></summary><div className="draft-form-grid">{['description','notes'].map((key,index)=><div className="draft-form-field draft-field-wide" key={key}><label htmlFor={'import-field-'+key}>{index?'ملاحظات':'وصف المنتج'}</label><textarea id={'import-field-'+key} rows="3" value={values[key]} onChange={event=>update(key,event.target.value)}/></div>)}{field('width','العرض (سم)',{type:'number'})}{field('height','الارتفاع (سم)',{type:'number'})}{field('length','الطول (سم)',{type:'number'})}{field('weight','الوزن (كجم)',{type:'number'})}</div></details></Card>
      </div>
      <aside className="import-create-aside"><Card className="import-create-summary"><header><Icon name="file-import"/><h3>ملخص طلبك</h3></header>
        <div className="import-summary-route"><div><small>من</small><CountryLabel code={values.origin}/></div><Icon name="chevron-left"/><div><small>إلى</small><CountryLabel name={values.destination}/></div></div>
        <dl><div><dt>المنتج</dt><dd>{values.name||'لم تتم الإضافة'}</dd></div><div><dt>الكمية</dt><dd>{values.quantity?<><bdi>{values.quantity}</bdi> قطعة</>:'لم تتم الإضافة'}</dd></div><div><dt>وسيلة الشحن</dt><dd>{route?.label||'لم يتم الاختيار'}</dd></div>{route?<div><dt>المدة التقديرية</dt><dd>{route.duration}</dd></div>:null}</dl>
        <p className="import-quote-hint"><Icon name="info"/>يُحدد السعر بعد مراجعة تفاصيل المنتج والشحن.</p>
        <Button type="submit" isDisabled={loading} className="import-submit-button"><Icon name="circle-check"/>تأكيد طلب الاستيراد</Button><p className="import-submit-note">سيُضاف الطلب للمعاينة المحلية فقط. تحديث الصفحة يمسح البيانات.</p>
      </Card></aside>
    </form>
  </div>;
}
