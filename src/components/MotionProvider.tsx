"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/**
 * Configuração global do Motion.
 * `reducedMotion="user"`: quem ativou "reduzir movimento" no sistema deixa de
 * receber animações de deslocamento em TODOS os componentes, sem precisar
 * tratar caso a caso.
 */
export default function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
