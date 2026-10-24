export const imageTypes=['image/png','image/jpeg','image/webp'];
export const maxImageSize=5*1024*1024;
export const defaultStore={name:'',slug:'',logo:null,whatsapp:'',instagram:'',facebook:'',tiktok:'',cod:true,paymob:false,formPlacement:'inline',metaEnabled:false,metaPixel:'',tiktokEnabled:false,tiktokPixel:'',shareTitle:'',shareDescription:'',successMessage:'شكرًا لك، تم استلام طلبك.',showWhatsapp:false};
export const emptyPage=()=>({name:'',slug:'',productId:'',quantity:'',price:'',images:[],status:'draft'});
export const validSlug=value=>/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)&&value.length<=64;
export function validOffer(quantity,price){return Number.isInteger(Number(quantity))&&Number(quantity)>=1&&Number(quantity)<=999&&/^\d+(\.\d{1,2})?$/.test(String(price))&&Number(price)>0&&Number(price)<=999999.99}
export function validateStore(store){
  const errors={};
  if(!store.name.trim()||store.name.length>80)errors.name='أدخل اسم المتجر بحد أقصى 80 حرفًا.';
  if(!validSlug(store.slug))errors.slug='استخدم حروفًا إنجليزية صغيرة وأرقامًا وشرطة بين الكلمات، حتى 64 حرفًا.';
  if(!['inline','separate'].includes(store.formPlacement))errors.formPlacement='اختر مكان عرض فورم الشراء.';
  if(!store.cod&&!store.paymob)errors.payment='فعّل طريقة دفع واحدة على الأقل.';
  if(store.whatsapp&&!/^\+?[1-9]\d{7,14}$/.test(store.whatsapp))errors.whatsapp='أدخل الرقم الدولي بدون مسافات، مثل +9665XXXXXXXX.';
  if(store.showWhatsapp&&!store.whatsapp)errors.whatsapp='أضف رقم واتساب لإظهار زر التواصل.';
  for(const key of ['instagram','facebook','tiktok'])if(store[key]){try{const url=new URL(store[key]);if(url.protocol!=='https:'||url.username||url.password)throw Error()}catch{errors[key]='أدخل رابطًا كاملًا يبدأ بـ https://.'}}
  if(store.metaEnabled&&!/^\d{5,30}$/.test(store.metaPixel))errors.metaPixel='أدخل معرّف Meta Pixel الرقمي الصحيح.';
  if(store.tiktokEnabled&&!/^[a-zA-Z0-9]{5,40}$/.test(store.tiktokPixel))errors.tiktokPixel='أدخل معرّف TikTok Pixel من الحروف والأرقام.';
  if(!store.successMessage.trim()||store.successMessage.length>300)errors.successMessage='أدخل رسالة نجاح بحد أقصى 300 حرف.';
  return errors;
}
export function validatePage(page,pages,products){
  const errors={};
  if(!page.name.trim()||page.name.length>100)errors.name='أدخل اسمًا للصفحة بحد أقصى 100 حرف.';
  if(!validSlug(page.slug))errors.slug='استخدم حروفًا إنجليزية صغيرة وأرقامًا وشرطات، حتى 64 حرفًا.';
  else if(pages.some(item=>item.id!==page.id&&item.slug===page.slug))errors.slug='هذا الرابط مستخدم لصفحة أخرى.';
  if(!products.some(product=>product.id===page.productId))errors.productId='اختر منتجًا من كتالوج هلا.';
  if(pageOffers(page).length>5||pageOffers(page).some(offer=>!validOffer(offer.quantity,offer.price))||new Set(pageOffers(page).map(o=>Number(o.quantity))).size!==pageOffers(page).length)errors.offer='أضف حتى 5 عروض بكميات مختلفة من 1 إلى 999، وأسعار أكبر من صفر وبمنزلتين عشريتين كحد أقصى.';
  const settings={...pageDefaults,...page.settings};
  if(!settings.ctaText.trim()||settings.ctaText.length>60)errors.ctaText='أدخل نص زر الشراء بحد أقصى 60 حرفًا.';
  if(!['inherit','inline','separate'].includes(settings.formPlacement))errors.formPlacement='اختر مكان فورم الشراء.';
  if(!['gallery','stacked'].includes(settings.imageLayout))errors.imageLayout='اختر طريقة عرض الصور.';
  if(settings.expiresAt&&!Number.isFinite(Date.parse(settings.expiresAt)))errors.expiresAt='أدخل موعد انتهاء صحيحًا.';
  if(pageOffers(page).some(offer=>[offer.ctaText,offer.helperText,offer.helperDescription].some(text=>text&&text.length>160)))errors.offer='نصوص العرض لا تتجاوز 160 حرفًا لكل حقل.';
  const content={...contentDefaults,...page.content};
  if(['announcement','title','subtitle','sellerName'].some(key=>content[key].length>160)||['description','benefits','shipping','returns','warranty','privacy','sellerDetails'].some(key=>content[key].length>2000)||content.faqs.length>5||content.faqs.some(f=>!f.question.trim()||!f.answer.trim()||f.question.length>160||f.answer.length>1000))errors.content='راجع المحتوى: عناوين حتى160حرفًا، نصوص حتى2000حرف، وحتى5أسئلة مكتملة.';
  const form={...formDefaults,...page.form};
  if(!form.title.trim()||form.title.length>100||form.description.length>300||form.submitText.length>60||form.successMessage.length>300)errors.form='راجع نصوص الفورم: عنوان حتى100حرف، زر حتى60حرف، ووصف ورسالة حتى300حرف.';
  if(!page.images.length||page.images.length>20)errors.images='أضف من صورة واحدة إلى 20 صورة.';
  return errors;
}
export function validateImageFiles(files,currentCount=0){
  if(currentCount+files.length>20)throw new Error('الحد الأقصى 20 صورة للصفحة.');
  for(const file of files){if(!imageTypes.includes(file.type))throw new Error('الصور المسموحة PNG وJPEG وWebP فقط.');if(file.size>maxImageSize)throw new Error('حجم كل صورة يجب ألا يتجاوز 5 ميجابايت.');if(!file.size)throw new Error('لا يمكن رفع ملف فارغ.');}
}

export const pageDefaults={ctaText:'اطلب الآن',skipCart:true,stickyCta:true,formPlacement:'inherit',freeShipping:false,showStock:false,expiresAt:'',hideHeader:false,hideQuantity:false,hidden:false,formBeforeImages:false,imageLayout:'gallery'};
export function pageOffers(page){return page.offers?.length?page.offers:[{id:'original',quantity:page.quantity??'',price:page.price??'',ctaText:'',helperText:'',helperDescription:'',hideUnitPrice:false,freeShipping:false}]}
export const contentDefaults={showReviews:true,showFaq:true,showInformation:true,announcement:'',title:'',subtitle:'',description:'',benefits:'',shipping:'',returns:'',warranty:'',privacy:'',sellerName:'',sellerDetails:'',faqs:[]};
export const formDefaults={title:'اطلب الآن',description:'',submitText:'',successMessage:'',showNotes:true,showNationalAddress:true};
export function normalizePage(page){const offers=pageOffers(page).map((offer,index)=>({id:'offer-'+index,ctaText:'',helperText:'',helperDescription:'',hideUnitPrice:false,freeShipping:false,...offer}));return {...page,template:'sitar',content:{...contentDefaults,...page.content,title:page.name||'',faqs:page.content?.faqs||[]},form:{...formDefaults,...page.form},settings:{...pageDefaults,...page.settings},offers,quantity:offers[0].quantity,price:offers[0].price}}
