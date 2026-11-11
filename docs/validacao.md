# Validação atual

Os templates são renderizados com LiquidJS e testados com Chromium em 320/390/820/1280/1440 px. A estrutura Shopify passa pela validação de schemas, JSON, assets, referências e limite de nome das seções. JavaScript e CSS passam por análise de sintaxe.

## Comportamentos verificados

- Cards preservam suas dimensões, bordas e áreas de preço/compra; o ícone inclui produtos no carrinho e mantém a pessoa na página.
- A confirmação de inclusão tem link acessível para o carrinho, contador nativo e tratamento de erro de estoque.
- Favoritos persistem após recarga, podem ser removidos e atualizam o contador.
- Volume é lido dos metacampos, sem presumir 750 ml quando o campo está vazio.
- custom.caixa, número inteiro, foi identificado no Terroir Chardonnay como 6 unidades; aliases e busca de campos semelhantes também são testados.
- Quantidade da caixa determina a quantidade nativa: uma caixa de seis = quantity 6, duas = quantity 12. Kits com preço próprio não têm o preço multiplicado outra vez. Variantes indisponíveis e limites de quantidade são respeitados.
- A vitrine anuncia 5% somente em caixas com no mínimo seis unidades. Duas caixas de três não exibem desconto na vitrine. A regra real da Shopify continua sendo por quantidade de itens no carrinho, conforme configurado pelo lojista.
- Carrinho usa original_total_price, total_price e alocações nativas para exibir subtotal original, descontos, economia e subtotal final.
- Sessão anônima real confirmou cinco garrafas a R$49 = R$245,00 sem desconto; seis = R$279,30; seis a R$49,90 = R$284,46. Carrinhos de teste foram limpos, sem pedido ou contato criado.
- Países usam origem do produto. Pizza usa a ficha de harmonização. A consulta percorre páginas seguintes, indica carregamento incompleto e oferece tentar novamente.
- Pontuações, selos e o item/seção Onde estamos não aparecem no tema atual.
- Newsletter confirma somente o estado de sucesso retornado pela Shopify; erros não geram confirmação falsa.

As fotos e as informações de produto dos snapshots são públicas. Os exemplos de caixas, limites e variantes dos testes são locais. Nenhum produto, metacampo, desconto, pedido ou contato foi alterado no admin da Shopify.
