# Videira Vinhoteca · TestevBLACK

Tema Shopify com estrutura de loja baseada na referência Mistral e identidade Videira: **somente fundo branco, bordô e dourado, sem modo escuro e sem fundo creme**. A logo original foi preservada e centralizada no celular.

## Instalar

Conecte [Guilhsxzd12/TestevBLACK](https://github.com/Guilhsxzd12/TestevBLACK), branch `main`, à biblioteca de temas da Shopify ou importe [o ZIP](downloads/teste-videira-shopify.zip). A aplicação depende da sincronização e seleção do tema na loja; o assistente não publica o tema na Shopify.

## Comportamento

- O ícone do carrinho abre a página **Meu carrinho**. Adicionar um produto também leva a essa página; o painel antigo foi removido.
- Banners têm artes diferentes para PC e celular. A arte móvel foi recomposta para uma proporção mais baixa, evitando o banner alto da versão anterior.
- Busca, menus, filtros, favoritos locais, carrosséis, preços, variantes e estoque continuam integrados aos produtos da Shopify.
- Descrição do vinho visível, **FICHA TÉCNICA** expansível com ícones dourados e harmonizações abaixo.
- O emblema flutuante reCAPTCHA foi ocultado visualmente; a proteção não foi desativada. A newsletter exibe os links obrigatórios de privacidade/termos do Google. Desafios de segurança continuam disponíveis quando exigidos pelo provedor.

## Adicionar logos

No editor Shopify, abra **Videira · Loja**:

1. **Logo da vitrine principal** e **Logo da vitrine de novidades**: imagens opcionais acima dos títulos, que permanecem visíveis.
2. Adicione blocos **Produtor com logo** com nome, imagem e link. Ao configurar blocos, cadastre todos os produtores que deseja exibir nessa faixa. Sem blocos, a lista continua usando os fornecedores do catálogo.
3. Para uma logo de produtor também nos cards, crie em **Configurações → Dados personalizados → Produtos** o metacampo `custom.producer_logo`, tipo **Arquivo**, restrito a imagens. Preencha-o nos produtos desejados. O alias `custom.brand_logo` também é aceito. A logo é opcional e aparece junto do nome do produtor.

## Preencher a ficha técnica

Em **Dados personalizados → Produtos**, use estes metacampos no namespace `custom`. Crie-os como texto e preencha somente as informações conhecidas de cada vinho:

| Chave | Informação |
| --- | --- |
| `visual` | Visual |
| `aromas` | Aromas |
| `palate` | Paladar |
| `tasting_notes` | Notas de degustação |
| `aging` | Envelhecimento |
| `alcohol` | Teor alcoólico, por exemplo `13%` |
| `country` | País |
| `region` | Região |
| `grape` | Uva |
| `vintage` | Safra |
| `volume` | Volume |
| `serving_temperature` | Temperatura de serviço |
| `pairing` | Harmonizações, exibidas abaixo da ficha |

Campos vazios não geram linhas vazias. Produtor e tipo vêm do cadastro normal do produto. A descrição usa o campo de descrição original da Shopify; o tema não inventa dados técnicos.

## Conferir

- [Celular](docs/preview-mobile.png) e [PC](docs/preview-desktop.png).
- [Carrinho no celular](docs/cart-390.png) e [ficha técnica](docs/product-technical-390.png).
- [Design](docs/design.md), [validação](docs/validacao.md) e [testes](tests/README.md).

As capturas usam um servidor de teste e um retrato do catálogo público Videira. As informações técnicas demonstrativas pertencem ao produto de teste e não são gravadas nos produtos reais. Pagamento, frete e newsletter reais precisam ser conferidos na prévia Shopify. O ZIP contém apenas arquivos de tema.
