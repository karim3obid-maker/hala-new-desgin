import {withTrioOffer} from './landTrioOffer';
import {landAddressPolicy} from '../data/saudiRegions';
import {halaLandPolicies} from '../config/halaLandPolicies';
import {defaultStore,validateStore,validatePage,validateImageFiles,normalizePage,pageOffers} from './halaLandValidation';
import {validateDraft} from '../data/draftEditor';
let connection;
function database(){
  if(connection)return connection;
  connection=new Promise((resolve,reject)=>{
    if(!globalThis.indexedDB){reject(new Error('التخزين المحلي غير متاح في هذا المتصفح.'));return;}
    const request=indexedDB.open('hala-land',1);
    request.onupgradeneeded=()=>{request.result.createObjectStore('store');request.result.createObjectStore('pages',{keyPath:'id'});};
    request.onsuccess=()=>{const db=request.result;db.onversionchange=()=>{db.close();connection=null};resolve(db)};
    request.onerror=()=>reject(request.error);
    request.onblocked=()=>reject(new Error('أغلق نسخ هلا لاند الأخرى ثم أعد المحاولة.'));
  }).catch(error=>{connection=null;throw error});
  return connection;
}
async function transaction(name,mode,operation){
  const db=await database();
  return new Promise((resolve,reject)=>{
    const tx=db.transaction(name,mode);let result;
    tx.oncomplete=()=>resolve(result);
    tx.onerror=tx.onabort=()=>reject(new Error('تعذّر حفظ أو قراءة البيانات المحلية. راجع مساحة التخزين وإعدادات المتصفح ثم أعد المحاولة.'));
    try{operation(tx.objectStore(name),value=>{result=value})}catch(error){tx.abort();reject(error)}
  });
}
export const halaLandService={
  async addExamplePages(products){
    // Explicitly requested examples. A durable marker prevents duplicates after reload or deletion.
    const seeded=await transaction('store','readonly',(store,set)=>{const r=store.get('examples-v1');r.onsuccess=()=>set(r.result)});
    if(seeded)return [];
    const selection=['magic-book','olevs','grinder','dental','bloom'].map(id=>products.find(p=>p.id===id)).filter(Boolean);
    if(selection.length!==5)throw new Error('تعذّر تجهيز منتجات اللاندات التجريبية.');
    const drafts=await Promise.all(selection.map(async(product,index)=>{
      const response=await fetch(product.image);if(!response.ok)throw new Error('تعذّر تحميل صور اللاندات التجريبية.');
      const blob=await response.blob();const [asset]=await this.prepareImages([new File([blob],product.id+'.jpg',{type:blob.type})]);
      return normalizePage({id:'hala-example-'+product.id,name:'لاند تجريبية '+(index+1)+' — '+product.name,slug:'demo-'+product.id,productId:product.id,quantity:'1',price:String(product.suggestedPrice),images:[asset],example:true,status:'draft',createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),settings:{formPlacement:index%2?'separate':'inline'},form:{title:'اطلب '+product.name.split(' — ')[0],description:'فورم مستقل لهذه اللاند التجريبية. عدّل النصوص والعروض والصور بحرية.'}});
    }));
    const db=await database();
    return new Promise((resolve,reject)=>{const tx=db.transaction(['pages','store'],'readwrite'),pages=tx.objectStore('pages'),store=tx.objectStore('store');let added=[];
      tx.oncomplete=()=>resolve(added);tx.onabort=tx.onerror=()=>reject(new Error('تعذّر حفظ اللاندات التجريبية. أعد المحاولة.'));
      const marker=store.get('examples-v1');marker.onsuccess=()=>{if(marker.result)return;const all=pages.getAll();all.onsuccess=()=>{const existing=all.result;for(const draft of drafts){if(existing.some(p=>p.id===draft.id))continue;let slug=draft.slug,n=2;while(existing.some(p=>p.slug===slug))slug=draft.slug+'-'+n++;const next={...draft,slug};pages.put(next);added.push(next);existing.push(next)}store.put(true,'examples-v1')}};
    });
  },
  async addTrioOffers(){
    // One atomic migration: saved edits/deletions after this update stay respected.
    const db=await database();
    return new Promise((resolve,reject)=>{
      const tx=db.transaction(['pages','store'],'readwrite'),store=tx.objectStore('store'),pages=tx.objectStore('pages');
      tx.oncomplete=()=>resolve();tx.onabort=tx.onerror=()=>reject(new Error('تعذّر إضافة عروض الثلاث قطع. أعد المحاولة.'));
      const marker=store.get('trio-offers-v1');
      marker.onsuccess=()=>{if(marker.result)return;const request=pages.getAll();request.onsuccess=()=>{
        for(const page of request.result){const original=pageOffers(page),offers=withTrioOffer(original);if(offers!==original)pages.put({...page,offers,updatedAt:new Date().toISOString()})}
        store.put(true,'trio-offers-v1');
      }};
    });
  },
  async getStore(){return {...defaultStore,...await transaction('store','readonly',(store,set)=>{const r=store.get('current');r.onsuccess=()=>set(r.result)})}},
  async saveStore(store){if(Object.keys(validateStore(store)).length)throw new Error('راجع إعدادات المتجر قبل الحفظ.');await transaction('store','readwrite',s=>s.put({...store,name:store.name.trim()},'current'));return {...store,name:store.name.trim()}},
  listPages(){return transaction('pages','readonly',(store,set)=>{const r=store.getAll();r.onsuccess=()=>set(r.result.sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt)))})},
  getPage(id){return transaction('pages','readonly',(store,set)=>{const r=store.get(id);r.onsuccess=()=>set(r.result??null)})},
  async savePage(page,products){
    const now=new Date().toISOString();
    const result={...normalizePage(page),createdAt:page.createdAt||(!page.id?now:null),id:page.id||crypto.randomUUID(),name:page.name.trim(),status:'draft',updatedAt:now};
    // Check uniqueness and write in one transaction, including across browser tabs.
    let validationError;
    try{await transaction('pages','readwrite',store=>{const request=store.getAll();request.onsuccess=()=>{const errors=validatePage(result,request.result,products);if(Object.keys(errors).length){validationError=new Error(Object.values(errors).join(' '));store.transaction.abort();return}store.put(result)}})}catch(error){throw validationError||error}
    return result;
  },
  deletePages(ids){return transaction('pages','readwrite',store=>{for(const id of ids)store.delete(id)})},
  deletePage(id){return transaction('pages','readwrite',store=>store.delete(id))},
  async duplicatePage(id,products){const page=await this.getPage(id);if(!page)throw new Error('الصفحة لم تعد موجودة.');const pages=await this.listPages();let suffix=1;const base=page.slug.slice(0,50).replace(/-$/,'');let slug;do{slug=base+'-copy-'+suffix++}while(pages.some(p=>p.slug===slug));return this.savePage({...page,id:undefined,createdAt:undefined,name:(page.name.slice(0,90)+' — نسخة'),slug},products)},
  async prepareImages(files,currentCount=0){
    validateImageFiles(files,currentCount);
    return Promise.all(files.map(async file=>{
      const url=URL.createObjectURL(file);
      try{const image=new Image();image.src=url;await image.decode();if(!image.naturalWidth||!image.naturalHeight)throw Error();return {id:crypto.randomUUID(),name:file.name,blob:file,width:image.naturalWidth,height:image.naturalHeight}}catch{throw new Error('تعذّر قراءة الصورة «'+file.name+'». اختر صورة صالحة.')}finally{URL.revokeObjectURL(url)}
    }));
  },
  async submitOrder({pageId,values,payment,createOrder,products,submissionId,expectedUpdatedAt,offerId}){
    const [page,store,pages]=await Promise.all([this.getPage(pageId),this.getStore(),this.listPages()]);
    if(page&&page.updatedAt!==expectedUpdatedAt)throw new Error('تم تعديل الصفحة بعد فتح المعاينة. أعد تحميلها لمراجعة العرض الحالي.');
    if(!page||Object.keys(validatePage(page,pages,products)).length)throw new Error('الصفحة غير مكتملة أو لم تعد موجودة.');
    if(Object.keys(validateStore(store)).length)throw new Error('أكمل إعدادات المتجر واحفظها قبل تجربة الطلب.');
    if(payment==='paymob')throw new Error('Paymob يتطلب ربط النظام. لم يتم خصم أي مبلغ أو إنشاء طلب مدفوع.');
    if(payment!=='cod'||!store.cod)throw new Error('الدفع عند الاستلام غير مفعّل لهذا المتجر.');
    const offers=pageOffers(page),offer=offers.find(item=>item.id===offerId)||(offers.length===1?offers[0]:null);
    if(!offer)throw new Error('اختر عرضًا صحيحًا من عروض الصفحة.');
    if(page.settings?.expiresAt&&Date.parse(page.settings.expiresAt)<=Date.now())throw new Error('انتهت مدة العرض. لا يمكن إنشاء طلب جديد عليه.');
    const product=products.find(item=>item.id===page.productId);
    if(Number(offer.quantity)>product.stock)throw new Error('كمية العرض تتجاوز مخزون الكتالوج الحالي.');
    const selected=[{...product,quantity:Number(offer.quantity)}];
    const pricing={mode:'cod',codTotal:offer.price};
    if(Object.keys(validateDraft(values,selected,pricing,landAddressPolicy)).length)throw new Error('راجع بيانات الطلب قبل الإرسال.');
    return createOrder({...values,country:'السعودية',source:'هلا لاند',payment:'عند الاستلام',landPageId:page.id,landPageName:page.name,landPageSlug:page.slug,landSubmissionId:submissionId,landOfferId:offer.id,freeShipping:!!(halaLandPolicies.freeShipping||page.settings?.freeShipping||offer.freeShipping)},selected,pricing);
  },
};
