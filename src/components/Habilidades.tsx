import Section from "./Section";
import Reveal from "./Reveal";
import { habilidades } from "@/data/content";

export default function Habilidades() {
  return (
    <Section
      id="habilidades"
      numero="02"
      titulo={habilidades.titulo}
      subtitulo={habilidades.subtitulo}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        {habilidades.grupos.map((grupo, i) => (
          <Reveal key={grupo.titulo} delay={i * 0.08}>
            <div className="h-full rounded-2xl border border-line bg-surface p-6 transition-colors duration-300 hover:border-accent/40 md:p-7">
              <h3 className="text-lg font-semibold tracking-tight">
                {grupo.titulo}
              </h3>
              <p className="mt-1.5 text-sm text-muted">{grupo.descricao}</p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {grupo.itens.map((item) => (
                  <li
                    key={item}
                    className="rounded-md border border-line bg-elevated px-2.5 py-1 font-mono text-xs text-ink"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
