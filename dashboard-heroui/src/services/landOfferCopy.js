import {validOffer} from './halaLandValidation.js';

export function offerPresentation(offer,offers,{hideQuantity=false}={}){
  const valid=validOffer(offer.quantity,offer.price);
  const quantity=Number(offer.quantity),price=Number(offer.price);
  const single=offers.find(item=>Number(item.quantity)===1&&validOffer(item.quantity,item.price));
  const original=valid&&single?Math.round(Number(single.price)*quantity*100)/100:0;
  const saving=valid?Math.max(0,Math.round((original-price)*100)/100):0;
  const percent=saving?Math.round(saving/original*100):0;
  const amount=value=>value.toFixed(2);
  const bundle=quantity===1?'قطعة واحدة':quantity===2?'قطعتين':quantity===3?'ثلاث قطع':`${quantity} قطع`;
  const suggested={
    ctaText:!valid?'اختر عرضك واطلب الآن':hideQuantity?'اختر هذا العرض واطلب الآن':saving?`خذ ${bundle} ووفّر ${amount(saving)} ر.س`:`اطلب ${bundle} الآن`,
    helperText:!valid?'اختر الكمية والسعر لعرض التفاصيل':saving?'كمية أكثر، وسعر أوفر':quantity===1?'ابدأ بقطعة وجرّب المنتج':'كل الكمية في طلب واحد',
    helperDescription:!valid?'':saving?`توفير ${amount(saving)} ر.س مقارنة بشراء كل قطعة بسعرها الفردي`:`إجمالي عرضك ${amount(price)} ر.س — اختره وأكمل بيانات طلبك`,
  };
  return {valid,quantity,price,original,saving,percent,suggested,copy:Object.fromEntries(Object.entries(suggested).map(([key,value])=>[key,offer[key]?.trim()?offer[key]:value]))};
}
