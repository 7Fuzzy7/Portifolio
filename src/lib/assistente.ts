import { assistente, pessoal } from "../data/content";
import type { Resposta } from "../data/perguntas";

/* =============================================================================
 *  Cérebro do assistente (modo offline).
 *
 *  Não usa IA nem internet: é uma busca bem esperta sobre as respostas que você
 *  escreveu em src/data/perguntas.ts. Para cada pergunta ela soma:
 *    1. PALAVRAS-CHAVE  expressões do campo `palavras`. As palavras de conteúdo
 *                       e as de pergunta ("por que", "qual", "como") precisam
 *                       aparecer em ordem; o resto ("você", "o", "de") é
 *                       tolerado no meio. Aceita plural, conjugação, começo
 *                       da palavra e erro de digitação;
 *    2. SEMELHANÇA      o quanto a pergunta se parece com as `perguntas` de
 *                       exemplo (palavras raras pesam mais);
 *    3. COBERTURA       se as palavras que a pessoa usou foram "explicadas".
 *  Respostas gerais (`generica: true`) perdem para as específicas, e perguntas
 *  sobre uma tecnologia que não está no portfólio recebem uma resposta honesta.
 * ========================================================================== */

/* -----------------------------------------------------------------------------
 *  Texto
 * -------------------------------------------------------------------------- */

const ABREVIACOES: Record<string, string> = {
  vc: "voce",
  vcs: "voces",
  pq: "porque",
  tb: "tambem",
  tbm: "tambem",
  q: "que",
  pra: "para",
};

/**
 * Deixa o texto comparável: minúsculo, sem acento e sem pontuação.
 * "Onde ele ESTUDOU?" -> "onde ele estudou"
 */
export function normalizar(texto: string): string {
  const base = texto
    .toLowerCase()
    .replace(/c\+\+/g, "cpp")
    .replace(/c#/g, "csharp")
    .replace(/\.net\b/g, "dotnet")
    .replace(/ci\s*\/\s*cd/g, "cicd")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!base) return "";
  return base
    .split(" ")
    .map((t) => ABREVIACOES[t] ?? t)
    .join(" ");
}

/** Palavras que aparecem em quase toda pergunta e não ajudam a achar a resposta. */
const PALAVRAS_VAZIAS = new Set(
  (
    "a o as os um uma uns umas de do da dos das em no na nos nas por pela pelo pelas pelos para com " +
    "e ou que qual quais quem como onde quando porque se seu sua seus suas meu minha meus minhas voce " +
    "voces pedro ele ela eles elas me te lhe ja mais muito muita tem tenho ter tinha ser sao foi esta " +
    "estao estou esse essa esses essas isso este estes estas isto ao aos mim ti la aqui ai pode poder " +
    "poderia gostaria saber queria favor fale falar conte conta diga sobre"
  ).split(" "),
);

/**
 * Entre as palavras "vazias", estas mudam o sentido de uma expressão e por isso
 * precisam aparecer: "por que tecnologia" não é "tecnologia", "é uma IA" não é "IA".
 */
const PALAVRAS_DE_SENTIDO = new Set(
  "por que porque qual quais quem como onde quando nao um uma".split(" "),
);

const vazia = (token: string) => token.length <= 1 || PALAVRAS_VAZIAS.has(token);

const SUFIXOS = [
  "amentos", "imentos", "amento", "imento", "adores", "adoras", "idades", "acoes",
  "ismos", "istas", "mente", "ando", "endo", "indo", "aram", "eram", "avam", "ados",
  "adas", "idos", "idas", "acao", "ador", "adora", "ismo", "ista", "idade", "ado",
  "ada", "ido", "ida", "ou", "ei", "ar", "er", "ir", "as", "os", "es", "a", "o", "e", "s",
].sort((a, b) => b.length - a.length);

/**
 * Tira o final da palavra (plural, gênero, tempo verbal) para "projetos" casar com "projeto".
 * Sufixos longos exigem um radical maior (senão "qualidade" viraria "qual").
 */
function radical(palavra: string): string {
  for (const sufixo of SUFIXOS) {
    const minimo = sufixo.length >= 4 ? 5 : 4;
    if (palavra.length - sufixo.length >= minimo && palavra.endsWith(sufixo)) {
      const raiz = palavra.slice(0, -sufixo.length);
      return PALAVRAS_VAZIAS.has(raiz) ? palavra : raiz;
    }
  }
  return palavra;
}

function raizes(texto: string): string[] {
  return normalizar(texto)
    .split(" ")
    .filter((t) => !vazia(t))
    .map(radical);
}

/** Distância de edição (inclui troca de letras vizinhas): "projetso" fica a 1 de "projetos". */
function distancia(a: string, b: string): number {
  const linhas = a.length + 1;
  const colunas = b.length + 1;
  const d: number[][] = Array.from({ length: linhas }, (_, i) => {
    const l = new Array<number>(colunas).fill(0);
    l[0] = i;
    return l;
  });
  for (let j = 0; j < colunas; j++) d[0][j] = j;
  for (let i = 1; i < linhas; i++) {
    for (let j = 1; j < colunas; j++) {
      const custo = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + custo);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      }
    }
  }
  return d[linhas - 1][colunas - 1];
}

/* -----------------------------------------------------------------------------
 *  Preenchimento de {email}, {linkedin}…
 * -------------------------------------------------------------------------- */

const semProtocolo = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

/** Troca {email}, {linkedin}, {github}, {cidade}, {empresa}, {cargo}, {nome} pelos dados de `pessoal`. */
export function preencher(texto: string, extra: Record<string, string> = {}): string {
  const dados: Record<string, string> = {
    email: pessoal.email,
    linkedin: semProtocolo(pessoal.linkedin),
    github: semProtocolo(pessoal.github),
    cidade: pessoal.cidade,
    empresa: pessoal.empresa,
    cargo: pessoal.cargo,
    nome: pessoal.nome,
    ...extra,
  };
  return texto.replace(/\{(\w+)\}/g, (inteiro, chave: string) => dados[chave] ?? inteiro);
}

/* -----------------------------------------------------------------------------
 *  Índice (montado uma vez só)
 * -------------------------------------------------------------------------- */

type Chave = {
  /** Palavras que precisam aparecer, em ordem (conteúdo + palavras de sentido). */
  exigidas: string[];
  raizes: string[];
  /** Expressão sem nenhuma palavra de conteúdo ("por que você"): só vale se for quase a pergunta toda. */
  somenteVazias: boolean;
  peso: number;
};
type ItemIndexado = { item: Resposta; chaves: Chave[]; exemplos: Set<string>[] };
type Indice = {
  itens: ItemIndexado[];
  idf: Map<string, number>;
  idfPadrao: number;
  /** Toda palavra que o assistente conhece. Erro de digitação só é corrigido para palavra FORA daqui. */
  vocabulario: Set<string>;
};

let cache: Indice | null = null;

function indice(): Indice {
  if (cache) return cache;
  const base = assistente.baseDeConhecimento;

  // Palavra de conteúdo que só aparece nas chaves de UMA resposta é uma pista forte (ex.: "junior", "tambore").
  const donas = new Map<string, Set<string>>();
  const vocabulario = new Set<string>();
  const registrar = (texto: string) => {
    for (const t of normalizar(texto).split(" ")) if (t) vocabulario.add(t);
  };
  for (const item of base) {
    item.perguntas.forEach(registrar);
    registrar(item.resposta);
    for (const palavra of item.palavras) {
      registrar(palavra);
      for (const t of normalizar(palavra).split(" ")) {
        if (vazia(t)) continue;
        const r = radical(t);
        if (!donas.has(r)) donas.set(r, new Set());
        donas.get(r)!.add(item.id);
      }
    }
  }
  for (const { gatilhos } of assistente.foraDoPortfolio.itens) gatilhos.forEach(registrar);

  const itens: ItemIndexado[] = base.map((item) => ({
    item,
    chaves: item.palavras
      .map((p) => normalizar(p).split(" ").filter(Boolean))
      .filter((tokens) => tokens.length > 0)
      .map((tokens): Chave => {
        const conteudo = tokens.filter((t) => !vazia(t));
        const somenteVazias = conteudo.length === 0;
        const exigidas = somenteVazias
          ? tokens
          : tokens.filter((t) => !vazia(t) || PALAVRAS_DE_SENTIDO.has(t));
        const sentido = exigidas.length - conteudo.length;
        const unica = !somenteVazias && conteudo.some((t) => donas.get(radical(t))?.size === 1);
        let peso = somenteVazias
          ? Math.min(7, tokens.length * 1.5 + 2.5)
          : conteudo.length * 3 + sentido * 0.8 + Math.max(conteudo.join("").length, 6) * 0.2;
        if (unica) peso *= 1.5;
        return { exigidas, raizes: exigidas.map(radical), somenteVazias, peso };
      }),
    exemplos: item.perguntas.map((p) => new Set(raizes(p))),
  }));

  // Palavras raras (que aparecem em poucas respostas) identificam melhor o assunto.
  const df = new Map<string, number>();
  for (const { exemplos } of itens) {
    const vistas = new Set<string>();
    for (const ex of exemplos) for (const w of ex) vistas.add(w);
    for (const w of vistas) df.set(w, (df.get(w) ?? 0) + 1);
  }
  const idf = new Map<string, number>();
  for (const [w, n] of df) idf.set(w, Math.log(1 + itens.length / n));

  cache = { itens, idf, idfPadrao: Math.log(1 + itens.length), vocabulario };
  return cache;
}

/* -----------------------------------------------------------------------------
 *  Pontuação
 * -------------------------------------------------------------------------- */

/**
 * 1 = igual ou começa igual; 0.95 = mesma raiz (plural, verbo); 0.7 = erro de digitação.
 * 0 = diferente.
 */
function casaToken(q: string, qRaiz: string, k: string, kRaiz: string, idx: Indice): number {
  if (q === k) return 1;
  if (k.length <= 3) return 0; // palavras curtas (bi, ia, sql) só valem inteiras
  // "estud" casa com "estudou", mas "forma" não casa com "formigas".
  if (q.startsWith(k) && q.length - k.length <= (k.length >= 6 ? 3 : 2)) return 1;
  if (kRaiz.length >= 4 && qRaiz === kRaiz) return 0.95;
  // Erro de digitação ("emial", "projetso"): só corrige palavra que o assistente não conhece.
  if (
    k.length >= 5 &&
    q.length >= 5 &&
    q[0] === k[0] &&
    !idx.vocabulario.has(q) &&
    distancia(q.slice(0, k.length), k) <= 1
  ) {
    return 0.7;
  }
  return 0;
}

const MAX_PALAVRAS_NO_MEIO = 3;

type Achado = { valor: number; posicoes: number[] };

/** Procura as palavras da expressão, em ordem, tolerando palavras vazias entre elas ("onde VOCÊ trabalhou"). */
function acharChave(
  tokens: string[],
  raizesTokens: string[],
  chave: Chave,
  uteis: number,
  idx: Indice,
): Achado | null {
  const folga = chave.somenteVazias ? 0 : MAX_PALAVRAS_NO_MEIO;
  let melhor: Achado | null = null;

  for (let inicio = 0; inicio < tokens.length; inicio++) {
    let soma = casaToken(tokens[inicio], raizesTokens[inicio], chave.exigidas[0], chave.raizes[0], idx);
    if (!soma) continue;
    const posicoes = [inicio];
    let atual = inicio;
    let ok = true;

    for (let j = 1; j < chave.exigidas.length; j++) {
      let achou = false;
      for (let p = atual + 1; p <= atual + 1 + folga && p < tokens.length; p++) {
        const c = casaToken(tokens[p], raizesTokens[p], chave.exigidas[j], chave.raizes[j], idx);
        if (c) {
          soma += c;
          posicoes.push(p);
          atual = p;
          achou = true;
          break;
        }
        if (!vazia(tokens[p])) break; // só dá para atravessar palavras vazias
      }
      if (!achou) {
        ok = false;
        break;
      }
    }
    if (!ok) continue;

    let valor = chave.peso * (soma / chave.exigidas.length);
    // Expressão feita só de palavras vazias ("por que você") só vale quando não há outro assunto na pergunta.
    if (chave.somenteVazias) valor *= chave.exigidas.length / (chave.exigidas.length + uteis);
    if (!melhor || valor > melhor.valor) melhor = { valor, posicoes };
  }
  return melhor;
}

type PontosChaves = { pontos: number; cobertos: Set<number> };

function pontuarChaves(
  tokens: string[],
  raizesTokens: string[],
  chaves: Chave[],
  uteis: number,
  idx: Indice,
): PontosChaves {
  const achados: Achado[] = [];
  for (const chave of chaves) {
    const a = acharChave(tokens, raizesTokens, chave, uteis, idx);
    if (a) achados.push(a);
  }
  // A melhor expressão vale tudo; as seguintes valem cada vez menos (evita premiar listas repetidas).
  achados.sort((a, b) => b.valor - a.valor);
  const cobertos = new Set<number>();
  const pontos = achados.reduce((total, a, i) => {
    a.posicoes.forEach((p) => cobertos.add(p));
    return total + a.valor * (i === 0 ? 1 : i === 1 ? 0.5 : i === 2 ? 0.25 : 0.1);
  }, 0);
  return { pontos, cobertos };
}

function quaseIgual(exemplo: Set<string>, palavra: string, idx: Indice): boolean {
  if (palavra.length < 5 || idx.vocabulario.has(palavra)) return false;
  for (const e of exemplo) {
    if (e.length >= 5 && Math.abs(e.length - palavra.length) <= 1 && distancia(e, palavra) <= 1) {
      return true;
    }
  }
  return false;
}

/** 0 a 1: o quanto a pergunta se parece com a pergunta de exemplo mais próxima. */
function semelhanca(raizesPergunta: string[], exemplos: Set<string>[], idx: Indice): number {
  if (raizesPergunta.length === 0) return 0;
  const peso = (w: string) => (idx.idf.get(w) ?? idx.idfPadrao) ** 2;
  const unicas = [...new Set(raizesPergunta)];
  const normaPergunta = unicas.reduce((s, w) => s + peso(w), 0);
  let melhor = 0;
  for (const ex of exemplos) {
    let inter = 0;
    let normaExemplo = 0;
    for (const w of ex) normaExemplo += peso(w);
    for (const w of unicas) if (ex.has(w) || quaseIgual(ex, w, idx)) inter += peso(w);
    if (inter > 0 && normaExemplo > 0) {
      melhor = Math.max(melhor, inter / Math.sqrt(normaPergunta * normaExemplo));
    }
  }
  return melhor;
}

/* -----------------------------------------------------------------------------
 *  Tecnologias que não estão no portfólio
 * -------------------------------------------------------------------------- */

function contemSequencia(tokens: string[], sequencia: string[]): boolean {
  for (let i = 0; i + sequencia.length <= tokens.length; i++) {
    if (sequencia.every((s, j) => tokens[i + j] === s)) return true;
  }
  return false;
}

function tecnologiasForaDoPortfolio(tokens: string[]): string[] {
  const nomes: string[] = [];
  for (const { nome, gatilhos } of assistente.foraDoPortfolio.itens) {
    if (gatilhos.some((g) => contemSequencia(tokens, normalizar(g).split(" ")))) nomes.push(nome);
  }
  return nomes;
}

function listar(nomes: string[]): string {
  if (nomes.length <= 1) return nomes.join("");
  return `${nomes.slice(0, -1).join(", ")} e ${nomes[nomes.length - 1]}`;
}

/* -----------------------------------------------------------------------------
 *  API pública
 * -------------------------------------------------------------------------- */

export type Resultado = {
  /** id da resposta escolhida (null quando nada combinou). */
  id: string | null;
  resposta: string;
  /** Perguntas sugeridas em "veja também" (texto pronto para virar botão). */
  relacionadas: string[];
  confianca: "alta" | "media" | "nenhuma";
};

const MINIMO = 5.5; // abaixo disso a pergunta não casou com nada de forma convincente
const ALTA = 9; // a partir daqui a resposta é dada sem ressalva
const GENERICA_FATOR = 0.5; // respostas gerais perdem para as específicas
const SEMELHANCA_MINIMA = 0.45;
const PREFIXO_INCERTO = "Acho que é isto que você quer saber: ";
const RELACIONADAS_PADRAO = ["apresentacao", "projetos", "disponibilidade-estagio"];

function perguntasDe(ids: string[], excluir: Set<string>): string[] {
  const vistos = new Set<string>();
  const saida: string[] = [];
  for (const id of ids) {
    if (excluir.has(id) || vistos.has(id)) continue;
    const alvo = assistente.baseDeConhecimento.find((r) => r.id === id);
    if (!alvo) continue;
    vistos.add(id);
    saida.push(alvo.perguntas[0]);
  }
  return saida;
}

/** Escolhe a melhor resposta da base de conhecimento e sugere os próximos passos. */
export function responder(pergunta: string): Resultado {
  const tokens = normalizar(pergunta).split(" ").filter(Boolean);
  const semResposta = preencher(assistente.semResposta);

  if (tokens.length === 0) {
    return {
      id: null,
      resposta: semResposta,
      relacionadas: perguntasDe(RELACIONADAS_PADRAO, new Set()),
      confianca: "nenhuma",
    };
  }

  const idx = indice();
  const raizesTokens = tokens.map(radical);
  const raizesPergunta = raizes(pergunta);
  const uteis = tokens.filter((t) => !vazia(t)).length;

  // 1) Pontua todas as respostas.
  let candidatos = idx.itens.map(({ item, chaves, exemplos }) => {
    const { pontos: pChaves, cobertos } = pontuarChaves(tokens, raizesTokens, chaves, uteis, idx);
    // Cobertura: que parte da pergunta essa resposta "explica" (só palavras de conteúdo; se não houver, todas).
    const cobertura =
      uteis === 0
        ? cobertos.size / tokens.length
        : [...cobertos].filter((i) => !vazia(tokens[i])).length / uteis;
    const sim = semelhanca(raizesPergunta, exemplos, idx);
    const pSim = sim >= SEMELHANCA_MINIMA ? sim * 9 : 0;
    const base = pChaves + pSim + (pChaves > 0 || pSim > 0 ? Math.min(1, cobertura) * 3 : 0);
    return { item, pontos: base };
  });

  // 2) Resposta geral só ganha se nenhuma específica convenceu.
  const haEspecifica = candidatos.some((c) => !c.item.generica && c.pontos >= MINIMO);
  if (haEspecifica) {
    candidatos = candidatos.map((c) =>
      c.item.generica ? { ...c, pontos: c.pontos * GENERICA_FATOR } : c,
    );
  }
  candidatos.sort((a, b) => b.pontos - a.pontos);
  const melhor = candidatos[0];
  const convenceu = melhor !== undefined && melhor.pontos >= MINIMO;

  // 3) Pergunta sobre tecnologia que não está no portfólio: resposta honesta (e o resto vai em "veja também").
  const fora = tecnologiasForaDoPortfolio(tokens);
  if (fora.length > 0) {
    return {
      id: "fora-do-portfolio",
      resposta: preencher(assistente.foraDoPortfolio.resposta, { tec: listar(fora) }),
      relacionadas: perguntasDe(
        [convenceu ? melhor.item.id : "", "tecnologias", "nivel", "projetos"],
        new Set(),
      ).slice(0, 3),
      confianca: "alta",
    };
  }

  // 4) Nada convincente: resposta padrão com caminhos possíveis.
  if (!convenceu) {
    const proximos = candidatos.filter((c) => c.pontos > 1.5).slice(0, 3).map((c) => c.item.id);
    return {
      id: null,
      resposta: semResposta,
      relacionadas: perguntasDe([...proximos, ...RELACIONADAS_PADRAO], new Set()).slice(0, 3),
      confianca: "nenhuma",
    };
  }

  // 5) Resposta encontrada. "Veja também": as indicadas pelo autor + as vizinhas que quase ganharam.
  const alta = melhor.pontos >= ALTA;
  const vizinhas = candidatos
    .slice(1)
    .filter((c) => c.pontos >= Math.max(MINIMO, melhor.pontos * 0.45))
    .map((c) => c.item.id);
  const relacionadas = perguntasDe(
    [...(melhor.item.relacionadas ?? []), ...vizinhas],
    new Set([melhor.item.id]),
  ).slice(0, 3);

  const resposta = preencher(melhor.item.resposta);
  return {
    id: melhor.item.id,
    resposta: alta ? resposta : PREFIXO_INCERTO + resposta,
    relacionadas,
    confianca: alta ? "alta" : "media",
  };
}
