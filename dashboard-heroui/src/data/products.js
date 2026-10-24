const images=import.meta.glob('../assets/catalog/*.jpg',{eager:true,query:'?url',import:'default'});
export const categories=[{id:'all',label:'كل التصنيفات',icon:'layout-grid'},{id:'discounts',label:'خصومات',icon:'gift'},{id:'health',label:'الصحة والعناية',icon:'headset'},{id:'kids',label:'مستلزمات الأطفال',icon:'gift'},{id:'electronics',label:'الإلكترونيات',icon:'calculator'},{id:'other',label:'منتجات متنوعة',icon:'package'}];
const rows=[
 ['magic-book','Magic Book — مجموعة كتب تعليمية للأطفال لتعلم اللغة الإنجليزية','kids',7000],
 ['maxx','Purely MAXX Nitric Oxide Boost — مكمل غذائي لدعم الطاقة والأداء البدني','health',300],
 ['berberine','بربرين WellBetX الطبيعي 1000 مجم — 60 كبسولة','health',200],
 ['theraworx','فوم ثيراووركس لتخفيف تشنجات وشد العضلات — Theraworx Muscle Cramps','health',263],
 ['maca','قهوة ماكا للرجال بالطاقة العشبية — MACA Men Power','health',300],
 ['lumbar','جل لومبار كير (Lumbar Care) — العناية الفائقة بالظهر والفقرات','health',2000],
 ['joint-care','جل العناية بالمفاصل والعضلات بالأعشاب الصينية — Joint Care Gel، 50 جم','health',100],
 ['olevs','ساعة OLEVS الرجالية الفاخرة — أسود × ذهبي بتصميم كلاسيكي أنيق','other',100],
 ['dental','بخاخ العناية باللثة والأسنان من دكتور بوريس آرت — 30 مل','health',300],
 ['grinder','مطحنة القهوة والحبوب الكهربائية (Electric Coffee Grinder)','electronics',500],
 ['gold-bond','بخاخ جولد بوند JBD 007 (Gold Bond JBD 007)','health',200],
 ['bloom','قهوة بلوم بالكولاجين (Bloom Collagen Coffee)','other',30800],
];
export const products=rows.map(([id,name,category,stock],index)=>({id,name,category,stock,index,sku:id==='magic-book'?'TxzRIjPA':`HALA-${String(index+1).padStart(4,'0')}`,cost:15,suggestedPrice:15,image:images[`../assets/catalog/${id}.jpg`]}));

// User-requested testing versions of the same catalog, with separate saved offers and no stock.
export const testingProducts=products.map(product=>({...product,id:'testing-'+product.id,originalId:product.id,testing:true,stock:null}));

// User-requested saved-list preview; reuse catalog prices without inventing offers.
export const savedPreviewProductIds=['magic-book','lumbar','olevs','dental','grinder','bloom'];
export function createSavedPreviewOffers(){
  return Object.fromEntries(products.filter(product=>savedPreviewProductIds.includes(product.id)).map(product=>[product.id,[{quantity:1,price:product.suggestedPrice}]]));
}

// Two low-stock examples explicitly requested for the saved-list preview.
const savedStockPreview={'magic-book':6,'lumbar':8};
export function withSavedStockPreview(product){
  return Object.hasOwn(savedStockPreview,product.id)?{...product,stock:savedStockPreview[product.id],stockPreview:true}:product;
}
