import assert from 'node:assert/strict';
import {readFile, mkdir, writeFile} from 'node:fs/promises';
process.env.RENDER_ONLY = '1';
const {renderPage, renderSection, globals} = await import('./fixture-server.mjs');
const pages = ['index','collection','product','cart','search','404','page','list-collections'];
const count = Number(process.env.PRODUCT_COUNT ?? 6);
const metadata = process.env.PRODUCT_METADATA !== 'false';
await mkdir(new URL('./artifacts/', import.meta.url), {recursive:true});
for (const type of pages) {
  const html = await renderPage(type);
  assert.ok(html.includes('videira-storefront.css'), type);
  assert.ok(html.includes('class="zip-header vn-header vm-header"'), type);
  assert.ok(html.includes('name="q"'), type);
  assert.ok(html.includes('id="vn-mobile"'), type);
  assert.ok(html.includes('instagram.com/videiravinhoteca/'), type);
  assert.equal((html.match(/<h1[ >]/g) || []).length, 1, type + ': um título principal');
  assert.equal(html.includes('undefined'), false, type);
  assert.equal(/{[{%]/.test(html.replace(/<script[\s\S]*?<\/script>/g,'')), false, type + ': Liquid não resolvido');
  if (type === 'index') {
    assert.ok(html.includes('mi-categories'));
    assert.equal(html.includes('id="selecao"'), count > 0);
    assert.ok(html.includes('id="paises"'));
    assert.equal((html.match(/<section class="mi-categories"[^>]*><div>([\s\S]*?)<\/div>/)?.[1].match(/<a /g)||[]).length,5);
    if(count>0) assert.ok(html.includes('vm-product-card'));

  }
  if(type === 'collection') {
    assert.equal(html.includes('class="sf-catalog-search"'), false);
    assert.equal((html.match(/class="zip-search vm-search"/g)||[]).length,1);
  }
  if(type === 'product') {
    assert.ok(html.includes('data-product-variants'));
    assert.ok(html.includes('data-product-submit'));
    assert.ok(html.includes('name="id"'));
    assert.ok(html.includes('data-shopify-add'));
  }
  await writeFile(new URL(`./artifacts/${type}.html`, import.meta.url), html);
}
const noFilterContext=globals('collection');noFilterContext.collection={...noFilterContext.collection,filters:[]};const noFilters=await renderSection('main-collection',noFilterContext);assert.equal(noFilters.includes('class="nv-catalog-sidebar"'),false);
const accountContext = globals('index');
accountContext.shop.customer_accounts_enabled = true;
const header = await renderSection('videira-header', accountContext, {announcement:''});
assert.ok(header.includes('href="/account"'));
assert.equal(header.includes('nv-announcement'), false);
const card = await readFile(new URL('../snippets/product-card.liquid',import.meta.url),'utf8');
assert.ok(card.includes('card_variant.id'));
assert.ok(card.includes('product.selected_or_first_available_variant'));
assert.ok(card.includes('product.compare_at_price > product.price'));
console.log(`PASS render: ${pages.length} páginas, products=${count}, metadata=${metadata}; conta, faixa opcional e compra nativa.`);
// Optional shelf and producer logos are merchant-controlled, not fabricated.
const logo={src:'/assets/videira-logo.svg'};
const branded=await renderSection('videira-storefront',globals('index'),{featured_logo:logo},[{type:'producer',settings:{name:'Produtor de teste',logo,link:'/collections/all'}}]);
assert.ok(branded.includes('vm-shelf-logo') || count===0);
assert.ok(branded.includes('vm-producer-tile'));
assert.ok(branded.includes('Produtor de teste'));
const productContext=globals('product');
const productHTML=await renderSection('main-product',productContext);
assert.ok(productHTML.includes('pd-description'));
assert.ok(productHTML.includes('pd-technical-panel'));
if(!metadata)assert.equal(productHTML.includes('<h3>Visual</h3>'),false);
assert.equal(productHTML.includes('data-cart-dialog'),false);
console.log('PASS optional logos, description and technical data without fabricated fields');
