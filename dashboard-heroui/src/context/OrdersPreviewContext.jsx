import {createContext,useContext,useRef,useState} from 'react';
import {normalizeSaudiPhone,productTotals} from '../data/draftEditor';

const OrdersPreviewContext=createContext(null);
export const useOrdersPreview=()=>useContext(OrdersPreviewContext);
export function OrdersPreviewProvider({children}){
  const [newOrders,setNewOrders]=useState([]);
  const ordersRef=useRef([]);
  function submitDraft(draft,values,products,pricing={mode:'unit'}){
    const existing=draft&&ordersRef.current.find(order=>order.sourceDraftId===draft.id);
    if(existing)return existing;
    const {total,quantity}=productTotals(products,pricing);
    const order={...draft,...values,id:'LOCAL-'+crypto.randomUUID().slice(0,8).toUpperCase(),
      phone:normalizeSaudiPhone(values.phone),altPhone:normalizeSaudiPhone(values.altPhone),
      name:values.name.trim(),address:values.address.trim(),nationalAddress:values.nationalAddress.trim().toUpperCase(),
      products:products.map(product=>({...product,quantity:Number(product.quantity),price:pricing.mode==='cod'?null:Number(product.price),status:'غير متاح في المصدر'})),
      pricingMode:pricing.mode,codTotal:pricing.mode==='cod'?total:null,
      amount:total,quantity,status:'new',statusLabel:'طلب جديد',reason:null,attempts:0,
      sourceDraftId:draft?.id??null,origin:'local-preview',
      date:new Intl.DateTimeFormat('en-GB',{timeZone:'Africa/Cairo',dateStyle:'short',timeStyle:'short'}).format(new Date()),
    };
    ordersRef.current=[order,...ordersRef.current];setNewOrders(ordersRef.current);
    return order;
  }
  function createOrder(values,products,pricing){return submitDraft(null,{source:'إضافة يدوية',payment:'عند الاستلام',...values},products,pricing)}
  return <OrdersPreviewContext.Provider value={{newOrders,submitDraft,createOrder}}>{children}</OrdersPreviewContext.Provider>;
}
