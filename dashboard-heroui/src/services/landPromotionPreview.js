// Local design examples only; never used as analytics, checkout prices or offer validity.
const memory=new Map();
function hash(value){let result=2166136261;for(const char of value){result^=char.charCodeAt(0);result=Math.imul(result,16777619)}return result>>>0}
export function getPromotionPreview(productId,{storage,now=Date.now()}={}){
  if(storage===undefined){try{storage=globalThis.localStorage}catch{}}
  const id=String(productId||'new'),key='hala-land:promotion-demo:v1:'+id;
  const visitors=800+hash('visitors:'+id)%701;
  let stored;try{stored=JSON.parse(storage?.getItem(key)||'null')}catch{}
  const valid=value=>value&&Number.isFinite(value.startedAt)&&Number.isInteger(value.hours)&&value.hours>=3&&value.hours<=18&&value.deadline===value.startedAt+value.hours*3600000;
  if(!valid(stored))stored=memory.get(key);
  if(!valid(stored)){const hours=3+hash('duration:'+id)%16;stored={startedAt:now,hours,deadline:now+hours*3600000};try{storage?.setItem(key,JSON.stringify(stored))}catch{}}
  memory.set(key,stored);
  return {visitors,hours:stored.hours,deadline:new Date(stored.deadline).toISOString()};
}
export function previewOriginalPrice(price){const value=Number(price);return Number.isFinite(value)&&value>0?Math.round(value/0.8*100)/100:null}
