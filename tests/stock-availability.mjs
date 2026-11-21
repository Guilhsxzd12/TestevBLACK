import assert from 'node:assert/strict';
const {chromium} = await import(process.env.PLAYWRIGHT_TEST_MODULE || 'playwright');
process.env.RENDER_ONLY='1';
const {globals, renderPage}=await import('./fixture-server.mjs');
const base=process.env.TEST_BASE_URL || 'http://127.0.0.1:8179';
const seed=globals('product').product;
const make=(id,tracked,quantity,policy='deny',nativeAvailable=true)=>{
  const p=structuredClone(seed);
  p.id=id;p.title='Vinho '+id;p.url='/products/stock-'+id;p.available=nativeAvailable;
  p.has_only_default_variant=true;
  p.variants=[{...p.variants[0],id:id*10,available:nativeAvailable,inventory_management:tracked?'shopify':null,inventory_quantity:quantity,inventory_policy:policy}];
  p.selected_or_first_available_variant=p.variants[0];p.selected_variant=null;
  return p;
};
const empty=make(91,true,0,'deny',false);
const overselling=make(92,true,0,'continue');
const untracked=make(93,false,0);
const positive=make(94,true,5);
const negative=make(95,true,-2,'continue');
const mixed=make(96,true,0,'continue');mixed.has_only_default_variant=false;
mixed.variants.push({...positive.variants[0],id:962,title:'Com estoque'});
mixed.variants[0].title='Sem estoque';
const products=[empty,overselling,untracked,positive,negative,mixed];
const collection={...globals('collection').collection,products,products_count:products.length};
const catalog=await renderPage('collection.descobrir',{collection,collections:{all:collection}});
const home=await renderPage('index',{collection,collections:{all:collection}});
const detail=await renderPage('product',{product:mixed});
const restocked=structuredClone(empty);restocked.available=true;restocked.variants[0].available=true;restocked.variants[0].inventory_quantity=3;restocked.selected_or_first_available_variant=restocked.variants[0];
const restored=await renderPage('product',{product:restocked});
const kit=structuredClone(mixed);kit.metafields.custom.caixa={value:6};
const kitCollection={...collection,products:[kit],products_count:1};
const kits=await renderPage('collection.descobrir',{collection:kitCollection,collections:{all:kitCollection}});
// A directly selected zero-stock variant must remain selected and disabled.
const direct=structuredClone(mixed);direct.selected_variant=direct.variants[0];direct.selected_or_first_available_variant=direct.variants[0];
const directHTML=await renderPage('product',{product:direct});
const browser=await chromium.launch({executablePath:process.env.BROWSER_EXECUTABLE || '/usr/bin/chromium',args:['--no-sandbox']});
try {
 for(const width of [390,1440]){
  const page=await browser.newPage({viewport:{width,height:950}});
  await page.addInitScript(()=>sessionStorage.setItem('videira-age-session-v1','1'));
  let addCalls=0,holdAdd=false,releaseAdd,notifyAdd;
  await page.route('**/cart/add.js',async r=>{addCalls++;if(holdAdd)await new Promise(resolve=>{releaseAdd=resolve;notifyAdd?.();});return r.fulfill({json:{id:962}});});
  await page.route('**/collections/all?*',r=>r.fulfill({contentType:'text/html',body:new URL(r.request().url()).searchParams.get('modo')==='caixas'?kits:catalog}));
  await page.route('**/products/stock-mixed',r=>r.fulfill({contentType:'text/html',body:detail}));
  await page.route('**/products/stock-direct',r=>r.fulfill({contentType:'text/html',body:directHTML}));
  await page.route('**/products/stock-restored',r=>r.fulfill({contentType:'text/html',body:restored}));
  await page.route('**/stock-home',r=>r.fulfill({contentType:'text/html',body:home}));
  await page.goto(base+'/collections/all?view=descobrir');
  await page.locator('[data-discovery-status][data-complete=true]').waitFor();
  const cards=page.locator('[data-discovery-results] .vm-product-card');
  assert.equal(await cards.count(),6,'zero stock must not disappear from the catalog');
  for(const title of ['Vinho 91','Vinho 92','Vinho 95']){
   const card=cards.filter({has:page.locator('h3',{hasText:title})});
   assert.ok(await card.locator('.vm-stock-ribbon').isVisible());
   assert.equal(await card.locator('button[type=submit]').count(),0);
   assert.ok(await card.locator('.vm-card-title').isVisible());
  }
  for(const title of ['Vinho 93','Vinho 94','Vinho 96'])assert.equal(await cards.filter({has:page.locator('h3',{hasText:title})}).locator('.vm-stock-ribbon:visible').count(),0);
  await page.goto(base+'/collections/all?view=descobrir&disponivel=1');
  await page.locator('[data-discovery-status][data-complete=true]').waitFor();
  assert.equal(await page.locator('[data-discovery-results] .vm-product-card').count(),3);
  await page.goto(base+'/stock-home');
  assert.equal(await page.locator('#boas-compras .vm-product-card').count(),6,'home shelf retains exhausted wines');
  await page.goto(base+'/products/stock-direct');
  assert.ok(await page.locator('[data-product-stock-ribbon]').isVisible());
  assert.ok(await page.locator('[data-product-submit]').isDisabled());
  await page.locator('#videira-product-form').dispatchEvent('submit');assert.equal(addCalls,0);
  await page.locator('#variant-select').selectOption('962');
  assert.ok(await page.locator('[data-product-stock-ribbon]').isHidden());
  assert.ok(await page.locator('[data-product-submit]').isEnabled());
  // A pending add for an available variant must not re-enable a zero-stock choice.
  holdAdd=true;const heldRequest=new Promise(resolve=>notifyAdd=resolve);
  await page.locator('[data-product-submit]').click();await heldRequest;
  await page.locator('#variant-select').selectOption('960');releaseAdd();holdAdd=false;
  await page.waitForFunction(()=>!document.querySelector('[data-product-submit]').hasAttribute('aria-busy'));

  assert.ok(await page.locator('[data-product-stock-ribbon]').isVisible());
  assert.ok(await page.locator('[data-product-submit]').isDisabled());
  await page.goto(base+'/products/stock-mixed');
  assert.equal(await page.locator('#variant-select').inputValue(),'962','default variant must have positive or untracked stock');
  await page.goto(base+'/products/stock-restored');
  assert.ok(await page.locator('[data-product-stock-ribbon]').isHidden());
  assert.ok(await page.locator('[data-product-submit]').isEnabled());
  await page.goto(base+'/collections/all?view=descobrir&modo=caixas');
  await page.locator('[data-discovery-status][data-complete=true]').waitFor();
  const box=page.locator('[data-discovery-results] [data-kit-card]');
  await box.locator('[data-kit-variant]').selectOption('960');
  assert.ok(await box.locator('[data-kit-stock-ribbon]').isVisible());
  assert.ok(await box.locator('button[type=submit]').isDisabled());
  await box.locator('[data-kit-variant]').selectOption('962');
  assert.ok(await box.locator('[data-kit-stock-ribbon]').isHidden());
  assert.ok(await box.locator('button[type=submit]').isEnabled());
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await page.close();
  console.log('PASS stock '+width+': tracked zero/negative stays visible; overselling blocked; untracked zero available; variants, restock, kits and availability filter consistent');
 }
} finally {await browser.close();}
