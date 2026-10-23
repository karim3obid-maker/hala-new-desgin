import {useState} from 'react';
import {Button,Card} from '@heroui/react';
import {NavLink,useLocation,useOutletContext} from 'react-router';
import SettingsManagement from '../components/settings/SettingsManagement';
import {Icon,IconButton} from '../components/ui/Icon';
import {settingsSnapshot,companyCountries,settingsSections} from '../data/settings';

function SettingsField({id,label,error,hint,children}){return <div className="settings-field"><label htmlFor={id}>{label}</label>{children}{hint?<small id={id+'-hint'}>{hint}</small>:null}{error?<small id={id+'-error'} className="settings-error">{error}</small>:null}</div>}
function SectionHeading({icon,title,description,id}){return <header className="settings-section-heading"><span><Icon name={icon}/></span><div><h2 id={id}>{title}</h2><p>{description}</p></div></header>}
function PasswordField({id,label,autoComplete,hint}){
  const [visible,setVisible]=useState(false);
  return <SettingsField id={id} label={label} hint={hint}><div className="settings-password-control"><input id={id} type={visible?'text':'password'} autoComplete={autoComplete} placeholder={label} aria-describedby={hint?id+'-hint':undefined}/><IconButton icon="eye" label={(visible?'إخفاء ':'إظهار ')+label} aria-pressed={visible} onPress={()=>setVisible(value=>!value)}/></div></SettingsField>
}
export default function SettingsPage(){
  const {notify}=useOutletContext();
  const {pathname}=useLocation();
  const section=settingsSections.find(item=>item.path===pathname)?.id||'account';
  const [personal,setPersonal]=useState(settingsSnapshot.personal);
  const [company,setCompany]=useState(settingsSnapshot.company);
  const [savedPersonal,setSavedPersonal]=useState(settingsSnapshot.personal);
  const [savedCompany,setSavedCompany]=useState(settingsSnapshot.company);
  const [personalErrors,setPersonalErrors]=useState({});
  const [companyErrors,setCompanyErrors]=useState({});
  const personalDirty=JSON.stringify(personal)!==JSON.stringify(savedPersonal);
  const companyDirty=JSON.stringify(company)!==JSON.stringify(savedCompany);
  function savePersonal(event){event.preventDefault();const digits=personal.phone.replace(/[٠-٩]/g,char=>'٠١٢٣٤٥٦٧٨٩'.indexOf(char)).replace(/[\s()-]/g,'');const errors={name:personal.name.trim()?'':'أدخل الاسم.',phone:/^\+?\d{8,15}$/.test(digits)?'':'أدخل رقم هاتف صحيحًا مع مفتاح الدولة.'};setPersonalErrors(errors);if(Object.values(errors).some(Boolean)){document.getElementById(errors.name?'settings-name':'settings-phone')?.focus();return}const next={...personal,name:personal.name.trim(),phone:personal.phone.trim()};setPersonal(next);setSavedPersonal(next);notify('تم حفظ المعلومات الشخصية في المعاينة فقط')}
  function saveCompany(event){event.preventDefault();const errors={name:company.name.trim()?'':'أدخل الاسم التجاري.',country:company.country?'':'اختر دولة الشركة.'};setCompanyErrors(errors);if(Object.values(errors).some(Boolean)){document.getElementById(errors.name?'company-name':'company-country')?.focus();return}const next={...company,name:company.name.trim(),description:company.description.trim()};setCompany(next);setSavedCompany(next);notify('تم حفظ بيانات الشركة في المعاينة فقط')}
  return <div className="settings-page">
    <div className="settings-page-intro"><div><h2>إدارة إعداداتك</h2><p>حسابك وشركتك ومتاجرك وفريقك، في مكان واحد.</p></div><span className="settings-preview-label"><Icon name="info"/>معاينة محلية</span></div>
    <nav className="settings-navigation" aria-label="أقسام الإعدادات">{settingsSections.map(item=><NavLink end to={item.path} key={item.id} className={({isActive})=>'settings-navigation-item '+(isActive?'selected':'')}><Icon name={item.icon}/>{item.label}</NavLink>)}</nav>
    <div hidden={section!=='account'}><div className="settings-layout"><div className="settings-account-column">
      <Card className="settings-section" aria-labelledby="personal-settings-title"><SectionHeading icon="users" title="المعلومات الشخصية" description="حدّث اسمك ورقم التواصل الخاص بك." id="personal-settings-title"/><form onSubmit={savePersonal} noValidate><div className="settings-form-grid">
        <SettingsField id="settings-name" label="الاسم الأول" error={personalErrors.name}><input id="settings-name" autoComplete="given-name" value={personal.name} onChange={event=>setPersonal({...personal,name:event.target.value})} aria-invalid={!!personalErrors.name} aria-describedby={personalErrors.name?'settings-name-error':undefined}/></SettingsField>
        <SettingsField id="settings-email" label="البريد الإلكتروني" hint="البريد المرتبط بالحساب، غير قابل للتعديل هنا."><input id="settings-email" type="email" dir="ltr" value={personal.email} readOnly aria-describedby="settings-email-hint"/></SettingsField>
        <SettingsField id="settings-phone" label="رقم الهاتف" error={personalErrors.phone}><input id="settings-phone" type="tel" dir="ltr" autoComplete="tel" value={personal.phone} onChange={event=>setPersonal({...personal,phone:event.target.value})} aria-invalid={!!personalErrors.phone} aria-describedby={personalErrors.phone?'settings-phone-error':undefined}/></SettingsField>
        <SettingsField id="settings-type" label="نوع المستخدم" hint="لم يُحدد نوع المستخدم في بيانات المرجع."><input id="settings-type" value={personal.userType} placeholder="غير محدد" readOnly aria-describedby="settings-type-hint"/></SettingsField>
      </div><footer className="settings-form-footer"><span>{personalDirty?'لديك تعديلات غير محفوظة':'بيانات الحساب من المرجع المرسل'}</span><div>{personalDirty?<Button type="button" size="sm" variant="ghost" onPress={()=>{setPersonal(savedPersonal);setPersonalErrors({})}}>تراجع</Button>:null}<Button type="submit" size="sm" isDisabled={!personalDirty}><Icon name="circle-check"/>حفظ التعديلات</Button></div></footer></form></Card>
      <Card className="settings-section" aria-labelledby="company-settings-title"><SectionHeading icon="building-store" title="بيانات الشركة" description="المعلومات التجارية الخاصة بنشاطك." id="company-settings-title"/><form onSubmit={saveCompany} noValidate><div className="settings-form-grid">
        <SettingsField id="company-name" label="الاسم التجاري" error={companyErrors.name}><input id="company-name" autoComplete="organization" value={company.name} onChange={event=>setCompany({...company,name:event.target.value})} aria-invalid={!!companyErrors.name} aria-describedby={companyErrors.name?'company-name-error':undefined}/></SettingsField>
        <SettingsField id="company-country" label="الدولة" error={companyErrors.country}><select id="company-country" value={company.country} onChange={event=>setCompany({...company,country:event.target.value})} aria-invalid={!!companyErrors.country} aria-describedby={companyErrors.country?'company-country-error':undefined}><option value="">اختر الدولة</option>{companyCountries.map(country=><option key={country}>{country}</option>)}</select></SettingsField>
        <div className="settings-full-field"><SettingsField id="company-description" label="الوصف"><textarea id="company-description" rows={3} value={company.description} onChange={event=>setCompany({...company,description:event.target.value})}/></SettingsField></div>
      </div><footer className="settings-form-footer"><span>{companyDirty?'لديك تعديلات غير محفوظة':'أكمل دولة الشركة عند تحديث بياناتها'}</span><div>{companyDirty?<Button type="button" size="sm" variant="ghost" onPress={()=>{setCompany(savedCompany);setCompanyErrors({})}}>تراجع</Button>:null}<Button type="submit" size="sm" isDisabled={!companyDirty}><Icon name="circle-check"/>حفظ بيانات الشركة</Button></div></footer></form></Card>
    </div>
    <Card className="settings-section settings-security-section" aria-labelledby="security-settings-title"><SectionHeading icon="settings" title="كلمة المرور والأمان" description="حافظ على أمان الوصول إلى حسابك." id="security-settings-title"/><div className="settings-password-fields"><PasswordField id="settings-current-password" label="كلمة المرور الحالية" autoComplete="current-password"/><PasswordField id="settings-new-password" label="كلمة المرور الجديدة" autoComplete="new-password"/><PasswordField id="settings-confirm-password" label="تأكيد كلمة المرور" autoComplete="new-password"/><p className="settings-security-note"><Icon name="info"/>تغيير كلمة المرور يتطلب الربط بخدمة الحساب، وهو غير متاح في المعاينة الحالية.</p></div><footer className="settings-form-footer"><Button size="sm" isDisabled>تغيير كلمة المرور</Button></footer></Card>
    </div></div><SettingsManagement key="management" section={section}/><p className="settings-local-note">الحفظ هنا داخل المعاينة فقط، ولا يغيّر الحساب الفعلي. إعادة تحميل الصفحة تعيد بيانات المرجع.</p>
  </div>
}
