"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";

async function copiarTexto(texto: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(texto);
    return true;
  } catch {
    // Navegador sem permissão para a área de transferência: tenta o método antigo.
    try {
      const campo = document.createElement("textarea");
      campo.value = texto;
      campo.setAttribute("readonly", "");
      campo.style.position = "fixed";
      campo.style.opacity = "0";
      document.body.appendChild(campo);
      campo.select();
      const ok = document.execCommand("copy");
      campo.remove();
      return ok;
    } catch {
      return false;
    }
  }
}

/**
 * Pílula com o e-mail e um botão de copiar — inspirada no comando
 * "npm install motion" do motion.dev. O ícone troca por um "check" com
 * AnimatePresence e volta sozinho depois de 2 s.
 */
export default function CopiarEmail({ email }: { email: string }) {
  const [copiado, setCopiado] = useState(false);
  const temporizador = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  async function copiar() {
    if (!(await copiarTexto(email))) return;
    setCopiado(true);
    clearTimeout(temporizador.current);
    temporizador.current = setTimeout(() => setCopiado(false), 2000);
  }

  const icone = {
    initial: { scale: 0.4, opacity: 0, rotate: -30 },
    animate: { scale: 1, opacity: 1, rotate: 0 },
    exit: { scale: 0.4, opacity: 0, rotate: 30 },
    transition: { type: "spring" as const, stiffness: 500, damping: 28 },
  };

  return (
    <div className="inline-flex max-w-full items-center gap-1 rounded-full border border-line bg-surface py-1.5 pl-5 pr-1.5 font-mono text-xs text-ink sm:text-sm">
      <span className="min-w-0 select-all break-all">{email}</span>
      <button
        type="button"
        onClick={copiar}
        aria-label={copiado ? "E-mail copiado" : "Copiar e-mail"}
        className={`relative grid h-9 w-9 shrink-0 place-items-center rounded-full transition-colors hover:bg-elevated ${
          copiado ? "text-accent" : "text-muted hover:text-ink"
        }`}
      >
        <AnimatePresence mode="wait" initial={false}>
          {copiado ? (
            <motion.svg
              key="ok"
              {...icone}
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M20 6 9 17l-5-5" />
            </motion.svg>
          ) : (
            <motion.svg
              key="copiar"
              {...icone}
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </motion.svg>
          )}
        </AnimatePresence>
      </button>
      <span role="status" className="sr-only">
        {copiado ? "E-mail copiado para a área de transferência" : ""}
      </span>
    </div>
  );
}
