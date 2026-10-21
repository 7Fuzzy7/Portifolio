import { ImageResponse } from "next/og";
import { pessoal, hero } from "@/data/content";

/* Imagem que aparece quando o link do site é colado no LinkedIn/WhatsApp.
   É gerada no build a partir do content.ts — não precisa editar imagem. */

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${pessoal.nome}, ${pessoal.cargo}`;

/** Mistura duas cores hex (t = 0 → a, t = 1 → b). */
function misturar(a: number[], b: number[], t: number) {
  return a.map((v, i) => Math.round(v + (b[i] - v) * t));
}

/** Rampa de calor da esfera: laranja escuro → laranja → âmbar → creme. */
function corDoCalor(calor: number) {
  const fundo = [140, 41, 8];
  const laranja = [255, 117, 20];
  const ambar = [255, 199, 66];
  const creme = [255, 242, 204];
  const c =
    calor < 0.4
      ? misturar(fundo, laranja, calor / 0.4)
      : calor < 0.75
        ? misturar(laranja, ambar, (calor - 0.4) / 0.35)
        : misturar(ambar, creme, (calor - 0.75) / 0.25);
  return `rgb(${c[0]},${c[1]},${c[2]})`;
}

/** Os mesmos pontos da esfera do site, desenhados como círculos SVG. */
function pontosDaEsfera(total: number, raio: number) {
  const angulo = Math.PI * (3 - Math.sqrt(5));
  const guinada = 0.7;
  const arfagem = 0.5;
  const pontos: { cx: number; cy: number; r: number; o: number; cor: string }[] = [];

  for (let i = 0; i < total; i++) {
    const y0 = 1 - (2 * (i + 0.5)) / total;
    const anel = Math.sqrt(1 - y0 * y0);
    const fi = i * angulo;
    const x0 = Math.cos(fi) * anel;
    const z0 = Math.sin(fi) * anel;

    const x1 = x0 * Math.cos(guinada) + z0 * Math.sin(guinada);
    const z1 = -x0 * Math.sin(guinada) + z0 * Math.cos(guinada);
    const y2 = y0 * Math.cos(arfagem) - z1 * Math.sin(arfagem);
    const z2 = y0 * Math.sin(arfagem) + z1 * Math.cos(arfagem);

    const borda = Math.pow(1 - Math.abs(z2), 2.6);
    const luz = Math.max(0, -0.65 * x1 + 0.4 * y2 + 0.65 * z2);
    const frente = z2 > 0 ? 1 : 0.3;
    const brilho = Math.min(1, (0.14 + 1.0 * borda + 0.4 * luz * frente) * frente);
    const calor = Math.min(1, 0.15 + 0.7 * luz + 0.62 * borda);

    pontos.push({
      cx: raio + x1 * raio,
      cy: raio - y2 * raio,
      r: 1.1 + 1.8 * borda,
      o: brilho,
      cor: corDoCalor(calor),
    });
  }
  return pontos;
}

export default function OpenGraphImage() {
  const raio = 250;
  const pontos = pontosDaEsfera(1700, raio);

  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#080908",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        <svg
          width={raio * 2}
          height={raio * 2}
          viewBox={`0 0 ${raio * 2} ${raio * 2}`}
          style={{ position: "absolute", right: "-150px", top: "65px" }}
        >
          {pontos.map((p, i) => (
            <circle key={i} cx={p.cx} cy={p.cy} r={p.r} fill={p.cor} fillOpacity={p.o} />
          ))}
        </svg>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ width: "48px", height: "4px", background: "#ffba1d" }} />
          <div
            style={{
              color: "#ffba1d",
              fontSize: "22px",
              letterSpacing: "6px",
            }}
          >
            PORTFÓLIO
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", maxWidth: "640px" }}>
          <div
            style={{
              color: "#edebe5",
              fontSize: "88px",
              fontWeight: 700,
              lineHeight: 1.02,
              letterSpacing: "-3px",
            }}
          >
            {pessoal.nome}
          </div>
          <div
            style={{
              marginTop: "26px",
              color: "#98a099",
              fontSize: "32px",
            }}
          >
            {`${pessoal.cargo} na ${pessoal.empresa}`}
          </div>
        </div>

        <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
          {hero.palavrasChave.map((palavra) => (
            <div
              key={palavra}
              style={{
                display: "flex",
                border: "1px solid #262b27",
                background: "#0e110e",
                borderRadius: "999px",
                padding: "12px 26px",
                color: "#98a099",
                fontSize: "24px",
              }}
            >
              {palavra}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
