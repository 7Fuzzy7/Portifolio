/* =============================================================================
 *  content.ts — TODO o conteúdo do site mora aqui.
 *
 *  Para mudar qualquer texto do portfólio, edite SÓ este arquivo.
 *  Nenhum componente precisa ser tocado.
 *
 *  Dica: depois de editar, salve e o site recarrega sozinho (npm run dev).
 *
 *  As perguntas e respostas do assistente (/chat) ficam em perguntas.ts.
 * ========================================================================== */
import {
  baseDeConhecimento,
  categorias,
  foraDoPortfolio,
  type Resposta,
} from "./perguntas";

export type { Resposta, CategoriaPergunta } from "./perguntas";

/* -----------------------------------------------------------------------------
 * 1. SITE — usado em SEO, Open Graph e sitemap
 * -------------------------------------------------------------------------- */
export const site = {
  /** ⚠️ TROQUE depois do deploy pela URL real da Vercel (sem barra no final). */
  url: "https://pedro-almeida.vercel.app",
  titulo: "Pedro Martins de Almeida | Suporte de TI, Visão Computacional e IoT",
  /** Aparece no Google e no card de link do WhatsApp/LinkedIn. Até ~155 caracteres. */
  descricao:
    "Analista de Suporte de TI na SS3 Tecnologia e estudante de Engenharia da Computação na FIAP. Projetos em visão computacional, IoT e dados.",
  palavrasChaveSEO: [
    "Pedro Martins de Almeida",
    "Analista de Suporte de TI",
    "Engenharia da Computação",
    "FIAP",
    "visão computacional",
    "IoT",
    "Power BI",
    "Python",
    "portfólio",
  ],
};

/* -----------------------------------------------------------------------------
 * 2. PESSOAL — identidade e links
 * -------------------------------------------------------------------------- */
export const pessoal = {
  nome: "Pedro Martins de Almeida",
  /** Versão curta, usada no menu e no rodapé. */
  nomeCurto: "Pedro Almeida",
  cargo: "Analista de Suporte de TI",
  empresa: "SS3 Tecnologia",
  cidade: "Cotia, SP",
  email: "pedro.live.martins@gmail.com",
  linkedin: "https://www.linkedin.com/in/pedroalmeida09",
  github: "https://github.com/7Fuzzy7",
  /** Caminho da foto dentro de /public. Deixe "" (vazio) para esconder a foto. */
  foto: "/foto.jpg",
  fotoAlt: "Foto de Pedro Martins de Almeida",
};

/* -----------------------------------------------------------------------------
 * 3. HERO — primeira dobra
 * -------------------------------------------------------------------------- */
export const hero = {
  /** O nome que as partículas escrevem no centro da esfera (quebra em 2 linhas sozinho). */
  titulo: pessoal.nome,
  /** A frase de destaque, ao lado da esfera. Quebra de linha automática — escreva corrido. */
  posicionamento:
    "Mantenho a infraestrutura de pé durante o dia e construo visão computacional, IoT e dados no resto do tempo.",
  /** Exatamente 3 palavras-chave funcionam melhor no layout. */
  palavrasChave: [
    "Infraestrutura & Suporte",
    "Visão Computacional & IoT",
    "Dados & BI",
  ],
  botaoPrimario: { texto: "Ver no LinkedIn", href: pessoal.linkedin },
  botaoSecundario: { texto: "Falar comigo", href: "#contato" },
};

/* -----------------------------------------------------------------------------
 * 4. SOBRE
 * -------------------------------------------------------------------------- */
export const sobre = {
  titulo: "Sobre",
  /** Cada string vira um parágrafo. */
  paragrafos: [
    "Sou analista de suporte de TI na SS3 Tecnologia desde março de 2026. No dia a dia analiso a performance das máquinas, faço manutenção de hardware, instalo e padronizo software e cuido do parque de impressão e do inventário dos ativos. Foi no suporte que aprendi a achar a causa de um problema rápido e a explicar a solução de um jeito que qualquer pessoa entenda.",
    "Meu caminho até a TI foi meio longo. Comecei no técnico em Eletroeletrônica no SENAI Ricardo Lerner e depois passei um ano no CPOR/SP, como Aspirante a Oficial, cuidando de logística, compras e finanças. Também trabalhei no atendimento do Poupatempo e como controlador de acesso na Associação Fazenda Tamboré. Foram anos lidando com prazo curto e com gente de todo tipo. Na FIAP, no curso de Engenharia da Computação, juntei tudo isso com o que mais gosto de fazer: colocar um sistema para funcionar.",
    "Hoje estou no 4º ano da FIAP e procuro um estágio em Engenharia da Computação. Quero somar a infraestrutura, que já faz parte da minha rotina, ao que venho construindo em visão computacional, IoT e dados. Isso vai de modelos YOLOv8 rodando embarcados a dashboards feitos a partir de CSV bruto.",
  ],
  /** Números/destaques ao lado do texto. Deixe a lista vazia [] para esconder. */
  destaques: [
    { valor: "4º ano", legenda: "Engenharia da Computação na FIAP" },
    { valor: "Desde 2026", legenda: "Analista de Suporte na SS3 Tecnologia" },
    { valor: "5+", legenda: "Projetos em visão computacional, IoT e dados" },
  ],
};

/* -----------------------------------------------------------------------------
 * 5. HABILIDADES
 * -------------------------------------------------------------------------- */
export type GrupoHabilidades = {
  titulo: string;
  descricao: string;
  itens: string[];
};

export const habilidades: {
  titulo: string;
  subtitulo: string;
  grupos: GrupoHabilidades[];
} = {
  titulo: "Habilidades",
  subtitulo: "O que eu uso no dia a dia e nos projetos.",
  grupos: [
    {
      titulo: "Linguagens",
      descricao: "Onde eu escrevo a lógica.",
      itens: ["Python", "JavaScript", "HTML", "CSS", "SQL"],
    },
    {
      titulo: "IoT e Visão Computacional",
      descricao: "Do sensor ao modelo rodando embarcado.",
      itens: [
        "Arduino",
        "ESP32 / ESP32-CAM",
        "YOLOv8",
        "OpenCV",
        "Roboflow",
        "MQTT",
        "Node-RED",
      ],
    },
    {
      titulo: "Dados e BI",
      descricao: "Transformar dado bruto em decisão.",
      itens: [
        "Power BI",
        "Excel Avançado",
        "Pandas",
        "Streamlit",
        "Grafana",
        "Hadoop / Spark",
      ],
    },
    {
      titulo: "Infra e Suporte",
      descricao: "Manter o ambiente de pé e padronizado.",
      itens: [
        "Manutenção de hardware",
        "Análise de performance",
        "Instalação e padronização de software",
        "Suporte a impressão",
        "Inventário de ativos",
        "Gestão de infraestrutura de TI",
      ],
    },
  ],
};

/* -----------------------------------------------------------------------------
 * 6. PROJETOS
 *
 *  Cada card mostra: problema → stack → resultado.
 *  `link` é opcional: se ficar "", o card não mostra botão de repositório.
 *  💡 Quando tiver números reais (precisão do modelo, tempo economizado,
 *     nº de itens processados), coloque no campo `resultado` — números vendem.
 * -------------------------------------------------------------------------- */
export type Projeto = {
  titulo: string;
  contexto: string;
  ano: string;
  problema: string;
  solucao: string;
  resultado: string;
  stack: string[];
  link?: string;
  /** Card em destaque ocupa a largura toda na grade. */
  destaque?: boolean;
};

export const projetos: { titulo: string; subtitulo: string; itens: Projeto[] } = {
  titulo: "Projetos",
  subtitulo: "Problema, stack e o que saiu no final.",
  itens: [
    {
      titulo: "AntVision",
      contexto: "FIAP x John Deere Challenge",
      ano: "2026",
      problema:
        "Formigas cortadeiras derrubam a produtividade de lavouras inteiras, e o mapeamento dos formigueiros ainda é feito no olho, a pé, por quem conhece o talhão.",
      solucao:
        "Detecção por visão computacional rodando embarcada no dispositivo: dataset próprio anotado no Roboflow, modelo YOLOv8 treinado e convertido para Core ML, com a posição de cada detecção registrada por GPS.",
      resultado:
        "Cada ocorrência vira um ponto no mapa de infestação, e o modelo roda offline, sem depender de sinal de internet no meio da lavoura.",
      stack: ["YOLOv8", "OpenCV", "Roboflow", "Core ML", "Swift", "GPS"],
      link: "",
      destaque: true,
    },
    {
      titulo: "Digital Twin de prensa pneumática",
      contexto: "Desafio Festo na FIAP",
      ano: "2025",
      problema:
        "Acompanhar o funcionamento de uma prensa pneumática exigia inspeção presencial, o que atrasa a percepção de qualquer desvio na operação.",
      solucao:
        "Gêmeo digital alimentado por sensores físicos e uma ESP32-CAM: os dados são publicados via MQTT, tratados no Node-RED e exibidos em dashboards do Grafana.",
      resultado:
        "Estado da prensa visível em tempo real na tela, com histórico das leituras para identificar padrões fora do esperado.",
      stack: ["ESP32-CAM", "Sensores", "MQTT", "Node-RED", "Grafana"],
      link: "",
    },
    {
      titulo: "Dashboard de finanças pessoais",
      contexto: "Projeto pessoal",
      ano: "2025",
      problema:
        "O extrato do banco em CSV não responde a pergunta que importa: para onde o dinheiro foi neste mês.",
      solucao:
        "Aplicação em Streamlit que lê o CSV real do banco, limpa e categoriza os lançamentos com Pandas e monta as visões por categoria e por período.",
      resultado:
        "Evolução de gastos e concentração por categoria em uma tela só, atualizando a cada novo extrato exportado.",
      stack: ["Python", "Streamlit", "Pandas", "CSV bancário"],
      link: "",
    },
    {
      titulo: "App de risco de deslizamento",
      contexto: "Projeto acadêmico",
      ano: "2025",
      problema:
        "Quem mora em área de encosta costuma descobrir tarde demais que a chuva acumulada já passou do ponto crítico.",
      solucao:
        "App em React Native que cruza os dados de chuva da API OpenWeather com a localização do usuário e classifica o nível de risco, guardando o histórico local com AsyncStorage.",
      resultado:
        "Alerta de risco na palma da mão, funcionando com o histórico salvo mesmo quando a conexão cai.",
      stack: ["React Native", "Expo", "OpenWeather API", "AsyncStorage"],
      link: "",
    },
    {
      titulo: "Pipeline de Big Data",
      contexto: "Projeto acadêmico",
      ano: "2025",
      problema:
        "Dados presos em um banco Oracle transacional, sem uma forma prática de analisá-los em volume.",
      solucao:
        "Ingestão do Oracle para o HDFS com Sqoop e processamento distribuído com Hadoop e Spark.",
      resultado:
        "Base íntegra no data lake e consultas analíticas rodando sobre o cluster, sem pesar no banco de origem.",
      stack: ["Sqoop", "HDFS", "Hadoop", "Spark"],
      link: "",
    },
  ],
};

/* -----------------------------------------------------------------------------
 * 7. EXPERIÊNCIA E FORMAÇÃO
 *
 *  `ate: "atual"` deixa o cargo marcado como o atual (bolinha azul pulsando).
 * -------------------------------------------------------------------------- */
export type Cargo = {
  empresa: string;
  cargo: string;
  de: string;
  ate: string;
  local: string;
  descricao: string;
};

export const experiencia: {
  titulo: string;
  subtitulo: string;
  cargos: Cargo[];
  formacao: { instituicao: string; curso: string; periodo: string }[];
  certificacoes: string[];
} = {
  titulo: "Experiência",
  subtitulo: "Da eletroeletrônica ao suporte de TI.",
  cargos: [
    {
      empresa: "SS3 Tecnologia",
      cargo: "Analista de Suporte de TI",
      de: "mar/2026",
      ate: "atual",
      local: "São Paulo, SP",
      descricao:
        "Análise de performance de máquinas, manutenção de hardware, instalação e padronização de software, suporte ao parque de impressão e controle de inventário dos ativos.",
    },
    {
      empresa: "Associação Fazenda Tamboré",
      cargo: "Controlador de Acesso",
      de: "out/2024",
      ate: "mar/2026",
      local: "Barueri, SP",
      descricao:
        "Operação dos sistemas de controle de acesso e monitoramento, atendimento a moradores e registro de ocorrências.",
    },
    {
      empresa: "Poupatempo (Detran)",
      cargo: "Atendimento Multitarefas",
      de: "jan/2024",
      ate: "out/2024",
      local: "Carapicuíba, SP",
      descricao:
        "Atendimento ao público em serviços do Detran, com uso diário dos sistemas do órgão e alto volume de solicitações.",
    },
    {
      empresa: "CPOR/SP (Exército Brasileiro)",
      cargo: "Aspirante a Oficial (Logística, Compras e Finanças)",
      de: "jan/2022",
      ate: "dez/2022",
      local: "São Paulo, SP",
      descricao:
        "Rotinas de logística, processos de compra e controle financeiro, em ambiente de prazo curto e procedimento rígido.",
    },
  ],
  formacao: [
    {
      instituicao: "FIAP",
      curso: "Engenharia da Computação",
      periodo: "2023 a 2027",
    },
    {
      instituicao: "SENAI Ricardo Lerner",
      curso: "Técnico em Eletroeletrônica",
      periodo: "2020 a 2021",
    },
  ],
  certificacoes: [
    "Excel Avançado (Alura)",
    "Power BI Desktop (Alura)",
    "Lógica de Programação e SQL (Alura)",
    "Gestão de Infraestrutura de TI (Alura)",
  ],
};

/* -----------------------------------------------------------------------------
 * 8. CONTATO
 * -------------------------------------------------------------------------- */
export const contato = {
  titulo: "Contato",
  chamada: "Aberto a estágio em Engenharia da Computação",
  texto:
    "Se o que você leu aqui conversa com o que a sua equipe precisa, me chame. Respondo rápido por e-mail e por LinkedIn.",
  links: [
    { rotulo: "E-mail", valor: pessoal.email, href: `mailto:${pessoal.email}` },
    { rotulo: "LinkedIn", valor: "in/pedroalmeida09", href: pessoal.linkedin },
    { rotulo: "GitHub", valor: "@7Fuzzy7", href: pessoal.github },
    { rotulo: "Onde estou", valor: pessoal.cidade, href: "" },
  ],
};

/* -----------------------------------------------------------------------------
 * 9. NAVEGAÇÃO
 * -------------------------------------------------------------------------- */
export const navegacao = [
  { rotulo: "Sobre", href: "#sobre" },
  { rotulo: "Habilidades", href: "#habilidades" },
  { rotulo: "Projetos", href: "#projetos" },
  { rotulo: "Experiência", href: "#experiencia" },
  { rotulo: "Contato", href: "#contato" },
];

/* -----------------------------------------------------------------------------
 * 10. ASSISTENTE (/chat)
 *
 *  modo: "offline" → responde com as respostas prontas de perguntas.ts: uma
 *                    "entrevista" que você já deixou respondida. Não custa nada.
 *  modo: "api"     → chama a rota /api/chat, que usa a API da Anthropic.
 *                    Exige a variável ANTHROPIC_API_KEY (veja o README).
 *
 *  Aqui ficam só os textos de moldura da página. As perguntas e as respostas
 *  (o que realmente importa) ficam em src/data/perguntas.ts.
 * -------------------------------------------------------------------------- */
export const assistente: {
  modo: "offline" | "api";
  titulo: string;
  subtitulo: string;
  saudacao: string;
  placeholder: string;
  /** Resposta quando nada combina. Aceita {email}. */
  semResposta: string;
  categorias: typeof categorias;
  foraDoPortfolio: typeof foraDoPortfolio;
  baseDeConhecimento: Resposta[];
} = {
  modo: "offline",
  titulo: "Assistente",
  subtitulo:
    "Tire dúvidas sobre a minha carreira, os meus projetos e as minhas habilidades.",
  saudacao:
    "Oi! Aqui você encontra as respostas que eu escrevi para as perguntas mais comuns de quem avalia o meu perfil. Escolha um tema abaixo ou escreva a sua pergunta.",
  placeholder: "Escreva sua pergunta…",
  semResposta:
    "Essa eu ainda não tenho pronta. Escolha um dos temas abaixo ou fale direto comigo em {email}.",
  categorias,
  foraDoPortfolio,
  baseDeConhecimento,
};