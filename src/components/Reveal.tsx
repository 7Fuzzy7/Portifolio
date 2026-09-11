"use client";

import { motion, useReducedMotion } from "framer-motion";
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
 * Se o usuário pediu "menos movimento" no sistema, o conteúdo aparece direto.
 */
export default function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
}: Props) {
  const semMovimento = useReducedMotion();

  if (semMovimento) return <div className={className}>{children}</div>;

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
