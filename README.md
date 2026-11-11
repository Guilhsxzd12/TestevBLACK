# Videira Vinhoteca · TestevBLACK

Tema Shopify com estrutura de loja baseada na referência Mistral e identidade Videira: **somente fundo branco, bordô e dourado, sem modo escuro e sem fundo creme**. A forma original da logo foi preservada, aplicada em bordô sobre fundo transparente e à esquerda, ao lado do menu, em celular, tablet e computador.

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

## Cards, quantidade e filtros

Os cards mostram bodega, uva e região, com uma faixa de país colorida por origem. País e uvas leem tanto metacampos `custom` quanto os campos de categoria nativos `shopify.country` e `shopify.grape-variety`, inclusive referências/listas. Região também aceita `custom.regiao` e `custom.regi_o`. Quando a uva está no próprio título, ele pode ser usado como alternativa. Uma região explicitamente declarada na descrição também pode ser aproveitada. Dados não existentes ficam como “Não informada”; o tema não atribui países a partir da bodega.

Os botões +/− dos cards têm tamanho fixo e não deslocam o card. No carrinho, +/− atualiza a página e o subtotal após uma breve pausa entre os cliques, usando o formulário nativo Shopify. O botão Atualizar carrinho continua disponível.

No celular, Filtrar abre um painel compacto dentro da página, com grupos recolhíveis. Não existe mais diálogo/modal de filtros ou fundo escurecido. Os filtros laterais continuam disponíveis no computador.

## Navegação, banners e ficha técnica atual

- Compra somente pelo site: os botões “Comprar no WhatsApp” foram removidos dos produtos. Os contatos de atendimento permanecem no cabeçalho/rodapé.
- Banner com troca automática a cada cinco segundos, indicadores e gesto horizontal de deslizar; sem setas ou botão de pausa no banner. A preferência de redução de movimento do dispositivo é respeitada.
- Espumante e Frisante usam filtros nativos de categoria. Os valores atuais da própria loja foram conferidos para garantir links funcionais; consultas técnicas não aparecem nos campos de busca.
- Logo sempre à esquerda, ao lado do ícone de menu. Layout validado em 390, 820 e 1440 px.
- Ficha técnica: **Grau alcoólico**, **Amadurecimento** (quando preenchido), **Uvas**, **Harmonização**, **Aromas**, **Paladar** e **Visual**. Valor zero ou indicação explícita exibe **Sem álcool**.
- A leitura aceita nomes de metacampos em português e inglês. As listas de uvas têm prioridade sobre um campo antigo de uva única, exibindo o blend completo. Exemplos aceitos: `custom.blends` (campo de várias linhas conferido na loja), `custom.uvas`, `custom.uvas_do_blend`, `custom.grau_alcoolico`, `custom.amadurecimento`, `custom.harmonizacao`, `custom.paladar`. Campos técnicos com outras variações de nome no namespace `custom` também são reconhecidos por suas chaves.
- País e região aparecem na página do vinho, junto da identificação da bodega. Campos ausentes não geram informações inventadas.

## Alinhamento e comunicação

Os cards mantêm suas dimensões externas. O conteúdo fica em uma área própria, enquanto preço e compra ficam ancorados em posições iguais; nomes e regiões longos não deslocam os botões. Lexend padroniza textos, campos e controles; Playfair Display identifica os títulos editoriais.

A faixa acima do cabeçalho alterna uma mensagem completa por vez: **ENVIO PARA TODO O BRASIL** e **BLACK VIDEIRA · 27 A 30 DE NOVEMBRO**. Os textos podem ser editados em **Videira · Cabeçalho → Mensagem de envio / Mensagem de campanha**.

A newsletter continua usando o formulário nativo Shopify. Após `form.posted_successfully?`, mostra **Inscrição recebida com sucesso!** e leva o foco para essa confirmação. Erros retornados pela Shopify têm um bloco separado; o tema não informa sucesso somente por clicar. O aplicativo futuro de e-mails poderá cuidar dos envios, conforme sua integração e configuração.

O rodapé mantém a estrutura aprovada, com o texto **Uma seleção de vinhos. Um mundo para descobrir.** e apresentação tipográfica revisada.

### Produto: referência Mistral e premiação

Conferido em mistral.com.br: Lexend nos textos e Playfair Display 600 no título do produto (30 px no celular). A identidade continua branco, bordô e dourado. Produtor, origem e uvas usam os dados do produto, separados por ícones e divisórias. A compra móvel tem um único formulário fixo; variantes, estoque, limites de quantidade e carrinho nativo continuam ativos.

Para o selo opcional, use um metacampo de **produto** chamado **Premiação**, namespace/chave **`custom.premiacao`**, tipo **Texto de várias linhas** (também aceita lista de textos). Uma premiação por linha: `91 | Nome do avaliador` ou `Medalha de Ouro`. O primeiro formato destaca a nota acima do nome; o segundo exibe o texto informado. Até três selos aparecem na foto e nos cards. Campo vazio não gera selo. Não há notas ou avaliadores inventados. O tema lê o campo; a definição e os valores são gerenciados no admin da Shopify.

`tests/product-reference.mjs` valida celular, tablet e desktop; as capturas `docs/product-reference-*.png` usam premiação fictícia explicitamente identificada para demonstrar o layout, sem alterar produtos da loja.

### Menu e banners da Videira

Menu móvel com a composição de referência: barra superior com fechar, conta e sacola; quatro destaques com ícones lineares; acordeão Vinhos (inclui Frisante); links separados por linhas; atendimento/localização no final. O menu ocupa toda a largura no celular e 460 px no tablet. Os destinos Pontuados e Caixas e kits podem ser configurados no editor do cabeçalho; por padrão levam ao catálogo, sem criar coleções fictícias. Categorias continuam usando filtros nativos Shopify. Links para Clube e acessórios não são inventados; podem ser incluídos pelo menu adicional quando existirem.

O segundo slide agora usa arte gerada para a Videira, em duas composições: `videira-arrivals-mobile.webp` (compacta para não aumentar o carrossel) e `videira-arrivals-desktop.webp`. A imagem usa a identidade visual verde/dourada solicitada, nome Videira e marca na caixa. `object-fit: contain` preserva texto e marca completos. A logo original do cabeçalho e rodapé continua inalterada.

Volume numérico usa ml (ex.: 750 → 750 ml); valores com unidade explícita mantêm ml/L. O selo se ajusta ao conteúdo sem corte. Ícones do resumo do produto usam desenho e dimensões próprios; a ficha técnica preserva seus ícones dourados.
