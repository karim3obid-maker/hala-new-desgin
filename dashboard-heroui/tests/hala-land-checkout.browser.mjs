// Uses fresh isolated storage; never changes the user's saved pages or orders.
import assert from 'node:assert/strict';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.launch({headless:true,...(process.env.PLAYWRIGHT_EXECUTABLE?{executablePath:process.env.PLAYWRIGHT_EXECUTABLE}:{})});
const context=await browser.newContext({viewport:{width:390,height:844}});
const page=await context.newPage(),errors=[];
page.on('pageerror',error=>errors.push(error.message));
const base=process.env.HALA_BASE_URL||'http://127.0.0.1:4181/';
async function noOverflow(){assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false)}
try{
  await page.goto(base+'#/hala-land');
  await page.locator('.land-table tbody tr').first().waitFor();
  const id=await page.evaluate(async()=>{
    const {halaLandService:s}=await import('/src/services/halaLand.js');
    const {defaultStore}=await import('/src/services/halaLandValidation.js');
    const {products}=await import('/src/data/products.js');
    await s.saveStore({...defaultStore,name:'متجر اختبار الطلب',slug:'checkout-test'});
    const blob=await(await fetch(products[0].image)).blob();
    const [image]=await s.prepareImages([new File([blob],'checkout.jpg',{type:'image/jpeg'})]);
    const saved=await s.savePage({name:'اختبار الطلب المستقل',slug:'checkout-test',productId:products[0].id,images:[image],offers:[{id:'single',quantity:'1',price:'79'},{id:'trio',quantity:'3',price:'199',ctaText:'عرض الثلاث قطع'}],settings:{imageLayout:'stacked',skipCart:true}},products);
    return saved.id;
  });
  const preview=base+'#/hala-land/preview/'+id;
  await page.goto(preview+'?offer=trio');
  const buy=page.locator('.land-purchase-button');
  await buy.waitFor();
  assert.equal(await buy.getAttribute('aria-haspopup'),null);
  assert.equal(await page.locator('#land-order-form').count(),0);
  await noOverflow();
  await buy.click();
  await page.waitForURL(/\/checkout\?offer=trio$/);
  await page.locator('#land-order-form').waitFor();
  assert.equal(await page.getByRole('dialog').count(),0);
  assert.equal(await page.getByRole('radio',{name:'عرض الثلاث قطع',exact:true}).isChecked(),true);
  assert.match(await page.locator('.land-order-total').innerText(),/199\.00/);
  await page.locator('.land-order-submit').click();
  await page.getByText('اكتب اسم العميل بالكامل.').waitFor();
  assert.equal(await page.getByRole('heading',{name:'شكرًا لطلبك!'}).count(),0);
  await page.getByLabel('الاسم بالكامل',{exact:true}).fill('عميل اختبار الطلب');
  await page.getByLabel('رقم الجوال السعودي').fill('0512345678');
  await page.getByLabel('المنطقة',{exact:true}).selectOption('الرياض');
  await page.getByLabel('العنوان بالتفصيل').fill('الرياض، حي الاختبار، شارع 12');
  await noOverflow();
  await page.locator('.land-order-submit').click();
  await page.getByRole('heading',{name:'شكرًا لطلبك!'}).waitFor();
  assert.equal(await page.locator('.land-order-success').count(),1);
  assert.equal(await page.locator('.land-order-submit').count(),0);
  assert.equal(await page.locator('#land-order-form').evaluate(el=>el===document.activeElement),true);
  await page.getByRole('link',{name:'عرض الطلب في هلا'}).click();
  assert.match(await page.locator('.detail-total').innerText(),/199/);
  assert.match(await page.locator('.detail-products-table').innerText(),/3/);
  // Legacy skipCart=false still preserves the selected offer through the cart.
  await page.evaluate(async id=>{const {halaLandService:s}=await import('/src/services/halaLand.js');const {products}=await import('/src/data/products.js');const p=await s.getPage(id);await s.savePage({...p,settings:{...p.settings,skipCart:false}},products)},id);
  await page.goto(preview+'?offer=trio');
  await page.locator('.land-purchase-button').click();
  await page.waitForURL(/\/cart\?offer=trio$/);
  await page.getByRole('button',{name:'متابعة الشراء'}).click();
  await page.waitForURL(/\/checkout\?offer=trio$/);
  await page.locator('#land-order-form').waitFor();
  assert.equal(await page.getByRole('radio',{name:'عرض الثلاث قطع',exact:true}).isChecked(),true);
  await noOverflow();
  assert.deepEqual(errors,[]);
  console.log('Standalone checkout passed: selected bundle, validation, local order total/quantity, thank-you focus, cart routing and mobile overflow.');
}finally{await context.close();await browser.close()}
