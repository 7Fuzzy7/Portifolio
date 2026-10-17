"use client";

import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import { useEffect, useRef } from "react";

/**
 * Faixa de tecnologias que corre sozinha — e reage à rolagem:
 * rolando rápido ela acelera, rolando para cima ela inverte o sentido.
 * (A velocidade da rolagem vira um fator via useVelocity + useSpring.)
 *
 * É decorativa: os mesmos itens aparecem na seção Habilidades, então fica
 * escondida de leitores de tela.
 */
export default function FaixaTecnologias({
  itens,
  velocidade = 48,
}: {
  itens: string[];
  /** Pixels por segundo quando a página está parada. */
  velocidade?: number;
}) {
  const semMovimento = useReducedMotion();
  const raiz = useRef<HTMLDivElement>(null);
  const grupo = useRef<HTMLUListElement>(null);
  const naTela = useInView(raiz);

  const x = useMotionValue(0);
  const posicao = useRef(0);
  const periodo = useRef(0); // largura de UM grupo = quanto andar para o loop emendar
  const sentido = useRef(1);

  const { scrollY } = useScroll();
  const velocidadeRolagem = useVelocity(scrollY);
  const velocidadeSuave = useSpring(velocidadeRolagem, { damping: 50, stiffness: 400 });
  const fator = useTransform(velocidadeSuave, [-1500, 0, 1500], [-4, 0, 4], {
    clamp: false,
  });

  // Mede o grupo (muda com fonte carregada, resize…).
  useEffect(() => {
    const el = grupo.current;
    if (!el) return;
    const medir = () => {
      periodo.current = el.getBoundingClientRect().width;
    };
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useAnimationFrame((_, delta) => {
    if (semMovimento || !naTela || periodo.current === 0) return;
    const f = fator.get();
    if (f < -0.05) sentido.current = -1;
    else if (f > 0.05) sentido.current = 1;

    const dt = Math.min(delta, 64) / 1000;
    const passo = sentido.current * velocidade * dt * (1 + Math.abs(f));
    const p = periodo.current;
    posicao.current = (((posicao.current + passo) % p) + p) % p;
    x.set(-posicao.current);
  });

  return (
    <div
      ref={raiz}
      aria-hidden="true"
      className="mascara-faixa overflow-hidden border-y border-line py-5 md:py-7"
    >
      <motion.div style={{ x }} className="flex w-max will-change-transform">
        {[0, 1, 2].map((copia) => (
          <ul
            key={copia}
            ref={copia === 0 ? grupo : undefined}
            className="flex shrink-0 items-center gap-x-8 pr-8 md:gap-x-12 md:pr-12"
          >
            {itens.map((item) => (
              <li
                key={item}
                className="flex items-center gap-x-8 whitespace-nowrap text-2xl font-semibold tracking-tight text-ink/70 md:gap-x-12 md:text-4xl"
              >
                {item}
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              </li>
            ))}
          </ul>
        ))}
      </motion.div>
    </div>
  );
}
