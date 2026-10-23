import {useState} from 'react';
import {Button,Input,TextField} from '@heroui/react';
import {AppModal} from './AppModal';
import {Icon} from './Icon';
import {products as catalogProducts} from '../../data/products';
import {editorProduct} from '../../data/draftEditor';

const normalize=value=>String(value??'').toLowerCase().trim().replace(/[أإآ]/g,'ا').replace(/ة/g,'ه').replace(/[ًٌٍَُِّْ]/g,'');
const choices=[{...editorProduct,price:89},...catalogProducts.map(product=>({...product,sku:product.sku??null,price:product.suggestedPrice}))];
export function DraftProductPicker({currentProducts,setOpen,onAdd}){
  const [query,setQuery]=useState('');
  const [selected,setSelected]=useState([]);
  const existing=new Set(currentProducts.map(product=>product.id));
  const terms=normalize(query).split(/\s+/).filter(Boolean);
  const matches=choices.filter(product=>terms.every(term=>normalize(product.name+' '+(product.sku??'')).includes(term)));
  function toggle(id){setSelected(current=>current.includes(id)?current.filter(item=>item!==id):[...current,id])}
  return <AppModal open setOpen={setOpen} title="إضافة منتجات للطلب" footer={<div className="draft-picker-footer"><span>{selected.length?`${selected.length} منتجات محددة`:'اختر المنتجات التي تريد إضافتها'}</span><div><Button size="sm" variant="secondary" onPress={()=>setOpen(false)}>إلغاء</Button><Button size="sm" isDisabled={!selected.length} onPress={()=>{onAdd(choices.filter(product=>selected.includes(product.id)));setOpen(false)}}><Icon name="plus"/>إضافة المحدد{selected.length?` (${selected.length})`:''}</Button></div></div>}>
    <div className="draft-product-picker">
      <TextField aria-label="البحث باسم المنتج أو SKU" className="orders-search" value={query} onChange={setQuery}><div className="search-control"><Icon name="search"/><Input autoFocus placeholder="ابحث باسم المنتج أو SKU…"/></div></TextField>
      <p className="draft-picker-count" role="status">{matches.length} منتجات مطابقة</p>
      <div className="draft-picker-results">{matches.length?matches.map(product=>{
        const added=existing.has(product.id),checked=added||selected.includes(product.id);
        return <label key={product.id} className={'draft-picker-product '+(checked?'selected ':'')+(added?'added':'')}>
          <input type="checkbox" checked={checked} disabled={added} onChange={()=>toggle(product.id)} aria-label={'اختيار '+product.name}/>
          {product.image?<img src={product.image} alt="" width="42" height="42" loading="lazy"/>:<span className="detail-product-icon"><Icon name="package"/></span>}
          <span className="draft-picker-product-info"><strong>{product.name}</strong>{product.sku?<bdi dir="ltr">SKU: {product.sku}</bdi>:<small>SKU غير متاح في المصدر</small>}<small>سعر البيع: <bdi dir="ltr">{product.price.toFixed(2)} SAR</bdi></small></span>
          {added?<span className="draft-picker-added"><Icon name="circle-check"/>مضاف</span>:null}
        </label>;
      }):<div className="draft-picker-empty"><Icon name="search"/><p>لا توجد منتجات مطابقة</p><span>جرّب اسم المنتج أو الكود كاملًا.</span><Button size="sm" variant="secondary" onPress={()=>setQuery('')}>عرض كل المنتجات</Button></div>}</div>
    </div>
  </AppModal>;
}
