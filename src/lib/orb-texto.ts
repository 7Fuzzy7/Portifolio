/* =============================================================================
 *  orb-texto.ts — transforma um texto (o seu nome) numa nuvem de pontos.
 *
 *  Como funciona
 *   1. Desenha o texto num canvas 2D invisível, com a MESMA fonte do site;
 *   2. lê os pixels e descobre onde ficam as letras;
 *   3. sorteia pontos dentro das letras (uma grade com sorteio em cada célula,
 *      para a borda ficar orgânica e não "quadriculada").
 *  O orb.ts transforma esses pontos em partículas no centro da esfera.
 * ========================================================================== */

import { criarAleatorio } from "./orb";

export type FonteTexto = { familia: string; peso: string };

/** Divide o texto em até 2 linhas equilibradas (ex.: "Pedro Martins" / "de Almeida"). */
export function dividirEmLinhas(texto: string): string[] {
  const limpo = texto.trim().replace(/\s+/g, " ");
  const palavras = limpo.split(" ");
  if (palavras.length < 3 || limpo.length <= 12) return [limpo];

  let melhor = 1;
  let menorDiferenca = Infinity;
  for (let i = 1; i < palavras.length; i++) {
    const a = palavras.slice(0, i).join(" ").length;
    const b = palavras.slice(i).join(" ").length;
    if (Math.abs(a - b) < menorDiferenca) {
      menorDiferenca = Math.abs(a - b);
      melhor = i;
    }
  }
  return [palavras.slice(0, melhor).join(" "), palavras.slice(melhor).join(" ")];
}

/** Lê família e peso da fonte de um elemento da página, para o canvas usar a mesma. */
export function fonteDoElemento(el: Element | null): FonteTexto {
  if (!el) return { familia: "system-ui, sans-serif", peso: "700" };
  const estilo = getComputedStyle(el);
  return { familia: estilo.fontFamily, peso: estilo.fontWeight };
}

/**
 * Gera cerca de `alvo` pontos (pares x,y numa lista plana) cobrindo as letras.
 * A largura total do texto vale `largura` (na unidade da esfera, onde o raio é 1)
 * e o conjunto fica centralizado em (0, 0), com o eixo y para cima.
 */
export async function amostrarTexto(
  texto: string,
  fonte: FonteTexto,
  alvo: number,
  largura: number,
): Promise<Float32Array> {
  const vazio = new Float32Array(0);
  const linhas = dividirEmLinhas(texto);
  const tamanho = 200; // px usados só na rasterização (a resolução da "máscara")
  const fonteCss = `${fonte.peso} ${tamanho}px ${fonte.familia}`;

  // Garante que a fonte já chegou; sem isso o canvas desenharia com uma fonte reserva.
  try {
    await document.fonts.load(fonteCss, texto);
  } catch {
    /* segue com o que houver */
  }

  const medidor = document.createElement("canvas").getContext("2d");
  if (!medidor) return vazio;
  medidor.font = fonteCss;
  const maiorLinha = Math.max(...linhas.map((l) => medidor.measureText(l).width));

  const margem = 24;
  const alturaLinha = tamanho * 1.05;
  const W = Math.ceil(maiorLinha + margem * 2);
  const H = Math.ceil(alturaLinha * linhas.length + margem * 2);

  const tela = document.createElement("canvas");
  tela.width = W;
  tela.height = H;
  const ctx = tela.getContext("2d", { willReadFrequently: true });
  if (!ctx) return vazio;
  ctx.font = fonteCss;
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  linhas.forEach((linha, i) => ctx.fillText(linha, W / 2, margem + alturaLinha * (i + 0.5)));

  const pixels = ctx.getImageData(0, 0, W, H).data;
  const coberto = (x: number, y: number) => pixels[(y * W + x) * 4 + 3] > 127;

  // Caixa que realmente contém as letras e quantos pixels elas cobrem.
  let minX = W;
  let maxX = 0;
  let minY = H;
  let maxY = 0;
  let cobertos = 0;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (!coberto(x, y)) continue;
      cobertos++;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
  if (cobertos === 0 || maxX <= minX) return vazio;

  // Passo da grade que rende ≈ `alvo` pontos.
  const passo = Math.max(1.5, Math.sqrt(cobertos / alvo));
  const centroX = (minX + maxX) / 2;
  const centroY = (minY + maxY) / 2;
  const escala = largura / (maxX - minX);
  const aleatorio = criarAleatorio(7919);

  const pontos: number[] = [];
  for (let y = minY; y <= maxY; y += passo) {
    for (let x = minX; x <= maxX; x += passo) {
      const px = x + aleatorio() * passo;
      const py = y + aleatorio() * passo;
      const ix = Math.min(W - 1, Math.floor(px));
      const iy = Math.min(H - 1, Math.floor(py));
      if (coberto(ix, iy)) pontos.push((px - centroX) * escala, -(py - centroY) * escala);
    }
  }
  return new Float32Array(pontos);
}
