import Section from "./Section";
import Reveal from "./Reveal";
import CopiarEmail from "./CopiarEmail";
import { contato, pessoal } from "@/data/content";

export default function Contato() {
  return (
    <Section id="contato" titulo={contato.titulo}>
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3.5 py-1.5 text-sm text-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
              {contato.chamada}
            </span>

            <p className="mt-6 max-w-lg text-2xl font-medium leading-snug tracking-tight md:text-3xl">
              {contato.texto}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href={`mailto:${pessoal.email}`}
                className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-fundo transition-transform duration-200 hover:-translate-y-0.5"
              >
                Enviar e-mail
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
                  <path d="M5 12h14" />
                  <path d="m13 6 6 6-6 6" />
                </svg>
              </a>
              <CopiarEmail email={pessoal.email} />
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <dl className="divide-y divide-line border-y border-line">
            {contato.links.map((item) => (
              <div
                key={item.rotulo}
                className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-5"
              >
                <dt className="font-mono text-xs uppercase tracking-widest text-muted">
                  {item.rotulo}
                </dt>
                <dd className="min-w-0 break-words text-right text-sm text-ink sm:text-base">
                  {item.href ? (
                    <a
                      href={item.href}
                      target={item.href.startsWith("http") ? "_blank" : undefined}
                      rel={
                        item.href.startsWith("http")
                          ? "noopener noreferrer"
                          : undefined
                      }
                      className="transition-colors hover:text-accent"
                    >
                      {item.valor}
                    </a>
                  ) : (
                    item.valor
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </Section>
  );
}
