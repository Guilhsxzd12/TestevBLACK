import assert from 'node:assert/strict';
import fs from 'node:fs';
const {chromium}=await import(process.env.PLAYWRIGHT_TEST_MODULE || 'playwright');
process.env.RENDER_ONLY='1';
const {globals,renderPage}=await import('./fixture-server.mjs');
const root=new URL('../',import.meta.url).pathname;
const base=process.env.TEST_BASE_URL || 'http://127.0.0.1:8179';
// Synthetic awards are used only in this local fixture, never in merchant data.
const data=globals('product');
data.product=structuredClone(data.product);
data.product.metafields.custom.premiacao={type:'multi_line_text_field',value:'91 | Avaliador de exemplo'};
data.product.metafields.custom.volume={value:'750'};
data.product.featured_image={src:'/fixture-product-photo'};
data.product.images=[data.product.featured_image];
const html=await renderPage('product',data);
const browser=await chromium.launch({executablePath:process.env.BROWSER_EXECUTABLE || '/usr/bin/chromium',args:['--no-sandbox']});
try {
 for(const width of [390,820,1440]) {
  const page=await browser.newPage({viewport:{width,height:900}});
  await page.addInitScript(()=>localStorage.setItem('videira-age-ok','1'));
  await page.route(base+'/product-award-demo',r=>r.fulfill({body:html,contentType:'text/html'}));
  await page.route('**/fixture-product-photo',r=>r.fulfill({body:fs.readFileSync(root+'docs/images/product-2.img'),contentType:'image/jpeg'}));
  await page.goto(base+'/product-award-demo');await page.evaluate(()=>document.fonts.ready);
  assert.equal(await page.locator('.vm-awards').count(),0);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  assert.equal(await page.locator('[data-product-price]').count(),1);
  assert.equal(await page.locator('[data-product-submit]').count(),1);
  assert.match(await page.locator('.pd-summary h1').evaluate(e=>getComputedStyle(e).fontFamily),/Playfair Display/);
  assert.match(await page.locator('.pd-identity-row p').first().evaluate(e=>getComputedStyle(e).fontFamily),/Lexend/);
  assert.equal((await page.locator('.pd-volume span').innerText()).trim(),'750 ml');assert.equal(await page.locator('.pd-volume').evaluate(e=>e.scrollWidth<=e.clientWidth),true);for(const icon of await page.locator('.pd-identity-icon').all()){assert.equal(await icon.evaluate(e=>getComputedStyle(e).color),'rgb(56, 52, 56)');}
  await page.screenshot({path:root+'docs/product-reference-'+width+'.png',fullPage:true});
  await page.locator('.pd-quantity [data-quantity-step="1"]').click();assert.equal(await page.locator('#product-quantity').inputValue(),'2');
  await page.locator('.pd-quantity [data-quantity-step="-1"]').click();assert.equal(await page.locator('#product-quantity').inputValue(),'1');
  if(width<761)assert.equal(await page.locator('.pd-purchase-dock').evaluate(e=>getComputedStyle(e).position),'fixed');
  console.log('PASS product reference '+width+': removed score badges, fonts, single purchase form, quantity and no overflow');
  await page.close();
 }
} finally {await browser.close();}
