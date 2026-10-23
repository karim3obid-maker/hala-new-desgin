import {useRef,useState} from 'react';
import {Button,Card} from '@heroui/react';
import {AppModal} from '../ui/AppModal';
import {Icon} from '../ui/Icon';
import {amountCents} from '../../data/walletValidation';

export const transferMethods=[{id:'instapay',name:'إنستا باي',icon:'wallet',hint:'عنوان الدفع أو رقم الهاتف المسجل'},{id:'payoneer',name:'بايونير',icon:'currency-dollar',hint:'البريد الإلكتروني لحساب بايونير'},{id:'saudi',name:'حساب بنكي سعودي',icon:'building-store',hint:'رقم IBAN يبدأ بـ SA'}];
const methodName=id=>transferMethods.find(method=>method.id===id)?.name;
function Field({id,label,error,children}){return <div className="draft-form-field"><label htmlFor={id}>{label}</label>{children}{error?<span id={id+'-error'} className="draft-field-error" role="alert">{error}</span>:null}</div>}
const localNote='معاينة محلية فقط: لا يتم تحويل أموال أو إرسال بيانات، وتُمسح المعاينة عند إعادة تحميل الصفحة.';

export function TransferLedger({kind,requests,onAdd}){
  const withdrawal=kind==='withdrawals';
  return <Card className="wallet-panel"><header className="wallet-panel-heading"><h2>{withdrawal?'طلبات السحب':'طلبات الإيداع'}</h2><Button size="sm" variant="secondary" onPress={onAdd}><Icon name="plus"/>{withdrawal?'طلب سحب':'إيداع رصيد'}</Button></header><p className="wallet-transfer-note">{localNote}</p>{requests.length?<div className="wallet-table-scroll" tabIndex={0} role="region" aria-label={withdrawal?'طلبات السحب المحلية':'طلبات الإيداع المحلية'}><table className="wallet-transfer-table"><caption className="sr-only">طلبات المعاينة المحلية فقط</caption><thead><tr><th scope="col">الطلب والتاريخ</th><th scope="col">المبلغ</th><th scope="col">الطريقة</th><th scope="col">{withdrawal?'حساب الاستلام':'الغرض والإيصال'}</th><th scope="col">الحالة</th></tr></thead><tbody>{requests.map(row=><tr key={row.id}><th scope="row"><bdi dir="ltr">{row.id}</bdi><small>{new Intl.DateTimeFormat('ar-EG',{dateStyle:'medium',timeStyle:'short',timeZone:'Africa/Cairo'}).format(row.createdAt)}</small></th><td><bdi dir="ltr">{(row.cents/100).toFixed(2)} USD</bdi></td><td>{methodName(row.method)}</td><td><span>{withdrawal?row.accountName:row.purpose}</span>{!withdrawal?<small>{row.receiptName}</small>:null}{row.notes?<small>{row.notes}</small>:null}</td><td><span className="wallet-local-status">معاينة محلية</span></td></tr>)}</tbody></table></div>:<div className="wallet-ledger-empty"><Icon name={withdrawal?'download':'plus'}/><h3>{withdrawal?'لا توجد طلبات سحب':'لا توجد طلبات إيداع محلية'}</h3><p>{withdrawal?'ابدأ طلب سحب من رصيد المعاينة المتاح.':'أضف طلبًا لمعاينة المبلغ والطريقة والإيصال.'}</p></div>}</Card>;
}

export function useWalletTransfers({onCreated}){
  const [dialog,setDialog]=useState(null);
  const [accounts,setAccounts]=useState([]);
  const [requests,setRequests]=useState({withdrawals:[],deposits:[]});
  const [form,setForm]=useState({});
  const [errors,setErrors]=useState({});
  const [receipt,setReceipt]=useState(null);
  const sequence=useRef(0);
  const formRef=useRef(null);
  const backToWithdrawal=useRef(false);
  const withdrawalDraft=useRef({});
  const availableCents=4429-requests.withdrawals.reduce((sum,row)=>sum+row.cents,0);
  const open=type=>{setForm({});setReceipt(null);setErrors({});setDialog(type)};
  const update=(key,value)=>{setForm(current=>({...current,[key]:value}));setErrors(current=>({...current,[key]:null}))};
  const invalid=key=>({'aria-invalid':!!errors[key],'aria-describedby':errors[key]?'transfer-'+key+'-error':undefined});
  function fail(next){setErrors(next);requestAnimationFrame(()=>formRef.current?.querySelector('[aria-invalid="true"]')?.focus())}
  function saveAccount(event){
    event.preventDefault();const next={};const method=transferMethods.find(item=>item.id===form.method);const identifier=(form.identifier||'').trim();
    if(!method)next.method='اختر نوع الحساب.';
    if((form.holder||'').trim().length<2)next.holder='أدخل اسم صاحب الحساب.';
    if(!identifier)next.identifier='أدخل بيانات الحساب.';
    else if(method?.id==='payoneer'&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier))next.identifier='أدخل بريدًا إلكترونيًا صحيح التنسيق.';
    else if(method?.id==='saudi'&&!/^SA\d{22}$/.test(identifier.replace(/\s/g,'').toUpperCase()))next.identifier='أدخل IBAN سعوديًا من SA و22 رقمًا.';
    if(Object.keys(next).length){fail(next);return}
    const normalized=method.id==='saudi'?identifier.replace(/\s/g,'').toUpperCase():identifier;
    if(accounts.some(account=>account.method===method.id&&account.identifier.toLowerCase()===normalized.toLowerCase())){fail({identifier:'هذا الحساب مضاف في المعاينة.'});return}
    const id='ACCOUNT-'+(++sequence.current);
    setAccounts(current=>[...current,{id,method:method.id,holder:form.holder.trim(),identifier:normalized}]);
    if(backToWithdrawal.current){backToWithdrawal.current=false;open('withdrawal');setForm({...withdrawalDraft.current,account:id})}else open('accounts');
  }
  function saveRequest(event){
    event.preventDefault();const next={};const cents=amountCents(form.amount||'');const withdrawal=dialog==='withdrawal';const account=accounts.find(item=>item.id===form.account);
    if(cents===null)next.amount='أدخل مبلغًا موجبًا بحد أقصى منزلتين عشريتين.';
    else if(withdrawal&&cents>availableCents)next.amount='المبلغ يتجاوز المتاح في المعاينة.';
    if(withdrawal&&!account)next.account='اختر حساب استلام أو أضف طريقة سحب.';
    if(!withdrawal){
      if(!transferMethods.some(item=>item.id===form.method))next.method='اختر طريقة الدفع.';
      if(!form.purpose)next.purpose='اختر الغرض من الإيداع.';
      if(!receipt)next.receipt='أرفق صورة إيصال التحويل.';
      else if(!['image/jpeg','image/png','image/webp'].includes(receipt.type)||receipt.size>5*1024*1024||receipt.size===0)next.receipt='اختر صورة PNG أو JPG أو WebP حتى 5 ميجابايت.';
    }
    if(Object.keys(next).length){fail(next);return}
    const kind=withdrawal?'withdrawals':'deposits';
    const row={id:'LOCAL-'+(withdrawal?'W':'D')+'-'+(++sequence.current),createdAt:Date.now(),cents,method:withdrawal?account.method:form.method,accountName:withdrawal?account.holder:'',purpose:form.purpose||'',receiptName:receipt?.name||'',notes:(form.notes||'').trim()};
    setRequests(current=>({...current,[kind]:[row,...current[kind]]}));setDialog(null);setReceipt(null);onCreated(kind);
  }
  const accountMethod=transferMethods.find(item=>item.id===form.method);
  const dialogs=<>
    <AppModal open={dialog==='accounts'} setOpen={value=>{if(!value)setDialog(null)}} title="الحسابات البنكية وطرق التحويل" footer={<><Button variant="secondary" onPress={()=>setDialog(null)}>إغلاق</Button><Button onPress={()=>{backToWithdrawal.current=false;open('account')}}><Icon name="plus"/>إضافة طريقة سحب</Button></>}>
      <div className="wallet-accounts-dialog"><p>طرق التحويل المتاحة</p><div className="wallet-method-cards">{transferMethods.map(method=><div key={method.id}><Icon name={method.icon}/><h3>{method.name}</h3><p>بيانات حساب التحويل غير متاحة حاليًا.</p></div>)}</div><p className="wallet-transfer-note">بيانات التحويل الفعلية تحتاج ربط الحساب. لا تستخدم بيانات الصور المرجعية للتحويل.</p><h3>حسابات الاستلام في المعاينة</h3>{accounts.length?<ul className="wallet-saved-accounts">{accounts.map(account=><li key={account.id}><strong>{methodName(account.method)}</strong><span>{account.holder}</span><bdi dir="ltr">{account.identifier}</bdi></li>)}</ul>:<p>لم تضف حساب استلام بعد.</p>}<p className="wallet-transfer-note">{localNote}</p></div>
    </AppModal>
    <AppModal open={dialog==='account'} setOpen={value=>{if(!value)setDialog(null)}} title="إضافة طريقة سحب">
      <form ref={formRef} className="wallet-transfer-form" onSubmit={saveAccount} noValidate><p className="wallet-transfer-note">{localNote}</p>
        <Field id="transfer-method" label="نوع الحساب *" error={errors.method}><select id="transfer-method" value={form.method||''} onChange={event=>update('method',event.target.value)} {...invalid('method')}><option value="">اختر نوع الحساب</option>{transferMethods.map(method=><option key={method.id} value={method.id}>{method.name}</option>)}</select></Field>
        <Field id="transfer-holder" label="اسم صاحب الحساب *" error={errors.holder}><input id="transfer-holder" value={form.holder||''} maxLength={100} onChange={event=>update('holder',event.target.value)} {...invalid('holder')}/></Field>
        <Field id="transfer-identifier" label={accountMethod?.hint||'بيانات الحساب *'} error={errors.identifier}><input id="transfer-identifier" dir="ltr" value={form.identifier||''} maxLength={150} onChange={event=>update('identifier',event.target.value)} {...invalid('identifier')}/></Field>
        <div className="wallet-form-actions"><Button type="submit">حفظ الحساب للمعاينة</Button><Button variant="secondary" onPress={()=>open('accounts')}>رجوع</Button></div>
      </form>
    </AppModal>
    <AppModal open={dialog==='deposit'||dialog==='withdrawal'} setOpen={value=>{if(!value)setDialog(null)}} title={dialog==='withdrawal'?'طلب سحب':'إيداع رصيد'}>
      <form ref={formRef} className="wallet-transfer-form" onSubmit={saveRequest} noValidate><p className="wallet-transfer-note">{localNote}</p>
        <Field id="transfer-amount" label="المبلغ بالدولار الأمريكي *" error={errors.amount}><input id="transfer-amount" inputMode="decimal" dir="ltr" value={form.amount||''} onChange={event=>update('amount',event.target.value)} {...invalid('amount')}/></Field>
        {dialog==='withdrawal'?<><p className="wallet-available">المتاح للمعاينة بعد الطلبات المحلية: <bdi dir="ltr">{(availableCents/100).toFixed(2)} USD</bdi></p><Field id="transfer-account" label="حساب الاستلام *" error={errors.account}><select id="transfer-account" value={form.account||''} onChange={event=>update('account',event.target.value)} {...invalid('account')}><option value="">اختر حساب الاستلام</option>{accounts.map(account=><option key={account.id} value={account.id}>{methodName(account.method)} — {account.holder}</option>)}</select></Field><Button variant="secondary" onPress={()=>{backToWithdrawal.current=true;withdrawalDraft.current={...form};open('account')}}><Icon name="plus"/>إضافة طريقة سحب</Button></>:<>
        <Field id="transfer-method" label="طريقة الدفع *" error={errors.method}><select id="transfer-method" value={form.method||''} onChange={event=>update('method',event.target.value)} {...invalid('method')}><option value="">اختر طريقة الدفع</option>{transferMethods.map(method=><option key={method.id} value={method.id}>{method.name}</option>)}</select></Field>
        <Field id="transfer-purpose" label="الغرض من الإيداع *" error={errors.purpose}><select id="transfer-purpose" value={form.purpose||''} onChange={event=>update('purpose',event.target.value)} {...invalid('purpose')}><option value="">اختر الغرض</option>{['شحن الرصيد','تكاليف الخدمات','مصاريف إعلانات','مصاريف أخرى'].map(purpose=><option key={purpose}>{purpose}</option>)}</select></Field>
        <Field id="transfer-receipt" label="صورة إيصال التحويل *" error={errors.receipt}><input id="transfer-receipt" type="file" accept="image/png,image/jpeg,image/webp" onChange={event=>{setReceipt(event.target.files?.[0]||null);setErrors(current=>({...current,receipt:null}))}} {...invalid('receipt')}/><small className="draft-field-hint">PNG أو JPG أو WebP حتى 5 ميجابايت. يبقى الملف على جهازك.</small></Field>
        </>}
        <Field id="transfer-notes" label="ملاحظات (اختياري)"><textarea id="transfer-notes" rows={2} maxLength={500} value={form.notes||''} onChange={event=>update('notes',event.target.value)}/></Field>
        <div className="wallet-form-actions"><Button type="submit">حفظ معاينة الطلب</Button><Button variant="secondary" onPress={()=>setDialog(null)}>إلغاء</Button></div>
      </form>
    </AppModal>
  </>;
  return {openDeposit:()=>open('deposit'),openWithdrawal:()=>open('withdrawal'),openAccounts:()=>open('accounts'),requests,dialogs};
}
