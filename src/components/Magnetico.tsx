"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import type { PointerEvent, ReactNode } from "react";
import { useRef } from "react";

/**
 * Faz o elemento "puxar" levemente na direção do mouse, com mola.
 * Em tela de toque ou com "reduzir movimento" ligado, não faz nada.
 */
export default function Magnetico({
  children,
  forca = 0.28,
  className = "",
}: {
  children: ReactNode;
  /** Fração da distância até o cursor que o elemento acompanha (0.2–0.4 é sutil). */
  forca?: number;
  className?: string;
}) {
  const semMovimento = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const molaX = useSpring(x, { stiffness: 220, damping: 15, mass: 0.4 });
  const molaY = useSpring(y, { stiffness: 220, damping: 15, mass: 0.4 });

  function mover(e: PointerEvent<HTMLDivElement>) {
    // O markup é sempre o mesmo (evita hydration mismatch); só o efeito é desligado.
    if (semMovimento || e.pointerType === "touch" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * forca);
    y.set((e.clientY - (r.top + r.height / 2)) * forca);
  }

  function soltar() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      style={{ x: molaX, y: molaY }}
      onPointerMove={mover}
      onPointerLeave={soltar}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
}
