import {useState} from 'react';
import {Button} from '@heroui/react';
import {AppModal} from '../ui/AppModal';
import {Icon} from '../ui/Icon';
import {storePlatforms,connectedStores} from '../../config/storePlatforms';
export default function ProductStoreUpload({product,offers}){
  const [open,setOpen]=useState(false);
  const [platform,setPlatform]=useState('easyorder');
  const selected=storePlatforms.find(item=>item.id===platform);
  const stores=connectedStores.filter(store=>store.platform===platform);
  return <>
    <Button onPress={()=>setOpen(true)}><Icon name="share"/>رفع المنتج إلى متجرك</Button>
    <AppModal open={open} setOpen={setOpen} title="رفع المنتج إلى متجرك" footer={<><Button variant="secondary" onPress={()=>setOpen(false)}>إغلاق</Button><Button isDisabled><Icon name="share"/>رفع المنتج</Button></>}>
      <div className="store-upload-product"><img src={product.image} alt=""/><div><strong>{product.name}</strong><span>السعودية · {offers.length} عروض بيع محفوظة في المعاينة</span></div></div>
      <p className="store-upload-intro">اختر منصة متجرك لرفع المنتج إليها. الرفع متاح للمتاجر المرتبطة بحسابك فقط.</p>
      <fieldset className="store-platform-options"><legend>منصة المتجر</legend>{storePlatforms.map(item=><label key={item.id} className={'store-platform-option '+(platform===item.id?'selected':'')}><input type="radio" name="store-platform" value={item.id} checked={platform===item.id} onChange={()=>setPlatform(item.id)}/><span className="store-platform-mark" aria-hidden="true">{item.mark}</span><span><strong dir="ltr">{item.name}</strong><small>{item.label}</small></span></label>)}</fieldset>
      <div className="store-connection-state" role="status"><Icon name="info"/><div><strong>بيانات ربط {selected.name} غير متاحة</strong><p>{stores.length?'الرفع الفعلي غير متاح في المعاينة الحالية.':'لا تتوفر بيانات متاجر مرتبطة في المعاينة الحالية. يلزم ربط حساب المتجر لتفعيل رفع المنتج.'}</p></div></div>
      <small className="store-upload-footnote">اختيار المنصة هنا للمعاينة فقط، ولا يربط حسابًا أو يرفع منتجًا فعليًا.</small>
    </AppModal>
  </>
}
