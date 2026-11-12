import assert from 'node:assert/strict';
import fs from 'node:fs';
const {chromium}=await import(process.env.PLAYWRIGHT_TEST_MODULE||'playwright');
const base=process.env.TEST_BASE_URL||'http://127.0.0.1:8179';
const browser=await chromium.launch({executablePath:process.env.BROWSER_EXECUTABLE||'/usr/bin/chromium',args:['--no-sandbox']});
try {
 // Even old indefinite confirmations must show the question in a fresh session.
 const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 await context.addInitScript(()=>{try{localStorage.setItem('videira-age-ok','1');localStorage.setItem('videira-age-confirmed','yes');}catch{}});
 const p=await context.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto(base);await p.locator('[data-age-gate][open]').waitFor();
 await p.keyboard.press('Escape');assert.equal(await p.locator('[data-age-gate]').evaluate(e=>e.open),true);
 await p.locator('[data-age-confirm]').click();assert.equal(await p.locator('[data-age-gate]').evaluate(e=>e.open),false);
 await p.reload();assert.equal(await p.locator('[data-age-gate]').evaluate(e=>e.open),false);
 await p.goto(base+'/collections/all');assert.equal(await p.locator('[data-age-gate]').evaluate(e=>e.open),false);
 await p.goto(base);await p.evaluate(()=>document.fonts.ready);
 assert.equal(await p.locator('[data-carousel-step]:visible,.vm-inline-controls:visible').count(),0);
 assert.equal(await p.locator('[data-store-message]:visible>svg').count(),1);
 assert.equal(await p.locator('[data-store-message]:visible').innerText(),'ENVIO PARA TODO O BRASIL');
 await p.waitForFunction(()=>!document.querySelectorAll('[data-store-message]')[1].hidden,null,{timeout:6500});
 assert.equal(await p.locator('[data-store-message]:visible>svg').count(),1);
 for(const flag of await p.locator('#paises .vm-country-flag').all())assert.ok((await flag.boundingBox()).width>90);
 assert.equal(await p.locator('#paises a small').count(),0);
 assert.equal(await p.locator('#paises a').first().evaluate(e=>getComputedStyle(e).borderWidth),'0px');
 assert.ok((await p.locator('#paises a').first().getAttribute('href')).includes('pais=Argentina'));
 // All carousel rows retain native touch overflow, with no controls covering food or wine.
 const overflow=await p.locator('#selecao .wc-viewport').evaluate(e=>({width:e.clientWidth,content:e.scrollWidth,overflow:getComputedStyle(e).overflowX}));
 assert.ok(overflow.content>overflow.width&&overflow.overflow==='auto');
 assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 await p.locator('#paises').screenshot({path:'docs/countries-mobile-nov12.png'});
 assert.deepEqual(errors,[]);await context.close();
 // A new browsing session asks again, and a denial keeps browsing blocked.
 const denied=await browser.newPage();await denied.goto(base);await denied.locator('[data-age-gate][open]').waitFor();await denied.locator('[data-age-deny]').click();
 assert.equal(await denied.locator('[data-age-gate]').evaluate(e=>e.open),true);assert.equal(await denied.locator('[data-age-denied]').isVisible(),true);assert.equal(await denied.locator('.age-actions').isVisible(),false);await denied.close();
 const blocked=await browser.newPage();await blocked.addInitScript(()=>{Object.defineProperty(window,'sessionStorage',{get(){throw new DOMException('Denied','SecurityError');}});});await blocked.goto(base);await blocked.locator('[data-age-confirm]').click();assert.equal(await blocked.locator('[data-age-gate]').evaluate(e=>e.open),false);await blocked.close();
 const editor=await browser.newPage();await editor.addInitScript(()=>{window.Shopify={designMode:true};});await editor.goto(base);assert.equal(await editor.locator('[data-age-gate]').evaluate(e=>e.open),false);await editor.close();
 const desktop=await browser.newPage({viewport:{width:1440,height:1000}});await desktop.addInitScript(()=>sessionStorage.setItem('videira-age-session-v1','1'));await desktop.goto(base);assert.ok(await desktop.locator('#selecao [data-carousel-step="1"]').isVisible());await desktop.locator('#paises').screenshot({path:'docs/countries-desktop-nov12.png'});await desktop.close();
 console.log('PASS: fresh session, legacy acceptance, reload/navigation, denial, unavailable storage, editor, message icons, mobile flags/swipe/no arrows, desktop controls');
} finally {await browser.close();}
