import Image from "next/image";
import Section from "./Section";
import Reveal from "./Reveal";
import { sobre, pessoal } from "@/data/content";

export default function Sobre() {
  return (
    <Section id="sobre" numero="01" titulo={sobre.titulo}>
      <div className="grid gap-12 lg:grid-cols-[1fr_360px] lg:gap-16">
        <div className="order-2 lg:order-1">
          <div className="space-y-5">
            {sobre.paragrafos.map((paragrafo, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <p className="text-base leading-relaxed text-muted md:text-lg">
                  {paragrafo}
                </p>
              </Reveal>
            ))}
          </div>

          {sobre.destaques.length > 0 && (
            <Reveal delay={0.2}>
              <dl className="mt-10 grid gap-4 sm:grid-cols-3">
                {sobre.destaques.map((d) => (
                  <div
                    key={d.legenda}
                    className="rounded-xl border border-line bg-surface p-5"
                  >
                    <dt className="text-2xl font-semibold tracking-tight text-accent">
                      {d.valor}
                    </dt>
                    <dd className="mt-1.5 text-sm leading-snug text-muted">
                      {d.legenda}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          )}
        </div>

        {pessoal.foto && (
          <Reveal className="order-1 lg:order-2" y={16}>
            <div className="relative mx-auto w-full max-w-[300px] lg:max-w-none">
              <div
                className="absolute -inset-3 rounded-3xl bg-accent/10 blur-2xl"
                aria-hidden="true"
              />
              <Image
                src={pessoal.foto}
                alt={pessoal.fotoAlt}
                width={720}
                height={720}
                priority
                sizes="(max-width: 1024px) 300px, 360px"
                className="relative aspect-square w-full rounded-2xl border border-line object-cover"
              />
            </div>
          </Reveal>
        )}
      </div>
    </Section>
  );
}
