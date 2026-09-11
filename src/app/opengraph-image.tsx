import { ImageResponse } from "next/og";
import { pessoal, hero } from "@/data/content";

/* Imagem que aparece quando o link do site é colado no LinkedIn/WhatsApp.
   É gerada no build a partir do content.ts — não precisa editar imagem. */

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${pessoal.nome} — ${pessoal.cargo}`;

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#08090b",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ width: "48px", height: "4px", background: "#4d8dff" }} />
          <div
            style={{
              color: "#4d8dff",
              fontSize: "22px",
              letterSpacing: "6px",
            }}
          >
            PORTFÓLIO
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              color: "#edeef1",
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
              color: "#9ba2ad",
              fontSize: "32px",
            }}
          >
            {`${pessoal.cargo} · ${pessoal.empresa}`}
          </div>
        </div>

        <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
          {hero.palavrasChave.map((palavra) => (
            <div
              key={palavra}
              style={{
                display: "flex",
                border: "1px solid #23262d",
                background: "#0e1013",
                borderRadius: "999px",
                padding: "12px 26px",
                color: "#9ba2ad",
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
