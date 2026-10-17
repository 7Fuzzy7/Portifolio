"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import {
  animate,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from "motion/react";
import { criarOrb, type OrbHandle, type OrbParams } from "@/lib/orb";
import { amostrarTexto, fonteDoElemento } from "@/lib/orb-texto";

export type EstadoOrb = "ocioso" | "pensando";

type Props = {
  /** `hero`: grande, reage ao mouse e à rolagem. `avatar`: pequena, para o chat. */
  variante?: "hero" | "avatar";
  /** `pensando` deixa a esfera mais agitada, rápida e brilhante. */
  estado?: EstadoOrb;
  /** Mude esse número para disparar uma onda de luz (ex.: chegou uma resposta). */
  pulso?: number;
  /** Texto (o seu nome) desenhado com partículas no centro da esfera. Só na variante `hero`. */
  texto?: string;
  /** Elemento HTML cuja fonte (família e peso) é usada para desenhar o `texto`. */
  fonteDe?: RefObject<HTMLElement | null>;
  /**
   * Diz onde o nome está: "particulas" (já dentro da esfera) ou "html" (a esfera não
   * pôde ser criada, então quem chamou deve mostrar o nome em texto normal).
   */
  onEstado?: (estado: "particulas" | "html") => void;
  /** Tamanho e posição: o canvas ocupa 100% do elemento. */
  className?: string;
};

type Preset = {
  particulas: number;
  particulasCelular: number;
  faixa: number;
  poeira: number;
  raio: number;
  dprMax: number;
  dprMaxCelular: number;
  /** Duração (s) da chegada dos pontos. */
  chegada: number;
  /** Pontos do nome: `largura` em raios da esfera; `alvo` = quantidade de partículas. */
  texto?: { largura: number; alvo: number; alvoCelular: number };
};

/** Configuração de cada variante. `celular` vale para telas pequenas ou aparelhos fracos. */
const PRESETS: Record<"hero" | "avatar", Preset> = {
  hero: {
    particulas: 30000,
    particulasCelular: 13000,
    faixa: 0, // a "faixa" brilhante deu lugar ao nome
    poeira: 0.16,
    raio: 0.5,
    dprMax: 2,
    dprMaxCelular: 1.5,
    chegada: 4,
    texto: { largura: 1.62, alvo: 10000, alvoCelular: 5800 },
  },
  avatar: {
    particulas: 7000,
    particulasCelular: 7000,
    faixa: 0.31,
    poeira: 0.11,
    raio: 0.78,
    dprMax: 2,
    dprMaxCelular: 2,
    chegada: 1.6,
  },
};

/** O que cada estado faz com a esfera. O Motion faz a transição suave entre eles. */
const ESTADOS: Record<EstadoOrb, Partial<OrbParams>> = {
  ocioso: { amp: 0.5, speed: 1, glow: 1 },
  pensando: { amp: 1.25, speed: 2.8, glow: 1.4 },
};

const limitar = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));

/**
 * Esfera de partículas. O desenho é feito em WebGL (src/lib/orb.ts); aqui o
 * Motion cuida de tudo o que é movimento:
 *   • animate()        → chegada dos pontos, troca de estado e onda de luz
 *   • useSpring()      → mouse com inércia
 *   • useScroll()      → a esfera se dispersa ao sair da tela
 * Sem WebGL, ou com "reduzir movimento" ligado, ela vira uma imagem parada.
 */
export default function Orb({
  variante = "hero",
  estado = "ocioso",
  pulso = 0,
  texto,
  fonteDe,
  onEstado,
  className,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const orbRef = useRef<OrbHandle | null>(null);
  const [pronto, setPronto] = useState(false);

  // O callback pode mudar a cada render; guardamos o mais novo sem recriar a esfera.
  const onEstadoRef = useRef(onEstado);
  useEffect(() => {
    onEstadoRef.current = onEstado;
  });

  // Mouse: valor bruto → versão suavizada por mola → uniform do shader.
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const mouseForca = useMotionValue(0);
  const inclinaX = useMotionValue(0);
  const inclinaY = useMotionValue(0);
  const mola = { stiffness: 150, damping: 24, mass: 0.5 };
  const molaLenta = { stiffness: 55, damping: 18, mass: 1 };
  const suaveX = useSpring(mouseX, mola);
  const suaveY = useSpring(mouseY, mola);
  const suaveForca = useSpring(mouseForca, { stiffness: 90, damping: 20 });
  const suaveInclinaX = useSpring(inclinaX, molaLenta);
  const suaveInclinaY = useSpring(inclinaY, molaLenta);
  const { scrollY } = useScroll();

  useMotionValueEvent(suaveX, "change", (v) => {
    if (orbRef.current) orbRef.current.params.pointerX = v;
  });
  useMotionValueEvent(suaveY, "change", (v) => {
    if (orbRef.current) orbRef.current.params.pointerY = v;
  });
  useMotionValueEvent(suaveForca, "change", (v) => {
    if (orbRef.current) orbRef.current.params.pointerForce = v;
  });
  useMotionValueEvent(suaveInclinaX, "change", (v) => {
    if (orbRef.current) orbRef.current.params.tiltX = v;
  });
  useMotionValueEvent(suaveInclinaY, "change", (v) => {
    if (orbRef.current) orbRef.current.params.tiltY = v;
  });
  useMotionValueEvent(scrollY, "change", (y) => {
    if (variante === "hero" && orbRef.current) {
      orbRef.current.params.scroll = limitar(y / (window.innerHeight * 0.85));
    }
  });

  // Cria a esfera (e os pontos do nome), liga/desliga o laço conforme a
  // visibilidade e faz a chegada.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const preset = PRESETS[variante];
    const reduzir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const celular =
      window.matchMedia("(max-width: 767px)").matches ||
      (navigator.hardwareConcurrency ?? 8) <= 4;

    let cancelado = false;
    let orb: OrbHandle | null = null;
    const limpar: Array<() => void> = [];

    const iniciar = async () => {
      // 1. O nome vira uma nuvem de pontos (precisa da fonte já carregada).
      let pontosTexto: Float32Array | undefined;
      if (texto && preset.texto) {
        try {
          pontosTexto = await amostrarTexto(
            texto,
            fonteDoElemento(fonteDe?.current ?? null),
            celular ? preset.texto.alvoCelular : preset.texto.alvo,
            preset.texto.largura,
          );
        } catch {
          pontosTexto = undefined;
        }
        if (cancelado) return;
        if (pontosTexto && pontosTexto.length === 0) pontosTexto = undefined;
      }

      // 2. A esfera em si.
      const criado = criarOrb(canvas, {
        particulas: celular ? preset.particulasCelular : preset.particulas,
        dprMax: celular ? preset.dprMaxCelular : preset.dprMax,
        raio: preset.raio,
        faixa: preset.faixa,
        poeira: preset.poeira,
        texto: pontosTexto,
      });
      if (!criado) {
        // Sem WebGL: fica só o brilho de fundo em CSS e o nome em texto normal.
        onEstadoRef.current?.("html");
        return;
      }
      orb = criado;
      orbRef.current = criado;

      if (variante === "hero") {
        criado.params.scroll = limitar(window.scrollY / (window.innerHeight * 0.85));
      }

      if (reduzir) {
        // Imagem parada: esfera já formada e nome escrito, sem rotação nem laço.
        criado.params.assemble = 1;
        criado.params.speed = 0;
        criado.renderFrame();
        const ro = new ResizeObserver(() => {
          criado.resize();
          criado.renderFrame();
        });
        ro.observe(canvas);
        limpar.push(() => ro.disconnect());
      } else {
        const chegada = animate(
          criado.params,
          { assemble: 1 },
          { duration: preset.chegada, ease: [0.3, 0.55, 0.25, 1] },
        );
        limpar.push(() => chegada.stop());

        // Só gasta GPU enquanto a esfera está na tela e a aba está ativa.
        let naTela = true;
        const atualizar = () => (naTela && !document.hidden ? criado.start() : criado.stop());
        const io = new IntersectionObserver(([entrada]) => {
          naTela = entrada.isIntersecting;
          atualizar();
        });
        io.observe(canvas);
        document.addEventListener("visibilitychange", atualizar);
        const ro = new ResizeObserver(() => criado.resize());
        ro.observe(canvas);
        limpar.push(() => {
          io.disconnect();
          ro.disconnect();
          document.removeEventListener("visibilitychange", atualizar);
        });
        criado.renderFrame();
        criado.start();
      }

      setPronto(true);
      if (texto && preset.texto) onEstadoRef.current?.(pontosTexto ? "particulas" : "html");
    };

    void iniciar();

    return () => {
      cancelado = true;
      limpar.forEach((fn) => fn());
      orb?.dispose();
      orbRef.current = null;
      setPronto(false);
    };
  }, [variante, texto, fonteDe]);

  // Mouse: repele os pontos e inclina a esfera na direção do cursor.
  useEffect(() => {
    if (variante !== "hero") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const mover = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const r = canvas.getBoundingClientRect();
      const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
      const ny = -(((e.clientY - r.top) / r.height) * 2 - 1);
      mouseX.set(nx);
      mouseY.set(ny);
      mouseForca.set(Math.abs(nx) < 1.1 && Math.abs(ny) < 1.1 ? 1 : 0);
      inclinaY.set((e.clientX / window.innerWidth - 0.5) * 0.7);
      inclinaX.set((e.clientY / window.innerHeight - 0.5) * 0.45);
    };
    const sair = () => mouseForca.set(0);

    window.addEventListener("pointermove", mover, { passive: true });
    document.documentElement.addEventListener("pointerleave", sair);
    return () => {
      window.removeEventListener("pointermove", mover);
      document.documentElement.removeEventListener("pointerleave", sair);
    };
  }, [variante, mouseX, mouseY, mouseForca, inclinaX, inclinaY]);

  // Troca de estado (ocioso ↔ pensando) com mola.
  useEffect(() => {
    const orb = orbRef.current;
    if (!orb) return;
    const controles = animate(orb.params, ESTADOS[estado], {
      type: "spring",
      stiffness: 70,
      damping: 16,
    });
    return () => controles.stop();
  }, [estado, pronto]);

  // Onda de luz quando `pulso` muda (e só aí: ignora o valor inicial).
  const ultimoPulso = useRef(pulso);
  useEffect(() => {
    if (pulso === ultimoPulso.current) return;
    ultimoPulso.current = pulso;
    const orb = orbRef.current;
    if (!orb) return;
    orb.params.pulse = 0.001;
    const controles = animate(orb.params, { pulse: 1 }, { duration: 1.5, ease: "easeInOut" });
    return () => controles.stop();
  }, [pulso]);

  return (
    <div className={className} aria-hidden="true">
      <canvas
        ref={canvasRef}
        className={`block h-full w-full transition-opacity duration-1000 ${
          pronto ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
