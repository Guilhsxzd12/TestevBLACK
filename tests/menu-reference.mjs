import assert from 'node:assert/strict';
const {chromium}=await import(process.env.PLAYWRIGHT_TEST_MODULE || 'playwright');
const base=process.env.TEST_BASE_URL||'http://127.0.0.1:8179',root=new URL('../',import.meta.url).pathname;
const browser=await chromium.launch({executablePath:process.env.BROWSER_EXECUTABLE||'/usr/bin/chromium',args:['--no-sandbox']});
try{for(const width of [390,820,1440]){
 const page=await browser.newPage({viewport:{width,height:900}});await page.addInitScript(()=>sessionStorage.setItem('videira-age-session-v1','1'));
 await page.goto(base,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
 if(width<1024){
  await page.locator('[data-menu-toggle]').click();const panel=page.locator('.vm-menu-panel');
  assert.equal(await panel.isVisible(),true);assert.equal(await panel.locator('.vm-menu-highlights>a').count(),4);
  assert.equal(await panel.locator('.vm-menu-icon').first().evaluate(e=>getComputedStyle(e).strokeWidth),'1.2px');
  assert.equal(await panel.locator('.vm-menu-highlights-title').evaluate(e=>getComputedStyle(e).fontFamily),'Lexend, Arial, sans-serif');
  const box=await panel.boundingBox();assert.equal(Math.round(box.width),width===390?390:460);
  await panel.screenshot({path:root+'docs/menu-reference-'+width+'.png'});
  await panel.locator('.vm-menu-wines summary').click();assert.equal(await panel.getByRole('link',{name:'Frisante',exact:true}).isVisible(),true);
  await panel.getByRole('link',{name:'Frisante',exact:true}).focus();await page.keyboard.press('Escape');assert.equal(await panel.isVisible(),false);
  assert.equal(await page.locator('[data-menu-toggle]').evaluate(e=>document.activeElement===e),true);
  await page.locator('[data-menu-toggle]').click();await panel.getByRole('link',{name:'Novidades',exact:true}).click();assert.equal(await panel.isVisible(),false);
 }
 await page.locator('[data-banner-dot="1"]').click();await page.locator('.vm-arrivals-banner img').evaluate(e=>e.decode());
 const image=page.locator('.vm-arrivals-banner img');assert.ok((await image.evaluate(e=>e.currentSrc)).includes(width<761?'videira-arrivals-mobile.webp':'videira-arrivals-desktop.webp'));
 assert.equal(await image.evaluate(e=>getComputedStyle(e).objectFit),'contain');
 await page.locator('.mi-hero').screenshot({path:root+'docs/banner-'+width+'.png'});
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 console.log('PASS menu/banner '+width+': reference layout, categories, Escape/focus return, anchor close and uncropped responsive artwork');await page.close();
}}finally{await browser.close();}
