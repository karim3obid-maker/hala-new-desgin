import {Button,Card} from '@heroui/react';
import {MetricRows} from '../components/dashboard/Metrics';
import {Icon} from '../components/ui/Icon';
import {walletMetrics,serviceFees,performance} from '../data/wallet';

function Money({value}){return <bdi dir="ltr" className="wallet-money">{value} <small>USD</small></bdi>}

export default function WalletPage(){
  return <div className="wallet-page">
    <div className="wallet-toolbar">
      <p>رصيدك، مصروفاتك وطلباتك المالية في مكان واحد.</p>
      <div className="wallet-actions" aria-describedby="wallet-preview-note">
        <Button size="sm" isDisabled><Icon name="plus"/>إيداع رصيد</Button>
        <Button size="sm" variant="secondary" isDisabled><Icon name="download"/>طلب سحب</Button>
        <Button size="sm" variant="tertiary" isDisabled><Icon name="wallet"/>الحسابات البنكية</Button>
      </div>
    </div>
    <Card className="section-card wallet-overview" aria-label="ملخص المالية"><MetricRows items={walletMetrics} group="financial"/></Card>
    <div className="wallet-context"><span><Icon name="calendar"/>الفترة غير محددة في المصدر</span><p id="wallet-preview-note">معاينة تصميم · الإيداع والسحب والحسابات البنكية غير مفعّلة حاليًا.</p></div>

    <div className="wallet-details-grid">
      <Card className="wallet-fees wallet-panel">
        <header className="wallet-panel-heading"><div><h2>تفاصيل المصروفات</h2><p>كل الرسوم في جدول واحد · بالدولار الأمريكي</p></div><Icon name="calculator"/></header>
        <div className="wallet-table-scroll" tabIndex={0} role="region" aria-label="جدول رسوم التأكيد والشحن">
          <table className="wallet-table"><caption className="sr-only">تفاصيل رسوم خدمات التأكيد والشحن بالدولار الأمريكي</caption>
            <thead><tr><th scope="col">الخدمة</th><th scope="col">السعر</th><th scope="col">الطلبات</th><th scope="col">الإجمالي</th></tr></thead>
            <tbody>{serviceFees.map((fee,index)=><tr key={fee.name} className={index===4?'wallet-group-start':''}>
              <th scope="row"><span className="wallet-service">{fee.name}<small>{fee.group}</small></span></th>
              <td><span className="wallet-rate"><bdi dir="ltr">{fee.rate}{!fee.percentage?' USD':''}</bdi><small>{fee.unit}</small></span></td>
              <td><bdi dir="ltr">{fee.orders}</bdi></td><td><Money value={fee.total}/></td>
            </tr>)}</tbody>
          </table>
        </div>
        <div className="wallet-extra-fees"><h3>تكاليف إضافية</h3><div><span>منتجات هلا شير</span><Money value="8.00"/></div><div><span>إعلانات</span><Money value="0.00"/></div><div className="wallet-extra-total"><span>إجمالي التكاليف الإضافية</span><Money value="8.00"/></div></div>
        <footer className="wallet-fees-total"><span>إجمالي المصروفات <small>الخدمات + التكاليف الإضافية</small></span><Money value="221.87"/></footer>
      </Card>
      <div className="wallet-side-panels">
        <Card className="wallet-panel wallet-performance"><header className="wallet-panel-heading"><h2>مؤشرات الأداء</h2><Icon name="chart-bar"/></header>
          <div className="wallet-performance-list">{performance.map(item=><div className="wallet-performance-item" key={item.label}><div><span>{item.label}</span><bdi dir="ltr">{item.value}%</bdi></div><div className="wallet-bar" aria-hidden="true"><span style={{width:item.value+'%'}}/></div></div>)}</div>
        </Card>
        <Card className="wallet-panel wallet-net"><header className="wallet-panel-heading"><h2>الملخص المالي</h2><Icon name="currency-dollar"/></header><dl><div><dt>إجمالي الإيرادات</dt><dd><Money value="56.47"/></dd></div><div><dt>إجمالي المصاريف</dt><dd className="wallet-expense"><Money value="221.87"/></dd></div><div className="wallet-net-total"><dt>صافي الإيرادات</dt><dd><Money value="0.00"/></dd></div></dl><p className="wallet-source-note">صافي الإيرادات معروض كما ورد في المصدر؛ طريقة احتسابه غير متاحة.</p></Card>
      </div>
    </div>

    <section className="wallet-requests" aria-labelledby="wallet-requests-title"><div className="section-heading"><Icon name="clock"/><h2 id="wallet-requests-title">الطلبات المالية</h2></div><Card className="wallet-requests-card"><div><span className="wallet-request-icon"><Icon name="download"/></span><div><h3>طلبات السحب</h3><p>لا توجد طلبات سحب في البيانات المعروضة.</p></div></div><div><span className="wallet-request-icon"><Icon name="plus"/></span><div><h3>طلبات الإيداع</h3><p>بيانات طلبات الإيداع غير متاحة في المصدر.</p></div></div></Card></section>
    <p className="wallet-source-note wallet-snapshot-note">الأرقام من لقطة المالية المرفقة، وهي مستقلة عن ملخص الرئيسية. لا يوجد اتصال ببيانات الحساب الفعلية حاليًا.</p>
  </div>;
}
