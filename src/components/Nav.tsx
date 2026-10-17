"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { navegacao, pessoal } from "@/data/content";
import { SUAVE } from "@/lib/animacao";
import TextoRolante from "./TextoRolante";

// O Link do Next com as props do Motion (hover, variantes…).
const MotionLink = motion.create(Link);

export default function Nav() {
  const pathname = usePathname();
  const naHome = pathname === "/";
  const [rolou, setRolou] = useState(false);
  const [aberto, setAberto] = useState(false);
  const [ativo, setAtivo] = useState("");

  // Descobre qual seção está na tela para destacar o link correspondente.
  useEffect(() => {
    if (!naHome) return;
    const secoes = navegacao
      .map((item) => document.querySelector(item.href))
      .filter((el): el is Element => el !== null);
    const observer = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (e.isIntersecting) setAtivo(`#${e.target.id}`);
        }
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    secoes.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [naHome]);

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
              <motion.a
                href={link(item.href)}
                initial="repouso"
                whileHover="hover"
                whileFocus="hover"
                className={`relative block px-1 py-1 text-sm transition-colors hover:text-ink ${
                  naHome && ativo === item.href ? "text-ink" : "text-muted"
                }`}
              >
                <TextoRolante>{item.rotulo}</TextoRolante>
                {naHome && ativo === item.href && (
                  <motion.span
                    layoutId="nav-indicador"
                    data-nav-indicador=""
                    aria-hidden="true"
                    className="absolute inset-x-0 -bottom-1 h-px bg-accent"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
              </motion.a>
            </li>
          ))}
          <li>
            <MotionLink
              href="/chat"
              initial="repouso"
              whileHover="hover"
              whileFocus="hover"
              className="block rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent transition-colors hover:bg-accent/20"
            >
              <TextoRolante>Assistente</TextoRolante>
            </MotionLink>
          </li>
        </ul>

        {/* Botão do menu no celular */}
        <button
          type="button"
          onClick={() => setAberto((v) => !v)}
          aria-expanded={aberto}
          aria-controls={aberto ? "menu-mobile" : undefined}
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

      {/* Menu do celular: abre/fecha deslizando, com os links entrando em sequência. */}
      <AnimatePresence initial={false}>
        {aberto && (
          <motion.div
            id="menu-mobile"
            key="menu-mobile"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: SUAVE }}
            className="overflow-hidden border-t border-line bg-fundo md:hidden"
          >
            <ul className="container-site flex flex-col py-2">
              {[
                ...navegacao.map((item) => ({
                  rotulo: item.rotulo,
                  href: link(item.href),
                  pagina: false,
                })),
                { rotulo: "Assistente", href: "/chat", pagina: true },
              ].map((item, i) => (
                <motion.li
                  key={item.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: 0.05 + i * 0.045, ease: SUAVE }}
                >
                  {item.pagina ? (
                    <Link
                      href={item.href}
                      onClick={() => setAberto(false)}
                      className="block py-3 text-base font-medium text-accent"
                    >
                      {item.rotulo}
                    </Link>
                  ) : (
                    <a
                      href={item.href}
                      onClick={() => setAberto(false)}
                      className="block py-3 text-base text-muted transition-colors hover:text-ink"
                    >
                      {item.rotulo}
                    </a>
                  )}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
