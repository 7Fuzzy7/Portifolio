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
} from "@/data/content";

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
      (f) => `- ${f.curso} — ${f.instituicao} (${f.periodo})`,
    ),
    "",
    "CERTIFICAÇÕES:",
    ...experiencia.certificacoes.map((c) => `- ${c}`),
    "",
    `DISPONIBILIDADE: ${contato.chamada}.`,
  ];
  return linhas.join("\n");
}

const INSTRUCOES = `Você é o assistente do portfólio de ${pessoal.nome} e responde a recrutadores e pessoas curiosas sobre a carreira dele.

Regras:
- Responda SEMPRE em português do Brasil, em no máximo 4 frases.
- Use apenas as informações do dossiê abaixo. Se a resposta não estiver lá, diga que não tem essa informação e sugira falar direto com o ${pessoal.nomeCurto} pelo e-mail ${pessoal.email}.
- Nunca invente empregos, datas, números, notas ou tecnologias.
- Fale do ${pessoal.nomeCurto} na terceira pessoa, em tom profissional e direto.

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
