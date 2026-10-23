export const importOrigins=[
  {id:'CN',name:'الصين',flag:'🇨🇳',routes:[{id:'air',label:'جوي',duration:'10–15 يوم عمل'},{id:'sea',label:'بحري',duration:'35–45 يوم عمل'}]},
  {id:'SA',name:'السعودية',flag:'🇸🇦',routes:[{id:'local',label:'شحن محلي',duration:'1–3 أيام عمل'}]},
  {id:'EG',name:'مصر',flag:'🇪🇬',routes:[{id:'land',label:'بري',duration:'10–15 يوم عمل'}]},
];
export const importDestinations=['المملكة العربية السعودية','الإمارات العربية المتحدة','الكويت','قطر','البحرين','سلطنة عُمان','مصر'];
export const importCategories=['الصحة والعناية','مستلزمات الأطفال','الإلكترونيات','منتجات متنوعة'];
export const importColumns=[['id','رقم الطلب'],['name','المنتج'],['requestedBy','الطلب من'],['origin','بلد المصدر'],['category','الفئة'],['status','الحالة'],['payment','حالة الدفع'],['date','تاريخ الإنشاء'],['width','العرض'],['height','الارتفاع'],['weight','الوزن'],['length','الطول'],['notes','ملاحظات']];
export function validateImport(values,images){
  const errors={};
  if(!importOrigins.some(origin=>origin.id===values.origin))errors.origin='اختر بلد الاستيراد.';
  if(values.name.trim().length<2)errors.name='اكتب اسم المنتج.';
  try{const url=new URL(values.url);if(!['https:','http:'].includes(url.protocol))throw Error()}catch{errors.url='أدخل رابط منتج صحيحًا يبدأ بـ https:// أو http://.'}
  if(!images.length)errors.images='أضف صورة واحدة على الأقل للمنتج.';
  if(!/^\d+$/.test(String(values.quantity))||!Number.isSafeInteger(Number(values.quantity))||Number(values.quantity)<1)errors.quantity='أدخل كمية صحيحة أكبر من صفر.';
  if(!importDestinations.includes(values.destination))errors.destination='اختر الدولة المستورد إليها.';
  if(!importCategories.includes(values.category))errors.category='اختر فئة المنتج.';
  if(!importOrigins.find(origin=>origin.id===values.origin)?.routes.some(route=>route.id===values.shipping))errors.shipping='اختر وسيلة شحن مناسبة لبلد المصدر.';
  for(const key of ['width','height','weight','length'])if(values[key]!==''&&(!Number.isFinite(Number(values[key]))||Number(values[key])<=0))errors[key]='أدخل قيمة موجبة أو اترك الحقل فارغًا.';
  return errors;
}
