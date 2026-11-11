// Apenas para o arquivo de demonstração; não é carregado pelo tema Shopify.
(() => {
  const notice = () => {
    const status = document.querySelector('[data-cart-status]');
    if (status) {
      status.textContent = 'Prévia de design: produtos e preços ilustrativos. A compra funcionará com o catálogo real na Shopify.';
      clearTimeout(window.previewNoticeTimer);
      window.previewNoticeTimer = setTimeout(() => status.textContent = '', 6000);
    }
  };
  document.addEventListener('submit', event => {
    event.preventDefault();
    event.stopImmediatePropagation();
    notice();
  }, true);
  document.addEventListener('click', event => {
    const link = event.target.closest('a');
    if (link && (link.getAttribute('href')?.startsWith('/') || link.matches('[data-cart-open]'))) {
      event.preventDefault();
      event.stopImmediatePropagation();
      notice();
    }
  }, true);
  try { localStorage.setItem('videira-age-ok', '1'); } catch {}
})();
