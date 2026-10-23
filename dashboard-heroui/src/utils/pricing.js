// Expected values per delivered order. Returned stock is assumed reusable.
export const pricingDefaults={product:'',ads:6,confirmation:55,delivery:35,margin:30,sale:80,leads:100,units:1,call:1.5,shipping:3,deliveredFee:2,returnedFee:0,cod:5,other:0,exchange:3.75};
export function calculatePricing(values){
  const v=Object.fromEntries(Object.entries(values).map(([key,value])=>[key,value===''?NaN:Number(value)]));
  const invalid=Object.entries(v).some(([key,value])=>!Number.isFinite(value)||value<0||(['confirmation','delivery','margin','cod'].includes(key)&&value>100));
  if(invalid||v.units<1||v.leads<1||!Number.isInteger(v.units)||!Number.isInteger(v.leads)||v.exchange<=0)return {error:'أكمل الحقول بأرقام صحيحة. الكمية والطلبات أعداد صحيحة موجبة، والنسب من 0 إلى 100.'};
  const c=v.confirmation/100,d=v.delivery/100,success=c*d;
  if(!success)return {error:'لا يمكن حساب سعر يغطّي التكاليف عندما تكون نسبة التأكيد أو التوصيل صفرًا.'};
  const costs=[
    {label:'المنتجات',value:v.product*v.units},
    {label:'الإعلانات موزعة على الطلبات الموصّلة',value:v.ads/success},
    {label:'الكول سنتر لكل طلب مرفوع',value:v.call/success},
    {label:'الشحن لكل طلب مؤكد',value:v.shipping/d},
    {label:'التوصيل الناجح',value:v.deliveredFee},
    {label:'المرتجعات موزعة على الطلبات الموصّلة',value:v.returnedFee*(1-d)/d},
    {label:'مصاريف إضافية لكل طلب موصّل',value:v.other},
  ];
  const base=costs.reduce((total,item)=>total+item.value,0);
  if(!Number.isFinite(base)||!Number.isFinite(base*v.leads))return {error:'القيم أكبر من نطاق الحساب. استخدم مبالغ وعدد طلبات أقل.'};
  const breakEven=v.cod<100?base/(1-v.cod/100):null;
  const suggested=v.cod+v.margin<100?base/(1-(v.cod+v.margin)/100):null;
  return {v,c,d,success,costs,base,breakEven,suggested};
}
export function priceOutcome(model,price){
  const codCost=price*model.v.cod/100,total=model.base+codCost,profit=price-total;
  return {price,codCost,total,profit,margin:price?profit/price*100:null,delivered:model.v.leads*model.success,confirmed:model.v.leads*model.c,campaignProfit:profit*model.v.leads*model.success};
}
