"use client";

import { motion } from "motion/react";
import { SUAVE } from "@/lib/animacao";

/**
 * Título (h2) cujas palavras sobem de dentro de uma máscara quando entram na tela —
 * a mesma entrada do título do Hero, reaproveitada nas seções.
 */
export default function TituloAnimado({
  id,
  children,
  className,
}: {
  id?: string;
  children: string;
  className?: string;
}) {
  return (
    <h2 id={id} className={className}>
      {children.split(" ").map((palavra, i, todas) => (
        <span
          key={`${palavra}-${i}`}
          className="inline-block overflow-hidden pb-[0.12em] align-bottom"
        >
          <motion.span
            className="inline-block"
            initial={{ y: "110%" }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.75, delay: i * 0.07, ease: SUAVE }}
          >
            {palavra}
            {i < todas.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </h2>
  );
}
