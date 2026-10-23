# Compact Hala dashboard QA

final result: passed

## Source and state
Source visual truth: `design/concept.png`, 992×1586. Latest user changes override its spacious sizing and section tabs: reduce whitespace, remove all section tabs, promote this version to primary.
Implementation: `../hala-dashboard.html`, light Arabic RTL, all three sections, default period.
Browser: Codex in-app browser via CUA. Desktop CSS viewport 1440×900, phone breakpoint 390×844; default panel width also checked. No horizontal DOM overflow. All 20 aggregate metrics present. IBM Plex Sans Arabic loaded. No app console errors or warnings observed.

## Visual evidence
Final actual capture: `../hala-dashboard-new-design.jpg` (1440×1555).
The browser full-page capture shifted RTL content; the delivered image stitches two unchanged viewport captures at scroll offsets 0 and 655, with overlapping rows removed and the fixed sidebar shown once. This corrects screenshot capture behavior without changing the design.
Full comparison: `/private/tmp/hala-heroui-qa/final-comparison.jpg`. Concept at native 992px width alongside actual scaled uniformly from 1440px to 992px width; overall height intentionally differs because compact density was requested. Focused metrics/logo comparison: `/private/tmp/hala-heroui-qa/final-focus.jpg`. Both were opened and inspected together.

## Required fidelity surfaces
- Typography: IBM Plex Sans Arabic 400/500/600; clear numeric hierarchy and Arabic labels, LTR numbers and USD. Smaller sizes are intentional compact sizing.
- Spacing/layout: separate orders, shipments and financial surfaces retained; smaller donuts, chart heights, heading spacing and metric padding. Four columns desktop, two phone. No section tab bar.
- Colors: Hala purple/orange, pale surfaces and semantic status hues retained. Purple light balance card.
- Assets: supplied logo and real Tabler SVG icons; no invented logo or raster UI substitutes. Charts rendered as charts.
- Copy/content: exact original aggregate data retained, including all zero values; revenue curve explicitly illustrative.

## Interaction evidence and limits
Verified aggregate select opens and exposes the selected aggregate option. Date dialog opens with both dates and close controls. Financial sidebar anchor scrolls to the financial section. Mobile drawer opens, exposes navigation, and closes. Primary URL reloaded after promotion and confirmed HeroUI title, zero section tabs, and 20 metrics.
Date field automation repeatedly dismissed the dialog during browser interaction; invalid-range and empty-state submissions were not verified and are not claimed as passing. Search selection, clipboard, fullscreen, API/backend behavior and other browsers remain unverified. No API is implemented.

## Comparison history
Initial compact render retained tall metric rows and 140px donuts. Reduced icon/number tracks and padding, donuts to 120px, chart heights and heading spacing. Latest request removed tabs. Final screenshot confirms the changes with all content retained. No remaining actionable P0/P1/P2 visual findings; mobile tap target refinement remains optional P3.


## React project conversion — 23 October 2026

Build and standalone export passed. Source is self-contained, with local fonts, logo and icons. Data file remains byte-identical to the original aggregate data. Archived releases are unchanged.

Verified in the browser at 1440×900 and 390×844:
- Root: all 20 metrics and three independent sections, no tab bar; IBM font loads, no horizontal overflow. Screenshot `/private/tmp/hala-react-home.jpg`.
- Orders route: eight original metrics and original ratios, selected sidebar item and page title update. Record details unavailable state shown; no fabricated rows. Screenshot `/private/tmp/hala-react-orders.jpg`.
- Shipments and wallet routes: eight/four original metrics, active navigation and page titles correct. Wallet direct refresh passed.
- Search from wallet for جاري تأكيدها opens orders and focuses orders-metric-2 with value 32.
- Date input works with ArrowUp; changed start to 2 October, applied, unavailable state appeared and persisted on navigation to orders. Restore returned the eight orders metrics. Start 23 October with end 22 October correctly displayed the validation alert. CUA fill() was unsuitable for native date inputs; keyboard editing verified the actual flow instead.
- Mobile drawer opened, navigated to shipments and closed. No horizontal overflow. Screenshot `/private/tmp/hala-react-mobile.jpg`.
- No app console errors. Development build logged three React Aria PressResponder warnings; interactions passed. Library warning source was inspected; dependency internals were not patched.

The screenshots were opened and visually reviewed. Layout and branding remain consistent with the approved compact design. No backend, individual order rows, or other sidebar pages are claimed complete.

final result: passed


## Compact layout refinement — 2026-10-23

- Kept the original aggregate JSON and approved purple/orange/IBM design.
- Desktop at 1440×900: heading reduced from 64 to 46px, filters from 83.14 to 71px. Homepage height is now 1390px (previous capture was 1555px).
- Confirmed actual IBM font file weights 400/500/600 from OS/2 tables. Select values now center vertically at an 18px line height, without the previous stretched 36px value area. Disabled synthetic font weights.
- Replaced displayed Tabler image icons with bundled Gravity React icons. Sidebar groups and active indicator added; help card rests at the bottom.
- Seller ID 86jdk5 is visible beside its copy button on desktop and mobile. Clicking displays the success message. The browser automation virtual clipboard did not expose navigator.clipboard output, so clipboard readback could not be independently confirmed in this environment.
- At 390×844: document width equals viewport width (390px); ID/copy remain visible; drawer opens, navigates to Orders, and closes.
- Production build passes. Standalone HTML exports and portable React source archive updated.


## Approved baseline 2.1 and metric motion — 2026-10-23

- Current compact design documented in DESIGN.md and recorded in root DESIGN_LOCK.md. Project instructions direct future pages to the same shared components and stylesheet. Superseded shadcn documentation archived and marked inactive.
- AnimatedNumber counts metric values once on first intersection in 400ms; zero values are static, decimals are preserved, and screen readers receive only final values. Ratios/charts/layout remain unchanged.
- Component behavior check passed for nine integer/decimal values, final-value accuracy, no replay, zero values, reduced motion, preference changes, and unmount cleanup.
- Actual browser reports prefers-reduced-motion: reduce; verified immediate exact final values and no overflow there. Normal-motion progression was checked with a mocked frame clock against the actual compiled component. No OS preference was changed.
- Standard production and standalone builds passed. Existing large-chunk warning remains. Original aggregate JSON bytes unchanged.
- Immutable 2.1 snapshot includes standalone HTML, portable source ZIP, stylesheet, design guide, screenshot, original metric data, and SHA-256 manifest.


## Affiliate and shipping cards — 2026-10-23

- Added /affiliate from supplied screenshot content only, using the approved Hala shared layout, IBM font, Gravity icons, compact cards and restrained colors. Duplicate overview values consolidated.
- Verified referral code XPVHIW from the original-resolution source image. Commission per delivered order is $0.25; earnings, commissions, pending/available balances, delivered orders and registered accounts are all zero. Account table includes the four source columns and a genuine empty state.
- Copy interaction displays confirmation; share dialog opens/closes and contains the exact referral URL. Native sharing requires a user action inside that dialog. Withdraw button is disabled with an explanation at the supplied zero balance; no financial API action is implemented.
- Affiliate desktop 1440×900 and mobile 390×844: no document overflow. Table overflow stays within its own container on mobile. Mobile drawer navigation works.
- User confirmed shipping ring value 50%. Stored separately from unchanged original aggregate JSON. Delivery remains 1.2%.
- Shipping distribution is an independent card; a second equally sized card is split into two ratios with headings above the rings. Mobile cards stack while rings remain side by side.

## توحيد كارت الشحنات — 23 أكتوبر 2026

- جميع مؤشرات الشحنات والمخطط الشريطي والدائرتين داخل `section-card` واحد، دون بطاقات داخلية.
- راجعت الواجهة في المتصفح عند 1135px: خلفية واحدة وفواصل رفيعة، مع 50% و1.2% دون تغيير البيانات.
- عند 390px لا يوجد تجاوز أفقي؛ عرض الكارت 366px والرسوم تتراص داخله.
- نجح بناء الإنتاج وتصدير HTML المستقل.
- صورة التحقق: `../hala-shipments-unified.png`.

## النسب وأسباب الإلغاء والفشل — 23 أكتوبر 2026

- نسب الطلبات بالترتيب: التأكيد، الإلغاء، الوهمي، ثم أسباب إلغاء الطلبات. دائرة التأجيل أزيلت فقط، دون تغيير المؤشر الأصلي.
- أسباب الإلغاء: لم يعد يريد 34/39%، رفض العميل 22/26%، تأخر التوصيل 18/21%، نفاد المخزون 12/14%.
- قسم الشحنات ما زال سطحًا واحدًا؛ أسباب الفشل على اليمين، ونسبتا التسليم ثم الشحن على اليسار مع إجمالي 84 فوقهما.
- 6 صفوف لأسباب الفشل و4 للإلغاء، من الصور كما وردت. البيانات ملفات مستقلة دون إعادة حسابها من مؤشرات الرئيسية.
- راجعت DOM ولقطة الكمبيوتر 1135px، والموبايل 390px دون تجاوز أفقي؛ نسب الطلبات عمودان، والشحنات عمود واحد، دون أخطاء بالمتصفح.
- نجح بناء الإنتاج وتصدير HTML. لقطة التحقق: `../hala-order-cancellation-and-shipping.png`.

## أفضل ٥ منتجات — 23 أكتوبر 2026

- وافق المستخدم على أي 5 منتجات تجريبية؛ الكارت مستقل بعد الشحنات وقبل المالية، وصوره التوضيحية SVG محلية.
- الجدول يتضمن الصورة والاسم، الطلبات، المؤكد، المشحون والإيرادات، مع نسبة من إجمالي كل عمود حسب اختيار المستخدم.
- مجموع الأعمدة: 400 طلب، 316 مؤكد، 244 مشحون، و12,800 USD؛ كل نسبة تُحسب من إجمالي عمود المنتجات الخمسة فقط. صف الإجمالي 100%.
- تحقق المتصفح: 5 صفوف و5 صور محمّلة، لا أخطاء. عرض الهاتف 390px: الصفحة 390px، حاوية الجدول 366px، والجدول 700px داخل منطقة تمرير أفقية.
- نجح بناء الإنتاج وتصدير HTML المستقل، وبقيت بيانات الرئيسية الأصلية دون تعديل.
- لقطة التحقق: `../hala-top-five-products.png`.

## ضغط المنتجات وتوسيع أسباب الإلغاء — 23 أكتوبر 2026

- نسب الطلبات تعرض التأكيد والإلغاء فقط، وأسباب الإلغاء بعرض عمودين؛ المؤشرات الأصلية لم تتغير.
- أعمدة المنتجات: المنتج، الطلبات، المؤكد، المشحون، NDR، AOV، الإيراد. النسب للمؤكد والمشحون فقط: 10 نسب في 5 صفوف.
- الصور 30px دون شارة دولة؛ ارتفاع الصف 43px على الهاتف بدل 61px تقريبًا سابقًا.
- AOV من الإيراد ÷ كل الطلبات باختيار المستخدم: أول منتج 33.66 USD وإجمالي 32.00 USD. الإجمالي موزون ولا يجمع المتوسطات. NDR بيانات تجريبية مجموعها 27.
- الهاتف 390px دون تجاوز للصفحة؛ أسباب الإلغاء 356px داخل سطح 366px، والجدول 760px داخل حاوية تمرير 366px. جميع الصور محملة ودون أخطاء بالمتصفح.
- بناء الإنتاج وتصدير HTML ناجحان، وبيانات الرئيسية الأصلية محفوظة.
- لقطتا التحقق: `../hala-cancellation-expanded.png` و`../hala-products-compact.png`.

## نسبة الشحن أولًا — 23 أكتوبر 2026

- أزيلت دائرة نسبة التسليم، ومؤشر «تم التسليم» وبيانات المصدر محفوظان.
- دائرة الشحن 50% في أول عمود يمينًا، ثم أسباب فشل الشحنات في الأعمدة الثلاثة المتبقية داخل سطح واحد.
- الهاتف 390px: الصفحة بلا تجاوز أفقي، دائرة الشحن أولًا ثم أسباب الفشل، وكل جزء بعرض 366px. لا أخطاء متصفح.
- بناء الإنتاج وتصدير HTML ناجحان. صورة التحقق: `../hala-shipping-first.png`.
