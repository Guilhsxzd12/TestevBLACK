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

Revisão final: Chromium em 390, 820 e 1440 px verificou posição esquerda da logo, ausência de compra WhatsApp, banner automático/gesto horizontal/indicadores sem setas, categorias nativas incluindo Frisante, cards e carrinho. Os testes Liquid validaram listas de duas uvas, metacampos portugueses, ausência de amadurecimento vazio e grau zero exibido como Sem álcool. A leitura técnica continua condicionada aos valores cadastrados nos produtos.

Conferência na loja: o campo de blend é `custom.blends`, do tipo texto com várias linhas. Foi acrescentado à leitura com prioridade sobre uva única e teste de duas uvas separadas por quebra de linha. As categorias Espumante e Frisante retornaram 5 e 2 produtos na conferência pública da loja.

Revisão de alinhamento e newsletter: medidas dos cards preservadas em 390, 820 e 1440 px. Preço e compra foram comparados por coordenadas em cards com nomes e regiões de tamanhos diferentes. Foram verificadas a tipografia padronizada e a alternância de uma mensagem superior por vez. A fixture testou cadastro aceito, erro de servidor e e-mail inválido, com mensagem de sucesso somente no estado aceito. Não foram cadastrados contatos ou enviados e-mails na loja real durante os testes.

Produto Mistral: fonte conferida ao vivo via CSS e navegador: título Playfair Display 600/30px no celular; textos Lexend. Selos opcionais testados com texto, lista, ausência e conteúdo escapado. Formulário de compra único, seletor nativo, estoque e limites mantidos. Capturas product-reference usam dados de demonstração locais.

Menu e banner: `tests/menu-reference.mjs` confere layout em 390/820/1440, destaques, categoria Frisante, fechamento por Escape, retorno de foco e links de âncora. Verifica arquivos responsive de banner e renderização sem recorte. `tests/product-reference.mjs` também verifica 750 ml sem overflow e ícones em cor uniforme.
