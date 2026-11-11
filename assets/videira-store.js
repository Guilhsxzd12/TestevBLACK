(() => {
 const initialize=(scope=document)=>scope.querySelectorAll('[data-banner-slider]').forEach(slider=>{
  if(slider.dataset.ready)return;slider.dataset.ready='true';
  const slides=[...slider.querySelectorAll('[data-banner-slide]')],dots=[...slider.querySelectorAll('[data-banner-dot]')];
  if(slides.length<2)return;
  const media=matchMedia('(prefers-reduced-motion: reduce)');let index=0,timer,startX=0,startY=0,dragging=false,suppressClick=false;
  const show=number=>{index=(number+slides.length)%slides.length;slides.forEach((slide,i)=>slide.hidden=i!==index);dots.forEach((dot,i)=>dot.setAttribute('aria-pressed',String(i===index)));};
  const stop=()=>clearInterval(timer);
  const start=()=>{stop();if(slider.dataset.autoplay!=='false'&&!media.matches&&!document.hidden)timer=setInterval(()=>{if(!slider.isConnected){stop();return;}show(index+1);},5000);};
  dots.forEach(dot=>dot.addEventListener('click',()=>{show(Number(dot.dataset.bannerDot));start();}));
  slider.querySelectorAll('img,a').forEach(el=>el.draggable=false);
  slider.addEventListener('pointerdown',event=>{if(!event.isPrimary||event.button>0)return;startX=event.clientX;startY=event.clientY;dragging=true;suppressClick=false;stop();});
  slider.addEventListener('pointerup',event=>{if(!dragging)return;dragging=false;const dx=event.clientX-startX,dy=event.clientY-startY;if(Math.abs(dx)>40&&Math.abs(dx)>Math.abs(dy)*1.25){show(index+(dx<0?1:-1));suppressClick=true;}start();});
  slider.addEventListener('pointercancel',()=>{dragging=false;start();});
  slider.addEventListener('pointerleave',()=>{if(dragging){dragging=false;start();}});
  slider.addEventListener('click',event=>{if(suppressClick){event.preventDefault();event.stopPropagation();suppressClick=false;}},true);
  slider.addEventListener('mouseenter',stop);slider.addEventListener('mouseleave',start);slider.addEventListener('focusin',stop);slider.addEventListener('focusout',event=>{if(!slider.contains(event.relatedTarget))start();});
  document.addEventListener('visibilitychange',()=>document.hidden?stop():start());media.addEventListener('change',start);show(0);start();
 });
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>initialize());else initialize();document.addEventListener('shopify:section:load',e=>initialize(e.target));
})();
// Favorites persist on this browser and use a complete catalog page.
(()=>{
 const key='videira-favorites-v1';let favorites=[];
 const read=()=>{try{const data=JSON.parse(localStorage.getItem(key)||'[]');favorites=Array.isArray(data)?data.filter(p=>p&&typeof p.id==='string'&&typeof p.title==='string'&&typeof p.url==='string'&&p.url.startsWith('/products/')).slice(0,100):[];}catch{favorites=[];}};
 const update=()=>{document.querySelectorAll('[data-favorite]').forEach(b=>{const active=favorites.some(p=>p.id===b.dataset.productKey);b.setAttribute('aria-pressed',String(active));b.setAttribute('aria-label',(active?'Remover dos favoritos: ':'Favoritar ')+b.dataset.favoriteTitle);});document.querySelectorAll('[data-favorites-count]').forEach(el=>{el.textContent=String(favorites.length);el.hidden=!favorites.length;});};
 const publish=()=>{update();document.dispatchEvent(new CustomEvent('videira:favorites-change'));};
 window.VideiraFavorites={get:()=>favorites.map(p=>({...p})),refresh:update,clear:()=>{favorites=[];try{localStorage.setItem(key,'[]');}catch{}publish();}};read();
 document.addEventListener('click',e=>{if(e.target.closest('[data-favorites-clear]')){window.VideiraFavorites.clear();return;}const b=e.target.closest('[data-favorite]');if(!b)return;const id=b.dataset.productKey;if(!id)return;favorites=favorites.some(p=>p.id===id)?favorites.filter(p=>p.id!==id):[...favorites,{id,title:b.dataset.favoriteTitle,url:b.dataset.favoriteUrl}].slice(-100);try{localStorage.setItem(key,JSON.stringify(favorites));}catch{}publish();});
 window.addEventListener('storage',e=>{if(e.key===key||e.key===null){read();publish();}});window.addEventListener('pageshow',()=>{read();publish();});document.addEventListener('shopify:section:load',update);
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',update);else update();
})();
// Announcement messages rotate one at a time, never as a continuous marquee.
(() => {
 const setup=(scope=document)=>scope.querySelectorAll('[data-store-announcements]').forEach(bar=>{
  if(bar.dataset.ready)return;bar.dataset.ready='true';const messages=[...bar.querySelectorAll('[data-store-message]')];if(messages.length<2)return;let index=0,timer;
  const stop=()=>clearInterval(timer),start=()=>{stop();if(document.hidden)return;timer=setInterval(()=>{if(!bar.isConnected){stop();return;}messages[index].hidden=true;index=(index+1)%messages.length;messages[index].hidden=false;},4500);};
  bar.addEventListener('mouseenter',stop);bar.addEventListener('mouseleave',start);document.addEventListener('visibilitychange',()=>document.hidden?stop():start());start();
 });
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setup());else setup();document.addEventListener('shopify:section:load',e=>setup(e.target));
})();
// Native Shopify confirmation is authoritative; no simulated subscription success.
(() => {
 const feedback=scope=>{const message=scope.querySelector('[data-newsletter-success],[data-newsletter-error]');if(message){message.scrollIntoView({block:'center',behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});message.focus({preventScroll:true});}};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>feedback(document));else feedback(document);document.addEventListener('shopify:section:load',e=>feedback(e.target));
 document.addEventListener('submit',event=>{if(event.defaultPrevented||!event.target.matches('.vm-newsletter-form'))return;const button=event.target.querySelector('button[type="submit"]');if(button){button.disabled=true;button.textContent='ENVIANDO…';event.target.setAttribute('aria-busy','true');}});
 window.addEventListener('pageshow',event=>{if(!event.persisted)return;document.querySelectorAll('.vm-newsletter-form[aria-busy]').forEach(form=>{form.removeAttribute('aria-busy');const button=form.querySelector('button[type="submit"]');if(button){button.disabled=false;button.textContent='INSCREVER';}});});
})();
// Storefront reference: quantities, accessible drawer, origin/brand rows and footer.
(() => {
 const setup=(scope=document)=>{
  scope.querySelectorAll('[data-horizontal-carousel]').forEach(el=>{
   if(el.dataset.rowReady)return;el.dataset.rowReady='true';const row=el.querySelector('[data-row-track]'),prev=el.querySelector('[data-row-prev]'),next=el.querySelector('[data-row-next]');
   const update=()=>{if(!prev||!next||!row)return;prev.disabled=row.scrollLeft<2;next.disabled=row.scrollLeft+row.clientWidth>=row.scrollWidth-2;};
   const move=n=>row.scrollBy({left:n*row.clientWidth*.8,behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});
   if(!row)return;if(!prev||!next)return;prev.addEventListener('click',()=>move(-1));next.addEventListener('click',()=>move(1));row.addEventListener('scroll',update,{passive:true});new ResizeObserver(update).observe(row);new MutationObserver(update).observe(row,{childList:true});update();
  });
  const media=matchMedia('(max-width:760px)');scope.querySelectorAll('[data-footer-group]').forEach(el=>{el.open=!media.matches;});
 };
 let cartUpdateTimer;
 document.addEventListener('change',e=>{
  if(!e.target.matches('.vm-cart-quantity input'))return;
  const form=e.target.form;if(!form)return;clearTimeout(cartUpdateTimer);
  cartUpdateTimer=setTimeout(()=>{if(!form.isConnected||!form.reportValidity())return;form.setAttribute('aria-busy','true');form.requestSubmit(form.querySelector('[name="update"]'));},450);
 });
 document.addEventListener('click',e=>{
  const button=e.target.closest('[data-quantity-step]');if(!button)return;
  const group=button.closest('.vm-quantity'),input=group?.querySelector('input');if(!input)return;
  const min=Number(input.min||1),max=input.max?Number(input.max):Infinity,step=Number(input.step||1);
  const current=Number.isFinite(input.valueAsNumber)?input.valueAsNumber:min;
  const next=Math.min(max,Math.max(min,Math.round((current+Number(button.dataset.quantityStep)*step)*1000)/1000));
  input.value=String(next);input.dispatchEvent(new Event('input',{bubbles:true}));input.dispatchEvent(new Event('change',{bubbles:true}));
 });
 let lastFocus;
 const drawerSetup=()=>{const shell=document.getElementById('vn-mobile'),toggle=document.querySelector('[data-menu-toggle]');if(!shell||shell.dataset.drawerReady)return;shell.dataset.drawerReady='true';const panel=shell.querySelector('.vm-menu-panel');
  const close=()=>{shell.hidden=true;toggle.setAttribute('aria-expanded','false');lastFocus?.focus();};
  shell.querySelectorAll('[data-menu-close]').forEach(b=>b.addEventListener('click',close));
  const sync=()=>{document.body.classList.toggle('vm-menu-is-open',!shell.hidden);if(!shell.hidden){lastFocus=toggle;panel.querySelector('a,button').focus();}};new MutationObserver(sync).observe(shell,{attributes:true,attributeFilter:['hidden']});
  shell.addEventListener('keydown',e=>{if(e.key!=='Tab')return;const focusable=[...panel.querySelectorAll('a[href],button:not(:disabled),summary')].filter(el=>el.getClientRects().length);const first=focusable[0],last=focusable.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}});
 };
 const run=()=>{setup();drawerSetup();};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();document.addEventListener('shopify:section:load',e=>{setup(e.target);drawerSetup();});
 matchMedia('(max-width:760px)').addEventListener('change',()=>{document.querySelectorAll('[data-footer-group]').forEach(el=>el.open=!matchMedia('(max-width:760px)').matches);const shell=document.getElementById('vn-mobile');if(shell&&!matchMedia('(max-width:760px)').matches){shell.hidden=true;document.querySelector('[data-menu-toggle]')?.setAttribute('aria-expanded','false');}});
})();
matchMedia('(min-width:1024px)').addEventListener('change',event=>{if(!event.matches)return;const panel=document.getElementById('vn-mobile');if(panel)panel.hidden=true;document.querySelector('[data-menu-toggle]')?.setAttribute('aria-expanded','false');document.body.classList.remove('vm-menu-is-open');});
