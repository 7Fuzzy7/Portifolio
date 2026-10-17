"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { assistente, pessoal } from "@/data/content";
import { responder } from "@/lib/assistente";
import { SUAVE } from "@/lib/animacao";

// A esfera (WebGL) vem em um pedaço de JS separado, só no navegador.
const Orb = dynamic(() => import("./Orb"), { ssr: false });

type Mensagem = { de: "voce" | "assistente"; texto: string };

export default function ChatAssistente() {
  const [mensagens, setMensagens] = useState<Mensagem[]>([
    { de: "assistente", texto: assistente.saudacao },
  ]);
  const [texto, setTexto] = useState("");
  const [pensando, setPensando] = useState(false);
  // Sobe a cada resposta recebida: faz a esfera soltar uma onda de luz.
  const [respostas, setRespostas] = useState(0);
  const fimDaLista = useRef<HTMLDivElement>(null);
  const campo = useRef<HTMLInputElement>(null);

  // Rola para a última mensagem sempre que a conversa cresce.
  useEffect(() => {
    fimDaLista.current?.scrollIntoView({ block: "end", behavior: "smooth" });
  }, [mensagens, pensando]);

  async function enviar(pergunta: string) {
    const limpa = pergunta.trim();
    if (!limpa || pensando) return;

    setMensagens((atual) => [...atual, { de: "voce", texto: limpa }]);
    setTexto("");
    setPensando(true);

    try {
      if (assistente.modo === "api") {
        // Modo com IA: a chave da API fica no servidor, nunca no navegador.
        const r = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pergunta: limpa }),
        });
        const dados = await r.json();
        const resposta =
          typeof dados?.resposta === "string" && dados.resposta.trim()
            ? dados.resposta
            : assistente.semResposta;
        setMensagens((atual) => [...atual, { de: "assistente", texto: resposta }]);
      } else {
        // Modo offline: respostas prontas do content.ts. Custo zero.
        await new Promise((resolve) => setTimeout(resolve, 420));
        setMensagens((atual) => [
          ...atual,
          { de: "assistente", texto: responder(limpa) },
        ]);
      }
    } catch {
      setMensagens((atual) => [
        ...atual,
        { de: "assistente", texto: assistente.semResposta },
      ]);
    } finally {
      setPensando(false);
      setRespostas((n) => n + 1);
      campo.current?.focus();
    }
  }

  const mostrarSugestoes = mensagens.length <= 3;

  return (
    <div className="container-site">
      <div className="mx-auto flex min-h-[calc(100svh-4rem)] max-w-3xl flex-col pb-8 pt-24">
        <header>
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-xs tracking-widest text-accent transition-opacity hover:opacity-80"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M19 12H5" />
              <path d="m11 18-6-6 6-6" />
            </svg>
            VOLTAR AO PORTFÓLIO
          </Link>
          <div className="mt-4 flex items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
                {assistente.titulo}
              </h1>
              <p className="mt-3 text-base text-muted md:text-lg">
                {assistente.subtitulo}
              </p>
            </div>
            {/* O "rosto" do assistente: agita enquanto pensa e solta uma onda de luz ao responder. */}
            <Orb
              variante="avatar"
              estado={pensando ? "pensando" : "ocioso"}
              pulso={respostas}
              className="-my-3 h-28 w-28 shrink-0 md:-my-4 md:h-44 md:w-44"
            />
          </div>
          <div className="rule-fade mt-8" />
        </header>

        {/* Conversa */}
        <div
          role="log"
          aria-live="polite"
          aria-label="Conversa com o assistente"
          className="flex-1 space-y-4 py-8"
        >
          {mensagens.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 14, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.45, ease: SUAVE }}
              className={`flex ${m.de === "voce" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed md:text-base ${
                  m.de === "voce"
                    ? "rounded-br-sm border border-accent/30 bg-accent/10 text-ink"
                    : "rounded-bl-sm border border-line bg-surface text-muted"
                }`}
              >
                <span className="sr-only">
                  {m.de === "voce" ? "Você disse: " : "Assistente respondeu: "}
                </span>
                {m.texto}
              </div>
            </motion.div>
          ))}

          <AnimatePresence>
            {pensando && (
              <motion.div
                key="pensando"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.25 }}
                className="flex justify-start"
              >
                <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm border border-line bg-surface px-4 py-4">
                  <span className="sr-only">Escrevendo a resposta…</span>
                  {[0, 1, 2].map((n) => (
                    <span
                      key={n}
                      className="h-1.5 w-1.5 animate-bounce rounded-full bg-accent"
                      style={{ animationDelay: `${n * 0.15}s` }}
                      aria-hidden="true"
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={fimDaLista} />
        </div>

        {/* Perguntas sugeridas */}
        {mostrarSugestoes && (
          <div className="mb-4">
            <p className="mb-3 font-mono text-[0.68rem] uppercase tracking-widest text-muted">
              Sugestões
            </p>
            <ul className="flex flex-wrap gap-2">
              {assistente.sugestoes.map((s) => (
                <li key={s}>
                  <button
                    type="button"
                    onClick={() => enviar(s)}
                    disabled={pensando}
                    className="rounded-full border border-line bg-surface px-4 py-2 text-left text-sm text-muted transition-colors hover:border-accent/50 hover:text-accent disabled:opacity-50"
                  >
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Campo de pergunta */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            enviar(texto);
          }}
          className="flex gap-2 rounded-2xl border border-line bg-surface/95 p-2 backdrop-blur"
        >
          <label htmlFor="pergunta" className="sr-only">
            Escreva sua pergunta para o assistente
          </label>
          <input
            id="pergunta"
            ref={campo}
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder={assistente.placeholder}
            autoComplete="off"
            className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-base text-ink placeholder:text-muted focus:outline-none"
          />
          <button
            type="submit"
            disabled={pensando || !texto.trim()}
            className="shrink-0 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-fundo transition-opacity disabled:opacity-40"
          >
            Enviar
            <span className="sr-only"> pergunta</span>
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-muted">
          {assistente.modo === "offline"
            ? "Respostas pré-definidas a partir do conteúdo deste portfólio."
            : "Respostas geradas por IA a partir do conteúdo deste portfólio."}{" "}
          Para falar comigo de verdade:{" "}
          <a
            href={`mailto:${pessoal.email}`}
            className="text-accent transition-opacity hover:opacity-80"
          >
            {pessoal.email}
          </a>
        </p>
      </div>
    </div>
  );
}
