# Videira Vinhoteca · Shopify

Tema publicado pelo repositório Guilhsxzd12/TestevBLACK. Fundo branco, cabeçalho preto, faixa preta/dourada, identidade bordô/dourado e logotipo original preservado. Fontes Lexend e Playfair Display.

## Compra e carrinho

Os cards têm quantidade, conteúdo da garrafa, nome, produtor, uvas, região, país, favoritos e botão com ícone de carrinho. Adicionar inclui as unidades reais usando `/cart/add.js`, atualiza o contador e confirma a inclusão sem navegar ou abrir pop-up. O aviso oferece Ver carrinho. Comprar agora na página individual mantém o fluxo para o carrinho. Estoque, variantes e regras de quantidade continuam nativos.

O carrinho apresenta os preços originais e finais fornecidos pela Shopify, descontos por produto, subtotal original, desconto total e subtotal com desconto. A economia exibida vem dos valores nativos, sem inferir um desconto que não tenha sido aplicado.

## Caixas e kits

Vitrine: `/collections/all?view=descobrir&modo=caixas`.

O campo real do lojista é **`custom.caixa`**, tipo **Número inteiro**, confirmado no produto Terroir Chardonnay com valor 6. O leitor prioriza esse campo e também aceita aliases como quantidade_caixa, quantidade_por_caixa e unidades_por_caixa, além de nomes numéricos de caixa encontrados no namespace custom. O tema não cria outro campo nem altera os dados dos produtos.

Para vinhos de preço unitário, uma caixa com seis garrafas envia quantity=6; duas enviam quantity=12. Produtos já cadastrados como Kit/Caixa, ou com custom.preco_por_caixa=true, mantêm o preço do conjunto sem multiplicação duplicada. A vitrine exibe 5% somente quando a caixa contém pelo menos seis unidades e a compra envia no mínimo seis unidades nativas. Comprar duas caixas de três não anuncia desconto na vitrine. O valor total aparece no botão com o ícone de carrinho.

A regra automática do lojista na Shopify é a autoridade financeira. Foi verificado em sessão anônima, limpa ao final: cinco garrafas de R$49 não têm desconto; seis totalizam R$279,30; seis de R$49,90 totalizam R$284,46. O arredondamento da vitrine acompanha o desconto por unidade observado no carrinho real. A regra da Shopify atualmente é por quantidade de itens, inclusive unidades avulsas; restringi-la ao contexto exclusivo de caixa requer configuração no backend da Shopify. O tema não altera essa regra.

## Exploração, favoritos e produtos

- Países e harmonizações leem os metacampos reais e percorrem todas as páginas da coleção. Exemplos: `?view=descobrir&pais=Argentina` e `?view=descobrir&harmonizacao=pizzas`.
- Harmonizações são deslizantes por toque, trackpad ou teclado, sem setas. As imagens originais usam viewports SVG que excluem os textos e linhas embutidos.
- Favoritos: `?view=descobrir&modo=favoritos`. Persistem neste navegador, com contador, remoção e opção de limpar a lista.
- A ficha técnica usa grau alcoólico/sem álcool, amadurecimento, uvas ou blends, harmonização, aromas, paladar e visual. Campos vazios não geram dados inventados.
- Pontuações, selos de premiação e diretório de críticos foram removidos. Endereços antigos redirecionam ao catálogo normal. Os metacampos do lojista não foram apagados.
- O item Onde estamos e a seção correspondente foram removidos. O rodapé pode continuar indicando Foz do Iguaçu – PR e atendimento online como informação de contato.
- A newsletter confirma sucesso somente quando o formulário nativo de cliente é aceito pela Shopify. O app de envio de e-mails é configurado separadamente pelo lojista.

## Instalação e validação

`python scripts/package-theme.py` gera downloads/teste-videira-shopify.zip. Inclui apenas pastas de tema, com templates JSON, schemas e referências validados por `python tests/validate-theme.py`.

Testes com LiquidJS/Chromium:

- render-checks.mjs: nove templates, metacampos, blends, estados da newsletter, leitura de aliases de caixa, resumo de descontos e ausência das seções removidas.
- cart-add.mjs: inclusão sem navegação, ícone, contador, link acessível para o carrinho, erro de estoque e dimensões estáveis.
- favorites-boxes.mjs: favoritos persistentes, variantes, caixas reais, kits com preço próprio, regras de quantidade, limite de estoque e arredondamento.
- discovery.mjs: país e comida com paginação, resultado vazio e recuperação após erro.
- product-reference.mjs / menu-reference.mjs: produto sem selos de pontuação, menu e banners responsivos.
- theme-regressions.mjs: vitrines, carrinho, filtros, navegação, newsletter e ficha técnica.

Capturas boxes/favorites usam catálogo sintético local e não alteram produtos da loja. Capturas add-to-cart-card e a prévia usam snapshot do catálogo público. Recursos visuais e fontes estão documentados em assets/media-credits.txt.
