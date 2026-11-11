import assert from 'node:assert/strict';import fs from 'node:fs';
const {chromium}=await import(process.env.PLAYWRIGHT_TEST_MODULE||'playwright');process.env.RENDER_ONLY='1';
const {renderPage,globals}=await import('./fixture-server.mjs');
const base=process.env.TEST_BASE_URL||'http://127.0.0.1:8179',dir=new URL('../',import.meta.url).pathname;
const seed=globals('collection').product;
const sample=(id,title,pairing,award)=>{const p=structuredClone(seed);Object.assign(p,{id,title,has_only_default_variant:true});p.metafields.custom.pairing={value:pairing};if(award)p.metafields.custom.premiacao={type:'multi_line_text_field',value:award};return p;};
const first=[sample(901,'Pizza com James 91','Pizzas e massas','91 | James Suckling\n96 | Decanter'),sample(902,'Carnes com James 96','Carnes vermelhas','96 | James Suckling'),sample(903,'Peixes sem nota','Peixes e frutos do mar','Medalha de Ouro')];
const second=[sample(904,'Pizza da segunda página','Pizza de queijo','94 | Robert Parker')];
const render=products=>renderPage('collection.descobrir',{collection:{...globals('collection').collection,products,products_count:products.length}});
let page1=(await render(first)).replace('data-next=""','data-next="/collections/all?view=descobrir&amp;page=2"');const page2=await render(second);
const b=await chromium.launch({executablePath:process.env.BROWSER_EXECUTABLE||'/usr/bin/chromium',args:['--no-sandbox']});
try{for(const width of [390,820,1440]){
 const p=await b.newPage({viewport:{width,height:950}}),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.addInitScript(()=>localStorage.setItem('videira-age-ok','1'));
 await p.route('**/collections/all?*',route=>{const u=new URL(route.request().url());if(u.searchParams.get('view')==='descobrir')return route.fulfill({body:u.searchParams.get('page')==='2'?page2:page1,contentType:'text/html'});return route.continue();});
 await p.goto(base+'/collections/all?view=descobrir&modo=pontuacoes');await p.locator('[data-discovery-status][data-complete="true"]').waitFor();
 assert.equal(await p.locator('.vm-critic-grid>a').count(),12);assert.equal(await p.locator('[data-critic-directory]').isVisible(),true);
 await p.locator('.vm-critic-grid [data-critic-link="James Suckling"]').click();assert.equal(await p.locator('[data-discovery-results] .vm-product-card').count(),2);
 await p.locator('[name=nota]').selectOption('95-100');await p.locator('[data-discovery-filters] button').click();assert.equal(await p.locator('[data-discovery-results] .vm-product-card').count(),1);assert.ok((await p.locator('[data-discovery-results]').innerText()).includes('Carnes com James 96'),'score and critic must belong to SAME award');
 await p.locator('[name=critico]').selectOption('Decanter');await p.locator('[data-discovery-filters] button').click();assert.ok((await p.locator('[data-discovery-results]').innerText()).includes('Pizza com James 91'));
 await p.screenshot({path:dir+'docs/scores-filter-'+width+'.png',fullPage:true});
 await p.goto(base+'/collections/all?view=descobrir&harmonizacao=pizzas');await p.locator('[data-discovery-status][data-complete="true"]').waitFor();assert.equal(await p.locator('[data-discovery-results] .vm-product-card').count(),2);assert.match(await p.locator('[data-discovery-results]').innerText(),/segunda página/);assert.equal((await p.locator('[data-discovery-results]').innerText()).includes('Carnes com James 96'),false);
 await p.screenshot({path:dir+'docs/pairing-filter-'+width+'.png',fullPage:true});
 await p.goto(base+'/collections/all?view=descobrir&modo=pontuacoes&critico=Tim%20Atkin');await p.locator('[data-discovery-status][data-complete="true"]').waitFor();assert.equal(await p.locator('[data-discovery-results] .vm-product-card').count(),0);assert.match(await p.locator('[data-discovery-status]').innerText(),/Nenhum vinho/);
 assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);assert.deepEqual(errors,[]);
 await p.goto(base+'/collections/all?view=descobrir&modo=pontuacoes');await p.locator('[data-discovery-status][data-complete="true"]').waitFor();await p.screenshot({path:dir+'docs/scores-directory-'+width+'.png',fullPage:true});
 console.log('PASS discovery '+width+': paginated metadata, critic/score on same award, pizza match, empty results and directory');await p.close();
 }
 // A failed second page must not claim a complete result; retry can finish it.
 const p=await b.newPage();await p.addInitScript(()=>localStorage.setItem('videira-age-ok','1'));let fail=true;
 await p.route('**/collections/all?*',r=>{const u=new URL(r.request().url());return r.fulfill(u.searchParams.get('page')==='2'&&fail?{status:503,body:'Unavailable'}:{body:u.searchParams.get('page')==='2'?page2:page1,contentType:'text/html'});});
 await p.goto(base+'/collections/all?view=descobrir&harmonizacao=pizzas');await p.locator('[data-discovery-retry]:visible').waitFor();assert.match(await p.locator('[data-discovery-status]').innerText(),/concluir/);fail=false;await p.locator('[data-discovery-retry]').click();await p.locator('[data-discovery-status][data-complete="true"]').waitFor();assert.equal(await p.locator('[data-discovery-results] .vm-product-card').count(),2);await p.close();console.log('PASS pagination failure and retry without false complete count');
}finally{await b.close();}
