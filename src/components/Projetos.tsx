import Section from "./Section";
import Reveal from "./Reveal";
import { projetos, type Projeto } from "@/data/content";

function Bloco({
  rotulo,
  texto,
  destaque,
}: {
  rotulo: string;
  texto: string;
  destaque?: boolean;
}) {
  return (
    <div>
      <h4
        className={`font-mono text-[0.68rem] uppercase tracking-widest ${
          destaque ? "text-accent" : "text-muted"
        }`}
      >
        {rotulo}
      </h4>
      <p className="mt-1.5 text-sm leading-relaxed text-muted">{texto}</p>
    </div>
  );
}

function Card({ projeto }: { projeto: Projeto }) {
  return (
    <article
      className="group flex h-full flex-col rounded-2xl border border-line bg-surface p-6 transition-colors duration-300 hover:border-accent/40 md:p-8"
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-muted">
        <span className="rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 text-accent">
          {projeto.contexto}
        </span>
        <span>{projeto.ano}</span>
      </div>

      <h3
        className={`mt-4 font-semibold tracking-tight ${
          projeto.destaque ? "text-3xl md:text-4xl" : "text-2xl"
        }`}
      >
        {projeto.titulo}
      </h3>

      <div
        className={`mt-6 flex-1 gap-6 ${
          projeto.destaque ? "grid md:grid-cols-3" : "flex flex-col"
        }`}
      >
        <Bloco rotulo="Problema" texto={projeto.problema} />
        <Bloco rotulo="Solução" texto={projeto.solucao} />
        <Bloco rotulo="Resultado" texto={projeto.resultado} destaque />
      </div>

      <ul className="mt-7 flex flex-wrap gap-2">
        {projeto.stack.map((tec) => (
          <li
            key={tec}
            className="rounded-md border border-line bg-elevated px-2.5 py-1 font-mono text-xs text-ink"
          >
            {tec}
          </li>
        ))}
      </ul>

      {projeto.link && (
        <a
          href={projeto.link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 self-start text-sm font-medium text-accent transition-opacity hover:opacity-80"
        >
          Ver repositório
          <svg
            width="14"
            height="14"
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
          <span className="sr-only">— {projeto.titulo}</span>
        </a>
      )}
    </article>
  );
}

export default function Projetos() {
  return (
    <Section
      id="projetos"
      numero="03"
      titulo={projetos.titulo}
      subtitulo={projetos.subtitulo}
    >
      <div className="grid gap-5 md:grid-cols-2">
        {projetos.itens.map((projeto, i) => (
          <Reveal
            key={projeto.titulo}
            delay={i * 0.06}
            className={projeto.destaque ? "h-full md:col-span-2" : "h-full"}
          >
            <Card projeto={projeto} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
