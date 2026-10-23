import {useRef,useState} from 'react';
import {Button,Card} from '@heroui/react';
import {Link,useNavigate,useOutletContext,useParams} from 'react-router';
import {DraftProductPicker} from '../components/ui/DraftProductPicker';
import {Icon,IconButton} from '../components/ui/Icon';
import {draftOrders} from '../data/draftOrders';
import {editorProduct,normalizeSaudiPhone,productTotals,validateDraft} from '../data/draftEditor';
import {useOrdersPreview} from '../context/OrdersPreviewContext';

const price=value=><bdi dir="ltr">{value.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})} <span>SAR</span></bdi>;
const regions=['الرياض','مكة المكرمة','المدينة المنورة','القصيم','المنطقة الشرقية','عسير','تبوك','حائل','الحدود الشمالية','جازان','نجران','الباحة','الجوف'];
function EditSection({number,title,description,children,action}){return <Card className="draft-edit-card"><div className="draft-edit-section-heading"><span>{number}</span><div><h2>{title}</h2><p>{description}</p></div>{action}</div>{children}</Card>}

export default function DraftEditPage(){
  const {orderId}=useParams();
  const draft=draftOrders.find(order=>order.id===orderId);
  if(!draft)return <Card className="empty-state"><h2>طلب الدرافت غير متاح</h2><Link className="platform-link" to="/orders/drafts">الرجوع لطلبات الدرافت</Link></Card>;
  return <DraftEditor key={orderId} draft={draft}/>;
}
export function NewOrderPage(){return <DraftEditor createMode draft={{name:'',phone:'',address:'',country:'المملكة العربية السعودية'}}/>}
function DraftEditor({draft,createMode=false}){
  const navigate=useNavigate();
  const {notify}=useOutletContext();
  const {newOrders,submitDraft,createOrder}=useOrdersPreview();
  const [values,setValues]=useState({name:draft.name,phone:draft.phone,altPhone:'',country:draft.country,region:'',city:'',district:'',address:draft.address,nationalAddress:'',notes:''});
  const [products,setProducts]=useState(draft.id==='ORD-ZH62'?[{...editorProduct,price:89,quantity:2}]:[]);
  const [pricingMode,setPricingMode]=useState('unit');
  const [codTotal,setCodTotal]=useState('');
  const pricing={mode:pricingMode,codTotal};
  const [errors,setErrors]=useState(createMode?{}:{phone:'رقم الهاتف المسجل غير صالح. راجعه مع العميل وأدخل الرقم الصحيح.'});
  const [pickerOpen,setPickerOpen]=useState(false);
  const [submitted,setSubmitted]=useState(false);
  const [saving,setSaving]=useState(false);
  const submitting=useRef(false);
  const totals=productTotals(products,pricing);
  const existing=!createMode&&newOrders.find(order=>order.sourceDraftId===draft.id);
  const errorKeys=Object.keys(errors);
  const phoneValid=!validateDraft(values,products,pricing).phone;
  if(existing)return <Card className="empty-state"><Icon name="circle-check"/><h2>تم إنشاء طلب جديد في المعاينة</h2><p>لن تتم إعادة إرسال نفس الدرافت مرة أخرى.</p><Link className="platform-link" to={'/orders/'+existing.id}>عرض الطلب الجديد</Link><Link className="order-back-link" to="/orders/drafts">الرجوع للدرافت</Link></Card>;
  function focusField(key){const element=document.getElementById('draft-'+key);const details=element?.closest('details');if(details)details.open=true;element?.focus();element?.scrollIntoView({behavior:'instant',block:'center'})}
  function update(key,value){
    const next={...values,[key]:value};setValues(next);
    if(errors[key]||submitted){const nextErrors=validateDraft(next,products,pricing);setErrors(current=>{const result={...current};if(nextErrors[key])result[key]=nextErrors[key];else delete result[key];return result})}
  }
  function updateProduct(id,key,value){
    const next=products.map(product=>product.id===id?{...product,[key]:value}:product);setProducts(next);
    if(errors.products)setErrors(current=>{const result={...current};const message=validateDraft(values,next,pricing).products;if(message)result.products=message;else delete result.products;return result});
  }
  function changePricingMode(mode){
    if(mode==='cod'&&codTotal==='')setCodTotal(String(productTotals(products).total||''));
    setPricingMode(mode);
    setErrors(current=>{const next={...current};delete next.codTotal;delete next.products;return next});
  }
  function updateCodTotal(value){
    setCodTotal(value);
    if(errors.codTotal||submitted)setErrors(current=>{const next={...current};const message=validateDraft(values,products,{mode:'cod',codTotal:value}).codTotal;if(message)next.codTotal=message;else delete next.codTotal;return next});
  }
  function addProducts(selected){setProducts(current=>[...current,...selected.filter(product=>!current.some(item=>item.id===product.id)).map(product=>({...product,quantity:1}))]);setErrors(current=>{const next={...current};delete next.products;return next})}
  function submit(event){
    event.preventDefault();
    if(submitting.current)return;
    const problems=validateDraft(values,products,pricing);setErrors(problems);setSubmitted(true);
    if(Object.keys(problems).length){focusField(Object.keys(problems)[0]);return}
    submitting.current=true;setSaving(true);
    const order=createMode?createOrder(values,products,pricing):submitDraft(draft,values,products,pricing);
    notify('تمت إضافة الطلب الجديد إلى المعاينة المحلية');
    navigate('/orders',{state:{newOrderId:order.id}});
  }
  function field(key,label,{type='text',required=false,hint,placeholder,span=false,readOnly=false,dir}={}){
    const error=errors[key];
    return <div className={'draft-form-field '+(span?'draft-field-wide':'')}>
      <label htmlFor={'draft-'+key}>{label}{required?<span className="field-required">*</span>:<span className="field-optional">اختياري</span>}</label>
      <input id={'draft-'+key} name={key} type={type} value={values[key]} onChange={event=>update(key,event.target.value)} onBlur={()=>{if(key==='phone'&&phoneValid)update(key,normalizeSaudiPhone(values[key]))}} required={required} readOnly={readOnly} dir={dir} placeholder={placeholder} autoComplete={key==='name'?'name':key==='phone'?'tel':'off'} aria-invalid={!!error} aria-describedby={error?'draft-'+key+'-error':hint?'draft-'+key+'-hint':undefined}/>
      {error?<p className="draft-field-error" id={'draft-'+key+'-error'}><Icon name="warning"/>{error}</p>:hint?<p className="draft-field-hint" id={'draft-'+key+'-hint'}>{hint}</p>:null}
      {key==='phone'&&phoneValid?<p className="draft-phone-valid"><Icon name="circle-check"/>تنسيق الرقم صحيح</p>:null}
    </div>;
  }
  return <div className="draft-editor-page">
    <div className="draft-edit-intro"><div><div className="draft-edit-title"><h2>{createMode?'طلب جديد':'إصلاح طلب الدرافت'}</h2>{!createMode?<bdi dir="ltr">{draft.id}</bdi>:null}</div><p>{createMode?'أضف بيانات العميل والمنتجات، ثم راجع الإجمالي.':'صحّح البيانات، راجع الطلب، ثم أرسله كطلب جديد.'}</p></div><Link className="order-back-link" to={createMode?'/orders':'/orders/drafts'}><Icon name="chevron-right"/>{createMode?'رجوع للطلبات':'رجوع للدرافت'}</Link></div>
    {(!createMode||submitted&&errorKeys.length>0)?<div className={'draft-edit-alert '+(!errorKeys.length?'resolved':'')} role={submitted&&errorKeys.length?'alert':'status'}>
      <Icon name={errorKeys.length?'warning':'circle-check'}/><div><h2>{errorKeys.length?submitted?'راجع البيانات المطلوبة':'ابدأ بتصحيح رقم الهاتف':'تم حل المشكلات الظاهرة'}</h2><p>{submitted&&errorKeys.length?`يوجد ${errorKeys.length} حقول تحتاج مراجعة. اضغط على الحقل للانتقال إليه.`:errorKeys.length?draft.reason:'راجع بيانات الشحن والمنتجات قبل إرسال الطلب.'}</p>{submitted&&errorKeys.length?<div className="draft-error-links">{errorKeys.map(key=><button type="button" key={key} onClick={()=>focusField(key)}>{({name:'اسم العميل',phone:'رقم الهاتف',altPhone:'الرقم البديل',region:'المنطقة',city:'المدينة',district:'الحي',address:'العنوان',nationalAddress:'العنوان الوطني',products:'المنتجات',codTotal:'إجمالي COD'})[key]}</button>)}</div>:null}</div>{!submitted&&errors.phone?<Button size="sm" variant="secondary" onPress={()=>focusField('phone')}>راجع رقم الهاتف<Icon name="chevron-left"/></Button>:null}
    </div>:null}
    <div className="draft-edit-layout">
      <form id="draft-edit-form" className="draft-edit-form" noValidate onSubmit={submit}>
        <EditSection number="1" title="بيانات العميل" description="الرقم الصحيح يساعد الفريق على تأكيد الطلب بسرعة.">
          <div className="draft-form-grid">{field('name','اسم العميل',{required:true})}{field('phone','رقم الهاتف',{type:'tel',dir:'ltr',required:true,placeholder:'05xxxxxxxx',hint:'يمكنك كتابة الرقم بصيغة 05 أو +966.'})}</div>
        </EditSection>
        <EditSection number="2" title="عنوان الشحن" description="أكمل العنوان حتى يصل الطلب إلى المكان الصحيح.">
          <div className="draft-shipping-country"><Icon name="world"/><span>الدولة</span><strong>{draft.country}</strong></div>
          <div className="draft-form-grid">
            <div className="draft-form-field"><label htmlFor="draft-region">المنطقة<span className="field-required">*</span></label><select id="draft-region" value={values.region} onChange={event=>update('region',event.target.value)} required aria-invalid={!!errors.region} aria-describedby={errors.region?'draft-region-error':undefined}><option value="">اختر المنطقة</option>{regions.map(region=><option key={region} value={region}>{region}</option>)}</select>{errors.region?<p className="draft-field-error" id="draft-region-error">{errors.region}</p>:null}</div>
            {field('city','المدينة',{required:true,placeholder:'اكتب المدينة'})}
            {field('district','الحي',{required:true,placeholder:'اكتب اسم الحي'})}
            {!createMode?field('nationalAddress','العنوان الوطني المختصر',{dir:'ltr',placeholder:'ABPE3294'}):null}
            {field('address','العنوان بالتفصيل',{required:true,span:true,placeholder:'الشارع، رقم المبنى أو أقرب علامة مميزة',hint:createMode?undefined:'استبدل أي نص مختصر بالعنوان الكامل من العميل.'})}
          </div>
        </EditSection>
        <EditSection number="3" title="منتجات الطلب" description="راجع المنتج والكمية وسعر البيع قبل الإرسال." action={<Button className="draft-add-product" size="sm" variant="secondary" onPress={()=>setPickerOpen(true)}><Icon name="plus"/>إضافة منتج</Button>}>
          <div className="draft-pricing-options"><div><h3>تحديد سعر الطلب</h3><p>اختر سعر كل وحدة أو المبلغ الإجمالي المطلوب تحصيله.</p></div><div className="draft-pricing-switch" role="group" aria-label="طريقة تحديد السعر"><button type="button" aria-pressed={pricingMode==='unit'} onClick={()=>changePricingMode('unit')}>سعر الوحدة</button><button type="button" aria-pressed={pricingMode==='cod'} onClick={()=>changePricingMode('cod')}>إجمالي COD</button></div></div>
          {pricingMode==='cod'?<div className="draft-cod-input draft-form-field"><label htmlFor="draft-codTotal">إجمالي COD <span className="field-required">*</span></label><div className="draft-price-field"><input id="draft-codTotal" type="number" min="0.01" step="0.01" value={codTotal} onChange={event=>updateCodTotal(event.target.value)} dir="ltr" aria-invalid={!!errors.codTotal} aria-describedby={errors.codTotal?'draft-codTotal-error':'draft-codTotal-hint'}/><span>SAR</span></div>{errors.codTotal?<p className="draft-field-error" id="draft-codTotal-error">{errors.codTotal}</p>:<p className="draft-field-hint" id="draft-codTotal-hint">المبلغ النهائي لتحصيل الطلب بالكامل. لا يتغير تلقائيًا عند تعديل الكميات أو المنتجات.</p>}</div>:null}
          <div id="draft-products" tabIndex={-1} aria-describedby={errors.products?'draft-products-error':undefined}>
            {products.map(product=><div className="draft-edit-product" key={product.id}><div className="draft-edit-product-info"><span className="detail-product-icon"><Icon name="package"/></span><div><h3>{product.name}</h3>{product.sku?<bdi dir="ltr">SKU: {product.sku}</bdi>:<small>SKU غير متاح في المصدر</small>}<p>التكلفة للوحدة: {price(product.cost)}</p></div></div><div className={"draft-product-controls "+(pricingMode==='cod'?'draft-controls-cod':'')}>{pricingMode==='unit'?<div className="draft-form-field"><label htmlFor={'price-'+product.id}>سعر البيع للوحدة</label><div className="draft-price-field"><input id={'price-'+product.id} aria-label={'سعر بيع '+product.name} type="number" min="0.01" step="0.01" value={product.price} onChange={event=>updateProduct(product.id,'price',event.target.value)} dir="ltr"/><span>SAR</span></div></div>:null}<div className="draft-form-field"><label htmlFor={'quantity-'+product.id}>الكمية</label><div className="draft-quantity-control"><Button size="sm" variant="ghost" aria-label="تقليل الكمية" isDisabled={Number(product.quantity)<=1} onPress={()=>updateProduct(product.id,'quantity',Number(product.quantity)-1)}>−</Button><input id={'quantity-'+product.id} type="number" min="1" max="999" step="1" value={product.quantity} onChange={event=>updateProduct(product.id,'quantity',event.target.value)} aria-label={'كمية '+product.name}/><Button size="sm" variant="ghost" aria-label="زيادة الكمية" isDisabled={Number(product.quantity)>=999} onPress={()=>updateProduct(product.id,'quantity',Number(product.quantity)+1)}>+</Button></div></div><IconButton icon="trash" label={'إزالة '+product.name} onPress={()=>setProducts(products.filter(item=>item.id!==product.id))}/></div></div>)}
            {!products.length?<div className="draft-products-empty"><Icon name="package"/><p>أضف المنتج المطلوب لإكمال الطلب.</p><small>اضغط «إضافة منتج» وابحث بالاسم أو SKU.</small></div>:null}
          </div>
          {errors.products?<p id="draft-products-error" className="draft-field-error">{errors.products}</p>:null}
        </EditSection>
        <Card className="draft-edit-card"><details className="draft-extra-fields"><summary><span><Icon name="file-import"/>بيانات إضافية <small>اختياري</small></span><Icon name="chevron-down"/></summary><div className="draft-form-grid">{field('altPhone','رقم هاتف بديل',{type:'tel',dir:'ltr'})}{createMode?field('nationalAddress','العنوان الوطني المختصر',{dir:'ltr',placeholder:'ABPE3294'}):null}<div className="draft-form-field"><label htmlFor="draft-notes">ملاحظات العميل<span className="field-optional">اختياري</span></label><textarea id="draft-notes" rows="2" value={values.notes} onChange={event=>update('notes',event.target.value)} placeholder="تعليمات إضافية تساعد في توصيل الطلب"/></div></div></details></Card>
      </form>
      <aside className="draft-submit-summary" aria-labelledby="draft-summary-title"><Card className="draft-edit-card"><div className="draft-summary-heading"><Icon name="shopping-cart"/><h2 id="draft-summary-title">ملخص الطلب</h2><span>طلب جديد</span></div><div className="draft-summary-body">
        {!createMode?<div className="draft-source-reference"><span>مرجع الدرافت</span><bdi dir="ltr">{draft.id}</bdi></div>:null}
        {products.length?products.map(product=><div className="draft-summary-product" key={product.id}><span>{product.name}<small>{product.quantity||'—'} قطع {pricingMode==='unit'?<>× {price(Number(product.price)||0)}</>:null}</small></span>{pricingMode==='unit'?<strong>{price((Number(product.price)||0)*(Number(product.quantity)||0))}</strong>:null}</div>):<p className="draft-summary-empty">لم تتم إضافة منتجات.</p>}
        <dl className="draft-summary-facts"><div><dt>طريقة الدفع</dt><dd><span className="order-payment">عند الاستلام</span></dd></div><div><dt>الربح قبل الرسوم</dt><dd className={totals.profit<0?'negative':'positive'}>{price(totals.profit)}</dd></div></dl>
        <div className="draft-summary-total"><div><span>المستحق للدفع من العميل</span><small>{pricingMode==='cod'?'إجمالي COD المحدد يدويًا':'إجمالي المنتجات'}</small></div><strong>{price(totals.total)}</strong></div>
        <div className="draft-submit-explanation"><Icon name="info"/><p>{createMode?'سيظهر الطلب في الطلبات الجديدة بعد مراجعة البيانات.':'بعد التصحيح، ينتقل الطلب من الدرافت إلى الطلبات الجديدة برقم جديد.'}</p></div>
        <Button type="submit" form="draft-edit-form" className="draft-submit-button" isDisabled={saving}>{saving?'جاري الإضافة…':createMode?'إضافة الطلب':'إرسال كطلب جديد'}<Icon name="chevron-left"/></Button>
        <p className="draft-preview-disclosure">معاينة محلية فقط؛ لا يتم إرسال طلب فعلي. تُمسح التغييرات عند تحديث الصفحة.</p>
        <Link className="draft-cancel-link" to={createMode?'/orders':'/orders/drafts'}>{createMode?'إلغاء والرجوع للطلبات':'إلغاء والرجوع للدرافت'}</Link>
      </div></Card></aside>
    </div>
    {pickerOpen?<DraftProductPicker currentProducts={products} setOpen={setPickerOpen} onAdd={addProducts}/>:null}
  </div>;
}
