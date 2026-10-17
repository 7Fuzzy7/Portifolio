import Hero from "@/components/Hero";
import FaixaTecnologias from "@/components/FaixaTecnologias";
import Sobre from "@/components/Sobre";
import Habilidades from "@/components/Habilidades";
import Projetos from "@/components/Projetos";
import Experiencia from "@/components/Experiencia";
import Contato from "@/components/Contato";
import { habilidades } from "@/data/content";

/** Nomes curtos de ferramentas (frases longas da área de Infra ficam de fora da faixa). */
const tecnologias = [
  ...new Set(habilidades.grupos.flatMap((g) => g.itens)),
].filter((item) => item.length <= 18);

export default function Home() {
  return (
    <>
      <Hero />
      <FaixaTecnologias itens={tecnologias} />
      <Sobre />
      <Habilidades />
      <Projetos />
      <Experiencia />
      <Contato />
    </>
  );
}
