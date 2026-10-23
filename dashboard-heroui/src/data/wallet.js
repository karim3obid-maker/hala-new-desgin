// Independent snapshot transcribed from the finance screenshots; no API connection.
export const walletMetrics = [
  {label:'الرصيد المتاح',value:'44.29',currency:'USD',icon:'wallet',tone:'purple',highlight:true,caption:'متاح للسحب'},
  {label:'إجمالي الدخل',value:'56.47',currency:'USD',icon:'arrow-up-right',tone:'green'},
  {label:'إجمالي المصروفات',value:'221.87',currency:'USD',icon:'arrow-down-right',tone:'red'},
  {label:'الأرباح',value:'0.00',currency:'USD',icon:'currency-dollar',tone:'green'},
  {label:'قيد المعالجة',value:'225.00',currency:'USD',icon:'clock',tone:'orange'},
];
export const serviceFees = [
  {group:'التأكيد',name:'طلبات محتملة',rate:'0.50',unit:'لكل طلب',orders:230,total:'115.00'},
  {group:'التأكيد',name:'طلبات مؤكدة',rate:'1.00',unit:'لكل طلب',orders:90,total:'90.00'},
  {group:'التأكيد',name:'الطلبات الموصّلة',rate:'1.50',unit:'لكل طلب',orders:1,total:'1.50'},
  {group:'التأكيد',name:'بيع إضافي (Up Sell)',rate:'1.00',unit:'لكل طلب',orders:0,total:'0.00'},
  {group:'الشحن',name:'رسوم التوصيل',rate:'5.00',unit:'لكل طلب',orders:1,total:'5.00'},
  {group:'الشحن',name:'رسوم الإرجاع',rate:'3.00',unit:'لكل طلب',orders:0,total:'0.00'},
  {group:'الشحن',name:'رسوم التجهيز',rate:'0.00',unit:'لكل طلب',orders:0,total:'0.00'},
  {group:'الشحن',name:'رسوم COD',rate:'5.00%',unit:'من قيمة الطلب',orders:1,total:'2.37',percentage:true},
];
export const performance = [
  {label:'نسبة التأكيد',value:'42.45'},
  {label:'الاستلام',value:'42.13'},
  {label:'المرتجعات',value:'0.00'},
  {label:'نسبة COD',value:'5'},
];

// Expense categories requested by the user. Missing amounts remain unknown.
export const additionalExpenses = [
  {name:'منتجات هلا شير',total:'8.00'},
  {name:'مصاريف إعلانات',total:'0.00'},
  {name:'نقل بضاعة إلى المخزن',total:null},
  {name:'استيراد بضاعة من الصين',total:null},
  {name:'نقل بضاعة من مصر إلى السعودية',total:null},
  {name:'تكاليف إعلانات تيك توك',total:null},
];

// Current tariff supplied by the user; historical summary charges remain a snapshot.
export const currentServicePrices = [
  {name:'خدمات الشحن',icon:'truck',items:[
    {name:'الشحن',rate:'3.00',unit:'لكل طلب مشحون',icon:'truck'},
    {name:'التوصيل',rate:'2.00',unit:'لكل طلب موصّل',icon:'package'},
    {name:'المرتجع',rate:'0.00',unit:'لكل طلب مرتجع',icon:'arrow-forward-up'},
  ]},
  {name:'خدمات الكول سنتر',icon:'headset',items:[
    {name:'الكول سنتر',rate:'1.50',unit:'لكل طلب مرفوع',icon:'headset'},
  ]},
];

// User-requested demo invoices. These are UI fixtures, not issued financial records.
export const walletInvoices = [
  {id:'DEMO-INV-003',demo:true,issuedAt:'2026-10-23T10:00:00+03:00',dueAt:'2026-10-30T18:00:00+03:00',status:'مستحقة',total:'110.00',items:[
    {id:'shipping',name:'شحن الطلبات',quantity:20,unitPrice:'3.00',total:'60.00'},
    {id:'delivery',name:'توصيل الطلبات',quantity:10,unitPrice:'2.00',total:'20.00'},
    {id:'call-center',name:'خدمات الكول سنتر',quantity:20,unitPrice:'1.50',total:'30.00'},
  ]},
  {id:'DEMO-INV-002',demo:true,issuedAt:'2026-10-20T11:30:00+03:00',dueAt:'2026-10-27T18:00:00+03:00',status:'قيد المعالجة',total:'45.00',items:[
    {id:'call-center',name:'خدمات الكول سنتر',quantity:30,unitPrice:'1.50',total:'45.00'},
  ]},
  {id:'DEMO-INV-001',demo:true,issuedAt:'2026-10-15T09:00:00+03:00',dueAt:'2026-10-22T18:00:00+03:00',status:'مدفوعة',total:'40.00',items:[
    {id:'shipping',name:'شحن الطلبات',quantity:10,unitPrice:'3.00',total:'30.00'},
    {id:'delivery',name:'توصيل الطلبات',quantity:5,unitPrice:'2.00',total:'10.00'},
  ]},
];
