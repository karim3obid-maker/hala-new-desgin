// Values transcribed from the supplied shipment screenshot. Missing fields stay unknown.
export const shipmentStatuses=[
  {id:'all',label:'الكل',count:89},
  {id:'waiting',label:'قيد الانتظار',count:13,tone:'orange',icon:'clock'},
  {id:'ready',label:'جاهز للشحن',count:0,tone:'orange',icon:'package'},
  {id:'preparing',label:'قيد التجهيز',count:0,tone:'blue',icon:'package'},
  {id:'shipped',label:'تم الشحن',count:75,tone:'green',icon:'truck'},
  {id:'transit',label:'في الطريق',count:0,tone:'orange',icon:'truck'},
  {id:'attempted',label:'محاولة التسليم',count:0,tone:'blue',icon:'clock'},
  {id:'delivered',label:'تم التسليم',count:1,tone:'green',icon:'circle-check'},
  {id:'failed',label:'فشل التسليم',count:0,tone:'red',icon:'circle-x'},
  {id:'returned',label:'مرتجع',count:0,tone:'purple',icon:'reset'},
  {id:'cancelled',label:'ملغية',count:null,tone:'red',icon:'circle-x'},
];
export const shipmentMetrics=[
  {label:'إجمالي الشحنات',value:'89',tone:'purple',icon:'package'},
  {label:'شحنة جديدة',value:'13',tone:'amber',icon:'clock'},
  {label:'جاهزة للتسليم',value:'0',tone:'orange',icon:'package'},
  {label:'تم الشحن',value:'75',tone:'green',icon:'truck'},
  {label:'تم التوصيل',value:'1',tone:'green',icon:'circle-check'},
  {label:'تم الإرجاع',value:'0',tone:'purple',icon:'reset'},
  {label:'في الطريق',value:'0',tone:'orange',icon:'truck'},
  {label:'محاولة التسليم',value:'0',tone:'blue',icon:'clock'},
  {label:'في التحضير',value:'0',tone:'blue',icon:'package'},
  {label:'فشلت',value:'0',tone:'red',icon:'circle-x'},
];
const rows=[
 ['ORD-F1AS-S1','32983','سعد العتيبي','+966553377370',178,'2026-10-23'],
 ['ORD-YTDJ-S1','33099','عبدالله الزهراني','+966505757717',277.5,'2026-10-23'],
 ['ORD-YXMS-S1','33044','محسن الزهراني','+966505712667',208.5,'2026-10-23'],
 ['ORD-3YAQ-S1','33120','حماد احمد','+966567420376',178,'2026-10-22'],
 ['ORD-VKFY-S1','33033','عبدالرحمن وهاس','+966536667016',277.5,'2026-10-22'],
 ['ORD-YMIL-S1','32974','ربيع البلادي','+966550073580',277.5,'2026-10-22'],
 ['ORD-IJLB-S1','33266','IBRAHIM ALDOSARY','+966506656678',277.5,'2026-10-22'],
 ['ORD-SMUH-S1','33062','ابو هتان','+966553365771',178,'2026-10-22'],
 ['ORD-Z062-S1','33251','هادي مهدي مفرح ا…','+966503672118',178,'2026-10-22'],
 ['ORD-T6ZE-S1','33021','منديل','+966544803050',178,'2026-10-22'],
 ['ORD-MS3X-S1','33121','محمدمقبل وجيه','+966555528979',208.99,'2026-10-23'],
 ['ORD-110P-S1','33110','عبدالله القحطاني','+966556289857',188,'2026-10-23'],
];
export const screenshotShipments=rows.map(([id,orderId,name,phone,amount,date])=>({id,orderId,name,phone,amount,date,status:'waiting',items:1,tracking:null,country:null,city:null,expected:null,productIds:[]}));
export const shipmentColumns=[['status','حالة الشحنة'],['id','رقم الشحنة'],['orderId','رقم الطلب'],['tracking','رقم التتبع'],['customer','العميل'],['country','الدولة والمدينة'],['items','العناصر'],['amount','COD'],['expected','التسليم المتوقع'],['date','تاريخ الإنشاء']];

// Additional fields visible in the shipment-details reference (ORD-YTDJ-S1 only).
export const shipmentReference={
  id:'ORD-YTDJ-S1',updatedAt:'2026/10/23',city:'جدة',district:'المروة',nationalAddress:'JDMB5380',
  address:'جدة حي المروة شارع ابو قتادة الانصاري بالقرب من لولو هايبر ماركت - المروة كود العنوان الوطني JDMB5380',
  deliveryDistrict:'المروة',productIds:['shemagh-58'],
  products:[{id:'shemagh-58',name:'شماغ 58',sku:'Hala0002074',quantity:5,status:'reserved',warehouse:'مستودع الرياض'}],
};
Object.assign(screenshotShipments.find(row=>row.id===shipmentReference.id),shipmentReference);
