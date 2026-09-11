import type { Metadata } from "next";
import ChatAssistente from "@/components/ChatAssistente";
import { pessoal } from "@/data/content";

export const metadata: Metadata = {
  title: "Assistente",
  description: `Pergunte sobre a formação, a experiência e os projetos de ${pessoal.nome}.`,
  alternates: { canonical: "/chat" },
  openGraph: {
    title: `Assistente · ${pessoal.nomeCurto}`,
    description: `Pergunte sobre a formação, a experiência e os projetos de ${pessoal.nome}.`,
    url: "/chat",
  },
};

export default function PaginaChat() {
  return <ChatAssistente />;
}
