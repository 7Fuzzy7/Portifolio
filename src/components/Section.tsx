import type { ReactNode } from "react";
import Reveal from "./Reveal";

type Props = {
  id: string;
  numero: string;
  titulo: string;
  subtitulo?: string;
  children: ReactNode;
};

/** Casca padrão das seções: número, título grande e conteúdo. */
export default function Section({
  id,
  numero,
  titulo,
  subtitulo,
  children,
}: Props) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-titulo`}
      className="container-site py-20 md:py-28"
    >
      <Reveal>
        <div className="mb-10 md:mb-14">
          <span className="font-mono text-xs tracking-widest text-accent">
            {numero}
          </span>
          <h2
            id={`${id}-titulo`}
            className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl"
          >
            {titulo}
          </h2>
          {subtitulo && (
            <p className="mt-3 max-w-xl text-base text-muted md:text-lg">
              {subtitulo}
            </p>
          )}
          <div className="rule-fade mt-8" />
        </div>
      </Reveal>
      {children}
    </section>
  );
}
