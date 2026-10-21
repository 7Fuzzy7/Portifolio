import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import MotionProvider from "@/components/MotionProvider";
import { site, pessoal, experiencia, habilidades } from "@/data/content";

// Mesmo par de fontes do motion.dev: TASA Orbiter (texto) + Geist Mono (rótulos).
// Os arquivos ficam em ./fonts (veja o LEIA-ME de lá): assim o site não depende
// de baixar nada do Google na hora de compilar.
const fonteTexto = localFont({
  src: "./fonts/TASAOrbiter-latin.woff2",
  variable: "--font-tasa",
  weight: "400 800",
  display: "swap",
});
const fonteMono = localFont({
  src: "./fonts/GeistMono-latin.woff2",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.titulo,
    template: `%s | ${pessoal.nomeCurto}`,
  },
  description: site.descricao,
  keywords: site.palavrasChaveSEO,
  authors: [{ name: pessoal.nome, url: site.url }],
  creator: pessoal.nome,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: site.url,
    siteName: `Portfólio de ${pessoal.nome}`,
    title: site.titulo,
    description: site.descricao,
  },
  twitter: {
    card: "summary_large_image",
    title: site.titulo,
    description: site.descricao,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#080908",
  colorScheme: "dark",
};

/** Dados estruturados: ajuda o Google a entender que a página é sobre uma pessoa. */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: pessoal.nome,
  jobTitle: pessoal.cargo,
  worksFor: { "@type": "Organization", name: pessoal.empresa },
  alumniOf: experiencia.formacao.map((f) => ({
    "@type": "EducationalOrganization",
    name: f.instituicao,
  })),
  address: { "@type": "PostalAddress", addressLocality: pessoal.cidade },
  email: `mailto:${pessoal.email}`,
  url: site.url,
  sameAs: [pessoal.linkedin, pessoal.github],
  knowsAbout: habilidades.grupos.flatMap((g) => g.itens),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${fonteTexto.variable} ${fonteMono.variable}`}>
      <body className="min-h-dvh">
        {/* Primeiro item do Tab: pular direto para o conteúdo. */}
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-fundo"
        >
          Pular para o conteúdo
        </a>

        {/* Quem pediu "menos movimento" no sistema não recebe animações de transform. */}
        <MotionProvider>
          <ScrollProgress />
          <Nav />
          <main id="conteudo">{children}</main>
          <Footer />
        </MotionProvider>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
