import type { ReactNode } from "react";
import Reveal from "./Reveal";
import TituloAnimado from "./TituloAnimado";

type Props = {
  id: string;
  titulo: string;
  subtitulo?: string;
  children: ReactNode;
};

/** Casca padrão das seções: título grande, subtítulo opcional e conteúdo. */
export default function Section({ id, titulo, subtitulo, children }: Props) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-titulo`}
      className="container-site py-20 md:py-28"
    >
      <Reveal>
        <div className="mb-10 md:mb-14">
          <TituloAnimado
            id={`${id}-titulo`}
            className="text-4xl font-semibold tracking-tight md:text-6xl"
          >
            {titulo}
          </TituloAnimado>
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
