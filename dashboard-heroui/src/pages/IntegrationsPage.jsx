import {useState} from 'react';
import {Button,Card,Input,Label,ListBox,Select,TextField} from '@heroui/react';
import {useOutletContext} from 'react-router';
import {AppModal} from '../components/ui/AppModal';
import {Icon} from '../components/ui/Icon';
import {integrationPlatforms,integrationSnapshot} from '../data/integrations';

function PlatformMark({platform}){
  return <span className={'integration-mark '+platform.tone+(platform.logo?' has-logo':'')} aria-hidden="true">{platform.logo?<img src={platform.logo} alt="" width="40" height="40"/>:platform.mark}</span>;
}

export default function IntegrationsPage(){
  const {notify}=useOutletContext();
  const [stores,setStores]=useState(integrationSnapshot);
  const [platform,setPlatform]=useState(null);
  const [country,setCountry]=useState(null);
  const [storeName,setStoreName]=useState('');
  const [submitted,setSubmitted]=useState(false);
  const [disconnect,setDisconnect]=useState(null);
  const nameError=submitted&&(!storeName.trim()||storeName.trim().length>80);
  const duplicate=submitted&&stores.some(store=>store.platform===platform?.id&&store.name.toLowerCase()===storeName.trim().toLowerCase());
  function openSetup(item){setPlatform(item);setCountry(null);setStoreName('');setSubmitted(false)}
  function saveSetup(event){
    event.preventDefault();setSubmitted(true);
    if(!country||!storeName.trim()||storeName.trim().length>80||stores.some(store=>store.platform===platform.id&&store.name.toLowerCase()===storeName.trim().toLowerCase()))return;
    setStores(items=>[...items,{id:crypto.randomUUID(),name:storeName.trim(),platform:platform.id,country,count:null,local:true}]);
    setPlatform(null);notify('تم حفظ إعداد الربط في المعاينة فقط؛ لم يتم توصيل متجر فعلي.');
  }
  function confirmDisconnect(){setStores(items=>items.filter(item=>item.id!==disconnect.id));setDisconnect(null);notify('أُزيل المتجر من المعاينة فقط؛ لم يتغير أي ربط فعلي.')}
  return <div className="integrations-page">
    <p className="page-description">اربط متجرك بهلا، وتابع كل منصاتك من مكان واحد.</p>
    <section aria-labelledby="connected-stores-title">
      <header className="integration-section-heading"><div><h2 id="connected-stores-title">المتاجر المرتبطة</h2><span>إدارة الربط الحالي لمتاجرك</span></div><span className="integration-count"><bdi>{stores.length}</bdi> متاجر</span></header>
      <div className="connected-stores-grid">
        {stores.map(store=>{const provider=integrationPlatforms.find(item=>item.id===store.platform);return <Card className="connected-store-card" key={store.id}>
          <div className="connected-store-top"><PlatformMark platform={provider}/><div className="connected-store-name"><h3 dir="auto">{store.name}</h3><span dir="ltr">{provider.name}</span></div><span className={'integration-status '+(store.local?'pending':'')}><Icon name={store.local?'clock':'circle-check'}/>{store.local?'بانتظار التفعيل':'متصل'}</span></div>
          <div className="connected-store-bottom"><span className="store-country"><Icon name="world"/>{store.country}</span><span className="store-order-count"><Icon name="package"/><bdi>{store.count??'—'}</bdi><span>{store.local?'الطلبات غير متاحة':'طلب'}</span></span><Button size="sm" variant="ghost" className="disconnect-store" aria-label={'فصل '+store.name} onPress={()=>setDisconnect(store)}><Icon name="link"/>فصل الربط</Button></div>
        </Card>})}
        {!stores.length?<Card className="integration-empty"><Icon name="building-store"/><h3>لا توجد متاجر مرتبطة في المعاينة</h3><p>اختر إحدى المنصات أدناه لإعداد ربط متجرك.</p></Card>:null}
      </div>
    </section>
    <section aria-labelledby="available-platforms-title" className="available-platforms-section">
      <header className="integration-section-heading"><div><h2 id="available-platforms-title">المنصات المتاحة</h2><span>اختر منصة متجرك لإضافة ربط جديد</span></div></header>
      <div className="integration-platforms-grid">{integrationPlatforms.map(item=><Card key={item.id} className={'integration-platform-card '+(item.comingSoon?'coming-soon':'')}>
        <div className="integration-platform-heading"><PlatformMark platform={item}/><h3 dir="ltr">{item.name}</h3>{item.comingSoon?<span className="integration-soon">قريبًا</span>:null}</div>
        <p>{item.comingSoon?'الربط بهذه المنصة سيتاح قريبًا.':'أضف متجرك وحدد دولة البيع.'}</p>
        <Button variant="secondary" size="sm" isDisabled={item.comingSoon} onPress={()=>openSetup(item)} aria-label={item.comingSoon?'WooCommerce متاح قريبًا':'إضافة ربط '+item.name}><Icon name={item.comingSoon?'clock':'plus'}/>{item.comingSoon?'قريبًا':'إضافة الربط'}</Button>
      </Card>)}</div>
    </section>
    <p className="integrations-preview-note"><Icon name="info"/>بيانات المتاجر من الصورة المرجعية. الإضافة والفصل للمعاينة فقط، دون تغيير الاتصال الفعلي.</p>
    <AppModal open={Boolean(platform)} setOpen={open=>{if(!open)setPlatform(null)}} title={platform?'ربط '+platform.name:'ربط متجر'} footer={<><Button variant="secondary" onPress={()=>setPlatform(null)}>إلغاء</Button><Button type="submit" form="integration-setup-form"><Icon name="link"/>حفظ إعداد الربط</Button></>}>
      {platform?<form id="integration-setup-form" className="integration-setup-form" onSubmit={saveSetup} noValidate>
        <div className="integration-setup-platform"><PlatformMark platform={platform}/><div><strong dir="ltr">{platform.name}</strong><span>أدخل بيانات المتجر لإعداد الربط</span></div></div>
        <Select className="integration-country-select" placeholder="اختر الدولة" aria-label="الدولة" value={country} onChange={value=>setCountry(value)} isInvalid={submitted&&!country} isRequired><Label>الدولة</Label><Select.Trigger><Icon name="world"/><Select.Value/><Select.Indicator/></Select.Trigger><Select.Popover><ListBox><ListBox.Item id="السعودية" textValue="السعودية">السعودية<ListBox.ItemIndicator/></ListBox.Item></ListBox></Select.Popover></Select>
        {submitted&&!country?<p className="integration-field-error" role="alert">اختر دولة المتجر.</p>:null}
        <TextField name="storeName" value={storeName} onChange={setStoreName} isInvalid={nameError||duplicate} isRequired><Label>اسم المتجر</Label><Input placeholder="اكتب اسم متجرك" maxLength={80} aria-describedby={nameError||duplicate?'integration-name-error':undefined}/></TextField>
        {nameError||duplicate?<p id="integration-name-error" className="integration-field-error" role="alert">{duplicate?'هذا المتجر موجود بالفعل على نفس المنصة.':'أدخل اسم متجر من حرف واحد إلى 80 حرفًا.'}</p>:null}
        <div className="integration-setup-note"><Icon name="info"/><p>حفظ البيانات يجهّز الربط في المعاينة فقط. تفعيل الاتصال ومزامنة الطلبات يحتاجان توصيل المنصة فعليًا.</p></div>
      </form>:null}
    </AppModal>
    <AppModal open={Boolean(disconnect)} setOpen={open=>{if(!open)setDisconnect(null)}} title="فصل ربط المتجر" footer={<><Button variant="secondary" onPress={()=>setDisconnect(null)}>إلغاء</Button><Button className="integration-disconnect-confirm" onPress={confirmDisconnect}>فصل من المعاينة</Button></>}><p>هل تريد إزالة «{disconnect?.name}» من المعاينة؟ لن يتغير اتصال المتجر الحقيقي.</p></AppModal>
  </div>;
}
