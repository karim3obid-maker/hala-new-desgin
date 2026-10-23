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
