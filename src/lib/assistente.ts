import { assistente } from "@/data/content";

/**
 * Deixa o texto comparável: minúsculo, sem acento e sem pontuação.
 * "Onde ele ESTUDOU?" -> "onde ele estudou"
 */
export function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Escolhe a melhor resposta da base de conhecimento do content.ts.
 * Pontuação: expressões com mais palavras e mais específicas valem mais,
 * para "visão computacional" ganhar de "projetos" numa mesma pergunta.
 */
export function responder(pergunta: string): string {
  const texto = normalizar(pergunta);
  if (!texto) return assistente.semResposta;

  let melhorPontuacao = 0;
  let melhorResposta = assistente.semResposta;

  for (const item of assistente.baseDeConhecimento) {
    let pontos = 0;

    for (const palavra of item.palavras) {
      const chave = normalizar(palavra);
      if (!chave || !texto.includes(chave)) continue;
      const palavrasNaChave = chave.split(" ").length;
      pontos += palavrasNaChave * 3 + chave.length * 0.2;
    }

    if (pontos > melhorPontuacao) {
      melhorPontuacao = pontos;
      melhorResposta = item.resposta;
    }
  }

  return melhorResposta;
}
