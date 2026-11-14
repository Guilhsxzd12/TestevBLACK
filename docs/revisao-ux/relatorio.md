# Revisão de UX e compra — Videira Vinhoteca

Data: 14/11/2026. Catálogo público analisado: 38 produtos. Identidade preservada: fundo branco, bordô/dourado, logo original, fotos dos mini banners restauradas e seções editáveis.

| Solicitação | Resultado |
| --- | --- |
| Filtros de categorias, tipos, uvas, países e produtores | Catálogo e busca unificados a partir dos mesmos fatos exibidos nos cards. Filtros combináveis, blends, disponibilidade, preços, ordenação, chips, histórico e recuperação de vazio. URLs antigas são convertidas e recarregadas sem limitar o índice aos campos de taxonomia incompletos. |
| Destaque a produtos e compra na home | Primeira vitrine antes dos atalhos. Banner mais compacto no celular, mantendo garrafas inteiras. Boas Compras agora apresenta preço e Adicionar, em vez de apenas imagens. |
| Frete na página de produto | CEP e quantidade consultam preços reais de transportadoras pela Shopify em um carrinho de cotação isolado; o carrinho do cliente permanece intacto. Não é preciso comprar nem adicionar o vinho para consultar. Prazo só é exibido se retornado pelo serviço; quando ausente, a confirmação é indicada no checkout. |
| Coleções vazias e promoções | Vitrines vazias e coleções sem produtos deixam de aparecer nas listagens. A coleção pública Promoções estava vazia. Ofertas e comparação de preço usam a variante disponível correspondente. Caixas seguem a regra financeira já cadastrada. |
| Padronização dos vinhos | Grafia de Carménère, apresentação de blends e campos em branco tratados na exibição. Há uma lista separada de 18 ajustes de cadastro que precisam de conferência e edição no admin. Dados ausentes não foram inventados. |
| Página de produto | Resumo de estilo, doçura, corpo/intensidade quando cadastrado, paladar e harmonização; ficha técnica completa acessível por link. Adicionar ao carrinho confirma e mantém o cliente no produto. Ao abrir uma caixa, a quantidade é preservada. |
| Credibilidade | CNPJ informado pelo responsável, operação exclusivamente online, contato público, página institucional e orientação para quebra, vazamento, violação e suspeita de alteração do vinho. Procedência continua vindo do país/produtor cadastrados, sem selos ou garantias fictícias. |
| Políticas e termos | Mistral, Cia do Vinho e Oda consultadas. Revisão e textos próprios preparados em politicas-revisadas.md. Os documentos oficiais usados pelo checkout precisam ser substituídos no admin; não foram sobrepostos por uma política alternativa no tema. |
| Testes | Verificações de schemas/renderização e testes de navegação em 320, 390, 820, 1280 e 1440 px conforme cada fluxo. Cobertura inclui filtros, busca, blend, paginação, URL antiga, vazio, preço, favoritos, caixas, estoque, carrinho, cotação e falhas. A compra real não é concluída durante a validação. |

## Problema dos filtros identificado

O filtro nativo de país considerava somente nove produtos, enquanto os metacampos personalizados exibidos nos cards cobriam o catálogo. O novo índice reúne campos personalizados e nativos, impedindo que o cliente veja uma origem no card e perca esse mesmo vinho ao filtrar.

Entre as correções está a busca por características. Por exemplo, consultas por país, produtor, uvas de blend, harmonização e paladar deixam de depender apenas das palavras do título.

## Frete: resultado e limites reais

A consulta de um vinho para o CEP 01001-000 retornou, no teste realizado, J&T Standard por R$13,75 e Jadlog Package por R$20,85. Esses valores pertencem ao produto, quantidade e momento consultados e não são uma tabela fixa da loja.

A resposta nativa consultada não continha prazo nas descrições dessas modalidades. A página não substitui essa ausência por dias inventados. O valor total e as condições do pedido seguem sendo confirmados no checkout. O simulador não copia dados pessoais ou cupons do carrinho do cliente para a cotação independente.

## Pendências de cadastro

Confira cadastro-vinhos.csv. Os problemas incluem: dois volumes, três composições de uvas, duas regiões, duas harmonizações, cinco descrições, uma grafia de título, duas classificações sem informação no filtro nativo e um produtor a conferir. São ocorrências por campo; um produto pode aparecer em mais de uma linha.

No Terroir Cabernet Sauvignon, o fornecedor cadastrado é Ponto Nero, enquanto a descrição menciona Casa Valduga. O tema não muda esse cadastro por suposição. É necessário conferir o rótulo e o fornecedor no admin.

## Políticas e promoção de caixas

A revisão não transfere os prazos comerciais de outra empresa para a Videira. A política atualmente publicada promete devolução grátis em 14 dias; essa condição não foi reduzida automaticamente a sete dias.

O responsável informou 5% de desconto em caixas, de preferência no Pix ou crédito em uma vez. A comunicação do tema foi ajustada. A regra automática existente é a autoridade de cálculo; a preferência anunciada não cria uma restrição técnica por meio de pagamento. Uma exclusividade financeira exige configuração compatível no checkout.

A conexão disponível nesta tarefa permite editar o tema pelo repositório. Não há conexão administrativa com permissão para salvar políticas oficiais ou atualizar produtos/metacampos. Por isso, os textos revisados e a lista de correções são entregues como arquivos concretos para aplicação no admin.


## Conferência na loja publicada

O fluxo real foi concluído até a abertura do checkout, em navegador com viewport móvel e sessão anônima separada, sem enviar contato ou pagamento e sem concluir pedido:

- Catálogo carregou 38 produtos. Países: Argentina 10, Brasil 18 e Chile 10.
- Busca por Cabernet Sauvignon combinada com país Chile, produtor Becas e tipo Tinto encontrou o vinho correspondente.
- Cotação de seis unidades para 01001-000 retornou J&T Standard por R$19,06 e Jadlog Package por R$39,90 no momento da consulta.
- O carrinho permaneceu inalterado durante a cotação.
- Adicionar seis garrafas de R$49 manteve o cliente na página e atualizou o contador.
- Carrinho: R$294,00 antes do desconto, economia nativa de R$14,70 e subtotal de R$279,30. O desconto retornado pela Shopify se chama Caixa.
- O botão Finalizar compra abriu Checkout – Videira Vinhoteca. A sessão de teste foi limpa ao terminar.
- CNPJ e informação de operação online apareceram na página institucional; a primeira vitrine veio antes dos atalhos e Boas Compras apresentou preços e botões.

### Conferir dados de peso no sistema de frete

O carrinho desse teste retornou total_weight igual a zero, e os campos gramas públicos dos produtos consultados também retornaram zero. As cotações funcionaram e variaram com a quantidade, então esse dado isolado não prova que o aplicativo da transportadora está calculando incorretamente: ele pode ter configuração própria.

É necessário conferir onde estão mantidos peso e dimensões reais de garrafas, caixas e embalagem — na Shopify e/ou no aplicativo de frete. Não se deve estimar o peso bruto apenas pelo volume líquido do vinho. Essa validação é administrativa; o tema usa os valores de frete efetivamente retornados pela loja.
