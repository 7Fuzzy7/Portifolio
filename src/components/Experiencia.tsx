import Section from "./Section";
import Reveal from "./Reveal";
import CardComLuz from "./CardComLuz";
import { LinhaDoTempo, Marcador } from "./LinhaDoTempo";
import { experiencia } from "@/data/content";

export default function Experiencia() {
  return (
    <Section
      id="experiencia"
      titulo={experiencia.titulo}
      subtitulo={experiencia.subtitulo}
    >
      <div className="grid gap-14 lg:grid-cols-[1.6fr_1fr] lg:gap-16">
        {/* Linha do tempo */}
        <LinhaDoTempo>
          {experiencia.cargos.map((cargo, i) => {
            const atual = cargo.ate.toLowerCase() === "atual";
            return (
              <li
                key={`${cargo.empresa}-${cargo.de}`}
                className="relative border-l border-line pb-12 pl-7 last:pb-0 md:pl-9"
              >
                <Marcador atual={atual} />

                <Reveal delay={i * 0.06}>
                  <p className="font-mono text-xs tracking-wide text-accent">
                    {cargo.de} {atual ? "até hoje" : `a ${cargo.ate}`}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold tracking-tight md:text-2xl">
                    {cargo.cargo}
                  </h3>
                  <p className="mt-1 text-sm text-ink">
                    {cargo.empresa}
                    {cargo.local && (
                      <span className="text-muted"> em {cargo.local}</span>
                    )}
                  </p>
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
                    {cargo.descricao}
                  </p>
                </Reveal>
              </li>
            );
          })}
        </LinhaDoTempo>

        {/* Formação e certificações */}
        <div className="space-y-8">
          <Reveal>
            <CardComLuz className="rounded-2xl border border-line bg-surface p-6">
              <h3 className="font-mono text-xs uppercase tracking-widest text-accent">
                Formação
              </h3>
              <ul className="mt-5 space-y-5">
                {experiencia.formacao.map((f) => (
                  <li key={f.curso}>
                    <p className="font-medium tracking-tight text-ink">
                      {f.curso}
                    </p>
                    <p className="mt-0.5 text-sm text-muted">
                      {f.instituicao}, {f.periodo}
                    </p>
                  </li>
                ))}
              </ul>
            </CardComLuz>
          </Reveal>

          <Reveal delay={0.08}>
            <CardComLuz className="rounded-2xl border border-line bg-surface p-6">
              <h3 className="font-mono text-xs uppercase tracking-widest text-accent">
                Certificações
              </h3>
              <ul className="mt-5 space-y-3">
                {experiencia.certificacoes.map((c) => (
                  <li
                    key={c}
                    className="flex gap-2.5 text-sm leading-snug text-muted"
                  >
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                    {c}
                  </li>
                ))}
              </ul>
            </CardComLuz>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
