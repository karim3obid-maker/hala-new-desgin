import {settingsSections} from '../data/settings';
import {productViews} from './productViews';
import {integrationsPageTitle} from '../data/integrations';
export const navigation=[
  {icon:'layout-grid',label:'الرئيسية',path:'/'},
  {icon:'currency-dollar',label:'الأفلييت',path:'/affiliate'},
  {icon:'package',label:'المنتجات',path:'/products',children:productViews.map(({label,path,description})=>({label,path,description}))},
  {icon:'world',label:'هلا لاند',path:'/hala-land'},
  {icon:'shopping-cart',label:'الطلبات',path:'/orders',children:[{label:'كل الطلبات',path:'/orders'},{label:'طلبات الدرافت',path:'/orders/drafts'}]},
  {icon:'truck',label:'الشحنات',path:'/shipments'},
  {icon:'link',label:integrationsPageTitle,path:'/integrations'},
  {icon:'file-import',label:'طلبات الاستيراد',path:'/import-orders'},
  {icon:'wallet',label:'المحفظة المالية',path:'/wallet'},
  {icon:'gift',label:'عروض هلا',path:'/offers'},
  {icon:'calculator',label:'الحاسبة',path:'/calculator'},
  {icon:'currency-dollar',label:'الأسعار والخدمات',path:'/pricing'},
  {icon:'settings',label:'الإعدادات',path:'/settings'},
  {icon:'headset',label:'المساعدة',path:'/help'},
];
export const offerPageTitles={'/offers':'عروض هلا','/offers/100-products':'عرض 100% بروفت','/offers/hala-partner':'Hala Partner'};
export const pageTitles={'/pricing':'الأسعار والخدمات','/help':'المساعدة','/hala-land':'هلا لاند','/hala-land/settings':'هلا لاند','/hala-land/pages/new':'إنشاء صفحة هبوط',...offerPageTitles,...Object.fromEntries(settingsSections.map(({path})=>[path,'الإعدادات'])),...Object.fromEntries(productViews.map(({path,label})=>[path,label])),'/products':'المنتجات','/':'لوحة التحكم','/affiliate':'الأفلييت','/orders/new':'طلب جديد','/orders':'الطلبات','/orders/drafts':'طلبات الدرافت','/shipments':'الشحنات','/calculator':'حاسبة التسعير والأرباح','/wallet':'المحفظة المالية','/integrations':integrationsPageTitle,'/import-orders':'طلبات الاستيراد','/import-orders/new':'طلب استيراد جديد'};
export const metricGroups={orders:{label:'الطلبات',path:'/orders',children:[{label:'كل الطلبات',path:'/orders'},{label:'طلبات الدرافت',path:'/orders/drafts'}]},shipments:{label:'الشحنات',path:'/shipments'},financial:{label:'المالية',path:'/wallet'}};
