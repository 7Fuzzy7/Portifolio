import Link from "next/link";
import { pessoal } from "@/data/content";

export default function Footer() {
  const ano = new Date().getFullYear();

  return (
    <footer className="border-t border-line py-10">
      <div className="container-site flex flex-col items-start justify-between gap-4 text-sm text-muted sm:flex-row sm:items-center">
        <p>
          © {ano} {pessoal.nome}
        </p>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <a
            href={pessoal.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-ink"
          >
            LinkedIn
          </a>
          <a
            href={pessoal.github}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-ink"
          >
            GitHub
          </a>
          <a
            href={`mailto:${pessoal.email}`}
            className="transition-colors hover:text-ink"
          >
            E-mail
          </a>
          <Link href="/chat" className="transition-colors hover:text-ink">
            Assistente
          </Link>
        </div>
      </div>
    </footer>
  );
}
