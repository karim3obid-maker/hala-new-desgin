import {useState} from 'react';
import {Button} from '@heroui/react';
import {Icon} from '../ui/Icon';

// Each variant is a complete option combination, e.g. green / medium.
export default function ProductSku({product}){
  const [copyStatus,setCopyStatus]=useState(null);
  const variants=product.variants||[];
  const rows=variants.length?variants.map((variant,index)=>({
    id:variant.id||String(index+1),
    label:Object.entries(variant.options||{}).map(([name,value])=>`${name}: ${value}`).join(' · ')||variant.name||`الخيار ${index+1}`,
    sku:variant.sku||`${product.sku}-${String(index+1).padStart(2,'0')}`,
    color:variant.color,
  })):[{id:product.id,label:null,sku:product.sku}];
  async function copySku(row){
    try{await navigator.clipboard.writeText(row.sku);setCopyStatus({id:row.id,sku:row.sku,success:true})}
    catch{setCopyStatus({id:row.id,sku:row.sku,success:false})}
  }
  return <section className={'product-sku-panel '+(variants.length?'has-variants':'single-sku')} aria-label="رموز المنتج SKU">
    <header><Icon name="package"/><strong>{variants.length?'رموز الخيارات (SKU)':'رمز المنتج (SKU)'}</strong>{variants.length?<span>رمز مستقل لكل لون أو مقاس</span>:null}</header>
    <div className="product-sku-list">{rows.map(row=><div className="product-sku-option" key={row.id}>
      <div className="product-sku-value">{!row.label?<span className="product-sku-caption">SKU</span>:null}{row.label?<span className="product-variant-label">{row.color?<i style={{backgroundColor:row.color}} aria-hidden="true"/>:null}{row.label}</span>:null}<bdi dir="ltr">{row.sku||'غير متاح'}</bdi></div>
      <Button size="sm" variant="secondary" isDisabled={!row.sku} aria-label={row.label?`نسخ SKU ${row.label}`:'نسخ SKU'} onPress={()=>copySku(row)}><Icon name={copyStatus?.id===row.id&&copyStatus.sku===row.sku&&copyStatus.success?'circle-check':'copy'}/>نسخ</Button>
      {copyStatus?.id===row.id&&copyStatus.sku===row.sku?<span className="product-sku-feedback" role="status">{copyStatus.success?'تم النسخ':'تعذّر النسخ، حدّد الرمز لنسخه يدويًا'}</span>:null}
    </div>)}</div>
  </section>
}
