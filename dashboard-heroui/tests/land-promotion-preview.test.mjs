import assert from 'node:assert/strict';
import {getPromotionPreview,previewOriginalPrice} from '../src/services/landPromotionPreview.js';
const data=new Map(),storage={getItem:key=>data.get(key)||null,setItem:(key,value)=>data.set(key,value)};
const now=1800000000000;
for(let i=0;i<100;i++){
 const first=getPromotionPreview('test-product-'+i,{storage,now});
 assert.ok(first.visitors>=800&&first.visitors<=1500);
 assert.ok(first.hours>=3&&first.hours<=18);
 assert.equal(Date.parse(first.deadline)-now,first.hours*3600000);
 assert.deepEqual(getPromotionPreview('test-product-'+i,{storage,now:now+3600000}),first);
 assert.deepEqual(getPromotionPreview('test-product-'+i,{storage,now:now+86400000}),first,'Expired demo must not restart');
}
const blocked={getItem(){throw Error('blocked')},setItem(){throw Error('blocked')}};
assert.deepEqual(getPromotionPreview('storage-blocked',{storage:blocked,now}),getPromotionPreview('storage-blocked',{storage:blocked,now:now+1000}));
assert.equal(previewOriginalPrice('15'),18.75);
assert.equal(previewOriginalPrice('invalid'),null);
assert.equal(previewOriginalPrice(0),null);
console.log('Promotion previews: ranges, persistence, expiry without reset, blocked storage, price calculation passed.');
