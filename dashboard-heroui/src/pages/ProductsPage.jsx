import {useState} from 'react';
import {Button,Card,Input,TextField,Tooltip} from '@heroui/react';
import {useLocation,useNavigate,useOutletContext} from 'react-router';
import {productViews} from '../config/productViews';
import {Icon} from '../components/ui/Icon';
import ProductDetails from '../components/products/ProductDetails';
import ProductOffersModal from '../components/products/ProductOffersModal';
import {products,categories} from '../data/products';

const normalize=value=>value.trim().toLowerCase().replace(/[أإآ]/g,'ا').replace(/ة/g,'ه');
const number=value=>value.toLocaleString('en-US');
export default function ProductsPage(){
  const {notify}=useOutletContext();
  const [query,setQuery]=useState('');
  const [category,setCategory]=useState('all');
  const {pathname}=useLocation();
  const navigate=useNavigate();
  const view=productViews.find(item=>item.path===pathname)||productViews[0];
  const tab=view.id;
  function setTab(id){navigate(productViews.find(item=>item.id===id).path)}
  const [sort,setSort]=useState('source');
  const [offersByProduct,setOffersByProduct]=useState({});
  const saved=Object.keys(offersByProduct);
  const [offerProduct,setOfferProduct]=useState(null);
  const detailId=pathname.startsWith('/products/item/')?pathname.split('/')[3]:null;
  const detailProduct=products.find(product=>product.id===detailId);
  const unavailable=tab==='private'||tab==='testing';
  const base=unavailable?[]:products.filter(product=>tab!=='saved'||saved.includes(product.id));
  const rows=base.filter(product=>(category==='all'||product.category===category)&&normalize(product.name).includes(normalize(query))).sort((a,b)=>sort==='stock'?b.stock-a.stock:sort==='name'?a.name.localeCompare(b.name,'ar'):a.index-b.index);
  function openProduct(product){navigate('/products/item/'+product.id)}
  const offersModal=offerProduct?<ProductOffersModal key={offerProduct.id} product={offerProduct} initialOffers={offersByProduct[offerProduct.id]} onClose={()=>setOfferProduct(null)} onSave={offers=>{setOffersByProduct(current=>({...current,[offerProduct.id]:offers}));setOfferProduct(null);notify('تم حفظ عروض المنتج في قائمتك للمعاينة')}}/>:null;
  function reset(){setQuery('');setCategory('all');setSort('source')}
  if(detailId)return detailProduct?<><ProductDetails product={detailProduct} offers={offersByProduct[detailProduct.id]} onOffers={()=>setOfferProduct(detailProduct)} onBack={()=>navigate('/products')}/>{offersModal}</>:<Card className="catalog-empty"><h2>المنتج غير موجود</h2><Button onPress={()=>navigate('/products')}>هلا شير</Button></Card>;
  return <div className="products-page">
    <div className="catalog-intro"><div><h2>منتجات تناسب تجارتك</h2><p>تصفّح المنتجات حسب التصنيف، واجمع اختياراتك في مكان واحد.</p></div><span className="catalog-country"><Icon name="world"/>المملكة العربية السعودية</span></div>
    <Card className="catalog-controls">
      <div className="catalog-tabs" role="group" aria-label="قوائم المنتجات">{productViews.map(item=><Tooltip key={item.id} delay={250}><Button size="sm" variant="ghost" aria-pressed={tab===item.id} aria-describedby={tab===item.id?'catalog-view-description':undefined} className={tab===item.id?'selected':''} onPress={()=>{reset();setTab(item.id)}}><Icon name={item.icon}/>{item.label}{item.id==='discover'?<span>{products.length}</span>:item.id==='saved'?<span>{saved.length}</span>:null}</Button><Tooltip.Content className="catalog-view-tooltip" placement="bottom">{item.description}</Tooltip.Content></Tooltip>)}</div>
      <p className="catalog-view-description" id="catalog-view-description"><Icon name="info"/>{view.description}</p>
      {!unavailable?<><div className="catalog-search-row"><TextField aria-label="البحث باسم المنتج" value={query} onChange={setQuery} className="catalog-search"><div className="search-control"><Icon name="search"/><Input placeholder="ابحث عن منتج…"/></div></TextField><label className="catalog-sort">الترتيب<select value={sort} onChange={event=>setSort(event.target.value)}><option value="source">الترتيب الأصلي</option><option value="stock">الأكثر مخزونًا</option><option value="name">اسم المنتج</option></select></label></div>
      <div className="catalog-categories" role="group" aria-label="تصنيفات المنتجات">{categories.map(item=><Button key={item.id} size="sm" variant="ghost" aria-pressed={category===item.id} className={'catalog-category '+(category===item.id?'selected':'')} onPress={()=>setCategory(item.id)}><Icon name={item.icon}/>{item.label}<bdi dir="ltr">{base.filter(product=>item.id==='all'||product.category===item.id).length}</bdi></Button>)}</div></>:null}
    </Card>
    <div className="catalog-results-heading"><h2>{category==='all'?view.label:categories.find(item=>item.id===category).label} {!unavailable?<span> / {rows.length} منتج</span>:null}</h2>{query||category!=='all'||sort!=='source'?<Button size="sm" variant="ghost" onPress={reset}><Icon name="reset"/>مسح الفلاتر</Button>:null}<small>معاينة من الصورة المرجعية · الحفظ في هذه الجلسة فقط</small></div>
    {unavailable?<Card className="catalog-empty"><Icon name="package"/><h3>{view.label}</h3><p>{view.description}</p><small>بيانات هذا القسم غير متاحة في المعاينة الحالية.</small></Card>:rows.length?<div className="catalog-grid">{rows.map(product=><Card key={product.id} className="catalog-product"><button className="catalog-image-button" onClick={()=>openProduct(product)} aria-label={'عرض '+product.name}><img src={product.image} alt={product.name} loading="lazy" width="480" height="480"/></button><div className="catalog-product-body"><span className="catalog-product-category">{categories.find(item=>item.id===product.category).label}</span><button className="catalog-name" onClick={()=>openProduct(product)}>{product.name}</button><div className="catalog-stock"><Icon name="package"/><span>متوفر <bdi dir="ltr">{number(product.stock)}</bdi> قطعة</span></div><div className="catalog-prices"><div><span>سعر التكلفة</span><strong><bdi dir="ltr">{product.cost}</bdi><small>ر.س</small></strong></div><div><span>سعر البيع المقترح</span><strong><bdi dir="ltr">{product.suggestedPrice}</bdi><small>ر.س</small></strong></div></div><Button size="sm" variant={saved.includes(product.id)?'secondary':'primary'} className="catalog-save" aria-pressed={saved.includes(product.id)} onPress={()=>setOfferProduct(product)}><Icon name={saved.includes(product.id)?'circle-check':'plus'}/>{saved.includes(product.id)?'تعديل عروض البيع':'إضافة إلى قائمتي'}</Button></div></Card>)}</div>:<Card className="catalog-empty"><Icon name={tab==='saved'&&!saved.length?'shopping-cart':'search'}/><h3>{tab==='saved'&&!saved.length?'قائمتك تبدأ باختيارك':'لا توجد منتجات مطابقة'}</h3><p>{tab==='saved'&&!saved.length?'أضف المنتجات التي تناسبك من هلا شير.':'جرّب اسمًا آخر أو امسح الفلاتر لعرض المزيد.'}</p><Button size="sm" variant="secondary" onPress={()=>{reset();if(tab==='saved'&&!saved.length)setTab('discover')}}>{tab==='saved'&&!saved.length?'هلا شير':'مسح الفلاتر'}</Button></Card>}
    {offersModal}
  </div>;
}
