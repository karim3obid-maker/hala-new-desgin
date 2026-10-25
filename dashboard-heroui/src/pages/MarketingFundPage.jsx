import {useState} from 'react';
import {Button,Card} from '@heroui/react';
import {useOutletContext} from 'react-router';
import {Icon} from '../components/ui/Icon';

const platforms=[
  {id:'tiktok',name:'تيك توك',mark:'♪'},
  {id:'facebook',name:'فيسبوك',mark:'f'},
  {id:'snapchat',name:'سناب شات',mark:'S'},
];
const platformName=id=>platforms.find(item=>item.id===id)?.name||id;

function PlatformMark({platform}){return <span className={'marketing-platform-mark '+platform.id} aria-hidden="true">{platform.mark}</span>}
function Field({id,label,children,hint}){return <div className="marketing-fund-field"><label htmlFor={id}>{label}</label>{children}{hint?<small>{hint}</small>:null}</div>}

export default function MarketingFundPage(){
  const {notify}=useOutletContext();
  const [platform,setPlatform]=useState('tiktok');
  const [email,setEmail]=useState('');
  const [accountRequest,setAccountRequest]=useState(null);
  const [accounts,setAccounts]=useState([]);
  const [addingAccount,setAddingAccount]=useState(false);
  const [existingPlatform,setExistingPlatform]=useState('tiktok');
  const [existingId,setExistingId]=useState('');
  const [existingError,setExistingError]=useState('');
  const [selectedAccount,setSelectedAccount]=useState('');
  const [amount,setAmount]=useState('');
  const [rechargeRequest,setRechargeRequest]=useState(null);

  function requestAccount(event){
    event.preventDefault();
    const next={platform,email:email.trim()};
    setAccountRequest(next);
    notify('حُفظ طلب الحساب داخل المعاينة فقط.');
  }
  function addExistingAccount(event){
    event.preventDefault();
    const id=existingId.trim();
    if(!id){setExistingError('أدخل معرّف الحساب الإعلاني.');document.getElementById('marketing-existing-id')?.focus();return}
    if(accounts.some(account=>account.platform===existingPlatform&&account.id===id)){
      setExistingError('هذا الحساب مضاف بالفعل.');
      document.getElementById('marketing-existing-id')?.focus();
      return;
    }
    const next={id,platform:existingPlatform,key:crypto.randomUUID()};
    setAccounts(current=>[...current,next]);
    setSelectedAccount(next.key);
    setExistingId('');
    setExistingError('');
    setAddingAccount(false);
    notify('أُضيف الحساب لقائمة المعاينة المحلية.');
  }
  function requestRecharge(event){
    event.preventDefault();
    const account=accounts.find(item=>item.key===selectedAccount);
    if(!account)return;
    setRechargeRequest({account,amount:Number(amount)});
    notify('حُفظ طلب الشحن داخل المعاينة فقط.');
  }

  return <div className="marketing-fund-page">
    <div className="marketing-fund-intro"><div><span className="marketing-fund-eyebrow"><Icon name="chart-bar"/> خدمات الإعلانات</span><h2>الفاند التسويقي</h2><p>اطلب حسابًا إعلانيًا جديدًا أو جهّز طلب إعادة شحن لحسابك الحالي.</p></div><span className="marketing-fund-preview"><Icon name="info"/> معاينة محلية</span></div>
    <div className="marketing-fund-grid">
      <Card className="marketing-fund-card" aria-labelledby="marketing-new-title">
        <header><span className="marketing-fund-card-icon"><Icon name="plus"/></span><div><small>01 / حساب جديد</small><h3 id="marketing-new-title">طلب حساب إعلاني جديد</h3><p>اختر المنصة، ثم أدخل البريد الذي تريد استخدامه للحساب.</p></div></header>
        <form onSubmit={requestAccount}>
          <fieldset className="marketing-platforms"><legend>منصة الإعلان</legend><div>{platforms.map(item=><label className={'marketing-platform-option '+(platform===item.id?'selected':'')} key={item.id}><input type="radio" name="marketing-platform" value={item.id} checked={platform===item.id} onChange={()=>setPlatform(item.id)}/><PlatformMark platform={item}/><span>{item.name}</span><Icon name="circle-check"/></label>)}</div></fieldset>
          <Field id="marketing-new-email" label="البريد الإلكتروني" hint="اكتب البريد الذي سيُستخدم للتواصل بشأن الحساب."><input id="marketing-new-email" type="email" dir="ltr" autoComplete="email" inputMode="email" required value={email} onChange={event=>setEmail(event.target.value)} placeholder="name@example.com"/></Field>
          <Button type="submit"><Icon name="plus"/>تجهيز طلب الحساب</Button>
        </form>
        {accountRequest?<div className="marketing-fund-result" role="status"><Icon name="circle-check"/><span>تم تجهيز طلب <strong>{platformName(accountRequest.platform)}</strong> للبريد <bdi dir="ltr">{accountRequest.email}</bdi>. بانتظار الربط والإرسال الفعلي.</span></div>:null}
      </Card>

      <Card className="marketing-fund-card" aria-labelledby="marketing-recharge-title">
        <header><span className="marketing-fund-card-icon"><Icon name="wallet"/></span><div><small>02 / حساب حالي</small><h3 id="marketing-recharge-title">إعادة شحن حساب إعلاني</h3><p>اختر حسابًا من القائمة وحدد المبلغ المطلوب شحنه.</p></div></header>
        <form onSubmit={requestRecharge}>
          <Field id="marketing-account" label="الحساب الإعلاني"><select id="marketing-account" required value={selectedAccount} onChange={event=>setSelectedAccount(event.target.value)}><option value="">{accounts.length?'اختر الحساب':'لا توجد حسابات إعلانية مضافة'}</option>{accounts.map(account=><option key={account.key} value={account.key}>{platformName(account.platform)} · {account.id}</option>)}</select></Field>
          <Field id="marketing-amount" label="مبلغ الشحن بالدولار الأمريكي"><div className="marketing-amount-control"><input id="marketing-amount" type="number" dir="ltr" inputMode="decimal" min="1" step="0.01" required value={amount} onChange={event=>setAmount(event.target.value)} placeholder="0.00"/><span>USD</span></div></Field>
          <Button type="submit" isDisabled={!accounts.length}><Icon name="wallet"/>تجهيز طلب الشحن</Button>
        </form>
        {!accounts.length?<p className="marketing-fund-empty"><Icon name="info"/>لا توجد حسابات إعلانية متاحة من بيانات المشروع. أضف حسابك الحالي للمعاينة لتجربة طلب الشحن.</p>:null}
        <button className="marketing-add-account-toggle" type="button" aria-expanded={addingAccount} aria-controls="marketing-existing-account" onClick={()=>setAddingAccount(value=>!value)}><Icon name={addingAccount?'chevron-up':'plus'}/>{addingAccount?'إغلاق إضافة الحساب':'إضافة حساب حالي للمعاينة'}</button>
        {addingAccount?<form id="marketing-existing-account" className="marketing-existing-account" onSubmit={addExistingAccount}><Field id="marketing-existing-platform" label="المنصة"><select id="marketing-existing-platform" value={existingPlatform} onChange={event=>setExistingPlatform(event.target.value)}>{platforms.map(item=><option key={item.id} value={item.id}>{item.name}</option>)}</select></Field><Field id="marketing-existing-id" label="معرّف الحساب الإعلاني"><input id="marketing-existing-id" dir="ltr" required maxLength={80} value={existingId} aria-invalid={!!existingError} aria-describedby={existingError?'marketing-existing-error':undefined} onChange={event=>{setExistingId(event.target.value);setExistingError('')}} placeholder="Account ID"/></Field>{existingError?<p id="marketing-existing-error" className="marketing-fund-error" role="alert">{existingError}</p>:null}<Button type="submit" variant="secondary"><Icon name="plus"/>إضافة للقائمة</Button></form>:null}
        {rechargeRequest?<div className="marketing-fund-result" role="status"><Icon name="circle-check"/><span>تم تجهيز طلب شحن <bdi dir="ltr">{rechargeRequest.amount.toLocaleString('en-US',{minimumFractionDigits:2})} USD</bdi> لحساب {platformName(rechargeRequest.account.platform)} <bdi dir="ltr">{rechargeRequest.account.id}</bdi>. لم يحدث دفع أو شحن فعلي.</span></div>:null}
      </Card>
    </div>
    <p className="marketing-fund-note"><Icon name="info"/>هذه الصفحة معاينة للطلب فقط. الحسابات والطلبات المضافة هنا تُمسح عند تحديث الصفحة، ولا يجري فتح حساب أو تحويل مبلغ حتى ربط الخدمة الفعلية.</p>
  </div>;
}
