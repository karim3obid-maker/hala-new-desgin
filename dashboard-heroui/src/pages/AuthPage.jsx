import {useEffect,useState} from 'react';
import {Link} from 'react-router';
import {Button} from '@heroui/react';
import {Icon} from '../components/ui/Icon';
import logo from '../assets/hala-logo.png';
import photo from '../assets/home/fulfillment.webp';
import countries from '../data/auth-countries.json';

function Field({label,name,type='text',autoComplete,placeholder,wide=false}){
 const [visible,setVisible]=useState(false);const password=type==='password';
 return <div className={'hala-auth-field '+(wide?'auth-wide':'')}><label htmlFor={name}>{label}</label><div className="hala-auth-input"><input id={name} name={name} type={password&&visible?'text':type} autoComplete={autoComplete} placeholder={placeholder} required dir={['email','tel','password'].includes(type)?'ltr':undefined}/>{password&&<Button type="button" isIconOnly variant="ghost" onPress={()=>setVisible(!visible)} aria-label={(visible?'إخفاء ':'إظهار ')+label} aria-pressed={visible}><Icon name={visible?'circle-x':'eye'}/></Button>}</div></div>
}
export default function AuthPage({register=false}){
 const [notice,setNotice]=useState('');
 useEffect(()=>{const previous=document.title;document.title=(register?'إنشاء حساب':'تسجيل الدخول')+' | هلا كوميرس';window.scrollTo(0,0);return()=>{document.title=previous}},[register]);
 function submit(e){e.preventDefault();const form=e.currentTarget;const data=new FormData(form);if(register&&data.get('password')!==data.get('confirmation')){const field=form.elements.confirmation;field.setCustomValidity('تأكيد كلمة المرور غير مطابق.');field.reportValidity();return}form.reset();setNotice(register?'هذه معاينة للتصميم. لم يتم إنشاء حساب أو إرسال بياناتك.':'هذه معاينة للتصميم. لم يتم تسجيل الدخول أو إرسال بياناتك.');}
 return <div className="hala-auth" dir="rtl"><header className="hala-auth-header"><Link to="/home" aria-label="العودة لرئيسية هلا"><span className="home-logo"><img src={logo} alt="هلا كوميرس"/></span></Link><Link className="auth-back" to="/home">العودة للرئيسية <Icon name="chevron-left"/></Link></header>
 <main className={'hala-auth-main '+(register?'is-register':'')}><section className="hala-auth-form-panel"><div className="hala-auth-tabs"><Link to="/auth/login" aria-current={!register?'page':undefined}>تسجيل الدخول</Link><Link to="/auth/register" aria-current={register?'page':undefined}>إنشاء حساب</Link></div><span className="home-kicker">{register?'بداية جديدة مع هلا':'أهلًا برجعتك'}</span><h1>{register?'ابدأ رحلتك مع هلا.':'كل تجارتك، في مكانك.'}</h1><p className="auth-intro">{register?'أنشئ حسابك وخلّينا نرتب تشغيل تجارتك معك.':'سجّل دخولك وتابع طلباتك وشحناتك ومستحقاتك.'}</p>
 <form onSubmit={submit} onInput={e=>{setNotice('');if(e.currentTarget.elements.confirmation)e.currentTarget.elements.confirmation.setCustomValidity('')}} className={'hala-auth-form '+(register?'auth-form-grid':'')}>
 {register&&<Field name="fullname" label="الاسم الكامل" autoComplete="name" placeholder="اكتب اسمك الكامل"/>}
 <Field name="email" label="البريد الإلكتروني" type="email" autoComplete="username" placeholder="you@example.com"/>
 {register&&<><Field name="phone" label="رقم الهاتف" type="tel" autoComplete="tel" placeholder="+966 5X XXX XXXX"/><div className="hala-auth-field"><label htmlFor="country">الدولة</label><select id="country" name="country" autoComplete="country-name" required defaultValue=""><option value="" disabled>اختر الدولة</option>{countries.map(c=><option key={c} value={c}>{c}</option>)}</select></div><Field name="business" label="اسم النشاط التجاري" autoComplete="organization" placeholder="اسم متجرك أو البراند" wide/></>}
 <Field name="password" label="كلمة المرور" type="password" autoComplete={register?'new-password':'current-password'} placeholder="••••••••"/>
 {register&&<Field name="confirmation" label="تأكيد كلمة المرور" type="password" autoComplete="new-password" placeholder="••••••••"/>}
 {!register&&<a className="auth-forgot" href="https://seller.halakommers.com/auth/forgot-password">نسيت كلمة المرور؟</a>}
 <div className="auth-wide"><Button type="submit" className="home-cta auth-submit">{register?'إنشاء حساب جديد':'تسجيل الدخول'}<Icon name="chevron-left"/></Button>{notice&&<p className="auth-notice" role="status">{notice}</p>}<p className="auth-preview-note">معاينة التصميم — بياناتك لا تُرسل ولا تُحفظ.</p></div></form>
 <p className="auth-switch">{register?'لديك حساب بالفعل؟':'لسه جديد مع هلا؟'} <Link to={register?'/auth/login':'/auth/register'}>{register?'سجّل دخولك':'أنشئ حساب جديد'}</Link></p></section>
 <aside className="hala-auth-story"><img src={photo} alt="صورة توضيحية لتجهيز طلبات التجارة الإلكترونية"/><div className="auth-story-content"><span className="auth-story-badge"><Icon name="package"/> تشغيل تجارتك مع هلا</span><h2>أنت تكبّر تجارتك.<br/>وهلا تهتم بالتفاصيل.</h2><p>من التوريد والتخزين إلى الشحن والتحصيل.<br/>رحلة طلبك كلها في مكان واحد.</p><div className="auth-story-points"><span><Icon name="circle-check"/> طلبات أوضح</span><span><Icon name="circle-check"/> تشغيل أسهل</span><span><Icon name="circle-check"/> متابعة أفضل</span></div><small>صورة توضيحية للتشغيل</small></div></aside></main><footer className="hala-auth-footer">© 2026 هلا كوميرس. جميع الحقوق محفوظة.</footer></div>
}
