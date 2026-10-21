/* =============================================================================
 *  Rota do assistente com IA — OPCIONAL.
 *
 *  Enquanto `assistente.modo` estiver como "offline" no content.ts, esta rota
 *  NÃO é chamada e o site não gasta nada.
 *
 *  Para ligar a IA de verdade:
 *   1. Pegue uma chave em https://console.anthropic.com
 *   2. Crie um arquivo .env.local na raiz do projeto com:
 *        ANTHROPIC_API_KEY=sua_chave_aqui
 *   3. Na Vercel: Settings → Environment Variables → adicione ANTHROPIC_API_KEY
 *   4. No content.ts, troque `modo: "offline"` por `modo: "api"`
 *
 *  ⚠️ A chave fica só no servidor. Nunca coloque a chave no content.ts nem em
 *     qualquer arquivo que vá para o GitHub.
 * ========================================================================== */

import { NextResponse } from "next/server";
import {
  pessoal,
  sobre,
  habilidades,
  projetos,
  experiencia,
  contato,
  assistente,
} from "@/data/content";
import { preencher } from "@/lib/assistente";

export const runtime = "nodejs";

/** Confira a lista de modelos disponíveis no console da Anthropic. */
const MODELO = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-5";

/** Monta o dossiê que a IA recebe — sempre a partir do content.ts. */
function contexto(): string {
  const linhas: string[] = [
    `Nome: ${pessoal.nome}`,
    `Cargo atual: ${pessoal.cargo} na ${pessoal.empresa}`,
    `Cidade: ${pessoal.cidade}`,
    `E-mail: ${pessoal.email}`,
    `LinkedIn: ${pessoal.linkedin}`,
    `GitHub: ${pessoal.github}`,
    "",
    "SOBRE:",
    ...sobre.paragrafos,
    "",
    "HABILIDADES:",
    ...habilidades.grupos.map((g) => `- ${g.titulo}: ${g.itens.join(", ")}`),
    "",
    "PROJETOS:",
    ...projetos.itens.map(
      (p) =>
        `- ${p.titulo} (${p.contexto}, ${p.ano}). Problema: ${p.problema} Solução: ${p.solucao} Resultado: ${p.resultado} Stack: ${p.stack.join(", ")}.`,
    ),
    "",
    "EXPERIÊNCIA:",
    ...experiencia.cargos.map(
      (c) =>
        `- ${c.cargo} na ${c.empresa} (${c.de} a ${c.ate}, ${c.local}): ${c.descricao}`,
    ),
    "",
    "FORMAÇÃO:",
    ...experiencia.formacao.map(
      (f) => `- ${f.curso}, ${f.instituicao} (${f.periodo})`,
    ),
    "",
    "CERTIFICAÇÕES:",
    ...experiencia.certificacoes.map((c) => `- ${c}`),
    "",
    `DISPONIBILIDADE: ${contato.chamada}.`,
    "",
    "RESPOSTAS JÁ ESCRITAS POR " + pessoal.nomeCurto.toUpperCase() + " (use como fonte e como tom):",
    ...assistente.baseDeConhecimento.map(
      (r) => `P: ${r.perguntas[0]}\nR: ${preencher(r.resposta)}`,
    ),
  ];
  return linhas.join("\n");
}

const INSTRUCOES = `Você responde como ${pessoal.nome}, no site do próprio portfólio, a recrutadores e pessoas curiosas sobre a sua carreira.

Regras:
- Responda SEMPRE em português do Brasil, em primeira pessoa ("eu"), em no máximo 4 frases.
- Use apenas as informações do dossiê abaixo e as respostas já escritas. Se a resposta não estiver lá, diga com sinceridade que isso não aparece no portfólio e convide a pessoa a falar direto pelo e-mail ${pessoal.email}.
- Nunca invente empregos, datas, números, notas, salário, nível de inglês ou tecnologias.
- Escreva como uma pessoa escreveria à mão: frases curtas, sem travessão (—), sem ponto médio (·) e sem o símbolo ×. Use vírgula, ponto ou dois-pontos.

DOSSIÊ:
${contexto()}`;

export async function POST(request: Request) {
  const chave = process.env.ANTHROPIC_API_KEY;

  if (!chave) {
    return NextResponse.json(
      {
        resposta:
          "O modo com IA está ativado, mas a variável ANTHROPIC_API_KEY não foi configurada. Volte o content.ts para modo: \"offline\" ou configure a chave.",
      },
      { status: 503 },
    );
  }

  let pergunta = "";
  try {
    const corpo = await request.json();
    pergunta = String(corpo?.pergunta ?? "").slice(0, 1000);
  } catch {
    return NextResponse.json({ resposta: "Pergunta inválida." }, { status: 400 });
  }

  if (!pergunta.trim()) {
    return NextResponse.json({ resposta: "Escreva uma pergunta." }, { status: 400 });
  }

  try {
    const resposta = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": chave,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODELO,
        max_tokens: 400,
        system: INSTRUCOES,
        messages: [{ role: "user", content: pergunta }],
      }),
    });

    if (!resposta.ok) {
      return NextResponse.json(
        { resposta: "Não consegui responder agora. Tente de novo em instantes." },
        { status: 502 },
      );
    }

    const dados = await resposta.json();
    const texto = dados?.content?.[0]?.text;

    return NextResponse.json({
      resposta:
        typeof texto === "string" && texto.trim()
          ? texto.trim()
          : "Não consegui responder agora. Tente de novo em instantes.",
    });
  } catch {
    return NextResponse.json(
      { resposta: "Não consegui responder agora. Tente de novo em instantes." },
      { status: 502 },
    );
  }
}
