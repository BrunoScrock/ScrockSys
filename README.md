# ScrockSys — Portfólio de Sites, Sistemas e Design

Site profissional e comercial da **ScrockSys**: desenvolvimento de sites,
sistemas web, interfaces e design gráfico para empresas.

É um site **estático** (HTML + CSS + JavaScript), sem backend, sem PHP, sem
banco de dados e sem bibliotecas externas. Nasce pronto para rodar no
**GitHub Pages** de graça.

---

## Índice

1. [Como baixar o projeto](#1-como-baixar-o-projeto)
2. [Como abrir localmente](#2-como-abrir-localmente)
3. [Como alterar os dados](#3-como-alterar-os-dados)
4. [Como adicionar projetos](#4-como-adicionar-projetos)
5. [Como adicionar imagens](#5-como-adicionar-imagens)
6. [Como alterar o WhatsApp](#6-como-alterar-o-whatsapp)
7. [Como alterar preços](#7-como-alterar-preços)
8. [Publicar no GitHub](#8-publicar-no-github)
9. [Ativar o GitHub Pages](#9-ativar-o-github-pages)
10. [Adicionar domínio próprio](#10-adicionar-domínio-próprio)
11. [Estrutura de pastas](#11-estrutura-de-pastas)
12. [O que está pronto](#12-o-que-está-pronto)

---

## 1. Como baixar o projeto

### Opção A — pelo Git (recomendado)

```bash
git clone https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git
cd SEU-REPOSITORIO
```

### Opção B — pelo botão de download

1. Abra o repositório no GitHub.
2. Clique em **Code**.
3. Clique em **Download ZIP**.
4. Descompacte o ZIP em uma pasta no seu computador.

O projeto **não precisa** de `npm install` nem de `npm install` — não há
dependências.

---

## 2. Como abrir localmente

O site é estático, então há três formas. Qualquer uma funciona.

### Opção A — abrir o arquivo direto (mais simples)

Clique duas vezes no `index.html`. Ele abre no navegador padrão.

> **Atenção:** alguns navegadores limitam recursos por segurança quando o site
> é aberto por `file://`. Se o WhatsApp, a galeria ou os filtros parecerem
> travados, use a Opção B.

### Opção B — servidor local (recomendado para desenvolver)

**Com Python (já vem instalado no Windows e no macOS):**

```bash
# Windows
python -m http.server 8000

# macOS / Linux
python3 -m http.server 8000
```

Depois abra: **http://localhost:8000**

**Com Node.js:**

```bash
npx serve .
```

**Com Live Server (VS Code):**

Instale a extensão *Live Server*, clique com o botão direito no `index.html`
e escolha **Open with Live Server**.

### Opção C — publicar e testar online

Faça o push para o GitHub e ative o GitHub Pages (passos 8 e 9). O site fica
disponível em um endereço público.

### Como conferir se está funcionando

Ao abrir o site, verifique:

- [ ] A tela de carregamento some em poucos segundos
- [ ] O título do Hero aparece com animação, letra a letra
- [ ] O menu fixo muda de fundo ao rolar
- [ ] No celular, o botão hambúrguer abre o menu lateral
- [ ] Os cards de serviço aparecem na seção "Soluções digitais"
- [ ] Os 10 itens de "O que está incluído" aparecem
- [ ] O portfólio mostra os projetos em Bento Grid
- [ ] Os filtros de categoria funcionam
- [ ] O comparador "Antes e Depois" responde ao arrasto e ao clique
- [ ] Clicar em uma peça de design abre o lightbox
- [ ] Os valores de investimento aparecem
- [ ] O formulário valida e abre o WhatsApp

---

## 3. Como alterar os dados

**Tudo o que é editável está em um único arquivo: [`js/config.js`](js/config.js).**

Você nunca precisa mexer no `index.html` para mudar textos, preços,
projetos ou contatos.

### O que tem dentro do `config.js`

| Seção | O que configura |
| --- | --- |
| `1. IDENTIDADE` | Nome da marca, slogan, tagline, textos do Hero |
| `2. CONTATO` | WhatsApp, telefone, e-mail, redes sociais |
| `3. LOCALIZAÇÃO` | Cidade, área de atendimento, horário |
| `4. SEO / URLs` | URL do site, título e descrição para o Google |
| `5. SOBRE` | Textos da seção Sobre, estatísticas e garantias |
| `6. SERVIÇOS` | Cards de serviço (título, texto, tags, ícone) |
| `7. O QUE ESTÁ INCLUÍDO` | Os 10 itens inclusos no site |
| `8. SISTEMAS WEB` | Tipos de sistema que você desenvolve |
| `9. DIFERENCIAIS` | Diferenciais do seu trabalho |
| `10. PROCESSO` | As etapas do processo de desenvolvimento |
| `11. INVESTIMENTO` | Preços, domínio, hospedagem e observações |
| `12. PRESENÇA` | Comparação "sem site" x "com site" |
| `13. ANTES E DEPOIS` | Projetos de comparação visual |
| `14. PORTFÓLIO` | Sites, sistemas e peças de design |
| `15. WHATSAPP` | Mensagens automáticas e opções do formulário |
| `16. TEXTOS DE APOIO` | Títulos e subtítulos das seções |

### Regra dos placeholders

Todo texto que começa com `[INSERIR` é tratado pelo site como **não
configurado**: o bloco é ocultado ou o valor não aparece. Assim nada de
informação inventada chega ao visitante.

```
whatsapp: "[INSERIR WHATSAPP]"   ->  botões não abrem link quebrado
telefone: "[INSERIR TELEFONE]"   ->  linha de contato é ocultada
cidade:   "[INSERIR CIDADE]"     ->  item de contato é ocultado
```

Preencha com dados reais e o conteúdo aparece automaticamente.

### Ícones disponíveis

Os ícones são SVGs internos (sem biblioteca externa). Para usar um ícone,
informe o nome:

```
monitor, alvo, sistema, paleta, marca, ferramenta, site, celular, busca,
servicos, galeria, whatsapp, avaliacao, hospedagem, dominio, manutencao,
painel, dashboard, formulario, controle, atendimento, camadas, olho,
atualizacao, codigo, check, busca, local, relogio, email, telefone
```

---

## 4. Como adicionar projetos

### 4.1 Adicionar um site ao portfólio

Abra `js/config.js` e duplique um item dentro de `CONFIG.portfolio.sites`:

```javascript
sites: [
  {
    titulo: "INOVE Mecânica",                        // nome do projeto
    categoria: "Institucional",                       // usado pelos filtros
    imagem: "assets/images/portfolio/sites/inove-mecanica.svg",
    descricao: "Site institucional para oficina mecânica.",
    url: "#",                                        // link do site publicado
    tags: ["Institucional", "WhatsApp", "Responsivo"],
    destaque: true                                   // ocupa o card grande
  }

  // ... copie este bloco e adicione o próximo projeto aqui
]
```

**Regras:**

- `categoria` precisa ser uma das categorias já existentes, **ou** uma nova.
  Se for nova, adicione também em `CONFIG.portfolio.filtrosSites` para que o
  botão de filtro apareça.
- `url: "#"` é aceito, mas o ideal é colocar o link do site publicado.
- `destaque: true` força o tamanho grande no card.

#### Como os tamanhos do Bento são definidos

Você **não precisa** se preocupar com isso. O site calcula os tamanhos para a
grade nunca sobrar buraco, em qualquer quantidade de projetos:

| Situação | Resultado |
| --- | --- |
| Ciclo completo (5 cards) | destaque (8 colunas) + grande (4) + 3 de terço (4+4+4) |
| Sobra 1 card no fim | card largo (12 colunas) |
| Sobra 2 cards | destaque (8) + grande (4) — já fecha sozinho |
| Sobra 3 cards | 3 cards de terço (4+4+4) |
| Sobra 4 cards | 3 de terço (12) + 1 largo (12) |

Se um card marcado com `destaque: true` cair no fechamento da lista, ele vira
tamanho normal — preferimos uma grade completa a um destaque torto.

### 4.2 Adicionar uma peça de design

Duplique um item em `CONFIG.portfolio.design`:

```javascript
design: [
  {
    titulo: "Logotipo e marca",
    categoria: "Logo",                        // um dos filtros de design
    imagem: "assets/images/portfolio/design/logo-marca.svg",
    descricao: "Criação do logotipo com variações.",
    url: "#",
    tags: ["Logo", "Variações"]
  }
]
```

Categorias sugeridas para os filtros de design:
`Logo`, `Identidade Visual`, `Social Media`, `Banners`, `Material Comercial`.

### 4.3 Adicionar um sistema web

Duplique um item em `CONFIG.portfolio.sistemas`. Cards aqui são menores
(3 colunas) e ficam abaixo da seção de tipos de sistema.

### 4.4 Adicionar um projeto "antes e depois"

Duplique um item em `CONFIG.antesDepois`:

```javascript
antesDepois: [
  {
    id: "projeto-05",
    titulo: "Projeto 05 — Clínica",
    categoria: "Site institucional",
    antes: "assets/images/before-after/projeto-05/antes.svg",
    depois: "assets/images/before-after/projeto-05/depois.svg",
    antesLabel: "Só redes sociais",
    depoisLabel: "Site profissional",
    descricao: "O que mudou com o projeto."
  }
]
```

O componente de comparação é gerado automaticamente.

### 4.5 Alterar as categorias dos filtros

```javascript
portfolio: {
  filtrosSites: ["Todos", "Institucional", "Serviços", "Comércio"],
  filtrosDesign: ["Todos", "Logo", "Banners", "Social Media"]
}
```

`"Todos"` sempre aparece primeiro e não precisa ser removido. Se um projeto
tiver uma categoria que não está na lista, ela é adicionada automaticamente
ao final.

### 4.6 Adicionar um serviço

Duplique um item em `CONFIG.servicos`:

```javascript
servicos: [
  {
    id: "sites",
    icone: "monitor",
    titulo: "Sites Profissionais",
    descricao: "Texto curto explicando o serviço.",
    tags: ["Institucional", "Comercial", "Autoral"]
  }
]
```

O `id` também é usado para montar a mensagem do WhatsApp: para o serviço
`id: "landing"`, o site usa `CONFIG.mensagemLanding`.

---

## 5. Como adicionar imagens

### Onde colocar

```
assets/
├── favicon/favicon.svg
├── icons/
├── images/
│   ├── logo/
│   ├── hero/
│   ├── portfolio/
│   │   ├── sites/       <- sites do portfólio
│   │   ├── sistemas/    <- telas de sistemas
│   │   └── design/      <- peças de design
│   ├── before-after/
│   │   ├── projeto-01/  <- antes.svg + depois.svg
│   │   └── projeto-02/
│   ├── services/
│   └── backgrounds/
```

### Formatos aceitos

`.svg` · `.webp` · `.jpg` · `.png`

**Use `.webp`** para fotos: até 30% menor que `.jpg` com a mesma qualidade.
`.svg` é ideal para mockups, logotipos e ilustrações.

### Tamanhos recomendados

| Uso | Proporção | Tamanho ideal |
| --- | --- | --- |
| Card do portfólio (Bento) | 16:11 ou 4:3 | 1200 × 900 px |
| Peça de design (galeria) | 1:1 (quadrado) | 800 × 800 px |
| Antes e depois | **16:11 (as duas iguais)** | 1200 × 825 px |
| Capa Open Graph | 1.91:1 | 1200 × 630 px |

### Antes e depois — regra importante

As duas imagens (`antes` e `depois`) precisam ter:

- o **mesmo enquadramento** (mesma posição, mesmo ângulo)
- a **mesma proporção** (exatamente a mesma largura e altura)
- o **mesmo tamanho** em pixels

Se não tiverem, a comparação por arraste fica distorcida, porque a alça move
um recorte sobre a outra imagem.

### Otimizar imagens antes de subir

- Reduza para o tamanho máximo da maior tela em que a imagem aparece.
- Use WebP: [squoosh.app](https://squoosh.app) (gratuito, no navegador).
- Mantenha os arquivos abaixo de 200 KB quando possível.

### Editar o caminho da imagem

O caminho fica no `config.js`, e a extensão deve ser **igual** ao arquivo real:

```javascript
imagem: "assets/images/portfolio/sites/minha-oficina.webp"  // .webp
imagem: "assets/images/portfolio/sites/minha-oficina.jpg"   // .jpg
```

Trocar só a extensão sem trocar o arquivo faz a imagem não aparecer.

---

## 6. Como alterar o WhatsApp

Abra `js/config.js` e edite a chave `whatsapp`:

```javascript
whatsapp: "5541999999999",
```

**Formato: `55` + `DDD` + número, somente dígitos. Sem espaços, sem traço,
sem parênteses.**

| Campo | Exemplo |
| --- | --- |
| Código do país | `55` |
| DDD | `41` |
| Número | `999999999` |
| **Completo** | **`5541999999999`** |

Enquanto estiver como `"[INSERIR WHATSAPP]"`, os botões não abrem um link
quebrado: eles mostram um aviso pedindo para configurar o número.

### Mensagens automáticas

Cada botão abre o WhatsApp com uma mensagem pronta. Para alterar, edite as
chaves `mensagem*`:

```javascript
mensagemPadrao:     "Olá! Gostaria de solicitar um orçamento...",
mensagemSites:      "Olá! Gostaria de falar sobre a criação de um site...",
mensagemLanding:    "Olá! Gostaria de falar sobre uma landing page...",
mensagemSistemas:   "Olá! Preciso de um sistema web ou painel...",
mensagemDesign:     "Olá! Gostaria de um orçamento para artes e design...",
mensagemIdentidade: "Olá! Gostaria de criar a identidade visual...",
mensagemManutencao: "Olá! Preciso de manutenção ou atualizações...",
```

O nome da chave é `mensagem` + o `id` do serviço em **CamelCase**:
`id: "landing"` → `mensagemLanding`.

### Mensagem do formulário

```javascript
mensagemContato:
  "Olá! Meu nome é {nome} e sou da empresa {empresa}. Tenho interesse em {servico}. Gostaria de conversar sobre um orçamento.",
```

Os campos `{nome}`, `{empresa}`, `{servico}` e `{mensagem}` são preenchidos
automaticamente. A mensagem digitada pelo visitante entra no final.

### Telefone e e-mail

```javascript
telefone: "(41) 99999-9999",
email: "contato@scrocksys.com.br",
```

### Botão flutuante

```javascript
textoBotaoFlutuante: "Falar sobre meu projeto",       // desktop
textoBotaoFlutuanteMobile: "Orçamento",               // celular
```

---

## 7. Como alterar preços

Todos os valores ficam em `CONFIG.investimento`, dentro do `js/config.js`.

### Preço do desenvolvimento

```javascript
investimento: {
  desenvolvimento: {
    rotulo: "Desenvolvimento",
    preco: "A partir de R$ 350,00",
    descricao: "Valor inicial de referência para um site institucional...",
    itens: [
      "Site institucional de até 1 página",
      "Layout responsivo (celular, tablet e computador)"
    ],
    aviso: "O valor final é sempre informado antes do início do projeto."
  }
}
```

### Preço do domínio

```javascript
dominio: {
  rotulo: "Custo separado",
  titulo: "Domínio .com.br",
  preco: "Aproximadamente R$ 40,00 por ano",
  texto: "Para utilizar um endereço personalizado...",
  exemplo: "www.suaempresa.com.br"
}
```

> O valor do domínio é definido pela registradora e pode mudar. Por isso o site
> usa **"aproximadamente"** em vez de um valor fixo. Mantenha essa palavra para
> não prometer um preço que você não controla.

### Hospedagem

```javascript
hospedagem: {
  rotulo: "Sem mensalidade",
  titulo: "Hospedagem",
  preco: "R$ 0,00 em projetos estáticos compatíveis",
  texto: [
    "Para projetos compatíveis com hospedagem estática, é possível utilizar hospedagem gratuita...",
    "Sistemas Web que precisam de back-end... não funcionam em hospedagem estática gratuita..."
  ]
}
```

O array `texto` aceita vários parágrafos. **Mantenha o segundo parágrafo**
explicando que sistemas com back-end não usam hospedagem gratuita: isso evita
que o cliente entenda errado e reclame depois.

### Faixas de escopo

```javascript
faixas: [
  {
    nome: "Landing Page",
    preco: "a partir de R$ 350,00",
    texto: "Uma página focada em divulgação ou conversão.",
    itens: ["Seção de apresentação", "Botão de WhatsApp", "Carregamento rápido"]
  }
]
```

### Observações (rodapé da seção de preços)

```javascript
observacoes: [
  "Valores de referência, sujeitos a alteração conforme o escopo definido.",
  "Domínio tem custo próprio, cobrado anualmente pela registradora.",
  "Hospedagem gratuita se aplica somente a sites estáticos compativeis.",
  "Sistemas com back-end exigem infraestrutura de hospedagem propria."
]
```

### Parcelamento

```javascript
pagamento: {
  rotulo: "Pagamento facilitado",
  titulo: "Parcelamento em até 3x",
  texto: "Possibilidade de parcelamento em até 3x no cartão, conforme negociação."
}
```

---

## 8. Publicar no GitHub

### Criar o repositório

1. Acesse [github.com/new](https://github.com/new).
2. **Repository name:** `scrocksys` (ou o nome que preferir).
3. Escolha **Public** — sites com GitHub Pages em repositórios privados exigem
   plano pago.
4. **Não** marque "Add a README", ".gitignore" nem "License".
5. Clique em **Create repository**.

### Enviar os arquivos

**Pelo terminal**, dentro da pasta do projeto:

```bash
git init
git add .
git commit -m "Publica o site da ScrockSys"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/scrocksys.git
git push -u origin main
```

Se aparecer erro de identidade do Git:

```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu@email.com"
```

E repita o `git commit`.

**Alternativa pela interface do GitHub:** em *Add file* → *Upload files*,
arraste a pasta inteira. O GitHub não aceita arrastar a pasta, então
selecione o conteúdo dela (ou use o GitHub Desktop).

### Antes de enviar: atualize a URL

Troque `https://brunoscrock.github.io/ScrockSys/` pela URL real do seu
repositório em **três** lugares:

| Arquivo | O que trocar |
| --- | --- |
| `js/config.js` | `siteUrl: "[INSERIR URL DO SITE]"` |
| `robots.txt` | A linha `Sitemap:` e o comentário |
| `sitemap.xml` | `<loc>...</loc>` e o `<lastmod>` |

> Se esquecer, o site funciona igual — só perde o canonical e o sitemap
> automático. Mas o SEO fica incompleto.

---

## 9. Ativar o GitHub Pages

1. Abra o repositório no GitHub.
2. Clique em **Settings** (Configurações).
3. Na barra lateral, clique em **Pages**.
4. Em **Build and deployment** → **Source**, escolha **Deploy from a branch**.
5. Em **Branch**, selecione **main** e a pasta **/ (root)**.
6. Clique em **Save**.
7. Espere de 1 a 3 minutos. Uma faixa verde escrito **Your site is live**
   significa que deu certo.
8. Abra a URL exibida: normalmente
   `https://SEU-USUARIO.github.io/scrocksys/`

### Solução de problemas

| Problema | O que fazer |
| --- | --- |
| "404 — Page not found" | A branch ou a pasta está errada. Repita o passo 5 escolhendo `main` e `/ (root)`. |
| O site abre, mas sem estilo | Verifique se `css/style.css` está no repositório. |
| Os botões do WhatsApp não fazem nada | `whatsapp` ainda está como `[INSERIR WHATSAPP]` no `config.js`. |
| Imagens não aparecem | A extensão em `config.js` é diferente do arquivo real. |
| Mudanças não aparecem | Force a atualização com `Ctrl + F5` (o cache do navegador segura CSS e JS). |
| A URL mostra 404 depois de mexer no nome do repositório | A pasta se chama `sbrocksys` com o prefixo do usuário. Confira a URL exibida na página *Settings → Pages*. |

### Atualizar o site depois

```bash
git add .
git commit -m "Atualiza o conteúdo do site"
git push
```

O GitHub Pages publica em 1 a 2 minutos.

---

## 10. Adicionar domínio próprio

### 10.1 Registrar um domínio

Compre um domínio `.com.br` (ou `.com`) em uma registradora:
Registro.br, Hostinger, Locaweb, Cloudflare Registrar, GoDaddy.

Preço de referência de um `.com.br`: **aproximadamente R$ 40,00 por ano**.
O valor é definido pela registradora e pode mudar — por isso o site sempre fala
"aproximadamente".

### 10.2 Configurar o GitHub Pages

1. **Settings** → **Pages** → **Custom domain**: escreva o domínio, **sem**
   `https://` e sem barra no final. Ex.: `www.suaempresa.com.br`
2. Clique em **Save**.
3. Marque **Enforce HTTPS** quando a caixa de verificação aparecer.

O GitHub mostra os valores DNS que você precisa cadastrar na registradora.

### 10.3 Apontar o domínio no GitHub

Na registradora, crie dois registros:

| Tipo | Nome | Valor |
| --- | --- | --- |
| `A` | `@` | `185.199.108.153` |
| `A` | `www` | `185.199.108.153` |
| `CNAME` | `www` | `SEU-USUARIO.github.io` |

> O endereço `185.199.108.153` é o IP do GitHub Pages para IPv4. A
> documentação oficial fica em
> [docs.github.com/pages/configuring-a-custom-domain](https://docs.github.com/pt/pages/configuring-a-custom-domain-for-your-github-pages-site).
> Se o GitHub mostrar outros valores para o seu caso, use os que ele mostrar.

### 10.4 Atualizar a URL no site

Depois que o domínio estiver ativo, atualize os mesmos três arquivos:

```javascript
// js/config.js
siteUrl: "https://www.suaempresa.com.br/",
```

```text
# robots.txt
Sitemap: https://www.suaempresa.com.br/sitemap.xml
```

```xml
<!-- sitemap.xml -->
<loc>https://www.suaempresa.com.br/</loc>
```

### 10.5 Sobre hospedagem e custo

O **GitHub Pages é gratuito** e não cobra mensalidade. Os únicos custos são:

| Item | Custo | Quem paga |
| --- | --- | --- |
| GitHub Pages | Grátis | — |
| Domínio `.com.br` | ~R$ 40/ano | A empresa do cliente |
| GitHub (repositório público) | Grátis | — |

Isso vale para sites estáticos: sites institucionais, landing pages e
portfólios. **Sistemas web com back-end não rodam no GitHub Pages** — precisam
de outro tipo de hospedagem, e o custo é orçado à parte.

---

## 11. Estrutura de pastas

```
ScrockSys/
│
├── index.html                  Estrutura completa da página
├── README.md                   Este arquivo
├── manifest.webmanifest        Ícone e cor da aba (aparece instalado no celular)
├── .gitignore                  Arquivos ignorados pelo Git
├── robots.txt                  Instruções para buscadores
├── sitemap.xml                 Mapa do site para o Google
├── llms.txt                    Descrição do site em texto (IA e buscadores)
│
├── css/
│   └── style.css               TODO o estilo: layout, cores, animação, responsivo
│
├── js/
│   ├── config.js               ⭐ TODA a configuração editável
│   ├── app.js                  Monta as seções a partir do config
│   ├── utils.js                Funções auxiliares (WhatsApp, telefone, scroll)
│   ├── storage.js              localStorage (filtros, favoritos)
│   ├── classifier.js           Classifica projetos (SITE, SISTEMA, DESIGN...)
│   ├── api.js                  Camada de dados, pronta para integrações futuras
│   ├── search.js               Busca e filtros do portfólio
│   └── ui.js                   Menu, lightbox, toasts, comparador, reveal
│
└── assets/
    ├── favicon/
    │   └── favicon.svg
    ├── icons/
    │   └── logo.svg
    └── images/
        ├── logo/
        ├── hero/
        │   └── og-cover.svg            Imagem de compartilhamento
        ├── portfolio/
        │   ├── sites/                 6 sites de exemplo
        │   ├── sistemas/              3 sistemas de exemplo
        │   └── design/                8 peças de exemplo
        ├── before-after/
        │   ├── projeto-01/            antes.svg + depois.svg
        │   ├── projeto-02/
        │   ├── projeto-03/
        │   └── projeto-04/
        ├── services/
        └── backgrounds/
```

---

## 12. O que está pronto

### Site

- Hero com fundo animado em canvas (partículas e linhas conectadas)
- Título com animação letra a letra, com destaque em gradiente
- Composição visual com notebook, celular e janelas de interface flutuantes
- Menu fixo com efeito de fundo ao rolar e barra de progresso de leitura
- Menu hambúrguer com painel lateral no celular, foco preso e fechar por `Esc`
- Botão flutuante de WhatsApp (com texto no desktop, circular no celular)
- 14 seções completas, do Hero ao rodapé
- Portfolio em Bento Grid, com filtros por categoria
- Galeria de design com lightbox, navegação por teclado e contador
- Comparador "antes e depois" com arrastar, clique e teclado
- Formulário que monta a mensagem do WhatsApp (sem backend)
- Rodapé completo com links, contato e redes sociais

### Design

- Paleta clara: branco, off-white, cinza claro, azul escuro, azul tecnológico
  e turquesa de destaque
- Tipografia Sora (títulos) e Inter (texto)
- Sem excesso de vermelho
- Cards com brilho que segue o cursor, hover e ícones que giram

### Técnica

- 100% estático: HTML, CSS e JavaScript, sem dependências
- JavaScript modular, carregado em ordem, sem framework
- Imagens SVG leves, com `loading="lazy"` e `decoding="async"`
- Sem rolagem horizontal de 320px a 1920px
- Acessibilidade: teclado, foco visível, `aria-*`, contraste e `alt` nas imagens
- `prefers-reduced-motion` desliga as animações
- Canvas do Hero é desativado em dispositivos com pouca potência
- SEO: `title`, `description`, Open Graph, canonical, favicon, sitemap,
  `robots.txt` e `llms.txt`
- Google Fonts com `preconnect` e `font-display: swap`

### Editável pelo `config.js`

- Marca, slogan, textos e SEO
- WhatsApp, telefone, e-mail, cidade, horário e redes sociais
- Serviços, diferenciais, processo, sistemas e itens inclusos
- Preços, domínio, hospedagem e formas de pagamento
- Projetos de sites, sistemas, design e antes/depois
- Filtros de categoria

---

## Dúvidas frequentes

**Preciso instalar Node.js?**
Não. O site não usa Node.js, npm nem qualquer dependência. Node serve apenas
para rodar um servidor local opcional.

**Preciso de um banco de dados?**
Não. Todo o conteúdo vem do `js/config.js`. O formulário só monta a mensagem do
WhatsApp no navegador.

**Por que os dados de contato ainda não aparecem?**
Porque estão como `[INSERIR ...]` no `config.js`. Preencha com dados reais e o
conteúdo aparece automaticamente.

**Como troco a cor de destaque do site?**
No topo do `css/style.css`, dentro do bloco `:root`, altere `--azul`,
`--azul-agua` e `--grad-principal`. Tudo o mais acompanha.

**Posso usar este site para um cliente?**
Sim. O código é seu. Lembre-se de trocar o nome da marca, o WhatsApp, o e-mail e
os projetos do portfólio pelos dados reais da empresa atendida.

---

© 2026 ScrockSys — Desenvolvimento de Sites, Sistemas e Design.
