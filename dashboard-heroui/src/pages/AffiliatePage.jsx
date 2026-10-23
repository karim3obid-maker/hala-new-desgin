import {useRef,useState} from 'react';
import {Button,Card,Input,TextField} from '@heroui/react';
import {useOutletContext} from 'react-router';
import data from '../data/affiliate.json';
import {MetricRows} from '../components/dashboard/Metrics';
import {AnimatedNumber} from '../components/ui/AnimatedNumber';
import {AppModal} from '../components/ui/AppModal';
import {Icon,colors} from '../components/ui/Icon';

export default function AffiliatePage(){
  const {notify}=useOutletContext();
  const [shareOpen,setShareOpen]=useState(false);
  const linkRef=useRef(null);
  async function copyReferralLink(){
    try{await navigator.clipboard.writeText(data.referralUrl);notify('تم نسخ رابط الإحالة')}
    catch{linkRef.current?.select();notify('حدد رابط الإحالة وانسخه من الحقل')}
  }
  async function shareReferralLink(){
    if(!navigator.share){setShareOpen(true);return;}
    try{await navigator.share({title:'انضم إلى هلا كوميرس',url:data.referralUrl})}
    catch(error){if(error.name!=='AbortError')setShareOpen(true)}
  }
  return <div className="affiliate-page">
    <p className="page-description">شارك رابطك واحصل على عمولة من كل طلب مسلّم.</p>
    <div className="affiliate-overview">
      <Card className="referral-card">
        <header className="affiliate-card-heading"><span className="affiliate-card-icon"><Icon name="link" color={colors.purple}/></span><div><h2>رابط الإحالة الخاص بك</h2><p>شارك الرابط مع التجار؛ أي تسجيل منه هيتسجّل تحتك.</p></div></header>
        <TextField aria-label="رابط الإحالة الخاص بك" className="referral-field" isReadOnly><Input ref={linkRef} value={data.referralUrl} dir="ltr" readOnly className="referral-url"/></TextField>
        <div className="referral-actions"><Button size="sm" onPress={copyReferralLink}><Icon name="copy"/>نسخ الرابط</Button><Button size="sm" variant="secondary" onPress={()=>setShareOpen(true)}><Icon name="share"/>مشاركة الرابط</Button></div>
        <div className="commission-note"><Icon name="gift" color={colors.purple}/><span>مع كل طلب مسلّم هتاخد <strong><bdi dir="ltr">${data.commissionPerDeliveredOrder}</bdi></strong> عمولة</span></div>
      </Card>
      <Card className="affiliate-earnings">
        <span className="affiliate-card-icon"><Icon name="currency-dollar" color={colors.purple}/></span>
        <h2>إجمالي الأرباح والعمولات</h2>
        <bdi dir="ltr" className="affiliate-earnings-value">$<AnimatedNumber value={data.totalEarnings}/></bdi>
        <p>حوّل علاقاتك إلى دخل مستمر مع هلا كوميرس.</p>
        <div className="affiliate-delivered"><span><Icon name="package" color={colors.purple}/>إجمالي الطلبات المسلّمة</span><bdi dir="ltr">{data.deliveredOrders}</bdi></div>
      </Card>
    </div>
    <section className="affiliate-summary" aria-label="إحصائيات الأفلييت"><Card className="section-card"><MetricRows items={data.metrics} group="affiliate"/></Card></section>
    <Card className="affiliate-withdrawal">
      <div className="withdrawal-description"><h2>سحب الأرباح</h2><p>يمكنك طلب سحب الرصيد المتاح في أي وقت.</p><small>{data.settlementNote}</small></div>
      <div className="withdrawal-balance"><span>الرصيد المتاح للسحب</span><bdi dir="ltr">${data.availableForWithdrawal}</bdi></div>
      <div className="withdrawal-action"><Button size="sm" isDisabled={Number(data.availableForWithdrawal)<=0}><Icon name="download"/>طلب سحب</Button><small>لا يوجد رصيد متاح للسحب حاليًا</small></div>
    </Card>
    <Card className="affiliate-accounts">
      <header className="affiliate-accounts-heading"><div className="affiliate-card-heading"><span className="affiliate-card-icon"><Icon name="users" color={colors.purple}/></span><div><h2>الحسابات المسجّلة</h2><p>التجار الذين سجّلوا من خلال رابط الإحالة الخاص بك.</p></div></div><span className="affiliate-count">{data.accounts.length} حساب</span></header>
      <div className="affiliate-table-scroll"><table className="affiliate-table"><caption className="sr-only">الحسابات المسجلة من خلال رابط الإحالة</caption><thead><tr><th scope="col">اسم الحساب</th><th scope="col">تاريخ التسجيل</th><th scope="col">الطلبات المسلّمة</th><th scope="col">العمولة</th></tr></thead><tbody><tr><td colSpan={4}><div className="affiliate-empty"><Icon name="users"/><p>لا توجد حسابات مسجّلة</p><span>ستظهر هنا الحسابات التي تسجّل من خلال رابطك.</span></div></td></tr></tbody></table></div>
      <footer className="affiliate-accounts-footer">عرض {data.accounts.length} حساب</footer>
    </Card>
    <AppModal open={shareOpen} setOpen={setShareOpen} title="مشاركة رابط الإحالة" footer={<><Button variant="secondary" onPress={()=>setShareOpen(false)}>إغلاق</Button><Button onPress={copyReferralLink}><Icon name="copy"/>نسخ الرابط</Button>{typeof navigator.share==='function'?<Button variant="secondary" onPress={shareReferralLink}><Icon name="share"/>مشاركة عبر الجهاز</Button>:null}</>}><p>انسخ رابطك وشاركه مع التجار للانضمام إلى هلا كوميرس.</p><bdi dir="ltr" className="share-url">{data.referralUrl}</bdi></AppModal>
  </div>;
}
