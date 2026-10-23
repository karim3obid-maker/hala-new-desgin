// Transcribed from the supplied orders screenshot. Ellipses preserve clipped source text.
export const snapshotMetrics = [
  {label:'إجمالي الطلبات',value:'336',icon:'shopping-cart',tone:'purple'},
  {label:'طلبات جديدة',value:'4',percentage:'1.19%',icon:'clock',tone:'amber'},
  {label:'طلبات مؤكدة',value:'142',percentage:'42.26%',icon:'circle-check',tone:'green'},
  {label:'جاري التأكيد',value:'62',percentage:'18.45%',icon:'clock',tone:'blue'},
  {label:'الطلبات المؤجلة',value:'7',percentage:'2.08%',icon:'clock',tone:'cyan'},
  {label:'طلبات ملغاة',value:'128',percentage:'38.10%',icon:'circle-x',tone:'red'},
];
export const orderStatuses = [
  {id:'all',label:'الكل',count:336}, {id:'new',label:'جديد',count:4,tone:'amber'},
  {id:'confirming',label:'قيد التأكيد',count:62,tone:'blue'},
  {id:'confirmed',label:'مؤكد',count:142,tone:'green'},
  {id:'stock',label:'بانتظار المخزون',count:0,tone:'cyan'},
  {id:'action',label:'انتظار إجراء',count:58,tone:'orange'},
  {id:'deferred',label:'مؤجل',count:7,tone:'cyan'},
  {id:'cancelled',label:'ملغي',count:128,tone:'red'},
  {id:'draft',label:'مسودة',count:29,tone:'purple'},
  {id:'fake',label:'وهمي',count:19,tone:'red'},
];
const rows = [
  ['ORD-WHYN','محمد الحربي','+966503302561','المدينة المنورة…',null,133,'new','طلب جديد',0],
  ['ORD-KGYG','ابو ريان','+966556353139','مكة المكرمة…',null,277.50,'new','طلب جديد',0],
  ['ORD-RFDD','ابو فهد / احمد الزهرا…','+966545593009','القصيم — …',null,178,'new','طلب جديد',0],
  ['ORD-EDOG','محمد البيشي','+966554432168','الرياض — …',null,178,'new','طلب جديد',0],
  ['ORD-H0QZ','ابورعد المدخلي','+966570616280','الرياض — …',null,178,'deferred','مؤجل',1],
  ['ORD-U1GF','سيف مضحي البراك','+966505203098','الرياض — …',null,178,'confirming','يعالج',1],
  ['ORD-FTMX','خالد مالك','+966552625505','جدة حي الأمير عبد…','جدة',178,'confirmed','جاهز للتنفيذ',1],
  ['ORD-UKQG','منصور إبراهيم','+966505676833','جدة حي المنار شارع…','جدة',277.50,'confirmed','جاهز للتنفيذ',0],
  ['ORD-YMFP','جابر محمد عسيري','+966504783667','القصيم — …',null,178,'cancelled','ملغي',1],
  ['ORD-UGRL','محمد الشهراني','+966557529812','عسير — …',null,158,'deferred','مؤجل',0],
];
export const screenshotOrders = rows.map(([id,name,phone,address,city,amount,status,statusLabel,attempts])=>({
  id,name,phone,address,city,amount,status,statusLabel,attempts,
  country:'المملكة العربية السعودية',source:'سوق الحرمين',reason:'لا يوجد',
  product:null,date:null,origin:'screenshot',
}));
export const orderColumns = [
  ['id','رقم الطلب'],['status','الحالة'],['attempts','المحاولات'],
  ['customer','اسم العميل ورقمه'],['address','عنوان العميل'],['country','الدولة والمدينة'],
  ['amount','المبلغ'],['source','المصدر'],['product','المنتج'],['date','تاريخ الطلب'],
];
export const defaultColumns = orderColumns.filter(([id])=>!['product','date'].includes(id)).map(([id])=>id);
