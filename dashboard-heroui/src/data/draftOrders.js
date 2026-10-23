// Only fully visible rows are transcribed; the clipped final row is not completed.
export const draftMetrics=[{label:'طلبات غير مكتملة / درافت',value:'31',icon:'clock',tone:'amber'}];
const rows=[
  ['ORD-U9CW','karim 3obid','01113336908','القصيم — …',259,1],
  ['ORD-AUL6','عبدالله، إبراهيم عبد الرحمن','05810026223','القصيم — …',277.50,1],
  ['ORD-ZH62','عبدالله الغامدي','+9665058603085','القصيم — …',178,1],
  ['ORD-DR6K','خلف الشرقي','5576310290','مكة المكرمة…',178,1],
  ['ORD-JI0K','سليما لحربي','+547111533','القصيم — …',178,1],
  ['ORD-OPAE','الحريسليم','+547111533','القصيم — …',277.50,1],
  ['ORD-VMTF','كريم إبراهيم السيد','01113336908','القصيم — …',428.50,2],
  ['ORD-DL03','ام موضيالدوسري','53323333806','الرياض — …',178,1],
  ['ORD-YRKK','karim obeid','01113336908','القصيم — …',178,1],
];
export const draftOrders=rows.map(([id,name,phone,address,amount,quantity])=>({
  id,name,phone,address,amount,quantity,country:'المملكة العربية السعودية',city:null,
  status:'incomplete',statusLabel:'غير مكتمل',attempts:0,source:'سوق الحرمين',
  payment:'عند الاستلام',product:null,date:null,origin:'screenshot',
  reason:id==='ORD-VMTF'?'لا يمكن جمع منتجات قابلة للتنفيذ وأخرى غير قابلة للتنفيذ. رقم الهاتف غير صالح.':'رقم الهاتف غير صالح',
}));
export const draftColumns=[
  ['reason','سبب عدم الاكتمال'],['id','رقم الطلب'],['status','الحالة'],['attempts','المحاولات'],
  ['customer','اسم العميل ورقمه'],['address','عنوان العميل'],['country','الدولة والمدينة'],
  ['amount','المبلغ'],['source','المصدر'],['payment','طريقة الدفع'],['quantity','القطع'],
];
