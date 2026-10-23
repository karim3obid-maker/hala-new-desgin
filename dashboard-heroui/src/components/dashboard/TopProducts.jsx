import data from '../../data/top-products.json';
import headphones from '../../assets/products/headphones.svg';
import watch from '../../assets/products/watch.svg';
import blender from '../../assets/products/blender.svg';
import bottle from '../../assets/products/bottle.svg';
import lamp from '../../assets/products/lamp.svg';
import {Section} from './Metrics';

const images={headphones,watch,blender,bottle,lamp};
const columns=[
  {key:'orders',label:'الطلبات'},
  {key:'confirmed',label:'المؤكد',share:true},
  {key:'shipped',label:'المشحون',share:true},
  {key:'ndr',label:'NDR',description:'عدد حالات عدم التسليم'},
  {key:'aov',label:'AOV',money:true,description:'متوسط قيمة الطلب = الإيراد ÷ إجمالي الطلبات'},
  {key:'revenue',label:'الإيراد (USD)',money:true},
];
const totals=Object.fromEntries(['orders','confirmed','shipped','ndr','revenue'].map(key=>[key,data.products.reduce((sum,product)=>sum+product[key],0)]));
const aov=product=>product.orders>0?product.revenue/product.orders:null;
const number=new Intl.NumberFormat('en-US');
const currency=new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0});
const averageCurrency=new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',minimumFractionDigits:2,maximumFractionDigits:2});
const percentage=new Intl.NumberFormat('en-US',{maximumFractionDigits:1});
function ProductValue({product,column}){
  const value=column.key==='aov'?aov(product):product[column.key];
  const formatted=value==null?'—':column.key==='aov'?averageCurrency.format(value):column.money?currency.format(value):number.format(value);
  return <span className={'product-stat product-'+column.key}><bdi dir="ltr" className="product-stat-value">{formatted}</bdi>{column.share?<bdi dir="ltr" className="product-stat-percentage" title="النسبة من إجمالي العمود">{totals[column.key]>0?percentage.format(value/totals[column.key]*100)+'%':'—'}</bdi>:null}</span>
}
export function TopProducts(){return <Section id="top-products" title="أفضل ٥ منتجات" icon="package">
  <div className="top-products-note"><p id="top-products-description">حسب عدد الطلبات · النسب للمؤكد والمشحون من إجمالي كل عمود</p>{data.demo?<span className="products-demo-label">بيانات تجريبية</span>:null}</div>
  <div className="top-products-scroll" role="region" aria-label="جدول أفضل خمسة منتجات" tabIndex={0}>
    <table className="top-products-table" aria-describedby="top-products-description"><colgroup>{[26,10,15,15,8,12,14].map((width,index)=><col key={index} style={{width:width+'%'}}/>)}</colgroup><thead><tr><th scope="col">المنتج</th>{columns.map(column=><th scope="col" key={column.key}>{column.description?<abbr title={column.description}>{column.label}</abbr>:column.label}</th>)}</tr></thead>
      <tbody>{data.products.map(product=><tr key={product.id}><th scope="row"><div className="top-product-name"><img src={images[product.id]} alt="" width="30" height="30"/><span>{product.name}</span></div></th>{columns.map(column=><td key={column.key}><ProductValue product={product} column={column}/></td>)}</tr>)}</tbody>
      <tfoot><tr><th scope="row">الإجمالي</th>{columns.map(column=><td key={column.key}><ProductValue product={totals} column={column}/></td>)}</tr></tfoot>
    </table>
  </div>
</Section>}
