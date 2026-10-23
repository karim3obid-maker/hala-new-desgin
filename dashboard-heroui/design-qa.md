# Compact Hala dashboard QA

## Second dashboard image-to-code — 2026-10-23

- Source visual truth: `design/dashboard-two-reference.png`, the exact user-selected attachment; 1487x1058 pixels. Implementation: `http://127.0.0.1:4181/#/dashboard-2`, light theme, original snapshot period, collapsed product/financial sections.
- Evidence: `design/dashboard-two-desktop.png`, 1487x1058 CSS/pixels at density 1. Full-view comparison: `design/dashboard-two-comparison.jpg` places both equal-size images together. Focused comparison: `design/dashboard-two-focused.jpg` aligns the orders lanes and shows readable type, values, chips and RTL alignment. No density rescaling was used for the full comparison; focused crops were reduced equally for review.
- Iteration history: initial P2 findings were undersized status typography and left-aligned LTR values. Increased lane titles to 19px, labels to 16px, values to 30px and lane rhythm; set metric `justify-self:start`. Recaptured and re-compared the same desktop state. Dark-mode review found low-contrast purple status icons; added explicit light-purple and muted minor-icon overrides, then captured `design/dashboard-two-dark.png`.
- Fonts/typography: local IBM Plex Sans Arabic confirmed loaded. Existing shell density retained intentionally; page label is the requested second homepage name. Arabic labels wrap cleanly and numbers use LTR bdi.
- Spacing/layout: two independently tinted lanes, four primary cards each, compact secondary statuses, two reasons panels and disclosure controls match the chosen architecture. Original shared header/sidebar remain unchanged; this accounts for the shorter top chrome compared with the generated reference. At mobile 390x844, primary cards form two columns and reasons stack. Document width/scrollWidth both 390.
- Colors/tokens: purple orders, blue shipments, semantic status colors, white interiors and fine borders preserved. Dark mode uses existing surface tokens and brighter accents. No giant donuts or combined conversion funnel.
- Images/assets: original local Hala logo and shared Gravity icons reused; no new raster assets needed. Reference is a UI-only screen. No screenshot is used as live page content.
- Copy/data: same dashboard JSON and independent reasons snapshots. Confirmation/cancellation percentages remain 40.28%; shipping presentation remains the user-selected 50%. The truncated coverage reason is intentionally preserved from source data rather than completed from the generated mock.
- Interactions verified: sidebar navigation to the new route and back to the original overview; product table and financial summary expand/collapse; date modal opens, applies 2026-10-02 start, displays unavailable-period state, and restores the original period. Light/dark toggle checked. Browser error logs empty. Production build passed.
- Mobile evidence: `design/dashboard-two-mobile.png` and `design/dashboard-two-mobile-details.png`, normal viewport screenshots after reload. Full-page browser capture had an RTL stitching artifact and was replaced by these inspected captures. Desktop viewport override reset after QA; user preview remains open.
- Remaining P3: generated reference has slightly larger shared-shell typography; retaining the approved existing shell is intentional. No actionable P0/P1/P2 findings remain.

final result: passed

final result: passed

## Wallet forms and revised pricing — 2026-10-23

Supersedes the earlier disabled transaction actions and old price-dialog content. Current prices show shipping first: shipped 3 USD, delivered 2 USD, returned 0 USD; call center 1.50 USD per uploaded order. Historical summary costs remain explicitly labeled as a prior snapshot. Invoice tab shows the existing Hala logo and separate issue-date/due-date-time fields, with unavailable values clearly marked rather than fabricated.

Withdrawal, deposit and receiving-account forms now work as local previews. Exactly three methods are available: Instapay, Payoneer and Saudi bank account. No API requests, actual transfers or receipt uploads occur. Blank deposit validation, Arabic decimal amount entry, required receipt selection, local ledger insertion, withdrawal balance limits and adding a Payoneer account while preserving the withdrawal draft were verified in the browser. Eleven integer-cent amount parsing cases passed. Reload cleared all test records and accounts.

Mobile deposit verified at 390 × 844 with no horizontal overflow and accessible form actions. Latest browser console had no errors. Production build passed. Evidence: `design/wallet-deposit-mobile.png`, `design/wallet-transfer-accounts.png`, `design/wallet-current-prices.png`, `design/wallet-invoice-preview.png`.

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

## Wallet implementation — 2026-10-23

Source: `/Users/mac/.codex/generated_images/01a16969-9b74-78f3-aa90-dcd101d1cbaf/exec-0963d95e-e5b9-4b94-87c6-0a09f9388185.png` (1330 × 1182).
Implementation: `http://127.0.0.1:4181/#/wallet`, `design/wallet-desktop.png` (1440 × 1280 pixels; viewport 1440 × 1280 CSS pixels). State: summary active, dialog closed.
Full-view evidence: `design/wallet-comparison.png`, equal 720px widths, natural aspect ratios retained (source/implementation ratios match). Focused evidence: `design/wallet-detail-comparison.png`, confirmation tables normalized to 900px width, inspected together for text, numeric columns and amounts.
Mobile: `design/wallet-mobile.png`, 390 × 844 CSS px. clientWidth/scrollWidth both 390. Also checked 320 × 568 price dialog: x14/y16, width292/height536; table body scrolls while close footer remains visible.

Findings/history: initial interaction review found HeroUI Button discarded custom tab roles and selection attributes. Fixed tab controls using native buttons with shared styles, roving tabindex and RTL navigation. Post-fix role/selection/focus verified. No remaining actionable P0/P1/P2 issues.

Required fidelity surfaces:
- Typography: existing IBM Plex Sans Arabic 400/500/600; approved compact sizes. LTR numbers inside bdi. Unit helper text sits below prices for mobile readability.
- Layout: five-metric surface, action row and price trigger, five tabs, confirmation/shipping/additional-expense panels stacked. Original shell retained; compact density intentionally follows approved site baseline over generated-image enlargement.
- Tokens: original Hala purple/lavender, fine gray borders, muted labels and white panels. Standard table amount text intentionally follows site styling rather than saturated generated purple.
- Assets: original logo and Gravity icons reused; no replacement illustrations or approximations.
- Copy/content: all eight aggregate service rows match original screenshot values. Extras show Hala Share 8.00 USD, ads 0.00 USD, private expenses unavailable. Overall snapshot expense total 221.87 USD retained. Invoice/deposit data unavailable; withdrawal empty per original source. No fabricated transactions.

Verified all five tabs and their content; price modal shows eight services, Escape closes and restores focus. Home and RTL ArrowLeft/ArrowRight selection work. Latest browser console error query returned none. HMR previously emitted PressResponder warnings during component replacement; no runtime error observed.
Build and standalone export pass. Financial transaction buttons intentionally remain disabled pending account API; tab navigation and service pricing work locally.
Checklist complete. No blocking visual or interaction findings; no required polish remaining. Backend account integration is outside this design task.
final result: passed

## Hala offers — 2026-10-23
Added sidebar link, two offer cards and direct detail routes. Verified opening both details and returning to the list. Hala Partner content and five rates match the user brief, including program-specific 15% COD (wallet/calculator defaults unchanged). Missing first-offer details and incomplete registration URL are disclosed; no invented terms, registration or redirect. Existing account-manager WhatsApp opens only on deliberate click.
Desktop and 390 × 844 mobile inspected; mobile clientWidth and scrollWidth both390. Sidebar active for nested offer routes; account-tools divider now follows the calculator path rather than a fragile index. No browser console errors. Production build passed. Evidence: `design/hala-partner-desktop.png`, `design/hala-partner-mobile.png`.
User clarification implemented: registration opens a simple form with full name, average daily orders and detailed experience. Tested empty-submit errors and focus; valid test submission using Arabic order count٢٠ reaches local-only confirmation. Closing/reopening clears test data. No request is transmitted. This supersedes the earlier unavailable-registration-URL state.
Application modal verified at390×844: all three fields and action footer visible, no horizontal page overflow. Evidence `design/hala-partner-application-mobile.png`. Updated standalone export passed.

## Public homepage — 2026-10-23
- Added independent `/#/home` preview using the approved Hala identity.
- Browser checked at 1366×950 and 390×844: no horizontal overflow; hero image, logo, and dashboard image loaded successfully.
- Mobile menu opens and closes; selecting a section closes it and scrolls beneath sticky header. FAQ expands and reveals its answer.
- Verified signup/login/booking destinations against the current public homepage; no external forms submitted.
- Production build and single-file build pass. Existing bundle-size advisory remains.
- Captures: design/home-desktop.jpg, design/home-mobile.jpg.
- Shareable standalone export: ../hala-home.html (defaults to /home; dashboard exports were not overwritten).

## Login-focused homepage and account pages
- Verified zero meeting links and all primary homepage CTAs target /auth/login.
- Verified fixed bottom CTA and mobile navigation at 390px; no horizontal overflow.
- Auth layouts reviewed at 1366×950 and 390×844; 250 original country options preserved.
- Password visibility works. Registration mismatch blocks submission; matching synthetic values produce explicit preview-only status and clear fields. Login produces explicit preview-only status. No requests or persistence added.
- Screenshots: design/auth-login-desktop.jpg, design/auth-login-mobile.jpg, design/auth-register-desktop.jpg, design/auth-register-mobile.jpg. Homepage captures refreshed.

## Hala Partner 3D presentation — 2026-10-23
User-supplied banner is displayed whole above partner details, with its native aspect ratio and full-size link. Six matching generated transparent 3D icons replace offer-page line artwork, with live HTML titles and body copy preserved. Purple application panel and restrained orange introduction accent distinguish the promotion within the shared shell. No new animation or change to pricing/application logic.
Desktop and390×844 mobile visually inspected. Banner loaded at naturalWidth2061; six benefit icons present. Mobile page width/scrollWidth both390. Form trigger and required fields still work; latest console errors empty. Production build passed. Screenshots: `design/hala-partner-3d-desktop.png`, `design/hala-partner-3d-mobile.png`. Generation provenance/prompt: `src/assets/offers/GENERATION.md`.

## Branded homepage, copy review, and motion
- Reviewed copy with Ibrahim Copywriting; preserved factual service scope and login conversion goal, no invented proof or claims.
- New local generated assets: brand-parcels.webp, brand-delivery.webp, commerce-icons.webp. Logo reference inspected and used in both brand photos; all outputs visually inspected and optimized to WebP.
- Desktop 1366px / mobile 390px: no horizontal overflow, all six service icons displayed, all images loaded, no meeting links, login CTA remains fixed.
- Visually checked service cards and new brand gallery on both sizes; adjusted sprite edge clipping and photo framing after inspection.
- Entrance animations run once, stagger on desktop, no recurring motion; reduced-motion CSS disables animations/transitions and the preference listener reveals pending sections.
- Captures: design/home-branded-desktop.jpg, design/home-3d-services.jpg, design/home-3d-mobile.jpg, design/home-brand-story.jpg.

## Partner application placement — 2026-10-23
Added top CTA directly below banner; retained bottom CTA. Both triggers verified opening the same single modal and closing normally. Production build passed; responsive top CTA becomes full-width below760px.

## 100% Profit banner — 2026-10-23
Verified supplied1080×400 banner loaded intact above first-offer details. Title/list name corrected to100%بروفت; existing route preserved. Shared fluid banner styling retained. Production build passed.

## 100% PROFIT details — 2026-10-23
Replaced empty details with supplied financing breakdown, settlement, five conditions and closing line. Verified1500+1500+3000=6000 and Hala's4500 contribution, all settlement statements and all five conditions against brief. Two CTAs use a single local application modal with correct100%PROFIT title. No actual investment/payment functionality introduced. Desktop and390×844 mobile inspected; width/scrollWidth both390, console errors empty. Production and standalone builds passed. Evidence: `design/hala-profit-details-desktop.png`, `design/hala-profit-details-mobile.png`.

## Gulf hero and blog — 2026-10-23
- Desktop1366 and mobile390 checked. No document horizontal overflow on home, index and article.
- Gulf route CSS animation observed advancing (offset-distance changed); pause froze at66.0062% across separate observations. Reduced-motion initial state is static, explicit play opt-in works. Offscreen pausing via IntersectionObserver.
- Blog search with no match showed empty state; reset restored articles; stock category showed exactly one card. Article read link opened correct slug. Article contents button jumped to returns section with header clearance.
- All three article images loaded. COD mobile article and inventory desktop article reviewed visually; expansion article has five content sections and references. Unknown slug shows recovery state.
- Evidence: design/home-gulf-desktop.jpg, home-gulf-mobile.jpg, blog-desktop.jpg, blog-mobile.jpg, blog-article-desktop.jpg, blog-article-mobile.jpg.
- Build successful; Vite retains its existing aggregate bundle-size advisory. Standalone home export includes local blog routes. Existing authentication remains preview-only.

## Invoice ledger — 2026-10-23
Replaced inline invoice template with a six-column ledger: invoice ID, issue date, due date/time, total, status and view action. Missing issued records remain an empty array. Independently verified sample-modal open/close and original invoice layout, logo and unknown dates. Real-row rendering uses selected record fields without placeholder financial values. Desktop and390×844 mobile inspected, page clientWidth/scrollWidth390, table scroll contained. No console errors. Production and standalone builds passed. Evidence: `design/wallet-invoice-ledger-desktop.png`, `design/wallet-invoice-ledger-mobile.png`.

## Demo invoices — 2026-10-23
User requested invoices in the ledger. Added three explicit DEMO records (110/45/40USD), each labeled as experimental in row/detail plus shared notice. Verified all three view actions, invoice-specific dates/status/items and amounts. Node check confirms every line quantity×rate and sum of all line totals match invoice totals. Invoice dialog max-width expanded860px and rows compacted after populated visual review. Production and standalone builds passed. Snapshot balances unchanged.

## Formal invoice print/download — 2026-10-23
Added formal document styling plus per-invoice print and real PDF download. Browser download completed at `/Users/mac/Downloads/Hala-DEMO-INV-003.pdf`. Poppler pdfinfo confirms valid PDF1.4, one A4 page595.28×841.89pt,223077bytes. Rendered and visually inspected the entire page: Arabic shaping, IBM font, Hala logo, recipient, dates, all three service rows,110USD total, and demo disclaimer are clear with no clipping/overlap. Evidence `design/wallet-invoice-a4-verified.png`. Output intentionally uses high-resolution page images (text is not selectable). Print control invoked in isolated test tab, with no console errors; no physical print job submitted. Shared renderer excludes application shell and provides12line pagination. Production and standalone builds passed.

## Calculator catalog selection — 2026-10-23
Verified product picker search by English name, Arabic name and SKU (HALA-0010), plus no-match feedback. Selecting a catalog product displays its photo, SKU, category, stock and catalog unit prices and populates unit cost15USD. Other inputs remain unchanged. Manual cost18 updates the override notice and calculated result103.90USD; restoring15 returns99.28USD. Reset clears product selection. Desktop and390px mobile visually inspected including modal; mobile clientWidth and scrollWidth both390, console errors empty. Production build and standalone export passed. Evidence: design/calculator-product-selection-desktop.png and design/calculator-product-selection-mobile.png. Uses existing local catalog data; no live catalog connection introduced.
