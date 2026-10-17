# Portfólio — Pedro Martins de Almeida

Site pessoal em **Next.js (App Router) + TypeScript + Tailwind CSS + [Motion](https://motion.dev)** (antigo Framer Motion) com uma esfera de partículas em WebGL, pronto para publicar na Vercel.

Todo o conteúdo do site fica em **um único arquivo**: `src/data/content.ts`.
Para mudar qualquer texto, número, projeto ou link, edite só esse arquivo — nunca precisa mexer nos componentes.

---

## 1. Rodar na sua máquina

Precisa do [Node.js](https://nodejs.org) versão 20 ou mais nova (`node -v` para conferir).

```bash
npm install     # só na primeira vez
npm run dev     # sobe em http://localhost:3000
```

O site recarrega sozinho a cada salvamento.

Outros comandos:

```bash
npm run build   # gera a versão de produção (é o que a Vercel roda)
npm start       # roda a versão de produção localmente
```

---

## 2. Editar o conteúdo

Abra `src/data/content.ts`. Ele está dividido em blocos comentados:

| Bloco | O que controla |
| --- | --- |
| `site` | Título, descrição e URL usados no Google e no card de link |
| `pessoal` | Nome, cargo, cidade, e-mail, LinkedIn, GitHub, foto |
| `hero` | Primeira dobra: o nome (`titulo`, escrito com partículas dentro da esfera), a frase de destaque, 3 palavras-chave e os dois botões |
| `sobre` | Parágrafos do "Sobre" e os 3 destaques em caixinha |
| `habilidades` | Os 4 grupos e os itens de cada um |
| `projetos` | Os cards (problema, solução, resultado, stack, link) |
| `experiencia` | Linha do tempo, formação e certificações |
| `contato` | Chamada, texto e a lista de links |
| `navegacao` | Itens do menu |
| `assistente` | Página `/chat`: sugestões e respostas prontas |

Algumas coisas que valem a pena ajustar depois:

- **Link dos repositórios**: em cada projeto, preencha `link: "https://github.com/7Fuzzy7/..."`. Se ficar vazio (`""`), o botão simplesmente não aparece.
- **Números reais nos projetos**: o campo `resultado` é o que mais chama atenção de recrutador. Quando tiver métrica (precisão do modelo, tempo economizado, volume processado), coloque lá.
- **Projeto em destaque**: `destaque: true` faz o card ocupar a linha inteira. Hoje é o AntVision.
- **Cargo atual**: `ate: "atual"` deixa a bolinha âmbar pulsando na linha do tempo.

### Trocar a foto

Substitua `public/foto.jpg` por outra imagem **quadrada** com o mesmo nome.
Para tirar a foto do site, deixe `foto: ""` no bloco `pessoal`.

### Trocar as cores

Estão em `src/app/globals.css`, no bloco `@theme`. Mudou ali, mudou no site inteiro.
O âmbar de destaque é `--color-accent` (o azul antigo era `#4d8dff`).
As fontes (TASA Orbiter e Geist Mono) são carregadas em `src/app/layout.tsx`.

A cor da esfera de partículas **não** vem do CSS: ela está nos shaders de `src/lib/orb.ts`
(variáveis `cDeep`, `cMid`, `cHot` e `cWhite`, valores de 0 a 1 em RGB).

---

## 2.1 Efeitos de movimento

Tudo é feito com o [Motion](https://motion.dev) (`import ... from "motion/react"`). Onde está cada coisa:

| Efeito | Arquivo | O que dá para ajustar |
| --- | --- | --- |
| Esfera de partículas (Hero) com o **nome escrito por partículas** no centro | `components/Orb.tsx` + `lib/orb.ts` + `lib/orb-texto.ts` | `PRESETS.hero` em `Orb.tsx`: nº de partículas, duração da chegada e o `texto` (`largura` do nome em raios da esfera, `alvo` = nº de pontos). O texto vem de `hero.titulo` no `content.ts` e usa a mesma fonte do site. |
| Esfera "assistente" no `/chat` | `components/ChatAssistente.tsx` | Fica agitada enquanto "pensa" e solta uma onda de luz ao responder (`ESTADOS` em `Orb.tsx`) |
| Faixa de tecnologias | `components/FaixaTecnologias.tsx` | `velocidade` (px/s); acelera e inverte com a rolagem |
| Brilho que segue o mouse nos cards | `components/CardComLuz.tsx` | Tamanho/cor do brilho |
| Linha do tempo que se desenha ao rolar | `components/LinhaDoTempo.tsx` | Início/fim da animação (`offset`) |
| Menu: texto que rola e sublinhado que desliza | `components/Nav.tsx` + `TextoRolante.tsx` | Mola do sublinhado (`stiffness`/`damping`) |
| Botão "copiar e-mail" | `components/CopiarEmail.tsx` | — |

**Desempenho:** a esfera é carregada à parte (≈12 kB), só roda enquanto está na tela, usa menos
partículas no celular e reduz a qualidade sozinha se o aparelho engasgar (os pontos do nome nunca
são cortados).

**Acessibilidade e plano B:** o nome continua existindo como `<h1>` de verdade (leitores de tela e
Google leem normalmente); ele só fica invisível enquanto as partículas desenham o nome. Se o
aparelho não tiver WebGL, ou a esfera demorar mais de 8 s, o `<h1>` aparece em texto normal.
Quem ativou "reduzir movimento" no sistema operacional recebe a esfera parada, com o nome já
escrito, e animações só de fade (o `MotionProvider` cuida disso). ⚠️ Não use `useReducedMotion()` para trocar
o HTML renderizado de um componente: o servidor não conhece a preferência, o HTML fica diferente
entre servidor e navegador e o conteúdo some. Use o hook só dentro de eventos/efeitos.

---

## 3. Subir no GitHub

No terminal, dentro da pasta do projeto:

```bash
git init
git add .
git commit -m "primeira versao do portfolio"
git branch -M main
```

Crie um repositório vazio em <https://github.com/new> (sugestão de nome: `portfolio`, público, **sem** README/`.gitignore`/licença — o projeto já tem). Depois:

```bash
git remote add origin https://github.com/7Fuzzy7/portfolio.git
git push -u origin main
```

> A pasta `node_modules` e o `.next` já estão no `.gitignore` — não vão para o GitHub, e não precisam ir.

Dali em diante, para publicar qualquer alteração:

```bash
git add .
git commit -m "descrição do que mudou"
git push
```

---

## 4. Publicar na Vercel

1. Entre em <https://vercel.com> e faça login **com a conta do GitHub**.
2. **Add New… → Project**.
3. Em *Import Git Repository*, escolha o repositório `portfolio` (se ele não aparecer, clique em *Adjust GitHub App Permissions* e libere o repositório).
4. A Vercel detecta o Next.js sozinho. **Não precisa mudar nada** em Build Command, Output Directory nem Environment Variables.
5. Clique em **Deploy** e espere ~1 minuto.

Pronto: o site fica em algo como `https://portfolio-7fuzzy7.vercel.app`.

A partir daí, **todo `git push` para a branch `main` republica o site automaticamente.**

### Depois do primeiro deploy (importante para o SEO)

Copie a URL final e cole em `src/data/content.ts`:

```ts
export const site = {
  url: "https://SUA-URL-AQUI.vercel.app",   // sem barra no final
```

Faça `git add . && git commit -m "url de producao" && git push`. Isso corrige os links do `sitemap.xml`, do `robots.txt` e do card que aparece quando você compartilha o link no LinkedIn ou WhatsApp.

### Domínio próprio (opcional)

Se um dia comprar um domínio: no painel do projeto → **Settings → Domains → Add**, e siga as instruções de DNS que a Vercel mostra.

---

## 5. Assistente da página `/chat`

Hoje ele roda no **modo offline**: as respostas estão prontas em `assistente.baseDeConhecimento`, dentro do `content.ts`. Não usa IA, não precisa de chave e **não custa nada**.

Para adicionar uma resposta nova, copie um bloco e preencha:

```ts
{
  palavras: ["ingles", "idioma", "fluente"],
  resposta: "Ele estudou inglês no Kumon e na Wizard...",
},
```

As `palavras` são os gatilhos. Acento e maiúscula não importam — a busca normaliza tudo.
Dica: use o **começo** da palavra (`"estud"` pega *estuda*, *estudou*, *estudante*).

### Ligar a IA de verdade (opcional, tem custo)

O código já está pronto em `src/app/api/chat/route.ts`. Para ativar:

1. Crie uma chave em <https://console.anthropic.com>.
2. Na sua máquina, crie o arquivo `.env.local` na raiz do projeto:
   ```
   ANTHROPIC_API_KEY=sua_chave_aqui
   ```
3. Na Vercel: **Settings → Environment Variables → Add** com o nome `ANTHROPIC_API_KEY` e o mesmo valor.
4. No `content.ts`, troque `modo: "offline"` por `modo: "api"`.
5. `git push` para republicar.

**Sobre o custo:** você paga por uso, por pergunta respondida. Cada resposta do assistente é curta (o limite está em 400 tokens) e o dossiê enviado junto tem cerca de mil palavras, então o custo por pergunta fica na casa de frações de centavo de dólar. Ainda assim, é um site público: se alguém resolver ficar conversando, o valor sobe. Recomendação: só ligue quando tiver a chave com **limite de gasto configurado** no console da Anthropic.

⚠️ **A chave nunca vai para o GitHub.** O `.env.local` está no `.gitignore` e a chamada acontece no servidor, não no navegador. Não coloque a chave no `content.ts`.

---

## 6. O que já vem pronto

- **Responsivo** — testado em 400px de largura, sem rolagem horizontal.
- **Acessível** — link "pular para o conteúdo", foco visível em toda a navegação por teclado, contraste acima de 6:1 em texto e botões, `aria-label` nos controles, e respeito à preferência de "reduzir movimento" do sistema.
- **SEO** — `<title>` e descrição, canonical, `sitemap.xml`, `robots.txt` e dados estruturados (schema.org/Person).
- **Open Graph** — a imagem de compartilhamento é **gerada automaticamente** a partir do `content.ts` (`src/app/opengraph-image.tsx`). Mudou o nome ou o cargo, a imagem muda junto.
- **Favicon** — `src/app/icon.svg`.

---

## 7. Estrutura de pastas

```
portifolio/
├── public/
│   └── foto.jpg                    # sua foto (quadrada)
├── src/
│   ├── app/
│   │   ├── api/chat/route.ts       # assistente com IA (desligado por padrão)
│   │   ├── chat/page.tsx           # página /chat
│   │   ├── globals.css             # cores, tipografia e utilitários
│   │   ├── icon.svg                # favicon
│   │   ├── layout.tsx              # SEO, menu, rodapé, dados estruturados
│   │   ├── opengraph-image.tsx     # imagem de compartilhamento
│   │   ├── page.tsx                # home (monta as 6 seções)
│   │   ├── robots.ts
│   │   └── sitemap.ts
│   ├── components/
│   │   ├── ChatAssistente.tsx
│   │   ├── Contato.tsx
│   │   ├── Experiencia.tsx
│   │   ├── Footer.tsx
│   │   ├── Habilidades.tsx
│   │   ├── Hero.tsx
│   │   ├── Nav.tsx
│   │   ├── Projetos.tsx
│   │   ├── Reveal.tsx              # animação de entrada ao rolar
│   │   ├── Section.tsx             # casca padrão das seções
│   │   └── Sobre.tsx
│   ├── data/
│   │   └── content.ts              # ⭐ TODO o conteúdo do site
│   └── lib/
│       ├── animacao.ts
│       └── assistente.ts           # busca das respostas prontas
├── .gitignore
├── next.config.mjs
├── package.json
├── postcss.config.mjs
└── tsconfig.json
```
