/* Native Shopify quantities: six bottles is quantity=6, never a fake bundle price. */
(()=>{
 const money=n=>new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(n/100);
 const gcd=(a,b)=>b?gcd(b,a%b):a;
 const initialize=(scope=document)=>scope.querySelectorAll('.vm-kit-form').forEach(form=>{
  if(form.dataset.ready)return;form.dataset.ready='true';
  const purchase=form.querySelector('[data-kit-purchase]'),boxes=form.querySelector('[data-kit-boxes]'),quantity=form.querySelector('[name=quantity]'),select=form.querySelector('[data-kit-variant]'),submit=form.querySelector('[type=submit]');if(!purchase||!boxes||!quantity||!submit)return;
  const sync=()=>{
   const variant=select?.selectedOptions[0]?.dataset||purchase.dataset,perBox=Math.max(1,Number(purchase.dataset.nativeCount)),price=Number(variant.price??purchase.dataset.unitPrice),available=variant.available!=='false',min=Math.max(1,Number(variant.min||1)),increment=Math.max(1,Number(variant.step||1)),maximum=variant.max?Number(variant.max):Infinity;
   const boxMin=Math.max(1,Math.ceil(min/perBox)),boxStep=increment/gcd(perBox,increment);boxes.min=String(Math.ceil(boxMin/boxStep)*boxStep);boxes.step=String(boxStep);if(Number.isFinite(maximum))boxes.max=String(Math.floor(maximum/perBox));else boxes.removeAttribute('max');
   let count=Math.max(Number(boxes.min),Number(boxes.value)||Number(boxes.min));count=Math.ceil(count/boxStep)*boxStep;if(Number.isFinite(maximum))count=Math.min(count,Math.max(Number(boxes.min),Math.floor(maximum/perBox)));boxes.value=String(Math.max(0,count));
   const native=count*perBox;quantity.value=String(native);const gross=price*native,rate=Number(purchase.dataset.caseSize)>=Number(purchase.dataset.threshold)&&perBox>=Number(purchase.dataset.threshold)?Number(purchase.dataset.discount)||0:0,total=(price-Math.floor(price*rate/100))*native;
   form.querySelector('[data-kit-total]').textContent=money(total);const compare=form.querySelector('[data-kit-compare]');compare.textContent=money(gross);compare.hidden=rate<=0;form.querySelector('[data-kit-saving]').textContent=rate?`${rate}% OFF · desconto automático`:'Valor total';
   const valid=native>=min&&native>0&&native%increment===0&&native<=maximum;submit.disabled=!available||!valid;form.querySelector('[data-kit-buy-label]').textContent=!available?'Esgotado':!valid?'Quantidade indisponível':`Adicionar · ${money(total)}`;
  };
  boxes.addEventListener('input',sync);boxes.addEventListener('change',sync);select?.addEventListener('change',sync);sync();
 });
 window.VideiraKits={initialize};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>initialize());else initialize();document.addEventListener('shopify:section:load',e=>initialize(e.target));
})();
