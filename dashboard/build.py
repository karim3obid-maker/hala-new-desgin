"""Build a portable HTML artifact with embedded fonts, artwork and libraries."""
from pathlib import Path
import base64
import html
import json
import mimetypes
import re

ROOT = Path(__file__).resolve().parent
DATA = json.loads((ROOT / 'data.json').read_text())
COLORS = {'purple':'#270A5E','green':'#13B857','red':'#F21E35','blue':'#0965F5','cyan':'#09B8D9','amber':'#E9B000','orange':'#FB8500'}

def esc(value):
    return html.escape(str(value), quote=True)

def uri(path, mime=None):
    kind = mime or mimetypes.guess_type(path)[0] or 'application/octet-stream'
    return 'data:' + kind + ';base64,' + base64.b64encode(Path(path).read_bytes()).decode()

def icon(name, color='#15132B', cls='icon'):
    # These are unmodified Tabler outline paths; only the standard stroke color changes.
    svg = (ROOT / 'assets' / (name + '.svg')).read_text().replace('currentColor', color)
    src = 'data:image/svg+xml;base64,' + base64.b64encode(svg.encode()).decode()
    return f'<img class="{esc(cls)}" src="{src}" width="20" height="20" alt="" aria-hidden="true">'

def badge(item):
    tone = item.get('tone', 'purple')
    return f'<span class="metric-icon tone-{tone}">{icon(item["icon"], COLORS[tone])}</span>'

def metric(item, group, index):
    money = ('<span class="currency">USD</span>' if item.get('currency') else '')
    percentage = f'<bdi class="metric-percentage" dir="ltr">{esc(item["percentage"])}</bdi>' if 'percentage' in item else ''
    caption = f'<p class="financial-caption">{esc(item["caption"])}</p>' if item.get('caption') else ('<p class="financial-caption" aria-hidden="true"></p>' if item.get('currency') else '')
    highlight = ' highlight' if item.get('highlight') else ''
    return f'''<article class="metric{highlight}" id="{group}-metric-{index}" data-search="{esc(item['label'])}" data-section="{group}" data-value="{esc(item.get('currency','') + item['value'])}">
      <h3 class="metric-label">{esc(item['label'])}</h3>{badge(item)}
      <bdi class="metric-value" dir="ltr">{money}{esc(item['value'])}</bdi>{percentage}{caption}
    </article>'''

def rows(items, group, financial=False):
    result=[]
    for start in range(0,len(items),4):
        classes='metric-row' + (' financial-row' if financial else '')
        result.append(f'<div class="{classes}">' + ''.join(metric(item,group,index) for index,item in enumerate(items[start:start+4],start)) + '</div>')
    return ''.join(result)

def ratios():
    result=[]
    for index,item in enumerate(DATA['ratios']):
        result.append(f'''<article class="ratio">
          <div class="ratio-heading"><h3>{esc(item['label'])}</h3><span class="total-chip">211 إجمالي</span></div>
          <p class="ratio-caption">{esc(item['caption'])}</p>
          <div class="donut"><canvas id="ratio-{index}" role="img" aria-label="{esc(item['label'])} {item['value']}%"></canvas><div class="donut-center"><strong dir="ltr">{item['value']}%</strong></div></div>
        </article>''')
    return '<div class="ratios">' + ''.join(result) + '</div>'

nav=[('layout-grid','الرئيسية','#overview','current'),('currency-dollar','الأفلييت',None,''),('package','المنتجات',None,''),('shopping-cart','الطلبات','#orders',''),('truck','الشحنات','#shipments',''),('link','التكاملات',None,''),('file-import','طلبات الاستيراد',None,''),('wallet','المحفظة المالية','#financial',''),('calculator','الحاسبة',None,''),('settings','الإعدادات',None,'')]
nav_html=''
for name,label,href,extra in nav:
    body=icon(name, '#270A5E' if extra else '#15132B') + f'<span>{label}</span>' + (icon('chevron-down',cls='icon chevron') if label=='الطلبات' else '')
    nav_html += f'<a class="side-item {extra}" href="{href}"'+(' aria-current="page"' if extra else '')+f'>{body}</a>' if href else f'<span class="side-item side-static">{body}</span>'

filters=''
for field,name,ico,value in [('country','الدولة','world','كل الدول'),('product','المنتج','package','كل المنتجات'),('store','المتجر','building-store','كل المتاجر')]:
    filters+=f'''<label class="filter-field"><span class="filter-label">{name}</span><span class="select-wrap">{icon(ico,'#626B82')}<select id="{field}-filter" aria-label="{name}"><option value="all">{value}</option></select>{icon('chevron-down',cls='icon select-chevron')}</span></label>'''

logo=uri(ROOT.parent/'design-system/assets/hala-logo.png','image/png')
fonts=(ROOT/'assets/fonts.css').read_text()
fonts=re.sub(r'url\(([^)]+)\)',lambda match:'url('+uri(ROOT/'assets'/match.group(1),'font/ttf')+')',fonts)
css=(ROOT/'styles.css').read_text()
library=(ROOT/'vendor/chart.umd.js').read_text()
library=re.sub(r'//# sourceMappingURL=.*','',library)
app=(ROOT/'app.js').read_text()
serialized=json.dumps(DATA,ensure_ascii=False).replace('<','\\u003c')

page=f'''<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#270A5E"><meta name="description" content="لوحة تحكم هلا كوميرس — الطلبات والشحنات والمالية.">
  <title>هلا كوميرس | لوحة التحكم</title>
  <link rel="icon" href="{uri(ROOT/'assets/layout-grid.svg','image/svg+xml')}">
  <style>{fonts}\n{css}</style>
</head>
<body id="overview">
<a class="skip-link" href="#dashboard-content">تخطي إلى المحتوى</a>
<div class="mobile-backdrop" id="mobile-backdrop" hidden></div>
<aside class="sidebar" id="sidebar" aria-label="القائمة الرئيسية">
  <button class="icon-button sidebar-close" type="button" aria-label="إغلاق القائمة">{icon('x')}</button>
  <a class="brand" href="#overview" aria-label="هلا كوميرس — الرئيسية"><span class="logo-window"><img src="{logo}" alt="Hala kommers" width="150" height="132"></span></a>
  <nav class="side-nav" aria-label="أقسام هلا">{nav_html}</nav>
  <div class="support-card">{icon('headset','#270A5E','support-icon')}<h3>محتاج مساعدة؟</h3><p>فريق هلا جاهز لمساعدتك<br>والإجابة على استفساراتك</p><button class="support-link" data-open-dialog="help-dialog" type="button">تواصل الآن</button></div>
  <button class="chat-button" data-open-dialog="help-dialog" type="button" aria-label="المساعدة">{icon('message','#FFFFFF')}</button>
</aside>
<div class="app-shell">
  <header class="topbar">
    <div class="topbar-right"><button class="icon-button mobile-menu" type="button" aria-label="فتح القائمة" aria-controls="sidebar" aria-expanded="false">{icon('menu-2')}</button><span class="topbar-title">لوحة التحكم</span><button class="icon-button" data-open-dialog="search-dialog" type="button" aria-label="بحث في اللوحة">{icon('search')}</button></div>
    <div class="account-tools"><span class="account-name"><span class="avatar">k</span><span>karim obide</span></span><button class="icon-button" id="copy-link" type="button" aria-label="نسخ رابط اللوحة">{icon('copy')}</button><span class="topbar-static" title="الإشعارات">{icon('bell')}</span><button class="icon-button" id="fullscreen" type="button" aria-label="ملء الشاشة">{icon('maximize')}</button></div>
  </header>
  <div class="page-heading"><h1>لوحة التحكم</h1><nav class="section-links" aria-label="الانتقال بين أقسام اللوحة"><a class="section-link active" href="#overview" aria-current="location">نظرة عامة</a><a class="section-link" href="#orders">الطلبات</a><a class="section-link" href="#shipments">الشحنات</a><a class="section-link" href="#financial">المالية</a></nav></div>
  <main class="page-content" id="dashboard-content">
    <div class="filter-bar" aria-label="فلاتر لوحة التحكم"><div class="filter-field"><span class="filter-label" id="period-label">اختر الفترة</span><button class="date-trigger" data-open-dialog="date-dialog" type="button" aria-labelledby="period-label period-text">{icon('calendar','#626B82')}<bdi id="period-text" dir="ltr">2026/10/01 – 2026/10/22</bdi>{icon('chevron-down')}</button></div>{filters}</div>
    <div id="sections">
      <section class="dashboard-section" id="orders" aria-labelledby="orders-title"><div class="section-heading">{icon('shopping-cart','#270A5E')}<h2 id="orders-title">الطلبات</h2></div><div class="section-frame">{rows(DATA['orders'],'orders')}{ratios()}</div></section>
      <section class="dashboard-section" id="shipments" aria-labelledby="shipments-title"><div class="section-heading">{icon('truck','#270A5E')}<h2 id="shipments-title">الشحنات</h2></div><div class="section-frame">{rows(DATA['shipments'],'shipments')}
        <div class="chart-block"><div class="chart-heading"><h3>كفاءة الشحن</h3><p>توزيع الشحنات وحالة التسليم للفترة المختارة.</p></div><div class="shipping-charts"><div class="delivery-donut"><div class="donut"><canvas id="delivery-chart" role="img" aria-label="نسبة التسليم 1.2 بالمئة"></canvas><div class="donut-center"><strong dir="ltr">1.2%</strong><span>نسبة التسليم</span></div></div></div><div class="distribution-wrap"><canvas id="distribution-chart" role="img" aria-label="قيد الانتظار 8، تم الشحن 75، تم التسليم 1، بانتظار المخزون 0"></canvas></div></div></div>
      </div></section>
      <section class="dashboard-section" id="financial" aria-labelledby="financial-title"><div class="section-heading">{icon('wallet','#270A5E')}<h2 id="financial-title">المالية</h2></div><div class="section-frame">{rows(DATA['financial'],'financial',True)}
        <div class="chart-block"><div class="revenue-heading"><div class="chart-heading"><div class="chart-title-line"><span class="calendar-badge">{icon('calendar','#270A5E')}</span><h3>الإيرادات والطلبات</h3></div><p>اتجاه الإيرادات وعدد الطلبات خلال الفترة المختارة.</p></div><span class="unit-chip">USD</span></div><div class="revenue-wrap"><canvas id="revenue-chart" role="img" aria-label="رسم توضيحي لاتجاه الإيرادات بناءً على صورة التصميم خلال أكتوبر 2026"></canvas></div><p class="chart-footnote">المنحنى توضيحي وفقًا للصورة المرجعية.</p></div>
      </div></section>
    </div>
    <div class="empty-state" id="empty-state" hidden role="status"><h2>لا تتوفر بيانات لهذه الفترة</h2><p>البيانات المتاحة من 1 إلى 22 أكتوبر 2026.</p><button class="primary-button" id="restore-period" type="button">عرض الفترة المتاحة</button></div>
  </main>
</div>
<dialog class="modal" id="date-dialog" aria-labelledby="date-title"><form id="date-form"><div class="modal-header"><h2 id="date-title">اختر الفترة</h2><button class="icon-button" type="button" data-close-dialog aria-label="إغلاق">{icon('x')}</button></div><div class="date-inputs"><label>من تاريخ<input type="date" id="date-start" value="2026-10-01" required></label><label>إلى تاريخ<input type="date" id="date-end" value="2026-10-22" required></label></div><p class="form-error" id="date-error" role="alert" hidden>تاريخ البداية يجب أن يسبق تاريخ النهاية.</p><div class="form-actions"><button class="primary-button" type="submit">تطبيق الفترة</button><button class="secondary-button" type="button" data-close-dialog>إلغاء</button></div></form></dialog>
<dialog class="modal" id="search-dialog" aria-labelledby="search-title"><div class="modal-header"><h2 id="search-title">بحث في اللوحة</h2><button class="icon-button" type="button" data-close-dialog aria-label="إغلاق">{icon('x')}</button></div><input class="search-input" id="dashboard-search" placeholder="ابحث عن مؤشر أو قسم…" aria-label="ابحث عن مؤشر أو قسم" autocomplete="off"><div class="search-results" id="search-results" aria-live="polite"><p class="search-hint">ابحث عن الطلبات أو الشحنات أو الأرصدة.</p></div></dialog>
<dialog class="modal" id="help-dialog" aria-labelledby="help-title"><div class="modal-header"><h2 id="help-title">محتاج مساعدة؟</h2><button class="icon-button" type="button" data-close-dialog aria-label="إغلاق">{icon('x')}</button></div><p class="modal-copy">يمكنك التواصل مع فريق هلا من خلال مركز المساعدة في حسابك على المنصة.</p><div class="form-actions"><a class="primary-button" href="https://seller.halakommers.com/" target="_blank" rel="noopener noreferrer">فتح منصة هلا</a><button class="secondary-button" type="button" data-close-dialog>إغلاق</button></div></dialog>
<div class="toast" id="toast" hidden role="status"></div>
<noscript><p style="padding:20px">يمكن قراءة المؤشرات بدون JavaScript. تفعيل JavaScript مطلوب للرسوم والتنقل التفاعلي.</p></noscript>
<script id="dashboard-data" type="application/json">{serialized}</script>
<script>{library}</script>
<script>{app}</script>
</body></html>'''

# The artifact intentionally needs neither an asset directory nor a network connection.
output = ROOT.parent / 'hala-dashboard.html'
output.write_text(page)
(ROOT / 'index.html').write_text(page)
print(f'Built {output.name}: {output.stat().st_size:,} bytes; assets embedded.')
