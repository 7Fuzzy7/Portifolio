/* =============================================================================
 *  content.ts — TODO o conteúdo do site mora aqui.
 *
 *  Para mudar qualquer texto do portfólio, edite SÓ este arquivo.
 *  Nenhum componente precisa ser tocado.
 *
 *  Dica: depois de editar, salve e o site recarrega sozinho (npm run dev).
 * ========================================================================== */

/* -----------------------------------------------------------------------------
 * 1. SITE — usado em SEO, Open Graph e sitemap
 * -------------------------------------------------------------------------- */
export const site = {
  /** ⚠️ TROQUE depois do deploy pela URL real da Vercel (sem barra no final). */
  url: "https://pedro-almeida.vercel.app",
  titulo: "Pedro Martins de Almeida — Suporte de TI, Visão Computacional e IoT",
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
  /** Linha pequena acima do nome. */
  sobrenome: "Portfólio",
  titulo: pessoal.nome,
  /** A frase grande. Quebra de linha automática — escreva corrido. */
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
    "Sou Analista de Suporte de TI na SS3 Tecnologia, onde cuido de análise de performance, manutenção de hardware, instalação e padronização de software e de todo o parque de impressão. É o tipo de rotina que ensina duas coisas que levo para qualquer projeto: diagnosticar rápido e explicar bem.",
    "Cheguei na TI por um caminho um pouco mais longo. Comecei no técnico em Eletroeletrônica do SENAI Ricardo Lerner, passei um ano como Aspirante a Oficial no CPOR/SP cuidando de logística, compras e finanças, e trabalhei com atendimento ao público no Poupatempo e na Associação Fazenda Tamboré. Foram anos lidando com processo, prazo e gente — até a Engenharia da Computação na FIAP juntar tudo isso com a parte que eu mais gosto: fazer o sistema funcionar.",
    "Hoje estou no 4º ano da FIAP e procuro um estágio em Engenharia da Computação onde eu possa somar o lado de infraestrutura ao que venho construindo em visão computacional, IoT e dados — de modelos YOLOv8 rodando embarcados a dashboards que transformam CSV bruto em decisão.",
  ],
  /** Números/destaques ao lado do texto. Deixe a lista vazia [] para esconder. */
  destaques: [
    { valor: "4º ano", legenda: "Engenharia da Computação · FIAP" },
    { valor: "2026", legenda: "Analista de Suporte na SS3 Tecnologia" },
    { valor: "5+", legenda: "Projetos entre visão computacional, IoT e dados" },
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
      contexto: "FIAP × John Deere Challenge",
      ano: "2026",
      problema:
        "Formigas cortadeiras derrubam a produtividade de lavouras inteiras, e o mapeamento dos formigueiros ainda é feito no olho, a pé, por quem conhece o talhão.",
      solucao:
        "Detecção por visão computacional rodando embarcada no dispositivo: dataset próprio anotado no Roboflow, modelo YOLOv8 treinado e convertido para Core ML, com a posição de cada detecção registrada por GPS.",
      resultado:
        "Cada ocorrência vira um ponto no mapa de infestação, e o modelo roda offline — sem depender de sinal de internet no meio da lavoura.",
      stack: ["YOLOv8", "OpenCV", "Roboflow", "Core ML", "Swift", "GPS"],
      link: "",
      destaque: true,
    },
    {
      titulo: "Digital Twin de prensa pneumática",
      contexto: "Desafio Festo · FIAP",
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
      empresa: "Poupatempo — Detran",
      cargo: "Atendimento Multitarefas",
      de: "jan/2024",
      ate: "out/2024",
      local: "Carapicuíba, SP",
      descricao:
        "Atendimento ao público em serviços do Detran, com uso diário dos sistemas do órgão e alto volume de solicitações.",
    },
    {
      empresa: "CPOR/SP — Exército Brasileiro",
      cargo: "Aspirante a Oficial · Logística, Compras e Finanças",
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
      periodo: "2023 – 2027",
    },
    {
      instituicao: "SENAI Ricardo Lerner",
      curso: "Técnico em Eletroeletrônica",
      periodo: "2020 – 2021",
    },
  ],
  certificacoes: [
    "Excel Avançado · Alura",
    "Power BI Desktop · Alura",
    "Lógica de Programação e SQL · Alura",
    "Gestão de Infraestrutura de TI · Alura",
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
 *  modo: "offline" → respostas prontas daqui de baixo. Não custa nada.
 *  modo: "api"     → chama a rota /api/chat, que usa a API da Anthropic.
 *                    Exige a variável ANTHROPIC_API_KEY (veja o README).
 *
 *  Para adicionar uma resposta nova: copie um bloco de `baseDeConhecimento`,
 *  liste as palavras que devem acionar aquela resposta e escreva o texto.
 *  Acento e maiúscula não importam na busca.
 * -------------------------------------------------------------------------- */
export type Resposta = { palavras: string[]; resposta: string };

export const assistente: {
  modo: "offline" | "api";
  titulo: string;
  subtitulo: string;
  saudacao: string;
  placeholder: string;
  sugestoes: string[];
  semResposta: string;
  baseDeConhecimento: Resposta[];
} = {
  modo: "offline",
  titulo: "Assistente",
  subtitulo: "Pergunte sobre a carreira, os projetos e a stack do Pedro.",
  saudacao:
    "Oi! Eu respondo perguntas sobre a trajetória do Pedro — formação, experiência, projetos e tecnologias. Escolha uma sugestão abaixo ou escreva a sua pergunta.",
  placeholder: "Escreva sua pergunta…",
  sugestoes: [
    "Quem é o Pedro e o que ele faz hoje?",
    "Quais projetos de visão computacional ele já fez?",
    "Quais tecnologias ele domina?",
    "Ele está disponível para estágio?",
  ],
  semResposta:
    "Ainda não tenho essa resposta pronta. Tente perguntar sobre formação, experiência, projetos, tecnologias ou disponibilidade para estágio — ou fale direto com o Pedro em pedro.live.martins@gmail.com.",
  baseDeConhecimento: [
    {
      palavras: [
        "quem e",
        "quem é",
        "quem eh",
        "me fale sobre ele",
        "fale sobre o pedro",
        "apresenta",
        "resumo",
        "faz hoje",
        "o que faz",
        "perfil",
      ],
      resposta:
        "Pedro Martins de Almeida é Analista de Suporte de TI na SS3 Tecnologia desde março de 2026 e está no 4º ano de Engenharia da Computação na FIAP (2023–2027). O posicionamento dele une duas frentes: infraestrutura e suporte de um lado, visão computacional, IoT e dados do outro. Mora em Cotia, SP.",
    },
    {
      palavras: [
        "trabalho atual",
        "trabalha",
        "ss3",
        "suporte",
        "emprego",
        "atualmente",
        "cargo",
        "analista",
      ],
      resposta:
        "Na SS3 Tecnologia ele cuida de análise de performance de máquinas, manutenção de hardware, instalação e padronização de software, suporte ao parque de impressão e controle de inventário dos ativos. É o trabalho que treinou nele o diagnóstico rápido e a comunicação clara com o usuário.",
    },
    {
      palavras: [
        "formacao",
        "formação",
        "faculdade",
        "fiap",
        "estud",
        "curso",
        "senai",
        "tecnico",
        "técnico",
        "eletroeletronica",
        "graduacao",
        "graduação",
        "universidade",
        "certifica",
      ],
      resposta:
        "Ele cursa Engenharia da Computação na FIAP (2023–2027, 4º ano) e é Técnico em Eletroeletrônica pelo SENAI Ricardo Lerner (2020–2021). Complementou com certificações da Alura em Excel Avançado, Power BI Desktop, Lógica de Programação e SQL, e Gestão de Infraestrutura de TI.",
    },
    {
      palavras: [
        "projetos",
        "portfolio",
        "portfólio",
        "ja fez",
        "já fez",
        "construiu",
        "desenvolveu",
      ],
      resposta:
        "São cinco projetos no portfólio: AntVision (detecção de formigas cortadeiras com YOLOv8, para o FIAP × John Deere Challenge 2026), um Digital Twin de prensa pneumática com ESP32-CAM e Grafana, um dashboard de finanças pessoais em Streamlit com CSV real de banco, um app React Native de risco de deslizamento e um pipeline de Big Data com Sqoop, Hadoop e Spark.",
    },
    {
      palavras: [
        "antvision",
        "formiga",
        "visao computacional",
        "visão computacional",
        "yolo",
        "opencv",
        "roboflow",
        "john deere",
        "lavoura",
        "agro",
        "deteccao",
        "detecção",
      ],
      resposta:
        "O AntVision foi feito para o FIAP × John Deere Challenge 2026. O problema: formigas cortadeiras derrubam a produtividade da lavoura e o mapeamento dos formigueiros ainda é feito a pé, no olho. A solução foi um modelo YOLOv8 treinado sobre um dataset próprio anotado no Roboflow, convertido para Core ML e rodando embarcado no dispositivo, com a posição de cada detecção registrada por GPS. Como roda offline, funciona no meio do talhão sem sinal de internet.",
    },
    {
      palavras: [
        "digital twin",
        "gemeo digital",
        "gêmeo digital",
        "festo",
        "prensa",
        "iot",
        "esp32",
        "mqtt",
        "node-red",
        "grafana",
        "sensor",
        "industria",
        "indústria",
      ],
      resposta:
        "O Digital Twin da prensa pneumática nasceu do desafio da Festo na FIAP. Sensores físicos e uma ESP32-CAM publicam telemetria via MQTT, o Node-RED trata os dados e o Grafana mostra o estado da prensa em tempo real, com histórico para identificar desvios na operação.",
    },
    {
      palavras: [
        "dashboard",
        "streamlit",
        "financas",
        "finanças",
        "gastos",
        "banco",
        "csv",
        "pandas",
      ],
      resposta:
        "O dashboard de finanças pessoais é um projeto em Streamlit que lê o CSV real exportado do banco, limpa e categoriza os lançamentos com Pandas e mostra a evolução dos gastos por categoria e por período — respondendo a pergunta que o extrato bruto não responde.",
    },
    {
      palavras: [
        "react native",
        "deslizamento",
        "app",
        "aplicativo",
        "mobile",
        "expo",
        "openweather",
        "chuva",
        "encosta",
      ],
      resposta:
        "É um app em React Native com Expo que cruza os dados de chuva da API OpenWeather com a localização do usuário para classificar o risco de deslizamento em área de encosta, guardando o histórico local com AsyncStorage para continuar útil mesmo sem conexão.",
    },
    {
      palavras: [
        "big data",
        "spark",
        "hadoop",
        "sqoop",
        "hdfs",
        "pipeline",
        "data lake",
        "oracle",
      ],
      resposta:
        "No projeto de Big Data ele fez a ingestão de dados de um banco Oracle para o HDFS usando Sqoop e o processamento distribuído com Hadoop e Spark, liberando as consultas analíticas do banco transacional de origem.",
    },
    {
      palavras: [
        "tecnologias",
        "stack",
        "habilidades",
        "linguagens",
        "domina",
        "ferramentas",
        "python",
        "javascript",
        "sql",
        "skills",
      ],
      resposta:
        "Linguagens: Python, JavaScript, HTML, CSS e SQL. IoT e visão computacional: Arduino, ESP32/ESP32-CAM, YOLOv8, OpenCV, Roboflow, MQTT e Node-RED. Dados e BI: Power BI, Excel Avançado, Pandas, Streamlit, Grafana e Hadoop/Spark. Infra e suporte: manutenção de hardware, análise de performance, padronização de software, suporte a impressão e inventário de ativos.",
    },
    {
      palavras: [
        "power bi",
        "bi",
        "dados",
        "analise de dados",
        "análise de dados",
        "excel",
      ],
      resposta:
        "Na parte de dados ele trabalha com Power BI e Excel Avançado (ambos com certificação Alura), Pandas e Streamlit para análise em Python, Grafana para telemetria em tempo real e Hadoop/Spark no contexto de Big Data.",
    },
    {
      palavras: [
        "estagio",
        "estágio",
        "disponivel",
        "disponível",
        "vaga",
        "contratar",
        "oportunidade",
        "procurando",
        "busca",
        "trabalhar",
      ],
      resposta:
        "Sim — ele está aberto a estágio em Engenharia da Computação, de preferência em algo que combine infraestrutura com visão computacional, IoT ou dados. O contato mais rápido é pelo e-mail pedro.live.martins@gmail.com ou pelo LinkedIn: linkedin.com/in/pedroalmeida09.",
    },
    {
      palavras: [
        "contato",
        "email",
        "e-mail",
        "linkedin",
        "github",
        "falar",
        "chamar",
        "telefone",
        "onde mora",
        "cidade",
      ],
      resposta:
        "E-mail: pedro.live.martins@gmail.com · LinkedIn: linkedin.com/in/pedroalmeida09 · GitHub: github.com/7Fuzzy7 · Cotia, SP.",
    },
    {
      palavras: [
        "transicao",
        "transição",
        "carreira",
        "antes",
        "experiencia anterior",
        "experiência anterior",
        "poupatempo",
        "exercito",
        "exército",
        "cpor",
        "tambore",
        "tamboré",
        "trajetoria",
        "trajetória",
      ],
      resposta:
        "A trajetória dele não começou na TI. Foi Aspirante a Oficial no CPOR/SP em 2022, cuidando de logística, compras e finanças; atuou no atendimento do Poupatempo (Detran) em 2024; e foi Controlador de Acesso na Associação Fazenda Tamboré até março de 2026, quando entrou na SS3 Tecnologia. São anos de processo, prazo e contato com o público que hoje aparecem na forma como ele conduz um atendimento técnico.",
    },
    {
      palavras: [
        "diferencial",
        "por que contratar",
        "ponto forte",
        "se destaca",
        "vale a pena",
      ],
      resposta:
        "O diferencial é a combinação: ele entende o hardware e a infraestrutura por baixo (formação em eletroeletrônica + rotina de suporte) e sabe construir a camada de software em cima — de um modelo YOLOv8 embarcado a um dashboard de telemetria. Some a isso anos de atendimento ao público, que aparecem na clareza com que ele explica um problema técnico.",
    },
  ],
};
