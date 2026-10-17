"use client";

import { motion, useMotionTemplate, useMotionValue } from "motion/react";
import type { ElementType, PointerEvent, ReactNode } from "react";

/**
 * Card com um brilho âmbar que segue o mouse (no fundo e na borda).
 * O brilho fica ATRÁS do conteúdo; só aparece no hover, e em telas de toque
 * simplesmente não faz nada.
 *
 * A posição do mouse vive em MotionValues: o brilho se move sem re-renderizar
 * o React.
 */
export default function CardComLuz({
  children,
  className = "",
  como: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  /** Tag HTML usada no card (ex.: "article"). */
  como?: ElementType;
}) {
  const x = useMotionValue(-400);
  const y = useMotionValue(-400);

  const brilho = useMotionTemplate`radial-gradient(420px circle at ${x}px ${y}px, color-mix(in srgb, var(--color-accent) 10%, transparent), transparent 65%)`;
  const borda = useMotionTemplate`radial-gradient(240px circle at ${x}px ${y}px, var(--color-accent), transparent 70%)`;

  function mover(e: PointerEvent<HTMLElement>) {
    if (e.pointerType === "touch") return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - r.left);
    y.set(e.clientY - r.top);
  }

  return (
    <Tag onPointerMove={mover} className={`group/luz relative isolate ${className}`}>
      <motion.div
        aria-hidden="true"
        style={{ background: brilho }}
        className="pointer-events-none absolute inset-0 -z-10 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/luz:opacity-100"
      />
      <motion.div
        aria-hidden="true"
        style={{ background: borda }}
        className="card-luz-borda -z-10 opacity-0 transition-opacity duration-300 group-hover/luz:opacity-100"
      />
      {children}
    </Tag>
  );
}
