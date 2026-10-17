"use client";

import dynamic from "next/dynamic";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { hero, pessoal } from "@/data/content";
import { SUAVE } from "@/lib/animacao";
import Magnetico from "./Magnetico";
import TextoRolante from "./TextoRolante";

// A esfera é pesada de carregar (WebGL) e só existe no navegador: vem num
// pedaço de JS separado, depois que o texto já apareceu.
const Orb = dynamic(() => import("./Orb"), { ssr: false });

/**
 * Onde o nome está sendo mostrado:
 *  • "aguardando": a esfera ainda está carregando (o <h1> fica invisível, mas existe);
 *  • "particulas": o nome foi desenhado com partículas dentro da esfera;
 *  • "html": a esfera não pôde ser criada (sem WebGL…), então o <h1> aparece normal.
 */
type NomeEm = "aguardando" | "particulas" | "html";

export default function Hero() {
  const nomeRef = useRef<HTMLHeadingElement>(null);
  const [nomeEm, setNomeEm] = useState<NomeEm>("aguardando");
  const aoMudarNome = useCallback((estado: "particulas" | "html") => setNomeEm(estado), []);

  // Rede de segurança: se a esfera demorar demais, mostra o nome em texto normal.
  useEffect(() => {
    const id = setTimeout(
      () => setNomeEm((atual) => (atual === "aguardando" ? "html" : atual)),
      8000,
    );
    return () => clearTimeout(id);
  }, []);

  // Sem useReducedMotion() aqui de propósito: o HTML do servidor e do cliente
  // precisam ser iguais. "Menos movimento" é tratado pelo MotionProvider.
  const entrada = (delay: number) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease: SUAVE },
  });

  return (
    <section
      aria-label="Apresentação"
      className="relative isolate overflow-hidden"
    >
      <div className="glow-hero" aria-hidden="true" />

      <div className="container-site relative grid min-h-[100svh] items-center gap-8 pb-12 pt-24 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] lg:gap-6 lg:pb-16">
        {/* Esfera de partículas com o NOME desenhado no centro. */}
        <div className="@container relative z-0 mx-auto aspect-square w-full max-w-[min(100%,74svh,40rem)] lg:order-2">
          {/* O canvas é 2× maior que a esfera: sobra espaço para a poeira em volta. */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[200%] -translate-x-1/2 -translate-y-1/2">
            <Orb
              variante="hero"
              texto={hero.titulo}
              fonteDe={nomeRef}
              onEstado={aoMudarNome}
              className="h-full w-full"
            />
          </div>

          {/* Plano B (sem WebGL): um disco de luz suave no lugar da esfera. */}
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-[4%] rounded-full bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--color-accent)_14%,transparent),transparent)] transition-opacity duration-700 ${
              nomeEm === "html" ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* O nome em texto de verdade (acessibilidade, SEO e plano B sem WebGL):
              fica invisível enquanto as partículas escrevem o nome. */}
          <div className="pointer-events-none absolute inset-0 grid place-items-center">
            <h1
              ref={nomeRef}
              className={`select-none px-[6cqw] text-center text-[12cqw] font-bold leading-[0.98] tracking-tight transition-opacity duration-700 ${
                nomeEm === "html" ? "opacity-100" : "opacity-0"
              }`}
            >
              {hero.titulo.split(" ").map((palavra, i) => (
                <Fragment key={`${palavra}-${i}`}>
                  {i > 0 && " "}
                  <span className="inline-block overflow-hidden pb-[0.12em] align-bottom">
                    <motion.span
                      className="inline-block"
                      initial={{ y: "110%" }}
                      animate={{ y: 0 }}
                      transition={{
                        duration: 0.8,
                        delay: 0.08 + i * 0.07,
                        ease: SUAVE,
                      }}
                    >
                      {palavra}
                    </motion.span>
                  </span>
                </Fragment>
              ))}
            </h1>
          </div>
        </div>

        {/* Texto de apoio. No celular/tablet fica abaixo da esfera; no desktop, à esquerda, embaixo. */}
        <div className="relative z-[2] lg:order-1 lg:self-end">
          <motion.p
            {...entrada(0.1)}
            className="max-w-[28rem] text-[1.7rem] font-semibold leading-[1.18] tracking-tight text-ink md:text-[2rem] lg:text-[clamp(1.5rem,2.3vw,2.1rem)]"
          >
            {hero.posicionamento}
          </motion.p>

          <motion.ul
            {...entrada(0.2)}
            className="mt-6 flex max-w-lg flex-wrap gap-2"
            aria-label="Áreas de atuação"
          >
            {hero.palavrasChave.map((palavra) => (
              <li
                key={palavra}
                className="rounded-full border border-line bg-surface/80 px-4 py-1.5 text-sm text-muted backdrop-blur-sm"
              >
                {palavra}
              </li>
            ))}
          </motion.ul>

          <motion.div {...entrada(0.28)} className="mt-8 flex flex-wrap gap-3">
            <Magnetico>
              <motion.a
                href={hero.botaoPrimario.href}
                target="_blank"
                rel="noopener noreferrer"
                initial="repouso"
                whileHover="hover"
                whileFocus="hover"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-fundo"
              >
                <TextoRolante>{hero.botaoPrimario.texto}</TextoRolante>
                <motion.svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  variants={{
                    repouso: { x: 0, y: 0 },
                    hover: { x: 2, y: -2 },
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                  <path d="M7 17 17 7" />
                  <path d="M8 7h9v9" />
                </motion.svg>
              </motion.a>
            </Magnetico>
            <Magnetico>
              <motion.a
                href={hero.botaoSecundario.href}
                initial="repouso"
                whileHover="hover"
                whileFocus="hover"
                className="inline-flex items-center rounded-full border border-line bg-surface/80 px-6 py-3 text-sm font-semibold text-ink backdrop-blur-sm transition-colors hover:border-accent/50 hover:text-accent"
              >
                <TextoRolante>{hero.botaoSecundario.texto}</TextoRolante>
              </motion.a>
            </Magnetico>
          </motion.div>

          <motion.p
            {...entrada(0.36)}
            className="mt-10 font-mono text-xs text-muted"
          >
            {pessoal.cargo} · {pessoal.empresa} — {pessoal.cidade}
          </motion.p>
        </div>
      </div>

      {/* Funde o pé do Hero com a página (a esfera se dispersa ao rolar e não pode "cortar" seco). */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-40 bg-gradient-to-t from-fundo to-transparent"
      />
    </section>
  );
}
