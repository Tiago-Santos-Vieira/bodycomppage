import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  ClipboardList,
  Utensils,
  Activity,
  ArrowRight,
  ChevronLeft,
  ChevronDown,
  Check,
  Clock,
  Lightbulb,
  Lock,
  MessageCircle,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import './index.css';

// --- Configuration & Data ---
const SCENES = 10; // 0 (Welcome), 1-6 (Questions), 7 (Email), 8 (Processing), 9 (Result)
const QUESTION_COUNT = 6;

// O InitiateCheckout é disparado pela própria Kiwify ao abrir o checkout.
const CHECKOUT_URL = "https://pay.kiwify.com.br/chRzTuK";
const WHATSAPP_NUMBER = "5573981579948";
const DEMO_VIDEO_ID = "4jDG9i7AR1Q";
const LOGO_SRC = "/logo-horizontal.webp";

// URL do Apps Script que grava os leads na planilha (ver docs/leads-google-sheets.md).
// Vazio = o quiz funciona normalmente, mas não salva os leads.
const LEADS_WEBHOOK_URL = "";

const SCREENSHOTS = [
  "https://i.postimg.cc/hPhmHg8G/Captura-de-tela-2026-05-07-175505.webp",
  "https://i.postimg.cc/3JXL7cKt/Captura-de-tela-2026-05-21-143421.webp",
  "https://i.postimg.cc/yYmfBbVp/Captura-de-tela-2026-05-21-143528.webp",
  "https://i.postimg.cc/qMsm05km/Captura-de-tela-2026-05-21-143637.webp",
  "https://i.postimg.cc/qMsm05kb/Captura-de-tela-2026-05-21-143659.webp"
];

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
// Repassados ao checkout: UTMs para os relatórios da Kiwify e fbclid para a Meta atribuir a venda ao anúncio
const CHECKOUT_PASSTHROUGH_KEYS = [...UTM_KEYS, 'fbclid', 'src', 'sck'];

// Meta Pixel carregado no index.html
const track = (event, params = {}, custom = false) => {
  if (typeof window.fbq !== 'function') return;
  window.fbq(custom ? 'trackCustom' : 'track', event, params);
};

const checkoutHref = () => {
  const current = new URLSearchParams(window.location.search);
  const url = new URL(CHECKOUT_URL);
  CHECKOUT_PASSTHROUGH_KEYS.forEach(key => {
    const value = current.get(key);
    if (value) url.searchParams.set(key, value);
  });
  return url.toString();
};

const QUIZ_QUESTIONS = [
  {
    id: 'q1',
    headline: "Em média, quantos pacientes você atende (ou planeja atender) por mês?",
    subheadline: "Considere retornos e primeiras consultas.",
    options: [
      { id: 'a', label: "A) 1 a 10 pacientes." },
      { id: 'b', label: "B) 11 a 30 pacientes." },
      { id: 'c', label: "C) Mais de 30 pacientes." },
      { id: 'd', label: "D) Ainda estou estruturando meus primeiros atendimentos." }
    ]
  },
  {
    id: 'q2',
    headline: "Como funciona a sua etapa antes de o paciente sentar na sua frente (Agendamento e Anamnese)?",
    options: [
      { id: 'a', label: "A) Tudo via WhatsApp e papel: perco tempo e pacientes às vezes faltam sem avisar." },
      { id: 'b', label: "B) Uso um sistema, mas a anamnese ainda é longa e feita na hora da consulta." },
      { id: 'c', label: "C) Meu sistema atual tem essas funções, mas acho confuso e os pacientes não engajam." }
    ]
  },
  {
    id: 'q3',
    headline: "Durante ou logo após a consulta, qual destas tarefas mais esgota sua energia?",
    options: [
      { id: 'a', label: "A) Registrar a antropometria e gerar gráficos de evolução claros." },
      { id: 'b', label: "B) Montar o cardápio do zero e calcular macros manualmente." },
      { id: 'c', label: "C) O processo inteiro demora porque uso planilhas soltas e calculadoras online." },
      { id: 'd', label: "D) Sou rápido nisso, meu problema é só o preço alto do software que uso." }
    ]
  },
  {
    id: 'q4',
    headline: "Sendo muito sincero: se você somar 12 meses, quanto você gasta por ANO com softwares de nutrição hoje?",
    options: [
      { id: 'a', label: "A) R$ 0 (Uso planilhas gratuitas, mas perco muito tempo)." },
      { id: 'b', label: "B) Entre R$ 500 e R$ 1.200 por ano." },
      { id: 'c', label: "C) Mais de R$ 1.500 por ano (Sinto que estou pagando um aluguel sem fim)." }
    ]
  },
  {
    id: 'q5',
    headline: "Se você não precisasse mais pagar mensalidades caras (ou se tivesse as horas livres que perde no Excel), qual seria sua prioridade para o consultório?",
    options: [
      { id: 'a', label: "A) Investiria em tráfego pago para captar mais pacientes." },
      { id: 'b', label: "B) Melhoraria o marketing e a identidade visual do meu negócio." },
      { id: 'c', label: "C) Faria novos cursos para me especializar ainda mais." },
      { id: 'd', label: "D) Apenas aproveitaria o aumento direto no meu lucro no fim do mês." }
    ]
  },
  {
    id: 'q6',
    headline: "Se existisse uma plataforma profissional, focada nos 4 pilares essenciais e que cobrasse apenas UMA VEZ na vida (sem pegadinhas)... qual seria sua reação?",
    options: [
      { id: 'a', label: "A) Eu trocaria de software hoje mesmo." },
      { id: 'b', label: "B) Eu finalmente abandonaria o papel e as planilhas." },
      { id: 'c', label: "C) Eu precisaria ver a interface e como funciona antes de decidir." }
    ]
  }
];

const PILLARS = [
  {
    id: 'agendamento',
    title: 'Agenda da Clínica',
    icon: Calendar,
    after: 'Veja todas as consultas do mês num calendário só, lance agendamentos em segundos e acompanhe os retornos de cada paciente.'
  },
  {
    id: 'anamnese',
    title: 'Anamnese Completa',
    icon: ClipboardList,
    after: 'Histórico clínico, medicamentos, alergias e intolerâncias, escala de Bristol, sono, estresse e hábitos. Tudo salvo no prontuário e pronto para imprimir.'
  },
  {
    id: 'prescricao',
    title: 'Prescrição de Dietas',
    icon: Utensils,
    after: 'Monte o cardápio com a Tabela TACO e medidas caseiras (escumadeira, concha, colher). Calorias, macros por refeição e g/kg calculados na hora.'
  },
  {
    id: 'avaliacao',
    title: 'Avaliações Físicas',
    icon: Activity,
    after: 'Protocolo de 7 dobras, perimetria completa e fotos de frente e perfil. % de gordura, massa magra e TMB na hora, com gráficos de evolução.'
  }
];

const DIAGNOSIS = {
  A: {
    title: <>Seu consultório tem um <span className="hl">vazamento financeiro</span> invisível.</>,
    points: [
      <>Você já usa sistema, mas paga <strong>todo mês</strong> por um pacote de funções que nem tem tempo de usar.</>,
      <>A assinatura foi feita para dar lucro recorrente à empresa de software: <strong>a cada mês, parte do seu lucro fica com ela</strong>.</>,
      <>O próximo passo não é um sistema "mais barato": é trocar <strong>aluguel por posse</strong>. Pagar uma vez e usar para sempre.</>
    ]
  },
  B: {
    title: <>Um <span className="hl">gargalo de tempo</span> está limitando o seu consultório.</>,
    points: [
      <>Você evita mensalidade e compensa <strong>montando dietas do zero em planilhas</strong>.</>,
      <>Parece economia, mas o custo real está no seu <strong>tempo</strong>: cada dieta que atrasa é energia que você não recupera.</>,
      <>O próximo passo é profissionalizar a rotina <strong>sem assumir um custo fixo mensal</strong>: agenda, anamnese, avaliação e dieta no mesmo lugar.</>
    ]
  }
};

const OFFER_ITEMS = [
  'Agenda, anamnese, avaliação física e prescrição de dietas',
  'Tabela TACO com medidas caseiras',
  'Funciona no computador e no celular, direto no navegador',
  'Pagamento único: nada de mensalidade',
  'Acesso liberado na hora'
];

const FAQS = [
  { q: 'Preciso instalar alguma coisa?', a: 'Não. O BodyComp funciona no navegador do computador e do celular. É só entrar com seu login.' },
  { q: 'Como recebo o acesso?', a: 'Por e-mail, assim que o pagamento é aprovado. No Pix, a aprovação sai em poucos minutos.' },
  { q: 'Pago mensalidade depois?', a: 'Não. Você paga R$ 97,90 uma única vez e o acesso é vitalício.' },
  { q: 'E se eu não gostar?', a: 'Você tem 7 dias de garantia. É só pedir o reembolso pela Kiwify e recebe 100% do valor de volta.' }
];

const LOADING_MESSAGES = ['Analisando suas respostas...', 'Calculando horas perdidas...', 'Montando seu diagnóstico...'];

// --- Animations ---
const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 140, damping: 20 } },
  exit: { opacity: 0, y: -16, transition: { duration: 0.2 } }
};

const stripLetter = (label) => label.replace(/^[A-D]\)\s*/, '');

const BackgroundNodes = () => (
  <div className="bg-nodes">
    <div className="node"></div>
    <div className="node"></div>
    <div className="node"></div>
  </div>
);

const Logo = ({ large = false }) => (
  <img src={LOGO_SRC} alt="BodyComp - Nutrição Inteligente" className={`brand-logo${large ? ' lg' : ''}`} width="405" height="96" />
);

export default function App() {
  const [scene, setScene] = useState(0);
  const [answers, setAnswers] = useState({});
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState(false);
  const [showMicroInsight, setShowMicroInsight] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [activeShot, setActiveShot] = useState(0);
  const [showStickyCta, setShowStickyCta] = useState(false);
  const offerRef = useRef(null);

  // Sobe para o topo a cada troca de tela (no celular a tela anterior podia ficar rolada)
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [scene, showMicroInsight]);

  // Auto-progress from loading scene
  useEffect(() => {
    if (scene === 8) {
      setLoadingStep(0);
      const stepTimer = setInterval(() => setLoadingStep(prev => Math.min(prev + 1, LOADING_MESSAGES.length - 1)), 1300);
      const timer = setTimeout(() => {
        setScene(9);
      }, 4000);
      return () => { clearTimeout(timer); clearInterval(stepTimer); };
    }
  }, [scene]);

  useEffect(() => {
    if (scene === 9) {
      track('ViewContent', { content_name: 'BodyComp', value: 97.90, currency: 'BRL' });
    }
  }, [scene]);

  // Barra fixa de compra: aparece depois do diagnóstico e some quando a oferta está na tela
  useEffect(() => {
    if (scene !== 9) return;
    const onScroll = () => {
      const offer = offerRef.current?.getBoundingClientRect();
      const offerVisible = offer && offer.top < window.innerHeight && offer.bottom > 0;
      setShowStickyCta(window.scrollY > 500 && !offerVisible);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [scene]);

  const handleSelect = (questionId, optionId) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionId }));

    // Check if it's question 4 to show micro-insight
    if (questionId === 'q4') {
      setTimeout(() => setShowMicroInsight(true), 250);
      setTimeout(() => {
        setShowMicroInsight(false);
        setScene(prev => prev + 1);
      }, 4250);
    } else {
      setTimeout(() => {
        setScene(prev => prev + 1);
      }, 350);
    }
  };

  const goBack = () => setScene(prev => Math.max(0, prev - 1));

  const sendLead = () => {
    if (!LEADS_WEBHOOK_URL) return;

    const params = new URLSearchParams(window.location.search);
    const payload = {
      email: email.trim(),
      phone: phone.replace(/\D/g, ''),
      profile: calculateProfile(),
      answers: QUIZ_QUESTIONS.map(q => q.options.find(o => o.id === answers[q.id])?.label || ''),
      page: window.location.href
    };
    UTM_KEYS.forEach(key => { payload[key] = params.get(key) || ''; });

    // text/plain + no-cors evita o preflight de CORS do Apps Script
    fetch(LEADS_WEBHOOK_URL, {
      method: 'POST',
      mode: 'no-cors',
      keepalive: true,
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    }).catch(() => {});
  };

  const handleLeadSubmit = (e) => {
    e.preventDefault();
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 10 || digits.length > 13) {
      setPhoneError(true);
      return;
    }
    if (email.includes('@')) {
      sendLead();
      // E-mail e telefone vão para a Meta pela correspondência avançada automática (ligada no pixel)
      track('Lead', { content_name: 'Diagnóstico BodyComp' });
      setScene(8); // Go to processing
    }
  };

  const calculateProfile = () => {
    let perfilA = 0;
    let perfilB = 0;

    if (answers.q2 === 'a') perfilB += 1;
    if (answers.q2 === 'b' || answers.q2 === 'c') perfilA += 1;

    if (answers.q3 === 'd') perfilA += 1;
    if (answers.q3 === 'a' || answers.q3 === 'b' || answers.q3 === 'c') perfilB += 1;

    if (answers.q4 === 'a') perfilB += 2;
    if (answers.q4 === 'b' || answers.q4 === 'c') perfilA += 2;

    return perfilA >= perfilB ? 'A' : 'B';
  };

  const profile = calculateProfile();
  const diagnosis = DIAGNOSIS[profile];
  const isQuestion = scene > 0 && scene < 7 && !showMicroInsight;
  const question = isQuestion ? QUIZ_QUESTIONS[scene - 1] : null;

  const handleShotsScroll = (e) => {
    const row = e.currentTarget;
    const first = row.firstElementChild;
    if (!first) return;
    const step = first.getBoundingClientRect().width + 12;
    setActiveShot(Math.min(SCREENSHOTS.length - 1, Math.round(row.scrollLeft / step)));
  };

  const CheckoutButton = ({ className = '', children }) => (
    <a
      href={checkoutHref()}
      onClick={() => track('ClickCheckout', {}, true)}
      className={`btn-primary ${className}`}
    >
      {children}
    </a>
  );

  return (
    <>
      <BackgroundNodes />

      <main className="app-container">

        {/* Topo das perguntas: voltar, contador e progresso */}
        {isQuestion && (
          <>
            <div className="topbar">
              <button className="back-btn" onClick={goBack} aria-label="Voltar para a pergunta anterior">
                <ChevronLeft size={18} /> Voltar
              </button>
              <span className="step-label">Pergunta {scene} de {QUESTION_COUNT}</span>
            </div>
            <div className="progress-container" aria-hidden="true">
              <div className="progress-bar" style={{ width: `${(scene / QUESTION_COUNT) * 100}%` }}></div>
            </div>
          </>
        )}

        {!isQuestion && scene !== 8 && (
          <div className="topbar" style={{ justifyContent: 'center' }}>
            <Logo large={scene === 0} />
          </div>
        )}

        <AnimatePresence mode="wait">

          {/* SCENE 0: WELCOME */}
          {scene === 0 && (
            <motion.section
              key="scene0"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="card center"
            >
              <span className="eyebrow"><Sparkles size={14} /> Diagnóstico gratuito</span>
              <h1 className="title">
                Descubra o que está <span className="hl">travando o lucro</span> do seu consultório
              </h1>
              <p className="lead" style={{ marginTop: 12 }}>
                Responda 6 perguntas rápidas e veja se você está operando no verde ou deixando dinheiro na mesa todo mês.
              </p>

              <div className="hero-shot" aria-hidden="true">
                <div className="hero-shot-bar"><span></span><span></span><span></span></div>
                <img src={SCREENSHOTS[0]} alt="" width="1920" height="1080" fetchPriority="high" />
              </div>

              <button
                className="btn-primary pulse"
                onClick={() => {
                  track('QuizStart', {}, true);
                  setScene(1);
                }}
              >
                Começar meu diagnóstico <ArrowRight size={20} />
              </button>

              <div className="trust-row">
                <span><Check size={16} /> 6 perguntas</span>
                <span><Clock size={16} /> Menos de 1 minuto</span>
                <span><Check size={16} /> Resultado na hora</span>
              </div>
            </motion.section>
          )}

          {/* MICRO-INSIGHT */}
          {showMicroInsight && (
            <motion.section
              key="micro-insight"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="card center"
            >
              <div className="insight-icon"><Lightbulb size={28} /></div>
              <span className="eyebrow">Você sabia?</span>
              <p className="question" style={{ fontWeight: 700 }}>
                A maioria dos nutricionistas gasta, em 3 anos, o equivalente a um equipamento de ponta só pagando "aluguel" de software que subutiliza.
              </p>
              <div className="timer-track"><div className="timer-fill"></div></div>
            </motion.section>
          )}

          {/* SCENES 1-6: QUIZ QUESTIONS */}
          {isQuestion && (
            <motion.section
              key={`scene${scene}`}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="card"
            >
              <h2 className="question">{question.headline}</h2>
              {question.subheadline && <p className="muted" style={{ marginTop: 6 }}>{question.subheadline}</p>}

              <div className="options" role="list">
                {question.options.map((opt, idx) => {
                  const isSelected = answers[question.id] === opt.id;
                  return (
                    <motion.button
                      key={opt.id}
                      type="button"
                      role="listitem"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className={`option-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleSelect(question.id, opt.id)}
                    >
                      <span className="option-letter">{isSelected ? <Check size={16} /> : opt.id.toUpperCase()}</span>
                      <span>{stripLetter(opt.label)}</span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.section>
          )}

          {/* SCENE 7: EMAIL CAPTURE */}
          {scene === 7 && (
            <motion.section
              key="scene7"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="card center"
            >
              <span className="eyebrow"><Check size={14} /> Diagnóstico pronto</span>
              <h2 className="title" style={{ fontSize: 'clamp(1.45rem, 5vw, 1.9rem)' }}>
                Descobrimos onde está o <span className="hl">vazamento</span> do seu consultório
              </h2>
              <p className="lead" style={{ marginTop: 10 }}>
                Diga para onde enviamos o seu diagnóstico. Se ficar alguma dúvida, você fala direto com a gente.
              </p>

              <div className="locked-preview" aria-hidden="true">
                <div className="line w90"></div>
                <div className="line w60"></div>
                <div className="line w80"></div>
                <div className="locked-badge"><Lock size={16} /> Seu diagnóstico personalizado</div>
              </div>

              <form onSubmit={handleLeadSubmit} noValidate={false}>
                <div className="field">
                  <label htmlFor="lead-email">Seu melhor e-mail</label>
                  <input
                    id="lead-email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    className="email-input"
                    placeholder="voce@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="lead-phone">WhatsApp com DDD</label>
                  <input
                    id="lead-phone"
                    type="tel"
                    name="phone"
                    autoComplete="tel"
                    inputMode="tel"
                    className={`email-input${phoneError ? ' invalid' : ''}`}
                    placeholder="(73) 99999-9999"
                    value={phone}
                    onChange={(e) => { setPhone(e.target.value); setPhoneError(false); }}
                    aria-invalid={phoneError}
                    required
                  />
                  {phoneError && (
                    <p className="field-error">Digite seu WhatsApp com DDD. Ex.: (73) 99999-9999</p>
                  )}
                </div>
                <button type="submit" className="btn-primary" style={{ marginTop: 6 }}>
                  Ver meu diagnóstico <ArrowRight size={20} />
                </button>
              </form>
              <p className="privacy-note"><Lock size={13} /> Seus dados ficam só com a BodyComp. Nada de spam.</p>
            </motion.section>
          )}

          {/* SCENE 8: LOADING TRANSITION */}
          {scene === 8 && (
            <motion.section
              key="scene8"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="card center"
            >
              <div className="loader-container">
                <div className="spinner"></div>
                <Logo />
                <AnimatePresence mode="wait">
                  <motion.p
                    key={loadingStep}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                    className="lead"
                    style={{ fontWeight: 600, color: 'var(--brand)' }}
                  >
                    {LOADING_MESSAGES[loadingStep]}
                  </motion.p>
                </AnimatePresence>
              </div>
            </motion.section>
          )}

          {/* SCENE 9: RESULT PAGE (PITCH) */}
          {scene === 9 && (
            <motion.div
              key="scene9"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="result-wrap"
            >
              {/* Diagnóstico */}
              <section className="card">
                <span className="eyebrow">Seu diagnóstico</span>
                <h1 className="title" style={{ fontSize: 'clamp(1.45rem, 5vw, 2rem)' }}>{diagnosis.title}</h1>
                <ul className="diagnosis-list">
                  {diagnosis.points.map((point, idx) => (
                    <li key={idx}><span className="dot"><Check size={15} /></span><span>{point}</span></li>
                  ))}
                </ul>
              </section>

              {/* Produto */}
              <section className="card">
                <h2 className="section-title">Foi para resolver isso que o BodyComp foi criado</h2>
                <p className="lead">
                  Um software de nutrição focado no que você usa todo dia, com <strong>pagamento único</strong> e acesso vitalício. Veja como funciona:
                </p>
                <div className="video-embed">
                  <iframe
                    loading="lazy"
                    src={`https://www.youtube-nocookie.com/embed/${DEMO_VIDEO_ID}?rel=0&modestbranding=1`}
                    title="Apresentação do BodyComp"
                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </div>

                <h3 className="section-title" style={{ marginTop: 26, fontSize: '1.15rem' }}>Veja o BodyComp por dentro</h3>
                <div className="screens-row" onScroll={handleShotsScroll}>
                  {SCREENSHOTS.map((src, idx) => (
                    <img
                      key={src}
                      src={src}
                      alt={`Tela do BodyComp ${idx + 1}`}
                      width="1920"
                      height="1080"
                      loading="lazy"
                    />
                  ))}
                </div>
                <div className="dots" aria-hidden="true">
                  {SCREENSHOTS.map((src, idx) => <span key={src} className={idx === activeShot ? 'active' : ''}></span>)}
                </div>
              </section>

              {/* Pilares */}
              <section className="card">
                <h2 className="section-title">Tudo o que a sua rotina precisa, num lugar só</h2>
                <div className="pillars-grid">
                  {PILLARS.map((pillar) => {
                    const Icon = pillar.icon;
                    return (
                      <div key={pillar.id} className="pillar-card">
                        <div className="pillar-header">
                          <div className="pillar-icon"><Icon size={18} /></div>
                          <span className="pillar-title">{pillar.title}</span>
                        </div>
                        <p>{pillar.after}</p>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Oferta */}
              <section className="card offer-card" ref={offerRef} id="oferta">
                <div className="offer-ribbon">Acesso vitalício</div>
                <div className="offer-body">
                  <h2 className="section-title" style={{ textAlign: 'center' }}>Pague uma vez. Use para sempre.</h2>
                  <p className="anchor-note">
                    Softwares de nutrição por assinatura cobram <strong>todo mês</strong>: em um ano, isso vira centenas de reais. No BodyComp você paga uma única vez.
                  </p>
                  <ul className="checklist">
                    {OFFER_ITEMS.map(item => <li key={item}><Check size={18} /> {item}</li>)}
                  </ul>
                  <div className="price-box">
                    <span className="price-label">Pagamento único</span>
                    <span className="price-value">R$ 97,90</span>
                    <span className="price-installments">ou em até 12x de R$ 10,13 no cartão</span>
                  </div>
                  <CheckoutButton className="pulse">
                    Quero meu acesso vitalício <ArrowRight size={22} />
                  </CheckoutButton>
                  <p className="pay-methods">Pix, cartão ou boleto · Compra segura pela Kiwify</p>
                  <div className="guarantee">
                    <ShieldCheck size={28} />
                    <p><strong>Garantia de 7 dias.</strong> Teste com seus pacientes. Se não gostar, devolvemos 100% do valor.</p>
                  </div>
                </div>
              </section>

              {/* Dúvidas */}
              <section className="card faq">
                <h2 className="section-title" style={{ marginBottom: 4 }}>Perguntas frequentes</h2>
                {FAQS.map(item => (
                  <details key={item.q}>
                    <summary>{item.q} <ChevronDown size={18} /></summary>
                    <p>{item.a}</p>
                  </details>
                ))}
              </section>

              <section className="support-section">
                <p className="muted">Ficou com alguma dúvida? Fale com a nossa equipe.</p>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Oi! Fiz o diagnóstico do BodyComp e fiquei com uma dúvida:')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="whatsapp-btn"
                >
                  <MessageCircle size={18} /> Falar no WhatsApp
                </a>
              </section>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Barra fixa de compra no celular */}
      <AnimatePresence>
        {scene === 9 && showStickyCta && (
          <motion.div
            className="sticky-cta"
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
          >
            <div className="sticky-price">
              <strong>R$ 97,90</strong>
              <span>vitalício · 12x R$ 10,13</span>
            </div>
            <CheckoutButton>Quero meu acesso <ArrowRight size={18} /></CheckoutButton>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
