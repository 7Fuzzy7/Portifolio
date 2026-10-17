"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { SUAVE } from "@/lib/animacao";

type Props = {
  children: ReactNode;
  /** Atraso em segundos — use para escalonar itens de uma lista. */
  delay?: number;
  /** Distância que o elemento sobe ao aparecer. */
  y?: number;
  className?: string;
};

/**
 * Envolve qualquer bloco para ele aparecer suavemente ao entrar na tela.
 *
 * Quem pediu "menos movimento" no sistema recebe só o fade (sem subir): isso é
 * feito pelo <MotionConfig reducedMotion="user"> em MotionProvider.tsx. Não
 * troque o markup com useReducedMotion() aqui — o servidor não sabe a
 * preferência e o HTML diferente deixa o conteúdo invisível ("hydration mismatch").
 */
export default function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
}: Props) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: SUAVE }}
    >
      {children}
    </motion.div>
  );
}
