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

## Navegação no computador

Os grupos com submenu abrem ao passar o mouse (a partir de 1024 px, com ponteiro de precisão). O painel permanece aberto durante a passagem do cursor e fecha com uma pequena tolerância ao sair. Só um grupo fica aberto de cada vez. Clique, seta para baixo, Tab e Escape continuam disponíveis; o celular mantém o menu por toque. O grupo aberto, o item sob o cursor e a rota atual ficam dourados. Os links atuais usam aria-current e os grupos refletem aria-expanded. `tests/desktop-dropdown.mjs` valida notebook/PC, percurso até o painel, clique, teclado e celular.

## Editor da Shopify e carrosséis

A página inicial agora usa dez seções independentes, na mesma ordem visual: banners, atalhos, harmonizações, seleção de vinhos, boas compras, editorial de origens, novidades, países, produtores e editorial da marca. Cada uma pode ser selecionada, movida, ocultada ou removida no editor. Títulos, textos, imagens e links têm campos próprios; as vitrines permitem escolher coleção, logo, quantidade e ordem dos produtos. Os dados e preços de cada vinho continuam no cadastro de produtos da Shopify.

Em **Videira · Produtores**, cada marca aparece como um bloco identificado pelo nome. Abra o produtor e selecione **Logo do produtor**; também é possível mudar nome, link, altura das logos e exibição do nome. As marcas existentes foram mantidas. Banners, atalhos, países e pratos também têm blocos próprios com atributos nativos do editor. Selecionar um bloco fora da área visível o traz para a tela; o banner selecionado fica pausado durante a edição.

A configuração anterior foi preservada em docs/home-layout-before-index.json e a seção antiga permanece como legado, sem opção de adicioná-la novamente como uma página inteira. Coleções, imagens e blocos existentes são transferidos para as respectivas seções. Nenhum dado de produto é migrado ou alterado.

Carrosséis podem ser arrastados com mouse, sem arraste nativo das imagens nem navegação acidental após o gesto. Clique normal, botões de compra, campos e seleção por teclado continuam disponíveis. O toque usa a rolagem nativa. A barra dos produtores fica oculta, e os controles existentes têm contraste maior e estado desabilitado distinguível. `tests/editor-drag.mjs` cobre a estrutura editável, campos de logo/nome/link, pratos personalizados, arraste e ausência de overflow em notebook/PC e celular.

## Bandeiras, faixa e confirmação de idade

A faixa preta/dourada associa um símbolo a cada mensagem da loja (envio e campanha). Alterna uma mensagem completa por vez, mantendo os textos editáveis e sem anunciar benefícios não cadastrados. Países usam bandeiras grandes com cantos arredondados e nomes compactos; nome, imagem personalizada e destino seguem editáveis. Os botões de carrossel ficam ocultos até 760 px. O toque e os controles do computador continuam funcionando.

O aviso 18+ agora usa sessionStorage (`videira-age-session-v1`). Uma confirmação antiga em localStorage não impede novas sessões de exibir a pergunta. A resposta vale para a aba durante a navegação/recarregamento; uma nova sessão volta a perguntar. O editor da Shopify continua sem o bloqueio para permitir a edição. Negar mantém o aviso aberto e Escape não o dispensa. O tema mantém a opção Aviso 18+ nas configurações gerais.

`tests/mobile-country-age.mjs` valida confirmação antiga, nova sessão, continuidade entre páginas, recusa, armazenamento indisponível, editor, símbolos, bandeiras e controles responsivos.

## Monte sua caixa — campanha no Pix

A campanha ativa substitui Black Friday no banner, na chamada de navegação e na faixa do topo. O banner anuncia 5% OFF no Pix a partir de seis garrafas, com destino ao catálogo para compor a seleção. Título, chamada, desconto, pagamento, condição, botão, nota, foto e destino são editáveis no bloco do banner. O segundo slide usa a arte de novidades da Videira.

A alteração é de comunicação no tema: a aplicação do desconto e os meios de pagamento elegíveis continuam sob a regra de checkout cadastrada pelo lojista. O tema não configura uma restrição financeira a Pix nem altera a regra automática existente.

Os cinco mini banners usam fotografias próprias de ocasiões, o Malbec real da loja e descrições editáveis. O atalho Vinho e pizza mantém o filtro de harmonização de pizzas. Fotos e destinos personalizados continuam disponíveis. O recorte elíptico dos pratos exclui as sombras embutidas nas fotos, sem apagar fotos cadastradas ou interferir nos filtros.
