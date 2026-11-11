# Validação da revisão branca

- 50 verificações estruturais de schemas, JSON, referências, Instagram e integridade da logo.
- 32 renderizações: oito páginas em quatro cenários de catálogo e metadados; testes de logos opcionais e ausência de informação técnica inventada.
- Chromium real em 1440 e 390 px, sem erros JavaScript, imagens quebradas ou rolagem horizontal.
- HTML e corpo brancos mesmo com a preferência antiga de modo escuro gravada; ausência do seletor de tema e do diálogo de carrinho.
- Logo centralizada no celular; arte móvel correta e altura do banner limitada por dispositivo.
- Carrinho: clique abre `/cart`; compra de duas unidades de R$ 49 redireciona à página com total R$ 98; variantes indisponíveis desabilitam compra; duas unidades de variante a R$ 120 totalizam R$ 240.
- Descrição fora do acordeão, ficha inicialmente fechada, ícones dourados, expansão/recolhimento e harmonizações.
- Banners, indicadores, pausa, menus, filtros, favoritos e carrosséis preservados.
- Emblema reCAPTCHA ocultado e divulgação com links Google presente; não foi desativada a proteção do provedor.

A fixture simula os endpoints Shopify. Frete, pagamento, inscrições reais e configuração da loja exigem conferência na prévia Shopify. Não houve publicação direta na loja. Os dados técnicos dos testes são demonstrativos e não são adicionados ao catálogo real.

Revisão de logo, cards e filtros: logo em tinta bordô sem fundo; repetidos cliques em + sem alteração de largura/altura do card; controles +/− no carrinho com atualização dos totais; filtro móvel inline compacto e sem diálogo; campos de categoria Shopify e aliases de metacampos testados, com faixas de país. A prévia incorporou somente dados públicos de categoria disponíveis na própria loja; campos ausentes permanecem indicados como não informados.
