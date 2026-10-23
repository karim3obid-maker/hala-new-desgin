// Product and pricing visible in the supplied draft-edit screenshot.
export const editorProduct={id:'shemagh-58',sku:'Hala0002074',name:'شماغ 58',cost:15};
const englishDigits=value=>String(value??'').replace(/[٠-٩]/g,digit=>String('٠١٢٣٤٥٦٧٨٩'.indexOf(digit))).replace(/[۰-۹]/g,digit=>String('۰۱۲۳۴۵۶۷۸۹'.indexOf(digit)));
export function normalizeSaudiPhone(value){
  const phone=englishDigits(value).replace(/[\s()-]/g,'');
  if(/^05\d{8}$/.test(phone))return '+966'+phone.slice(1);
  if(/^5\d{8}$/.test(phone))return '+966'+phone;
  if(/^9665\d{8}$/.test(phone))return '+'+phone;
  return phone;
}
const validPrice=value=>Number.isFinite(Number(value))&&Number(value)>0&&/^\d+(\.\d{1,2})?$/.test(String(value));
export function validateDraft(values,products,pricing={mode:'unit'},addressPolicy={requireCity:true}){
  const errors={};
  if(values.name.trim().length<2)errors.name='اكتب اسم العميل بالكامل.';
  if(!/^\+9665\d{8}$/.test(normalizeSaudiPhone(values.phone)))errors.phone='اكتب رقمًا سعوديًا صحيحًا: 05 ثم 8 أرقام، أو +966 ثم 9 أرقام تبدأ بـ5.';
  if(values.altPhone.trim()&&!/^\+9665\d{8}$/.test(normalizeSaudiPhone(values.altPhone)))errors.altPhone='راجع الرقم البديل أو اتركه فارغًا.';
  for(const [key,label] of [['region','المنطقة'],['city','المدينة'],['district','الحي']])if((key!=='city'||addressPolicy.requireCity!==false)&&(key!=='district'||addressPolicy.requireDistrict!==false)&&!values[key].trim())errors[key]='أضف '+label+'.';
  if(addressPolicy.regions&&values.region.trim()&&!addressPolicy.regions.includes(values.region))errors.region='اختر المنطقة من القائمة.';
  if(values.address.trim().length<8||/…|\.{3}/.test(values.address))errors.address='اكتب العنوان كاملًا: الشارع ورقم المبنى أو أقرب علامة مميزة.';
  if(values.nationalAddress.trim()&&!/^[A-Za-z]{4}\d{4}$/.test(values.nationalAddress.trim()))errors.nationalAddress='العنوان المختصر يتكون من 4 حروف إنجليزية و4 أرقام، مثل ABPE3294.';
  if(!products.length)errors.products='أضف منتجًا واحدًا على الأقل.';
  else if(products.some(product=>!Number.isInteger(Number(product.quantity))||Number(product.quantity)<1||Number(product.quantity)>999||(pricing.mode!=='cod'&&!validPrice(product.price))))errors.products='راجع الكمية وسعر البيع. الكمية من 1 إلى 999، والسعر أكبر من صفر وبحد أقصى منزلتين عشريتين.';
  if(pricing.mode==='cod'&&!validPrice(pricing.codTotal))errors.codTotal='أدخل إجمالي COD أكبر من صفر وبحد أقصى منزلتين عشريتين.';
  return errors;
}
export function productTotals(products,pricing={mode:'unit'}){
  const totalCents=pricing.mode==='cod'?Math.round((Number(pricing.codTotal)||0)*100):products.reduce((total,product)=>total+Math.round((Number(product.price)||0)*100)*(Number(product.quantity)||0),0);
  const costCents=products.reduce((total,product)=>total+Math.round(product.cost*100)*(Number(product.quantity)||0),0);
  return {total:totalCents/100,profit:(totalCents-costCents)/100,quantity:products.reduce((sum,product)=>sum+(Number(product.quantity)||0),0)};
}
