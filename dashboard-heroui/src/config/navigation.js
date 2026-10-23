import {productViews} from './productViews';
export const navigation=[
  {icon:'layout-grid',label:'الرئيسية',path:'/'},
  {icon:'currency-dollar',label:'الأفلييت',path:'/affiliate'},
  {icon:'package',label:'المنتجات',path:'/products',children:productViews.map(({label,path,description})=>({label,path,description}))},
  {icon:'shopping-cart',label:'الطلبات',path:'/orders',children:[{label:'كل الطلبات',path:'/orders'},{label:'طلبات الدرافت',path:'/orders/drafts'}]},
  {icon:'truck',label:'الشحنات',path:'/shipments'},
  {icon:'link',label:'التكاملات'},
  {icon:'file-import',label:'طلبات الاستيراد'},
  {icon:'wallet',label:'المحفظة المالية',path:'/wallet'},
  {icon:'calculator',label:'الحاسبة'},
  {icon:'settings',label:'الإعدادات'},
];
export const pageTitles={...Object.fromEntries(productViews.map(({path,label})=>[path,label])),'/products':'المنتجات','/':'لوحة التحكم','/affiliate':'الأفلييت','/orders':'الطلبات','/orders/drafts':'طلبات الدرافت','/shipments':'الشحنات','/wallet':'المحفظة المالية'};
export const metricGroups={orders:{label:'الطلبات',path:'/orders',children:[{label:'كل الطلبات',path:'/orders'},{label:'طلبات الدرافت',path:'/orders/drafts'}]},shipments:{label:'الشحنات',path:'/shipments'},financial:{label:'المالية',path:'/wallet'}};
