"use client";

import { motion, useInView, useScroll, useSpring } from "motion/react";
import { useRef, type ReactNode } from "react";

/**
 * Lista da linha do tempo: uma linha âmbar "se desenha" de cima para baixo
 * conforme você rola (useScroll → useSpring → scaleY).
 * Os itens (<li>) continuam sendo renderizados no servidor; aqui só entra o movimento.
 */
export function LinhaDoTempo({ children }: { children: ReactNode }) {
  const lista = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({
    target: lista,
    offset: ["start 70%", "end 60%"],
  });
  const escala = useSpring(scrollYProgress, { stiffness: 110, damping: 26, mass: 0.4 });

  return (
    <div className="relative">
      <motion.span
        aria-hidden="true"
        style={{ scaleY: escala }}
        className="absolute left-0 top-0 h-full w-px origin-top bg-gradient-to-b from-accent to-brasa"
      />
      <ol ref={lista}>{children}</ol>
    </div>
  );
}

/** Bolinha da linha do tempo: acende quando a rolagem chega nela. */
export function Marcador({ atual }: { atual: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const alcancado = useInView(ref, { once: true, margin: "0px 0px -42% 0px" });
  const aceso = atual || alcancado;

  return (
    <motion.span
      ref={ref}
      aria-hidden="true"
      animate={{ scale: aceso ? 1 : 0.7 }}
      transition={{ type: "spring", stiffness: 320, damping: 18 }}
      className={`absolute -left-[6.5px] top-1.5 h-3 w-3 rounded-full transition-colors duration-500 ${
        aceso ? "bg-accent" : "bg-line"
      }`}
    >
      {atual && (
        <span className="absolute inset-0 animate-ping rounded-full bg-accent/60" />
      )}
    </motion.span>
  );
}
