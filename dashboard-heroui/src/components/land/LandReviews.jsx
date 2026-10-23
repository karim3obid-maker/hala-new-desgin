import {Icon} from '../ui/Icon';
const examples=[
  {name:'نورة',city:'الرياض',text:'عجبني إن تفاصيل المنتج واضحة ومرتبة، عرفت وش أختار من غير ما أحتار.'},
  {name:'عبدالله',city:'جدة',text:'طريقة الطلب سهلة، وكل شي قدامي من العرض لين الإجمالي. كذا الواحد يطلب وهو مرتاح.'},
  {name:'سارة',city:'الدمام',text:'حلو إن فيه أكثر من عرض، قدرت أقارن وأختار اللي يناسبني على مهلي.'},
  {name:'خالد',city:'القصيم',text:'أهم شي عندي أعرف السعر والتوصيل من البداية، وعجبني إن التفاصيل كلها بمكان واحد.'},
  {name:'ريم',city:'أبها',text:'الصور والمعلومات ساعدتني أفهم المنتج، وحتى سياسة الإرجاع لقيتها واضحة.'},
  {name:'محمد',city:'المدينة المنورة',text:'نموذج الطلب مرتب وخفيف، وخيار الدفع عند الاستلام شي يهمني وقت أشتري.'},
];
export default function LandReviews({onBuy}){
  return <section className="land-reviews" aria-labelledby="land-reviews-title"><header><span className="land-reviews-demo">٦ نماذج تجريبية</span><h2 id="land-reviews-title">وش يقولون عملاؤنا؟</h2><p>أمثلة مكتوبة باللهجة السعودية لعرض التصميم؛ ليست تقييمات فعلية لعملاء.</p></header><div className="land-reviews-grid">{examples.map(example=><article className="land-review-card" key={example.name}><div className="land-review-person"><span className="land-review-avatar" aria-hidden="true">{example.name.charAt(0)}</span><div><h3>{example.name}</h3><small>{example.city} · اسم ورأي تجريبي</small></div></div><div className="land-review-stars" role="img" aria-label="نجوم توضيحية للتصميم، وليست تقييمًا فعليًا">{Array.from({length:5},(_,i)=><Icon name="star" key={i}/>)}</div><p>{example.text}</p><span className="land-review-example">نموذج محتوى · يُستبدل برأي عميل حقيقي</span></article>)}</div>{onBuy?<div className="land-section-cta"><button type="button" className="land-sitar-primary" onClick={onBuy}><Icon name="building-store"/>اختر عرضك واطلب الآن</button><small>راجع العرض والإجمالي قبل تأكيد الطلب</small></div>:null}</section>;
}
