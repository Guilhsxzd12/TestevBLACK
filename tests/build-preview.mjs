import {readFile,writeFile,readdir} from 'node:fs/promises';
process.env.RENDER_ONLY='1';
const {renderPage}=await import('./fixture-server.mjs');
const root=new URL('../',import.meta.url);
let html=await renderPage('index');
html=html.replaceAll('/assets/','../assets/').replaceAll('href="/#','href="#');
html=html.replace('</head>','<script src="preview.js" defer></script></head>');
html=html.replace('<title>Videira Vinhoteca','<title>Prévia · TESTE VIDEIRA');
html=html.replace('</body>','<aside style="position:fixed;bottom:10px;right:10px;z-index:95;background:#fff;padding:8px 12px;border:1px solid #d7c9d2;border-radius:4px;font:10px/1.5 Arial,sans-serif;color:#651242">Prévia do tema · dados de referência<br>A compra real acontece na Shopify.</aside></body>');
await writeFile(new URL('docs/preview.html',root),html);
let standalone=html;
for(const match of [...html.matchAll(/<link rel="stylesheet" href="\.\.\/assets\/([^\"]+)">/g)]){
 const file=match[1],css=await readFile(new URL('assets/'+file,root),'utf8');
 standalone=standalone.replace(match[0],'<style data-source="'+file+'">'+css+'</style>');
}
for(const match of [...standalone.matchAll(/<script src="([^\"]+)" defer><\/script>/g)]){
 const src=match[1],file=src==='preview.js'?new URL('docs/preview.js',root):new URL(src.replace('../',''),root);
 standalone=standalone.replace(match[0],'<script>'+await readFile(file,'utf8')+'</script>');
}
const mime=file=>file.endsWith('.ttf')?'font/ttf':file.endsWith('.woff2')?'font/woff2':/\.jpe?g$/.test(file)?'image/jpeg':file.endsWith('.webp')?'image/webp':file.endsWith('.png')?'image/png':'image/svg+xml';
for(const file of await readdir(new URL('assets/',root))){
 if(!/\.(ttf|woff2|jpg|jpeg|webp|png|svg)$/.test(file))continue;
 if(!standalone.includes('../assets/'+file)&&!standalone.includes("url('"+file+"')")&&!standalone.includes('url("'+file+'")'))continue;
 const b=await readFile(new URL('assets/'+file,root)),encoded='data:'+mime(file)+';base64,'+b.toString('base64');
 standalone=standalone.replaceAll('../assets/'+file,encoded).replaceAll("url('"+file+"')","url('"+encoded+"')").replaceAll('url("'+file+'")','url("'+encoded+'")');
}
const catalog=JSON.parse(await readFile(new URL('tests/catalog-preview.json',root),'utf8'));
for(let i=0;i<catalog.length;i++){
 let b;try{b=await readFile(new URL('docs/images/product-'+i+'.img',root));}catch{continue;}
 const type=b[0]===137?'image/png':b.toString('ascii',8,12)==='WEBP'?'image/webp':'image/jpeg';
 standalone=standalone.replaceAll(catalog[i].image,'data:'+type+';base64,'+b.toString('base64'));
}
await writeFile(new URL('../Teste-Videira-previa.html',root),standalone);
console.log('Prévia da loja gerada: docs/preview.html e /workspace/Teste-Videira-previa.html');
