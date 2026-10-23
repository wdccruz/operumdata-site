import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

const operationSteps = [
  "Protocolo do cliente",
  "Qualificação dos requisitos",
  "Sourcing de ambientes e participantes",
  "Autorizações e onboarding",
  "Controle de equipamentos",
  "Execução e acompanhamento de campo",
  "Avaliação do cliente e ajustes",
];

const environments = [
  {
    code: "ENV / 01",
    title: "Construção e reformas",
    text: "Instalações elétricas, hidráulica, HVAC, pintura, alvenaria, manutenção e serviços técnicos.",
  },
  {
    code: "ENV / 02",
    title: "Oficinas e serviços automotivos",
    text: "Oficinas mecânicas, borracharias, manutenção, diagnóstico e trabalho com ferramentas.",
  },
  {
    code: "ENV / 03",
    title: "Produção, fabricação e carpintaria",
    text: "Carpintarias, serralherias, pequenas operações industriais, montagem e fabricação.",
  },
  {
    code: "ENV / 04",
    title: "Restaurantes e cozinhas comerciais",
    text: "Preparação de alimentos, organização, limpeza e rotinas operacionais.",
  },
  {
    code: "ENV / 05",
    title: "Varejo e operações comerciais",
    text: "Reposição, organização de produtos, movimentação e atividades de apoio.",
  },
  {
    code: "ENV / 06",
    title: "Facilities e instalações técnicas",
    text: "Limpeza comercial, manutenção predial, instalação de equipamentos e serviços de campo.",
  },
];

const method = [
  {
    number: "01",
    label: "SCOPE",
    title: "Escopo",
    text: "Entendemos protocolo, tarefas, ambientes, perfil dos participantes, hardware, duração esperada e critérios de aceitação.",
  },
  {
    number: "02",
    label: "SOURCE",
    title: "Sourcing e qualificação",
    text: "Identificamos empresas, ambientes e participantes compatíveis e verificamos as condições operacionais.",
  },
  {
    number: "03",
    label: "PILOT",
    title: "Piloto",
    text: "Testamos o protocolo em campo, identificamos dificuldades e produzimos material inicial para avaliação do cliente.",
  },
  {
    number: "04",
    label: "OPERATE",
    title: "Operação",
    text: "Coordenamos participantes, locais, equipamentos, cronograma e execução, mantendo visibilidade sobre o andamento.",
  },
  {
    number: "05",
    label: "SCALE",
    title: "Escala",
    text: "Depois da validação, ampliamos gradualmente a capacidade com base no que foi comprovado durante o piloto.",
  },
];

const controls = [
  {
    code: "CTRL / 01",
    status: "DEFINED PER PROJECT",
    title: "Cadeia de custódia",
    text: "Recebimento, responsável, alocação, armazenamento, movimentação e devolução dos equipamentos.",
  },
  {
    code: "CTRL / 02",
    status: "REQUIRED",
    title: "Participantes e locais",
    text: "Qualificação, autorização dos ambientes, áreas permitidas, onboarding e responsabilidades.",
  },
  {
    code: "CTRL / 03",
    status: "REQUIRED",
    title: "Privacidade e consentimento",
    text: "Participação consentida, requisitos de privacidade do projeto e restrições específicas dos ambientes.",
  },
  {
    code: "CTRL / 04",
    status: "PROJECT-BASED",
    title: "Visibilidade da execução",
    text: "Cronograma, progresso, dificuldades de campo, incidentes e coordenação de correções ou regravações.",
  },
];

const faqs = [
  {
    question: "Vocês utilizam apenas funcionários próprios?",
    answer:
      "Não. Conforme o projeto, os participantes podem ser identificados em empresas parceiras e ambientes pertencentes a terceiros. A OperumData qualifica e coordena a participação de acordo com os requisitos definidos.",
  },
  {
    question: "Os locais precisam pertencer à OperumData?",
    answer:
      "Não. Podemos desenvolver operações em locais de terceiros, desde que exista compatibilidade com o protocolo e autorização para a coleta.",
  },
  {
    question: "Vocês conseguem recrutar novos participantes?",
    answer:
      "Sim. O sourcing é realizado de acordo com o perfil, a experiência, a localização e as atividades exigidas pelo projeto.",
  },
  {
    question: "Vocês fornecem o hardware?",
    answer:
      "Depende do escopo. Podemos operar com hardware e aplicações fornecidos pelo cliente. Outras necessidades são avaliadas durante a definição do projeto.",
  },
  {
    question: "Vocês trabalham apenas com construção?",
    answer:
      "Não. Construção é apenas uma das categorias possíveis. Também podemos desenvolver operações em oficinas, manutenção, carpintaria, pequenas operações industriais, restaurantes, cozinhas comerciais, varejo, limpeza e instalações técnicas.",
  },
  {
    question: "É possível definir capacidade semanal antes de analisar o projeto?",
    answer:
      "Não com responsabilidade. A capacidade depende do protocolo, das tarefas, dos ambientes, do hardware, da logística e dos critérios de aceitação. Quando necessário, utilizamos um piloto para produzir uma estimativa baseada em execução real.",
  },
  {
    question: "Vocês realizam pilotos?",
    answer:
      "Sim. Preferimos iniciar com um piloto controlado antes de assumir compromissos de escala.",
  },
  {
    question: "Em quais regiões vocês operam?",
    answer:
      "A operação inicial está concentrada no Rio Grande do Sul. O desenvolvimento de novas localidades é avaliado conforme o escopo, o prazo e a logística de cada projeto.",
  },
  {
    question: "Como são tratados privacidade, autorizações e consentimentos?",
    answer:
      "Os requisitos são definidos para cada operação. As autorizações dos ambientes, a participação consentida, as áreas permitidas para captura e os requisitos de privacidade aplicáveis são organizados antes do início da coleta.",
  },
];

function SectionHeading({
  index,
  eyebrow,
  title,
  description,
}: {
  index: string;
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="section-heading reveal">
      <div className="section-heading__meta">
        <span>{index}</span>
        <span>{eyebrow}</span>
      </div>
      <div>
        <h2>{title}</h2>
        {description ? <p>{description}</p> : null}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main id="top">
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>

      <header className="site-header">
        <div className="shell site-header__inner">
          <a className="wordmark" href="#top" aria-label="OperumData — início">
            <span className="wordmark__mark" aria-hidden="true">O</span>
            <span>OperumData</span>
          </a>

          <nav className="desktop-nav" aria-label="Navegação principal">
            <a href="#operacao">Operação</a>
            <a href="#ambientes">Ambientes</a>
            <a href="#metodo">Método</a>
            <a href="#controle">Controle</a>
            <a href="#experiencia">Experiência</a>
            <a href="#faq">FAQ</a>
          </nav>

          <Button asChild className="header-cta">
            <a href="#contato">Discutir um projeto</a>
          </Button>

          <details className="mobile-nav">
            <summary aria-label="Abrir navegação">Menu</summary>
            <nav aria-label="Navegação para dispositivos móveis">
              <a href="#operacao">Operação</a>
              <a href="#ambientes">Ambientes</a>
              <a href="#metodo">Método</a>
              <a href="#controle">Controle</a>
              <a href="#experiencia">Experiência</a>
              <a href="#faq">FAQ</a>
              <a href="#contato">Discutir um projeto</a>
            </nav>
          </details>
        </div>
      </header>

      <div id="conteudo">
        <section className="hero" aria-labelledby="hero-title">
          <div className="shell hero__grid">
            <div className="hero__content reveal">
              <div className="eyebrow">
                <span className="signal-dot" aria-hidden="true" />
                Dados do mundo real · Physical AI · Brasil
              </div>
              <h1 id="hero-title">O mundo físico.<br/><em>Dados para a próxima geração de IA.</em></h1>
              <p className="hero__lead">
                Da identificação de empresas, ambientes e profissionais à preparação de pilotos, estruturamos as condições para executar projetos de coleta de dados do mundo real no Brasil.
              </p>
              <div className="hero__proof"><span>REAL-WORLD DATA</span><span>FIELD NETWORK / BRAZIL</span><span>PILOT-FIRST</span></div>
              <div className="hero__actions">
                <Button asChild size="lg" className="primary-cta">
                  <a href="#contato">Discutir um projeto</a>
                </Button>
                <Button asChild size="lg" variant="outline" className="secondary-cta">
                  <a href="#metodo">Ver como operamos</a>
                </Button>
              </div>
              <ul className="hero__meta" aria-label="Princípios operacionais">
                <li>Protocolo do cliente</li>
                <li>Ambientes reais</li>
                <li>Participação consentida</li>
                <li>Piloto antes da escala</li>
              </ul>
            </div>

            <div className="ops-console reveal" aria-label="Representação do pipeline operacional">
              <div className="ops-console__header">
                <span>OPERUMDATA / FIELD OPS</span>
                <span className="ops-console__mode">
                  <span className="signal-dot" aria-hidden="true" /> PROCESS MODEL
                </span>
              </div>
              <div className="ops-console__body">
                <div className="console-readout">
                  <span>REGION / BR</span>
                  <span>MODE / PROJECT-BASED</span>
                </div>
                <div className="pipeline-flow" aria-hidden="true">
                  <span className="pipeline-flow__rail" />
                  <span className="pipeline-flow__pulse" />
                  {[
                    ["01", "CLIENT PROTOCOL", "RECEIVED"],
                    ["02", "REQUIREMENTS", "QUALIFYING"],
                    ["03", "WORKSITE + PEOPLE", "MATCHED"],
                    ["04", "FIELD CAPTURE", "CAPTURING"],
                    ["05", "CLIENT REVIEW", "REVIEW"],
                  ].map(([number, label, status]) => (
                    <div className="pipeline-node" key={number}>
                      <span className="pipeline-node__number">{number}</span>
                      <span className="pipeline-node__label">{label}</span>
                      <span className="pipeline-node__status">{status}</span>
                    </div>
                  ))}
                </div>
                <div className="console-footer">
                  <span>INPUT / CLIENT DEFINED</span>
                  <span>OUTPUT / FIELD EXECUTION</span>
                </div>
              </div>
              <p className="console-caption">Modelo conceitual · não representa gravações já realizadas.</p>
            </div>
          </div>
        </section>

        <div className="editorial-strip"><div className="shell editorial-strip__inner"><span>01 / ESTRUTURAR</span><span>02 / QUALIFICAR</span><span>03 / VALIDAR</span><span>04 / OPERAR</span><strong>BRASIL → PHYSICAL AI</strong></div></div>
        <section className="section" id="operacao">
          <div className="shell">
            <SectionHeading
              index="01"
              eyebrow="FIELD OPERATIONS"
              title="Do protocolo do cliente à execução em campo."
              description="O cliente define o que precisa ser capturado. A OperumData estrutura a operação local necessária para executar a coleta no Brasil."
            />

            <div className="operation-layout">
              <div className="operation-copy reveal">
                <p>
                  Conforme o projeto, identificamos ambientes, qualificamos empresas e participantes, organizamos autorizações e consentimentos, apoiamos o onboarding do protocolo, coordenamos equipamentos e acompanhamos a execução em campo.
                </p>
                <div className="statement-panel">
                  <span className="mono-label">OPERATING LAYER</span>
                  <strong>
                    Estruturamos a operação necessária para que a coleta aconteça em condições reais, com responsabilidades, critérios e controles definidos.
                  </strong>
                </div>
              </div>

              <ol className="operation-stack reveal">
                {operationSteps.map((step, index) => (
                  <li key={step}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <p>{step}</p>
                    <i aria-hidden="true" />
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className="section section--network" id="rede">
          <div className="shell">
            <SectionHeading
              index="02"
              eyebrow="BRAZIL FIELD NETWORK"
              title="Acesso desenvolvido de acordo com cada protocolo."
            />

            <div className="network-layout">
              <div className="network-copy reveal">
                <p>
                  A OperumData desenvolve e qualifica uma rede de empresas, ambientes reais de trabalho e profissionais que podem ser ativados de acordo com os requisitos de cada projeto.
                </p>
                <p>
                  Nossa capacidade não depende apenas de uma equipe própria. Ela vem da identificação, qualificação e coordenação de empresas, locais e participantes adequados para cada operação.
                </p>
                <p>
                  Os ambientes podem pertencer a terceiros e os participantes não precisam integrar o quadro próprio da OperumData. A participação, as áreas autorizadas e as condições de execução são definidas antes do início da coleta.
                </p>
                <div className="network-note">
                  A rede cresce de forma orientada à demanda real dos projetos e às categorias de ambiente exigidas por cada protocolo.
                </div>
              </div>

              <div className="network-graph reveal" aria-label="Representação conceitual da Brazil Field Network">
                <div className="network-graph__label">NETWORK MODEL / NOT COVERAGE DATA</div>
                <div className="network-graph__center">OPERUMDATA</div>
                <div className="network-graph__node network-graph__node--company"><span>01</span> COMPANY</div>
                <div className="network-graph__node network-graph__node--worksite"><span>02</span> WORKSITE</div>
                <div className="network-graph__node network-graph__node--participant"><span>03</span> PARTICIPANT</div>
                <div className="network-graph__node network-graph__node--field"><span>04</span> FIELD OPS</div>
                <span className="graph-line graph-line--one" aria-hidden="true" />
                <span className="graph-line graph-line--two" aria-hidden="true" />
                <span className="graph-line graph-line--three" aria-hidden="true" />
                <span className="graph-line graph-line--four" aria-hidden="true" />
                <span className="graph-pulse" aria-hidden="true" />
                <p>Representação operacional · sem indicação de cobertura ou disponibilidade atual</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="ambientes">
          <div className="shell">
            <SectionHeading
              index="03"
              eyebrow="REAL WORK ENVIRONMENTS"
              title="Onde o trabalho real já acontece."
              description="Cada protocolo exige uma combinação específica de ambiente, atividade, participante, segurança, autorização e condições de captura."
            />

            <div className="field-visual reveal" role="img" aria-label="Imagem ilustrativa de ambiente de trabalho industrial"><div className="field-visual__overlay"><span>REAL WORK / REAL ENVIRONMENTS</span><strong>O campo não é uma simulação.</strong><small>Imagem ilustrativa · não representa uma operação da OperumData</small></div></div>
            <div className="environment-grid">
              {environments.map((environment) => (
                <article className="environment-card reveal" key={environment.code}>
                  <div className="environment-card__top">
                    <span>{environment.code}</span>
                    <i aria-hidden="true" />
                  </div>
                  <h3>{environment.title}</h3>
                  <p>{environment.text}</p>
                  <div className="environment-card__footer">
                    <span>QUALIFICAÇÃO</span>
                    <span>PROJECT-BASED</span>
                  </div>
                </article>
              ))}
            </div>

            <p className="section-disclaimer reveal">
              Estes são exemplos de ambientes que podem ser qualificados. A disponibilidade e a compatibilidade são confirmadas após a análise de cada protocolo.
            </p>
          </div>
        </section>

        <section className="section section--method" id="metodo">
          <div className="shell">
            <SectionHeading
              index="04"
              eyebrow="OPERATING METHOD"
              title="Um processo para transformar requisitos em execução controlada."
            />

            <ol className="method-pipeline">
              {method.map((step) => (
                <li className="method-step reveal" key={step.number}>
                  <div className="method-step__top">
                    <span>{step.number}</span>
                    <span>{step.label}</span>
                  </div>
                  <div className="method-step__node" aria-hidden="true"><i /></div>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </li>
              ))}
            </ol>

            <div className="method-principle reveal">
              <span>PILOTO PRIMEIRO</span>
              <i aria-hidden="true" />
              <span>VALIDAR</span>
              <i aria-hidden="true" />
              <span>ESCALAR</span>
            </div>
            <p className="method-note reveal">
              Não prometemos capacidade antes de compreender o protocolo e as condições reais de execução.
            </p>
          </div>
        </section>

        <section className="section" id="controle">
          <div className="shell">
            <SectionHeading
              index="05"
              eyebrow="CONTROL + TRUST"
              title="Confiança construída através de processo e rastreabilidade."
              description="Coletar dados no mundo real envolve mais do que disponibilizar pessoas e câmeras. Exige responsabilidades claras, controle de equipamentos, documentação, consentimento e visibilidade sobre a execução em campo."
            />

            <div className="control-console reveal">
              <div className="control-console__header">
                <span>OPERATIONAL CONTROL LAYER</span>
                <span>CONFIGURED BY SCOPE</span>
              </div>
              <div className="control-list">
                {controls.map((control) => (
                  <article className="control-row" key={control.code}>
                    <span className="control-row__code">{control.code}</span>
                    <div>
                      <h3>{control.title}</h3>
                      <p>{control.text}</p>
                    </div>
                    <span className="control-row__status"><i aria-hidden="true" /> {control.status}</span>
                  </article>
                ))}
              </div>
              <div className="control-console__footer">
                Os controles aplicáveis são definidos durante o escopo e formalizados antes do piloto.
              </div>
            </div>
          </div>
        </section>

        <section className="section section--hardware" id="hardware">
          <div className="shell">
            <SectionHeading
              index="06"
              eyebrow="HARDWARE + QUALITY"
              title="Modelos flexíveis de hardware. Critérios claros de aprovação."
            />

            <div className="hardware-grid">
              <article className="hardware-panel reveal">
                <div className="panel-label">CLIENT-PROVIDED HARDWARE</div>
                <h3>O equipamento segue o projeto.</h3>
                <p>
                  Os requisitos técnicos e o hardware de captura são definidos de acordo com cada projeto. A OperumData pode operar com equipamentos, acessórios e aplicações fornecidos pelo cliente.
                </p>
                <div className="hardware-flow" aria-label="Fluxo de custódia de hardware">
                  {["Recebido", "Alocado", "Uso em campo", "Armazenado", "Devolvido"].map((label, index) => (
                    <div key={label}>
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <strong>{label}</strong>
                    </div>
                  ))}
                </div>
                <p className="panel-note">
                  Quando o projeto exigir uma configuração diferente, a viabilidade operacional é avaliada durante o escopo.
                </p>
              </article>

              <article className="quality-panel reveal">
                <div className="panel-label">CLIENT ACCEPTANCE CRITERIA</div>
                <h3>Tempo capturado e material aprovado não são a mesma medida.</h3>
                <p>
                  O valor de uma operação não está apenas no volume capturado, mas na capacidade de produzir material compatível com o protocolo e os critérios definidos pelo cliente.
                </p>
                <ul>
                  <li>Cumprimento operacional do protocolo</li>
                  <li>Verificação da execução em campo</li>
                  <li>Identificação de falhas recorrentes</li>
                  <li>Comunicação e correção do processo</li>
                  <li>Coordenação de regravações quando necessário</li>
                </ul>
                <p className="panel-note">
                  A aceitação técnica final do material permanece baseada nos critérios definidos pelo cliente.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="section section--experience" id="experiencia">
          <div className="shell experience-grid">
            <div className="experience-code reveal" aria-hidden="true">
              <span>FIELD OPERATIONS EXPERIENCE</span>
              <strong>2015</strong>
              <small>ORIGIN / BRAZIL</small>
            </div>
            <div className="experience-copy reveal">
              <div className="section-heading__meta">
                <span>07</span>
                <span>FIELD EXPERIENCE</span>
              </div>
              <h2>Uma nova marca apoiada por experiência operacional real.</h2>
              <p>A OperumData nasce da experiência de seu fundador na coordenação de serviços técnicos e operações de campo desde 2015. Essa trajetória não representa experiência anterior em gravações de dados para IA.</p>
              <p>
                Essa trajetória inclui gestão de equipes, fornecedores e profissionais terceirizados, compras técnicas, cronogramas, logística e execução em ambientes reais de trabalho.
              </p>
              <p>
                A experiência acumulada em serviços técnicos e operações de campo oferece o lastro operacional para a função atual da OperumData: estruturar e coordenar projetos de coleta de dados no mundo físico brasileiro.
              </p>
            </div>
          </div>
        </section>

        <section className="section" id="faq">
          <div className="shell faq-layout">
            <SectionHeading index="08" eyebrow="FAQ" title="Perguntas frequentes." />
            <Accordion type="single" collapsible className="faq-accordion reveal">
              {faqs.map((faq, index) => (
                <AccordionItem value={`faq-${index}`} key={faq.question}>
                  <AccordionTrigger>
                    <span className="faq-number">{String(index + 1).padStart(2, "0")}</span>
                    <span>{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent forceMount>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        <section className="final-cta" id="contato">
          <div className="shell final-cta__grid">
            <div className="final-cta__content reveal">
              <div className="eyebrow">
                <span className="signal-dot" aria-hidden="true" />
                Project intake / Brasil
              </div>
              <h2>Precisa executar um protocolo de coleta no Brasil?</h2>
              <p>
                Conte-nos quais tarefas, ambientes, participantes, equipamentos, volumes e critérios de aceitação o projeto exige.
              </p>
              <p>Avaliaremos a viabilidade operacional e o formato de piloto mais adequado.</p>
            </div>
            <div className="final-cta__panel reveal">
              <div className="intake-line"><span>01</span><strong>Tarefas + ambientes</strong></div>
              <div className="intake-line"><span>02</span><strong>Participantes + hardware</strong></div>
              <div className="intake-line"><span>03</span><strong>Volume + critérios de aceitação</strong></div>
              <Button asChild size="lg" className="primary-cta final-cta__button">
                <a href="mailto:contato@operumdata.com?subject=Projeto%20de%20dados%20do%20mundo%20real">Discutir um projeto</a>
              </Button>
              <small>Contato experimental por e-mail · confirmar endereço antes da versão definitiva.</small>
            </div>
          </div>
        </section>
      </div>

      <footer className="site-footer">
        <div className="shell site-footer__grid">
          <div>
            <a className="wordmark" href="#top" aria-label="OperumData — voltar ao início">
              <span className="wordmark__mark" aria-hidden="true">O</span>
              <span>OperumData</span>
            </a>
            <p>Coleta de dados do mundo real e operações de campo no Brasil para Physical AI e robótica.</p>
          </div>
          <div className="footer-meta">
            <span>Rio Grande do Sul · Brasil</span>
            <span>REAL-WORLD DATA / FIELD OPS</span>
          </div>
          <nav aria-label="Navegação do rodapé">
            <a href="#operacao">Operação</a>
            <a href="#ambientes">Ambientes</a>
            <a href="#metodo">Método</a>
            <a href="#controle">Controle</a>
            <a href="#faq">FAQ</a>
          </nav>
        </div>
      </footer>
    </main>
  );
}
