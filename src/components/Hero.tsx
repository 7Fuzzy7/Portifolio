"use client";

import { motion, useReducedMotion } from "framer-motion";
import { hero, pessoal } from "@/data/content";
import { SUAVE } from "@/lib/animacao";

export default function Hero() {
  const semMovimento = useReducedMotion();

  const entrada = (delay: number) => ({
    initial: semMovimento ? undefined : { opacity: 0, y: 20 },
    animate: semMovimento ? undefined : { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease: SUAVE },
  });

  return (
    <section
      aria-label="Apresentação"
      className="relative flex min-h-[92svh] items-center overflow-hidden pt-24"
    >
      <div className="glow-hero" aria-hidden="true" />

      <div className="container-site relative">
        <motion.p
          {...entrada(0)}
          className="flex items-center gap-3 font-mono text-xs tracking-widest text-accent"
        >
          <span className="h-px w-8 bg-accent" aria-hidden="true" />
          {hero.sobrenome.toUpperCase()}
        </motion.p>

        <motion.h1
          {...entrada(0.08)}
          className="mt-6 text-[clamp(2.25rem,9vw,6.5rem)] font-semibold leading-[0.95] tracking-tight"
        >
          {hero.titulo}
        </motion.h1>

        <motion.p
          {...entrada(0.16)}
          className="mt-7 max-w-2xl text-lg leading-relaxed text-muted md:text-xl"
        >
          {hero.posicionamento}
        </motion.p>

        <motion.ul
          {...entrada(0.24)}
          className="mt-8 flex flex-wrap gap-2"
          aria-label="Áreas de atuação"
        >
          {hero.palavrasChave.map((palavra) => (
            <li
              key={palavra}
              className="rounded-full border border-line bg-surface px-4 py-1.5 text-sm text-muted"
            >
              {palavra}
            </li>
          ))}
        </motion.ul>

        <motion.div {...entrada(0.32)} className="mt-10 flex flex-wrap gap-3">
          <a
            href={hero.botaoPrimario.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-fundo transition-transform duration-200 hover:-translate-y-0.5"
          >
            {hero.botaoPrimario.texto}
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M7 17 17 7" />
              <path d="M8 7h9v9" />
            </svg>
          </a>
          <a
            href={hero.botaoSecundario.href}
            className="inline-flex items-center rounded-full border border-line bg-surface px-6 py-3 text-sm font-semibold text-ink transition-colors hover:border-accent/50 hover:text-accent"
          >
            {hero.botaoSecundario.texto}
          </a>
        </motion.div>

        <motion.p
          {...entrada(0.4)}
          className="mt-12 font-mono text-xs text-muted"
        >
          {pessoal.cargo} · {pessoal.empresa} — {pessoal.cidade}
        </motion.p>
      </div>
    </section>
  );
}
