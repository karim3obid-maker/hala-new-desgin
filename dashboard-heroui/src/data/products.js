const images=import.meta.glob('../assets/catalog/*.jpg',{eager:true,query:'?url',import:'default'});
export const categories=[{id:'all',label:'كل التصنيفات',icon:'layout-grid'},{id:'health',label:'الصحة والعناية',icon:'headset'},{id:'kids',label:'مستلزمات الأطفال',icon:'gift'},{id:'electronics',label:'الإلكترونيات',icon:'calculator'},{id:'other',label:'منتجات متنوعة',icon:'package'}];
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
export const products=rows.map(([id,name,category,stock],index)=>({id,name,category,stock,index,cost:15,suggestedPrice:15,image:images[`../assets/catalog/${id}.jpg`]}));
