import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  ClipboardList, 
  Utensils, 
  Activity, 
  ArrowRight,
  Mail,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import './index.css';

// --- Configuration & Data ---
const SCENES = 10; // 0 (Welcome), 1-6 (Questions), 7 (Email), 8 (Processing), 9 (Result)

// O InitiateCheckout é disparado pela própria Kiwify ao abrir o checkout.
const CHECKOUT_URL = "https://pay.kiwify.com.br/chRzTuK";
const WHATSAPP_NUMBER = "5573981579948";
const DEMO_VIDEO_ID = "4jDG9i7AR1Q";

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
    subheadline: "(Considere retornos e primeiras consultas).",
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
      { id: 'a', label: "A) Tudo via WhatsApp e papel: perco tempo e pacientes às vezes faltam sem avisar.", icon: Calendar },
      { id: 'b', label: "B) Uso um sistema, mas a anamnese ainda é longa e feita na hora da consulta.", icon: ClipboardList },
      { id: 'c', label: "C) Meu sistema atual tem essas funções, mas acho confuso e os pacientes não engajam." }
    ]
  },
  {
    id: 'q3',
    headline: "Durante ou logo após a consulta, qual destas tarefas mais esgota sua energia?",
    options: [
      { id: 'a', label: "A) Registrar a antropometria e gerar gráficos de evolução claros.", icon: Activity },
      { id: 'b', label: "B) Montar o cardápio do zero e calcular macros manualmente.", icon: Utensils },
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
    before: 'Horários anotados no caderno ou espalhados no WhatsApp, e você só descobre o conflito na hora.',
    after: 'Veja todas as consultas do mês num calendário só, lance agendamentos em segundos e acompanhe os retornos de cada paciente.'
  },
  {
    id: 'anamnese',
    title: 'Anamnese Completa',
    icon: ClipboardList,
    before: 'Anamnese no papel, que se perde na gaveta e não dá para consultar no retorno.',
    after: 'Ficha completa e organizada: histórico clínico, medicamentos, alergias e intolerâncias, escala de Bristol, sono, estresse e hábitos. Tudo salvo no prontuário e pronto para imprimir.'
  },
  {
    id: 'prescricao',
    title: 'Prescrição de Dietas',
    icon: Utensils,
    before: 'Horas na frente do Excel cruzando tabelas de alimentos e somando macros.',
    after: 'Monte o cardápio com a Tabela TACO e medidas caseiras (escumadeira, concha, colher). Calorias, macros por refeição e g/kg calculados na hora.'
  },
  {
    id: 'avaliacao',
    title: 'Avaliações Físicas',
    icon: Activity,
    before: 'Anota medidas no papel e não consegue provar de forma visual que o paciente teve resultados.',
    after: 'Protocolo de 7 dobras, perimetria completa e fotos de frente e perfil. % de gordura, massa magra e TMB calculados na hora, com histórico e gráficos de evolução.'
  }
];

// --- Animations ---
const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95, rotateX: 10 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    rotateX: 0,
    transition: { type: 'spring', stiffness: 100, damping: 15, duration: 0.6 }
  },
  exit: { 
    opacity: 0, 
    y: -50, 
    scale: 0.95,
    rotateX: -10,
    transition: { ease: 'easeInOut', duration: 0.4 } 
  }
};

const BackgroundNodes = () => (
  <div className="bg-nodes">
    <div className="node"></div>
    <div className="node"></div>
    <div className="node"></div>
  </div>
);

export default function App() {
  const [scene, setScene] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showVslButton, setShowVslButton] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState(false);
  const [showMicroInsight, setShowMicroInsight] = useState(false);
  const [activePillar, setActivePillar] = useState(null);

  // Auto-progress from loading scene
  useEffect(() => {
    if (scene === 8) {
      const timer = setTimeout(() => {
        setScene(9);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [scene]);

  // VSL Button Delay
  useEffect(() => {
    if (scene === 9) {
      track('ViewContent', { content_name: 'BodyComp', value: 97.90, currency: 'BRL' });
      const timer = setTimeout(() => {
        setShowVslButton(true);
      }, 5000); // 5 seconds delay for demo
      return () => clearTimeout(timer);
    }
  }, [scene]);

  const handleSelect = (questionId, optionId) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionId }));
    
    // Check if it's question 4 to show micro-insight
    if (questionId === 'q4') {
      setShowMicroInsight(true);
      setTimeout(() => {
        setShowMicroInsight(false);
        setScene(prev => prev + 1);
      }, 4000);
    } else {
      setTimeout(() => {
        setScene(prev => prev + 1);
      }, 400);
    }
  };

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

  return (
    <>
      <BackgroundNodes />
      
      <main className="app-container">
        
        {/* Progress Bar for Quiz Questions */}
        {scene > 0 && scene < 7 && !showMicroInsight && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="progress-container"
          >
            <div 
              className="progress-bar" 
              style={{ width: `${(scene / 6) * 100}%` }}
            ></div>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          
          {/* SCENE 0: WELCOME */}
          {scene === 0 && (
            <motion.div 
              key="scene0"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="glass-card"
            >
              <div style={{ perspective: '1000px' }}>
                <motion.div 
                  animate={{ 
                    y: [0, -10, 0],
                    rotateZ: [-1, 1, -1]
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <h1 className="logo">Body<span className="logo-green">Comp</span></h1>
                </motion.div>
              </div>

              <h2 className="gradient-text" style={{ fontSize: '2rem', marginBottom: '1.5rem', lineHeight: 1.2 }}>
                Descubra qual gargalo silencioso está consumindo o lucro do seu consultório (e como estancar isso).
              </h2>
              
              <p style={{ fontSize: '1.1rem', color: '#475569', marginBottom: '2.5rem', lineHeight: 1.6 }}>
                Responda a estas 6 perguntas rápidas e veja se você está operando no verde ou deixando dinheiro na mesa todos os meses.
              </p>

              <button
                className="btn-primary btn-sticky-mobile"
                onClick={() => {
                  track('QuizStart', {}, true);
                  setScene(1);
                }}
              >
                Iniciar Diagnóstico Gratuito <ArrowRight size={20} />
              </button>
            </motion.div>
          )}

          {/* MICRO-INSIGHT */}
          {showMicroInsight && (
            <motion.div 
              key="micro-insight"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="glass-card"
            >
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                <ShieldCheck size={48} color="var(--electric-blue)" />
              </div>
              <h3 style={{ fontSize: '1.5rem', color: 'var(--navy)' }}>Processando...</h3>
              <p style={{ fontSize: '1.2rem', color: '#475569', marginTop: '1rem', lineHeight: 1.6 }}>
                Sabia que a maioria dos nutricionistas gasta, em 3 anos, o equivalente a um equipamento de ponta só pagando 'aluguel' de software que subutiliza?
              </p>
            </motion.div>
          )}

          {/* SCENES 1-6: QUIZ QUESTIONS */}
          {scene > 0 && scene < 7 && !showMicroInsight && (
            <motion.div 
              key={`scene${scene}`}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="glass-card"
            >
              <h2 className="gradient-text" style={{ marginBottom: '0.5rem', fontSize: '1.5rem' }}>
                {QUIZ_QUESTIONS[scene - 1].headline}
              </h2>
              {QUIZ_QUESTIONS[scene - 1].subheadline && (
                <p style={{ color: '#64748B', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                  {QUIZ_QUESTIONS[scene - 1].subheadline}
                </p>
              )}
              {!QUIZ_QUESTIONS[scene - 1].subheadline && <div style={{ marginBottom: '1.5rem' }}></div>}

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {QUIZ_QUESTIONS[scene - 1].options.map((opt, idx) => {
                  const isSelected = answers[QUIZ_QUESTIONS[scene - 1].id] === opt.id;
                  const Icon = opt.icon;
                  
                  return (
                    <motion.div
                      key={opt.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className={`option-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleSelect(QUIZ_QUESTIONS[scene - 1].id, opt.id)}
                    >
                      {Icon && (
                        <div className="option-icon">
                          <Icon size={24} />
                        </div>
                      )}
                      <span style={{ fontWeight: 500, fontSize: '1.05rem', color: isSelected ? 'var(--navy)' : 'var(--navy)' }}>
                        {opt.label}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* SCENE 7: EMAIL CAPTURE */}
          {scene === 7 && (
            <motion.div 
              key="scene7"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="glass-card"
            >
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                <div style={{ background: 'rgba(37, 99, 235, 0.1)', padding: '1rem', borderRadius: '50%' }}>
                  <Mail size={40} color="var(--electric-blue)" />
                </div>
              </div>
              <h2 className="gradient-text" style={{ fontSize: '1.6rem', marginBottom: '1rem' }}>
                Seu diagnóstico está pronto.
              </h2>
              <p style={{ fontSize: '1.1rem', color: '#475569', marginBottom: '2rem', lineHeight: 1.5 }}>
                Descobrimos onde está o vazamento financeiro do seu consultório. Onde podemos te enviar o diagnóstico e tirar suas dúvidas?
              </p>

              <form onSubmit={handleLeadSubmit}>
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  className="email-input"
                  style={{ marginBottom: '1rem' }}
                  placeholder="seu.melhor@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <input
                  type="tel"
                  name="phone"
                  autoComplete="tel"
                  inputMode="tel"
                  className="email-input"
                  style={{ marginBottom: phoneError ? '0.5rem' : '1.5rem' }}
                  placeholder="WhatsApp com DDD: (73) 99999-9999"
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value); setPhoneError(false); }}
                  required
                />
                {phoneError && (
                  <p style={{ color: '#DC2626', fontSize: '0.9rem', marginBottom: '1.5rem', textAlign: 'left' }}>
                    Digite seu WhatsApp com DDD. Ex.: (73) 99999-9999
                  </p>
                )}
                <button type="submit" className="btn-primary" style={{ width: '100%' }}>
                  Ver Meu Resultado Agora <ArrowRight size={20} />
                </button>
              </form>
            </motion.div>
          )}

          {/* SCENE 8: LOADING TRANSITION */}
          {scene === 8 && (
            <motion.div 
              key="scene8"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="glass-card"
              style={{ padding: '4rem 2rem' }}
            >
              <div className="loader-container">
                <div className="spinner"></div>
                
                <motion.h1 
                  className="logo"
                  animate={{ scale: [1, 1.05, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Body<span className="logo-green">Comp</span>
                </motion.h1>
                
                <div style={{ height: '60px', marginTop: '1rem' }}>
                  <AnimatePresence mode="wait">
                    <motion.p
                      key="text1"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.5 }}
                      style={{ fontSize: '1.2rem', color: 'var(--electric-blue)', fontWeight: 500 }}
                    >
                      Calculando horas perdidas...
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}

          {/* SCENE 9: RESULT PAGE (PITCH) */}
          {scene === 9 && (
            <motion.div 
              key="scene9"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="glass-card result-card"
            >
              <motion.div 
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                style={{ marginBottom: '1rem' }}
              >
                <h1 className="logo" style={{ fontSize: '2.5rem', textShadow: '0 0 20px rgba(132, 204, 22, 0.3)' }}>
                  Body<span className="logo-green">Comp</span>
                </h1>
              </motion.div>

              <h2 className="gradient-text" style={{ fontSize: '1.8rem', lineHeight: 1.3 }}>
                {profile === 'A' 
                  ? "Seu diagnóstico revela um vazamento financeiro invisível no seu consultório."
                  : "Seu diagnóstico revela um gargalo de tempo que está limitando sua escala."
                }
              </h2>
              
              <div style={{ 
                background: 'rgba(239, 246, 255, 0.5)', 
                padding: '1.5rem', 
                borderRadius: '16px', 
                border: '1px solid rgba(147, 197, 253, 0.5)',
                marginBottom: '2rem',
                textAlign: 'left'
              }}>
                {profile === 'A' ? (
                  <>
                    <p style={{ marginBottom: '1rem', color: '#1E293B', lineHeight: 1.6 }}>
                      <strong>Resumo:</strong> Pelas suas respostas, fica claro que você já entende a importância da tecnologia e usa um sistema para organizar seus atendimentos. O problema? Você está pagando o preço de um "aluguel" eterno por um pacote de dezenas de funcionalidades que nem tem tempo de usar.
                    </p>
                    <p style={{ marginBottom: '1rem', color: '#1E293B', lineHeight: 1.6 }}>
                      <strong style={{ color: 'var(--lime-green)' }}>A Descoberta:</strong> O modelo de assinaturas mensais não foi criado para ser eficiente para você; foi criado para garantir lucro recorrente para as empresas de software. A cada mês, uma parte considerável do seu lucro fica retida na mensalidade.
                    </p>
                    <p style={{ color: '#1E293B', lineHeight: 1.6 }}>
                      <strong>O Próximo Passo:</strong> Seu próximo passo não é buscar um software "mais barato". É adotar um modelo focado em <em>posse</em>, e não em aluguel. Imagine usar 100% dos recursos que importam sem nunca mais se preocupar com aquele débito no cartão todo mês.
                    </p>
                  </>
                ) : (
                  <>
                    <p style={{ marginBottom: '1rem', color: '#1E293B', lineHeight: 1.6 }}>
                      <strong>Resumo:</strong> Suas respostas mostram que você é um profissional cuidadoso, mas que está perdendo horas preciosas com trabalhos manuais. Você evita softwares pagos porque as mensalidades são altas, e acaba compensando isso montando dietas do zero em planilhas.
                    </p>
                    <p style={{ marginBottom: '1rem', color: '#1E293B', lineHeight: 1.6 }}>
                      <strong style={{ color: 'var(--lime-green)' }}>A Descoberta:</strong> Você acredita que está economizando dinheiro ao não pagar uma mensalidade, mas o custo real está no seu <em>tempo</em>. A lentidão para calcular macros atrasa a entrega da dieta, e você paga isso com a sua energia.
                    </p>
                    <p style={{ color: '#1E293B', lineHeight: 1.6 }}>
                      <strong>O Próximo Passo:</strong> Profissionalizar sua operação de ponta a ponta, sem assumir um custo fixo mensal. Imagine agenda, anamnese, avaliação e dieta no mesmo lugar, com a antropometria e os macros calculados em poucos cliques. Tudo sem pagar um centavo a mais por mês.
                    </p>
                  </>
                )}
              </div>

              <h3 style={{ fontSize: '1.4rem', color: 'var(--navy)', marginBottom: '1rem' }}>
                Foi exatamente para estancar esse vazamento que o BodyComp foi criado.
              </h3>
              <p style={{ color: '#475569', marginBottom: '2rem' }}>
                O mercado te disse que você precisava pagar mensalidades caras para ter um consultório profissional. Nós mudamos as regras. O BodyComp é o seu software de nutrição definitivo, focado no que realmente importa, com <strong>pagamento único</strong> e acesso vitalício.
              </p>

              {/* VSL */}
              <div className="video-embed">
                <iframe
                  loading="lazy"
                  src={`https://www.youtube-nocookie.com/embed/${DEMO_VIDEO_ID}?rel=0&modestbranding=1`}
                  title="Apresentação do BodyComp"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>

              {/* Real software screenshots */}
              <h3 style={{ marginTop: '2.5rem', fontSize: '1.3rem', color: 'var(--electric-blue)' }}>Veja o BodyComp por dentro:</h3>
              <p style={{ color: '#64748B', fontSize: '0.9rem', marginTop: '0.25rem' }}>Arraste para o lado para ver mais telas.</p>
              <div className="screens-row">
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

              {/* 3D Pillars Interactive Area */}
              <h3 style={{ marginTop: '3rem', fontSize: '1.3rem', color: 'var(--electric-blue)' }}>Como o BodyComp transforma sua rotina:</h3>
              <div className="pillars-grid">
                {PILLARS.map((pillar) => {
                  const Icon = pillar.icon;
                  const isActive = activePillar === pillar.id;
                  return (
                    <motion.div 
                      key={pillar.id}
                      className="pillar-card"
                      onClick={() => setActivePillar(isActive ? null : pillar.id)}
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                      <div className="pillar-header">
                        <div className="pillar-icon">
                          <Icon size={20} />
                        </div>
                        <span className="pillar-title">{pillar.title}</span>
                        <ChevronDown size={20} color="#94A3B8" style={{ marginLeft: 'auto', transform: isActive ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }} />
                      </div>
                      
                      <AnimatePresence>
                        {isActive && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="pillar-content"
                          >
                            <p style={{ marginBottom: '0.5rem', color: '#64748B' }}><em>Antes: {pillar.before}</em></p>
                            <p><strong>Com BodyComp:</strong> {pillar.after}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )
                })}
              </div>

              {/* Delayed CTA Button */}
              <AnimatePresence>
                {showVslButton && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                    style={{ marginTop: '3rem' }}
                  >
                    <div style={{ background: '#FFFBEB', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid #F59E0B', marginBottom: '1.5rem', textAlign: 'left' }}>
                      <p style={{ fontSize: '0.95rem', color: '#B45309' }}>
                        Softwares que entregam metade dessas integrações cobram facilmente de R$ 100 a R$ 250 por mês. No final de um ano, você deixou mais de R$ 1.500 na mesa deles. <strong>Com o BodyComp, você faz um pagamento único.</strong>
                      </p>
                    </div>

                    <div className="price-box">
                      <span className="price-label">Pagamento único</span>
                      <span className="price-value">R$ 97,90</span>
                      <span className="price-installments">ou em até 12x de R$ 10,13 no cartão</span>
                    </div>

                    <a
                      href={checkoutHref()}
                      onClick={() => track('ClickCheckout', {}, true)}
                      className="btn-primary"
                      style={{ width: '100%', padding: '1.25rem', fontSize: '1.1rem', marginBottom: '0.5rem', textDecoration: 'none' }}
                    >
                      Quero Meu Acesso Definitivo ao BodyComp (Sem Mensalidades) <ArrowRight size={24} />
                    </a>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem' }}>
                      <ShieldCheck size={20} color="var(--lime-green)" />
                      <p style={{ fontSize: '0.9rem', color: '#64748B', fontWeight: 500 }}>
                        Garantia de 7 dias. Pague uma vez, receba acesso imediato.
                      </p>
                    </div>

                    {/* Support Section */}
                    <div className="support-section">
                      <p style={{ fontSize: '0.9rem', color: '#64748B', marginBottom: '0.5rem' }}>
                        Ficou com alguma dúvida sobre o acesso vitalício? Fale com a nossa equipe.
                      </p>
                      <a
                        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Oi! Fiz o diagnóstico do BodyComp e fiquei com uma dúvida:')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="whatsapp-btn"
                      >
                        Falar no WhatsApp (73) 98157-9948
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </>
  );
}
