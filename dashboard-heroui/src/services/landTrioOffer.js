// Add the requested bundle without changing existing prices or a merchant's trio.
export function withTrioOffer(offers){
  if(offers.some(offer=>Number(offer.quantity)===3)||offers.length>=5)return offers;
  const base=offers.find(offer=>Number(offer.quantity)===1&&Number(offer.price)>0)||offers.find(offer=>Number(offer.quantity)>0&&Number(offer.price)>0);
  if(!base)return offers;
  const price=(Math.round(Math.round(Number(base.price)*100)*3/Number(base.quantity))/100).toFixed(2);
  return [...offers,{id:'bundle-trio',quantity:'3',price,ctaText:'اشتري ثلاث قطع',helperText:'',helperDescription:'',hideUnitPrice:false,freeShipping:false}];
}
