"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { SUAVE } from "@/lib/animacao";

/**
 * Texto que "rola": no hover, a linha sobe e uma cópia entra por baixo —
 * o mesmo efeito do menu do motion.dev.
 *
 * ⚠️ Precisa estar dentro de um elemento `motion.*` que tenha
 * `initial="repouso" whileHover="hover" whileFocus="hover"` (veja o Nav e o Hero):
 * é ele quem dispara as variantes daqui.
 */
export default function TextoRolante({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const transicao = { duration: 0.42, ease: SUAVE };

  return (
    <span className={`relative inline-flex overflow-hidden ${className}`}>
      <motion.span
        className="block"
        variants={{ repouso: { y: "0%" }, hover: { y: "-105%" } }}
        transition={transicao}
      >
        {children}
      </motion.span>
      <motion.span
        aria-hidden="true"
        className="absolute inset-0 block"
        variants={{ repouso: { y: "105%" }, hover: { y: "0%" } }}
        transition={transicao}
      >
        {children}
      </motion.span>
    </span>
  );
}
