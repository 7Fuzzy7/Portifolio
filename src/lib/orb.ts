/* =============================================================================
 *  orb.ts — esfera de partículas em WebGL puro (sem Three.js, ~6 kB).
 *
 *  Como funciona
 *   • Cada ponto nasce na CPU uma vez só (posição + sementes aleatórias) e vai
 *     para a GPU. Daí em diante TUDO é calculado no vertex shader: rotação,
 *     ondulação, chegada, dispersão, reação ao mouse e cor.
 *   • Quatro tipos de ponto: CASCA (a superfície, em espiral de Fibonacci),
 *     FAIXA (cinturão turbulento no equador), POEIRA (pontos soltos em volta)
 *     e TEXTO (os pontos que desenham o nome no centro da esfera — veja
 *     orb-texto.ts, que transforma um texto numa nuvem de pontos).
 *   • Quem anima é o Motion: este arquivo só expõe `params` (um objeto simples)
 *     e o Orb.tsx faz `animate(params, {...})`, springs e useScroll em cima.
 *
 *  Para ajustar o visual, mexa nas constantes dos shaders (função `ramp`, com as
 *  cores `cDeep`, `cMid`, `cHot`, `cWhite`) ou nas proporções em `gerar()`.
 * ========================================================================== */

/** Valores que o Motion anima. Todos são números simples. */
export type OrbParams = {
  /** 0 = pontos soltos ("dado bruto") → 1 = esfera formada e nome escrito. */
  assemble: number;
  /** Quanto a superfície ondula (0 calmo … 1 agitado). */
  amp: number;
  /** Velocidade do tempo/rotação (1 = normal, 0 = parado). */
  speed: number;
  /** Brilho geral. */
  glow: number;
  /** 0 → 1 enquanto a esfera sai da tela: ela se dispersa e some. */
  scroll: number;
  /** Entre 0 e 1 (exclusivo) uma onda de luz atravessa a esfera. */
  pulse: number;
  /** Inclinação (radianos) causada pelo mouse. */
  tiltX: number;
  tiltY: number;
  /** Posição do mouse no espaço do canvas (-1…1) e força de repulsão (0…1). */
  pointerX: number;
  pointerY: number;
  pointerForce: number;
};

export type OrbOpcoes = {
  /** Quantidade de partículas da esfera (casca + faixa + poeira) na qualidade máxima. */
  particulas: number;
  /** Teto da densidade de pixels (2 no desktop, ~1.5 no celular). */
  dprMax: number;
  /** Raio da esfera como fração da metade do menor lado do canvas. */
  raio: number;
  /** Fração das partículas que formam a faixa do equador (padrão 0.31; 0 = sem faixa). */
  faixa?: number;
  /** Fração de poeira solta em volta da esfera (padrão 0.11). */
  poeira?: number;
  /**
   * Pontos do nome, no centro da esfera: pares x,y em raios da esfera, centrados
   * em (0,0). São somados às `particulas` e sempre desenhados por inteiro.
   */
  texto?: Float32Array;
  /** Deslocamento do centro da esfera no canvas, em coordenadas de clip (-1…1). */
  deslocamento?: [number, number];
  /** Se true (padrão), reduz partículas sozinho quando o aparelho engasga. */
  adaptativo?: boolean;
};

export type OrbHandle = {
  params: OrbParams;
  /** Recalcula tamanho do canvas (chame quando o container mudar). */
  resize: () => void;
  /** Liga o laço de animação. */
  start: () => void;
  /** Pausa o laço (fora da tela, aba escondida…). */
  stop: () => void;
  /** Desenha um único quadro agora (modo "menos movimento"). */
  renderFrame: () => void;
  /** Libera programa e buffers. */
  dispose: () => void;
};

/* -----------------------------------------------------------------------------
 *  Shaders
 * -------------------------------------------------------------------------- */
const VERTEX = /* glsl */ `
precision highp float;

attribute vec4 aA; // xyz = direção na esfera (texto: x,y da letra), w = tipo (0 casca, 1 faixa, 2 poeira, 3 texto)
attribute vec4 aB; // sementes aleatórias

uniform float uTime;
uniform float uAssemble;
uniform float uAmp;
uniform float uGlow;
uniform float uScroll;
uniform float uPulse;
uniform float uPx;
uniform float uAspect;
uniform vec2  uTilt;
uniform vec2  uFit;
uniform vec2  uOffset;
uniform vec3  uPointer; // xy no espaço de clip, z = força

varying vec3  vColor;
varying float vAlpha;

float hash(vec3 p) {
  p = fract(p * 0.3183099 + 0.1);
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}

float noise(vec3 x) {
  vec3 i = floor(x);
  vec3 f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(mix(hash(i), hash(i + vec3(1.0, 0.0, 0.0)), f.x),
        mix(hash(i + vec3(0.0, 1.0, 0.0)), hash(i + vec3(1.0, 1.0, 0.0)), f.x), f.y),
    mix(mix(hash(i + vec3(0.0, 0.0, 1.0)), hash(i + vec3(1.0, 0.0, 1.0)), f.x),
        mix(hash(i + vec3(0.0, 1.0, 1.0)), hash(i + vec3(1.0, 1.0, 1.0)), f.x), f.y),
    f.z);
}

mat3 rotY(float a) {
  float c = cos(a);
  float s = sin(a);
  return mat3(c, 0.0, -s, 0.0, 1.0, 0.0, s, 0.0, c);
}

mat3 rotX(float a) {
  float c = cos(a);
  float s = sin(a);
  return mat3(1.0, 0.0, 0.0, 0.0, c, s, 0.0, -s, c);
}

// Rampa de cor: 0 = laranja escuro … 1 = creme quase branco.
vec3 ramp(float heat) {
  vec3 cDeep = vec3(0.55, 0.16, 0.03);
  vec3 cMid = vec3(1.00, 0.46, 0.08);
  vec3 cHot = vec3(1.00, 0.78, 0.26);
  vec3 cWhite = vec3(1.00, 0.95, 0.80);
  vec3 col = mix(cDeep, cMid, smoothstep(0.0, 0.40, heat));
  col = mix(col, cHot, smoothstep(0.35, 0.75, heat));
  return mix(col, cWhite, smoothstep(0.75, 1.0, heat));
}

void main() {
  vec3 dir = aA.xyz;
  float kind = aA.w;

  vec3 p;       // posição final no mundo (já com as rotações da câmera)
  vec3 col;
  float a;
  float size;

  if (kind > 2.5) {
    // ---------- TEXTO: o nome, desenhado com pontos no centro da esfera ----------
    // Cada ponto fica num plano (z ≈ 0) de frente para quem olha, com bordas
    // levemente irregulares e um tremor lento para o nome "respirar".
    vec3 tp = vec3(dir.xy + (aB.zw - 0.5) * 0.006, (aB.z - 0.5) * 0.06);
    vec2 jit = vec2(
      noise(vec3(dir.xy * 6.0, uTime * 0.45)),
      noise(vec3(dir.yx * 6.0 + 9.0, uTime * 0.45))) - 0.5;
    tp.xy += jit * 0.010 * (0.6 + uAmp);

    // Chegada: o ponto sai da região da casca e se encaixa na letra,
    // da esquerda para a direita (como se o nome estivesse sendo escrito).
    vec3 origem = normalize(vec3(aB.w, aB.x, aB.y) - 0.5 + 0.0001) * (0.9 + 0.6 * aB.y);
    float atraso = 0.28 + clamp(dir.x * 0.6 + 0.5, 0.0, 1.0) * 0.24 + aB.x * 0.08;
    float t = clamp((uAssemble - atraso) / 0.40, 0.0, 1.0);
    t = 1.0 - pow(1.0 - t, 3.0);
    p = rotY((1.0 - t) * 2.2) * mix(origem, tp, t);

    // Saindo da tela: o nome se dispersa junto com a esfera.
    p *= 1.0 + uScroll * (0.5 + 1.2 * aB.z) * 0.85;

    // O nome acompanha só um pouco a inclinação (para continuar legível).
    p = rotX(uTilt.x * 0.5) * rotY(uTilt.y * 0.5) * p;

    // Cor: amarelo-claro à esquerda, laranja à direita (como a luz na esfera).
    float xn = clamp(dir.x * 0.65, -1.0, 1.0);
    float heat = clamp(0.62 - 0.30 * xn + 0.30 * (aB.y - 0.5), 0.0, 1.0);
    col = ramp(heat);

    a = (0.78 + 0.45 * aB.x) * uGlow * (0.86 + 0.14 * sin(uTime * 2.2 + aB.w * 50.0));
    a *= mix(0.10, 1.0, t);
    size = (1.0 + 0.9 * aB.x * aB.x) * 1.15;
  } else {
    // ---------- CASCA / FAIXA / POEIRA ----------
    float isBelt = step(0.5, kind) - step(1.5, kind);
    float isDust = step(1.5, kind);
    float isShell = 1.0 - isBelt - isDust;

    // Rotação própria: a faixa gira mais rápido que a casca (bandas de planeta).
    float spin = uTime * (0.16 + 0.24 * isBelt * (0.55 + aB.y) + 0.06 * isDust);
    mat3 giro = rotY(spin);
    vec3 d0 = giro * dir;

    // Ondulação orgânica da superfície.
    float n1 = noise(d0 * 1.9 + vec3(0.0, uTime * 0.22, uTime * 0.17));
    float n2 = noise(d0 * 4.3 - vec3(uTime * 0.31, 0.0, uTime * 0.2));
    float wob = (n1 - 0.5) * 0.9 + (n2 - 0.5) * 0.35;

    float rShell = 1.0 + (aB.z - 0.5) * 0.010;
    float rBelt = 0.58 + 0.52 * aB.z;
    float rDust = 1.14 + 0.62 * aB.z * aB.z;
    float r = rShell * isShell + rBelt * isBelt + rDust * isDust;
    r += wob * uAmp * (0.045 * isShell + 0.22 * isBelt + 0.30 * isDust);

    // Onda de luz (resposta do assistente): varre a esfera de baixo para cima.
    float q = (d0.y - (uPulse * 2.8 - 1.4)) * 3.0;
    float wave = exp(-q * q) * step(0.001, uPulse) * step(uPulse, 0.999);
    r += wave * 0.07;

    p = d0 * r;

    // Chegada: cada ponto voa de um lugar aleatório até a posição final.
    vec3 scatter = (vec3(fract(aB.x * 7.31 + aB.w), fract(aB.y * 5.17 + aB.x), fract(aB.w * 3.77 + aB.y)) - 0.5) * 6.0;
    float t = clamp((uAssemble - aB.x * 0.45) / 0.55, 0.0, 1.0);
    t = 1.0 - pow(1.0 - t, 3.0);
    p = rotY((1.0 - t) * 2.4) * mix(scatter, p, t);

    // Saindo da tela: a esfera se abre e se dispersa.
    p *= 1.0 + uScroll * (0.35 + 1.4 * aB.z * aB.z) * 0.85;

    // Inclinação base + reação ao mouse.
    mat3 view = rotX(0.30 + uTilt.x) * rotY(uTilt.y);
    p = view * p;

    // Luz: de cima/esquerda, com brilho forte na borda (rim light).
    vec3 nrm = normalize(view * (giro * dir));
    float facing = nrm.z;
    float rim = pow(1.0 - abs(facing), 2.6);
    float diff = max(dot(nrm, normalize(vec3(-0.65, 0.40, 0.65))), 0.0);
    float front = smoothstep(-0.25, 0.35, facing);

    float heat = clamp(0.15 + 0.70 * diff + 0.62 * rim + 0.25 * (aB.y - 0.5) + wave * 0.6, 0.0, 1.0);
    col = ramp(heat);

    a = 0.0;
    a += isShell * (0.16 + 1.15 * rim + 0.42 * diff * front) * mix(0.30, 1.0, front);
    a += isBelt * (0.55 + 0.95 * diff + 0.45 * rim) * mix(0.5, 1.0, front);
    a += isDust * 0.34;
    a *= uGlow * (0.82 + 0.18 * sin(uTime * 2.0 + aB.w * 60.0));
    a *= mix(0.12, 1.0, t);

    size = (0.9 + 1.1 * aB.x * aB.x) * (0.8 + 1.1 * rim * isShell + 0.8 * isBelt);
  }

  // ---------- projeção, mouse e saída (iguais para todos os tipos) ----------
  float cam = 3.6;
  float persp = cam / max(cam - p.z, 0.6);
  vec2 c = p.xy * persp * uFit + uOffset;
  // Pontos que chegam perto da borda do canvas esmaecem (sem corte seco).
  float borda = 1.0 - smoothstep(0.80, 1.0, max(abs(c.x), abs(c.y)));

  // O mouse empurra os pontos para longe.
  vec2 dv = c - uPointer.xy;
  dv.x *= uAspect;
  float dist = length(dv);
  float push = smoothstep(0.42, 0.0, dist) * uPointer.z;
  vec2 away = dv / max(dist, 0.0001);
  away.x /= uAspect;
  c += away * push * (0.035 + 0.085 * aB.w);

  gl_Position = vec4(c, 0.0, 1.0);

  a *= (1.0 - smoothstep(0.05, 0.8, uScroll)) * borda;
  gl_PointSize = max(1.0, size * uPx * persp);

  vColor = col;
  vAlpha = a;
}
`;

const FRAGMENT = /* glsl */ `
precision mediump float;

varying vec3 vColor;
varying float vAlpha;

void main() {
  vec2 q = gl_PointCoord - 0.5;
  float d = dot(q, q);
  if (d > 0.25) discard;
  float a = (1.0 - smoothstep(0.06, 0.25, d)) * vAlpha;
  gl_FragColor = vec4(vColor * a, a);
}
`;

const UNIFORMS = [
  "uTime",
  "uAssemble",
  "uAmp",
  "uGlow",
  "uScroll",
  "uPulse",
  "uPx",
  "uAspect",
  "uTilt",
  "uFit",
  "uOffset",
  "uPointer",
] as const;

/* -----------------------------------------------------------------------------
 *  Geração dos pontos (CPU, uma vez só)
 * -------------------------------------------------------------------------- */

/** Gerador pseudo-aleatório com semente fixa: a esfera é igual em toda visita. */
export function criarAleatorio(semente: number) {
  let s = semente >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * 8 floats por ponto: aA (dir.xyz + tipo) e aB (4 sementes).
 * Ordem do buffer: [pontos do texto][casca/faixa/poeira embaralhadas].
 */
function gerar(total: number, faixa: number, poeira: number, texto?: Float32Array) {
  const aleatorio = criarAleatorio(20260421);
  const nTexto = texto ? Math.floor(texto.length / 2) : 0;
  const dados = new Float32Array((nTexto + total) * 8);

  // 1) Nome: vem primeiro e nunca é reduzido pela qualidade adaptativa.
  for (let i = 0; i < nTexto && texto; i++) {
    const o = i * 8;
    dados[o] = texto[i * 2];
    dados[o + 1] = texto[i * 2 + 1];
    dados[o + 2] = 0;
    dados[o + 3] = 3;
    dados[o + 4] = aleatorio();
    dados[o + 5] = aleatorio();
    dados[o + 6] = aleatorio();
    dados[o + 7] = aleatorio();
  }

  // 2) Esfera.
  const base = nTexto * 8;
  const nFaixa = Math.round(total * faixa);
  const nPoeira = Math.round(total * poeira);
  const nCasca = total - nFaixa - nPoeira;
  const angulo = Math.PI * (3 - Math.sqrt(5)); // ângulo áureo

  for (let i = 0; i < total; i++) {
    let x: number;
    let y: number;
    let z: number;
    let tipo: number;

    if (i < nCasca) {
      // Espiral de Fibonacci: distribui os pontos de forma quase uniforme.
      tipo = 0;
      y = 1 - (2 * (i + 0.5)) / nCasca;
      const raio = Math.sqrt(1 - y * y);
      const fi = i * angulo;
      x = Math.cos(fi) * raio;
      z = Math.sin(fi) * raio;
    } else if (i < nCasca + nFaixa) {
      // Faixa: concentrada no equador (soma de aleatórios ≈ curva em sino).
      tipo = 1;
      y = (aleatorio() + aleatorio() + aleatorio() - 1.5) * 0.42;
      const raio = Math.sqrt(Math.max(0, 1 - y * y));
      const fi = aleatorio() * Math.PI * 2;
      x = Math.cos(fi) * raio;
      z = Math.sin(fi) * raio;
    } else {
      // Poeira: direção uniforme em toda a esfera.
      tipo = 2;
      y = aleatorio() * 2 - 1;
      const raio = Math.sqrt(1 - y * y);
      const fi = aleatorio() * Math.PI * 2;
      x = Math.cos(fi) * raio;
      z = Math.sin(fi) * raio;
    }

    const o = base + i * 8;
    dados[o] = x;
    dados[o + 1] = y;
    dados[o + 2] = z;
    dados[o + 3] = tipo;
    dados[o + 4] = aleatorio();
    dados[o + 5] = aleatorio();
    dados[o + 6] = aleatorio();
    dados[o + 7] = aleatorio();
  }

  // Embaralha só o bloco da esfera: qualquer "prefixo" dele vira uma amostra
  // justa dos três tipos, o que permite reduzir a qualidade só desenhando menos pontos.
  const troca = new Float32Array(8);
  for (let i = total - 1; i > 0; i--) {
    const j = Math.floor(aleatorio() * (i + 1));
    if (i === j) continue;
    const a = base + i * 8;
    const b = base + j * 8;
    troca.set(dados.subarray(a, a + 8));
    dados.copyWithin(a, b, b + 8);
    dados.set(troca, b);
  }

  return { dados, nTexto };
}

/* -----------------------------------------------------------------------------
 *  WebGL
 * -------------------------------------------------------------------------- */
function compilar(gl: WebGLRenderingContext, tipo: number, fonte: string) {
  const shader = gl.createShader(tipo);
  if (!shader) return null;
  gl.shaderSource(shader, fonte);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn("[orb] erro no shader:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function criarPrograma(gl: WebGLRenderingContext) {
  const vs = compilar(gl, gl.VERTEX_SHADER, VERTEX);
  const fs = compilar(gl, gl.FRAGMENT_SHADER, FRAGMENT);
  if (!vs || !fs) return null;
  const programa = gl.createProgram();
  if (!programa) return null;
  gl.attachShader(programa, vs);
  gl.attachShader(programa, fs);
  gl.linkProgram(programa);
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  if (!gl.getProgramParameter(programa, gl.LINK_STATUS)) {
    console.warn("[orb] erro ao ligar o programa:", gl.getProgramInfoLog(programa));
    gl.deleteProgram(programa);
    return null;
  }
  return programa;
}

/** Cria a esfera dentro do canvas. Devolve `null` se o navegador não tiver WebGL. */
export function criarOrb(
  canvas: HTMLCanvasElement,
  opcoes: OrbOpcoes,
): OrbHandle | null {
  const atributos: WebGLContextAttributes = {
    alpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    premultipliedAlpha: true,
    powerPreference: "high-performance",
    preserveDrawingBuffer: false,
  };
  const gl = (canvas.getContext("webgl", atributos) ??
    canvas.getContext("experimental-webgl", atributos)) as WebGLRenderingContext | null;
  if (!gl) return null;

  const params: OrbParams = {
    assemble: 0,
    amp: 0.5,
    speed: 1,
    glow: 1,
    scroll: 0,
    pulse: 0,
    tiltX: 0,
    tiltY: 0,
    pointerX: 0,
    pointerY: 0,
    pointerForce: 0,
  };

  const total = opcoes.particulas;
  const { dados, nTexto } = gerar(
    total,
    opcoes.faixa ?? 0.31,
    opcoes.poeira ?? 0.11,
    opcoes.texto,
  );
  const deslocamento = opcoes.deslocamento ?? [0, 0];
  const adaptativo = opcoes.adaptativo !== false;

  let programa: WebGLProgram | null = null;
  let buffer: WebGLBuffer | null = null;
  const loc: Partial<Record<(typeof UNIFORMS)[number], WebGLUniformLocation | null>> = {};

  let largura = 1;
  let altura = 1;
  let aspecto = 1;
  let encaixe: [number, number] = [opcoes.raio, opcoes.raio];
  let pixelPonto = 1;
  let qualidade = 1;

  let rodando = false;
  let perdido = false;
  let raf = 0;
  let ultimo = 0;
  let tempo = 0;
  let mediaQuadro = 1 / 60;
  let amostras = 0;

  function montar(): boolean {
    if (!gl) return false;
    programa = criarPrograma(gl);
    if (!programa) return false;
    gl.useProgram(programa);

    buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, dados, gl.STATIC_DRAW);

    const locA = gl.getAttribLocation(programa, "aA");
    const locB = gl.getAttribLocation(programa, "aB");
    gl.enableVertexAttribArray(locA);
    gl.vertexAttribPointer(locA, 4, gl.FLOAT, false, 32, 0);
    gl.enableVertexAttribArray(locB);
    gl.vertexAttribPointer(locB, 4, gl.FLOAT, false, 32, 16);

    for (const nome of UNIFORMS) loc[nome] = gl.getUniformLocation(programa, nome);

    // Soma de luz: onde os pontos se acumulam, a cor "queima" para branco.
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE);
    gl.disable(gl.DEPTH_TEST);
    gl.clearColor(0, 0, 0, 0);
    return true;
  }

  function resize() {
    if (!gl) return;
    const cw = Math.max(1, canvas.clientWidth);
    const ch = Math.max(1, canvas.clientHeight);
    const dpr = Math.min(window.devicePixelRatio || 1, opcoes.dprMax);
    const pw = Math.round(cw * dpr);
    const ph = Math.round(ch * dpr);
    if (canvas.width !== pw || canvas.height !== ph) {
      canvas.width = pw;
      canvas.height = ph;
    }
    largura = pw;
    altura = ph;
    aspecto = pw / ph;
    const k = opcoes.raio;
    encaixe = aspecto >= 1 ? [k / aspecto, k] : [k, k * aspecto];
    // Pontos proporcionais ao diâmetro da esfera na tela.
    const diametroCss = k * Math.min(cw, ch);
    pixelPonto = dpr * Math.min(1.5, Math.max(0.45, diametroCss / 560));
  }

  function desenhar() {
    if (!gl || !programa || perdido) return;
    gl.viewport(0, 0, largura, altura);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.uniform1f(loc.uTime ?? null, tempo);
    gl.uniform1f(loc.uAssemble ?? null, params.assemble);
    gl.uniform1f(loc.uAmp ?? null, params.amp);
    gl.uniform1f(loc.uGlow ?? null, params.glow);
    gl.uniform1f(loc.uScroll ?? null, params.scroll);
    gl.uniform1f(loc.uPulse ?? null, params.pulse);
    gl.uniform1f(loc.uPx ?? null, pixelPonto);
    gl.uniform1f(loc.uAspect ?? null, aspecto);
    gl.uniform2f(loc.uTilt ?? null, params.tiltX, params.tiltY);
    gl.uniform2f(loc.uFit ?? null, encaixe[0], encaixe[1]);
    gl.uniform2f(loc.uOffset ?? null, deslocamento[0], deslocamento[1]);
    gl.uniform3f(loc.uPointer ?? null, params.pointerX, params.pointerY, params.pointerForce);

    // O nome (primeiros pontos) é sempre desenhado inteiro; só a esfera perde pontos.
    gl.drawArrays(gl.POINTS, 0, nTexto + Math.floor(total * qualidade));
  }

  /** Se o aparelho engasgar, desenha menos pontos em vez de perder fluidez. */
  function adaptar(dt: number) {
    if (!adaptativo) return;
    mediaQuadro = mediaQuadro * 0.92 + dt * 0.08;
    amostras++;
    if (amostras >= 90 && mediaQuadro > 0.03 && qualidade > 0.4) {
      qualidade = Math.max(0.4, qualidade * 0.72);
      amostras = 0;
      mediaQuadro = 1 / 60;
    }
  }

  function laco(agora: number) {
    raf = requestAnimationFrame(laco);
    const dt = Math.min((agora - ultimo) / 1000, 0.1);
    ultimo = agora;
    tempo += dt * params.speed;
    desenhar();
    adaptar(dt);
  }

  function start() {
    if (rodando || perdido) return;
    rodando = true;
    ultimo = performance.now();
    raf = requestAnimationFrame(laco);
  }

  function stop() {
    rodando = false;
    cancelAnimationFrame(raf);
  }

  // O navegador pode derrubar o contexto (troca de GPU, muitas abas…).
  // Ao voltar, remonta tudo e retoma a animação se ela estava rodando.
  let retomar = false;
  const aoPerder = (e: Event) => {
    e.preventDefault();
    perdido = true;
    retomar = rodando;
    stop();
  };
  const aoRestaurar = () => {
    perdido = false;
    if (montar()) {
      resize();
      desenhar();
      if (retomar) start();
    }
  };
  canvas.addEventListener("webglcontextlost", aoPerder);
  canvas.addEventListener("webglcontextrestored", aoRestaurar);

  if (!montar()) {
    canvas.removeEventListener("webglcontextlost", aoPerder);
    canvas.removeEventListener("webglcontextrestored", aoRestaurar);
    return null;
  }
  resize();

  return {
    params,
    resize,
    start,
    stop,
    renderFrame: desenhar,
    dispose() {
      stop();
      canvas.removeEventListener("webglcontextlost", aoPerder);
      canvas.removeEventListener("webglcontextrestored", aoRestaurar);
      if (gl) {
        if (buffer) gl.deleteBuffer(buffer);
        if (programa) gl.deleteProgram(programa);
      }
      buffer = null;
      programa = null;
    },
  };
}
