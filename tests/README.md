# Testes

Instale as dependências com `npm ci` nesta pasta.

- `python3 validate-theme.py`: schemas, JSON, assets, snippets e integridade da logo.
- `npm test`: oito páginas renderizadas com LiquidJS. Repita com `PRODUCT_COUNT=0 PRODUCT_METADATA=false`, `PRODUCT_COUNT=1 PRODUCT_METADATA=false`, `PRODUCT_COUNT=6 PRODUCT_METADATA=false` e `PRODUCT_COUNT=6 PRODUCT_METADATA=true`.
- `REAL_CATALOG=1 node fixture-server.mjs`: servidor local com fotografia pública do catálogo.
- `python3 download-preview-images.py`: baixa as fotografias da demonstração.
- `REAL_CATALOG=1 node build-preview.mjs`: gera a prévia e o HTML independente.
- `npm run test:browser`: Playwright, com o servidor de fixture iniciado em 8179 e fotografias disponíveis. Configure `BROWSER_EXECUTABLE` se necessário.

Os testes não substituem a prévia na Shopify e um pedido real de teste. `scripts/package-theme.py` gera o ZIP somente com as pastas do tema.
