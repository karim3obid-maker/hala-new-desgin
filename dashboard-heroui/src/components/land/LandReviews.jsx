import {Icon} from '../ui/Icon';
const examples=[
  {name:'نورة',city:'الرياض',text:'عجبني إن تفاصيل المنتج واضحة ومرتبة، عرفت وش أختار من غير ما أحتار.'},
  {name:'عبدالله',city:'جدة',text:'طريقة الطلب سهلة، وكل شي قدامي من العرض لين الإجمالي. كذا الواحد يطلب وهو مرتاح.'},
  {name:'سارة',city:'الدمام',text:'حلو إن فيه أكثر من عرض، قدرت أقارن وأختار اللي يناسبني على مهلي.'},
  {name:'خالد',city:'القصيم',text:'أهم شي عندي أعرف السعر والتوصيل من البداية، وعجبني إن التفاصيل كلها بمكان واحد.'},
  {name:'ريم',city:'أبها',text:'الصور والمعلومات ساعدتني أفهم المنتج، وحتى سياسة الإرجاع لقيتها واضحة.'},
  {name:'محمد',city:'المدينة المنورة',text:'نموذج الطلب مرتب وخفيف، وخيار الدفع عند الاستلام شي يهمني وقت أشتري.'},
];
export default function LandReviews({onBuy,rating='٤٫٩'}){
  return <section className="land-reviews" aria-labelledby="land-reviews-title">
    <header><span className="land-reviews-demo">بيانات تجريبية</span><h2 id="land-reviews-title">وش يقولون عملاؤنا؟</h2><div className="land-reviews-summary" aria-label="ملخص توضيحي للشراء والتقييم"><div><Icon name="building-store"/><span>تم شراء المنتج<strong>١٥٠٠ طلب</strong></span></div><div><Icon name="star"/><span>تقييم العملاء<strong>{rating} <small>من ٥ نجوم</small></strong></span></div></div><p>٦ آراء وأرقام توضيحية للمعاينة؛ ليست بيانات فعلية لعملاء.</p></header>
    <div className="land-reviews-grid">{examples.map(example=><article className="land-review-card" key={example.name}><div className="land-review-heading"><div className="land-review-person"><span className="land-review-avatar" aria-hidden="true">{example.name.charAt(0)}</span><div><h3>{example.name}</h3><small>{example.city}</small></div></div><div className="land-review-stars" role="img" aria-label="٥ نجوم توضيحية للتصميم، وليست تقييمًا فعليًا">{Array.from({length:5},(_,i)=><Icon name="star" key={i}/>)}</div></div><p>{example.text}</p></article>)}</div>
    {onBuy?<div className="land-section-cta"><button type="button" className="land-sitar-primary" onClick={onBuy}><Icon name="building-store"/>اختر عرضك واطلب الآن</button><small>راجع العرض والإجمالي قبل تأكيد الطلب</small></div>:null}
  </section>;
}
