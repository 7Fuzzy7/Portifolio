import type { Metadata, Viewport } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { site, pessoal, experiencia, habilidades } from "@/data/content";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.titulo,
    template: `%s · ${pessoal.nomeCurto}`,
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
    siteName: `${pessoal.nome} — Portfólio`,
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
  themeColor: "#08090b",
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
    <html lang="pt-BR">
      <body className="min-h-dvh">
        {/* Primeiro item do Tab: pular direto para o conteúdo. */}
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-fundo"
        >
          Pular para o conteúdo
        </a>

        <Nav />
        <main id="conteudo">{children}</main>
        <Footer />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
