import {createContext,useContext,useRef,useState} from 'react';
const ImportOrdersContext=createContext(null);
export const useImportOrders=()=>useContext(ImportOrdersContext);
export function ImportOrdersProvider({children}){
  const [records,setRecords]=useState([]);
  const ids=useRef(new Set());
  function addImportOrder(record){
    if(ids.current.has(record.id))return;
    ids.current.add(record.id);
    const received={...record,stage:'received',createdAt:new Date().toISOString(),activity:[{title:'تم استلام الطلب في المعاينة المحلية',description:'تم حفظ بيانات المنتج والصور في هذه الجلسة فقط؛ لم تُرسل إلى فريق الاستيراد.',date:new Date().toISOString()}]};
    setRecords(current=>[received,...current]);
  }
  return <ImportOrdersContext.Provider value={{records,addImportOrder}}>{children}</ImportOrdersContext.Provider>;
}
