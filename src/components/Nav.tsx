"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navegacao, pessoal } from "@/data/content";

export default function Nav() {
  const pathname = usePathname();
  const naHome = pathname === "/";
  const [rolou, setRolou] = useState(false);
  const [aberto, setAberto] = useState(false);

  // Fundo do menu só aparece depois de rolar um pouco.
  useEffect(() => {
    const aoRolar = () => setRolou(window.scrollY > 24);
    aoRolar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => window.removeEventListener("scroll", aoRolar);
  }, []);

  // Esc fecha o menu do celular.
  useEffect(() => {
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAberto(false);
    };
    window.addEventListener("keydown", aoTeclar);
    return () => window.removeEventListener("keydown", aoTeclar);
  }, []);

  // Âncoras (#sobre) só funcionam na home; fora dela viram /#sobre.
  const link = (href: string) => (naHome ? href : `/${href}`);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        rolou || aberto
          ? "border-b border-line bg-fundo/80 backdrop-blur-md"
          : "border-b border-transparent"
      }`}
    >
      <nav
        aria-label="Navegação principal"
        className="container-site flex h-16 items-center justify-between gap-4"
      >
        <Link
          href="/"
          className="text-sm font-semibold tracking-tight text-ink transition-colors hover:text-accent"
        >
          {pessoal.nomeCurto}
          <span className="text-accent">.</span>
        </Link>

        {/* Desktop */}
        <ul className="hidden items-center gap-7 md:flex">
          {navegacao.map((item) => (
            <li key={item.href}>
              <a
                href={link(item.href)}
                className="text-sm text-muted transition-colors hover:text-ink"
              >
                {item.rotulo}
              </a>
            </li>
          ))}
          <li>
            <Link
              href="/chat"
              className="rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent transition-colors hover:bg-accent/20"
            >
              Assistente
            </Link>
          </li>
        </ul>

        {/* Botão do menu no celular */}
        <button
          type="button"
          onClick={() => setAberto((v) => !v)}
          aria-expanded={aberto}
          aria-controls="menu-mobile"
          aria-label={aberto ? "Fechar menu" : "Abrir menu"}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-line text-ink md:hidden"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            {aberto ? (
              <>
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </>
            ) : (
              <>
                <path d="M4 7h16" />
                <path d="M4 12h16" />
                <path d="M4 17h16" />
              </>
            )}
          </svg>
        </button>
      </nav>

      {/* Menu do celular */}
      <div
        id="menu-mobile"
        hidden={!aberto}
        className="border-t border-line bg-fundo md:hidden"
      >
        <ul className="container-site flex flex-col py-2">
          {navegacao.map((item) => (
            <li key={item.href}>
              <a
                href={link(item.href)}
                onClick={() => setAberto(false)}
                className="block py-3 text-base text-muted transition-colors hover:text-ink"
              >
                {item.rotulo}
              </a>
            </li>
          ))}
          <li>
            <Link
              href="/chat"
              onClick={() => setAberto(false)}
              className="block py-3 text-base font-medium text-accent"
            >
              Assistente
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
