import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  BadgeCheck,
  Calendar,
  CircleCheck,
  ClipboardList,
  Heart,
  Play,
  Timer,
  User,
  Utensils,
  Star,
  Quote,
  ChevronDown
} from 'lucide-react';

const faqs = [
  { question: "Vou ter que pagar por atualizações futuras?", answer: "Não, o seu pagamento único garante acesso vitalício a todas as melhorias e novas funcionalidades lançadas." },
  { question: "Funciona no Mac ou Celular?", answer: "Sim, o BodyComp é 100% em nuvem. Você pode acessar de qualquer dispositivo (Mac, Windows, iOS ou Android) pelo navegador." },
  { question: "Meus dados e dos pacientes estão seguros?", answer: "Sim, utilizamos segurança de ponta (criptografia a nível bancário) e adequação total à LGPD, mantendo o controle em suas mãos." },
  { question: "Como recebo o acesso?", answer: "Imediatamente por e-mail após a confirmação do pagamento, com instruções de login e suporte." },
  { question: "Tem garantia?", answer: "Sim, 7 dias de garantia incondicional. Se a ferramenta não acelerar sua rotina, devolvemos seu dinheiro na hora." },
];

function FAQItem({ faq, isOpen, toggleOpen }: { faq: any, isOpen: boolean, toggleOpen: () => void }) {
  return (
    <div className="border border-surface-variant bg-surface rounded-xl overflow-hidden mb-3 md:mb-4 transition-all">
      <button 
        onClick={toggleOpen} 
        className="w-full flex items-center justify-between p-4 md:p-6 text-left focus:outline-none"
      >
        <span className="font-headline-md text-base md:text-lg text-on-surface font-medium pr-4">{faq.question}</span>
        <div className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <ChevronDown className="w-5 h-5 text-on-surface-variant" />
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="p-4 md:p-6 pt-0 font-body-sm text-on-surface-variant">
              {faq.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col antialiased">
      {/* TopNavBar */}
      <nav className="sticky top-0 w-full z-50 bg-white font-['Space_Grotesk'] antialiased border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <a href="#" className="flex items-center shrink-0">
            <img src="https://i.postimg.cc/jSR90w0Z/Body-Comp-(2500-x-1080-px).png" alt="Body Comp Logo" className="h-[32px] sm:h-[45px] md:h-[57px] w-auto object-contain" />
          </a>
          
          <div className="hidden lg:flex items-center space-x-8">
            <a className="text-slate-600 font-medium hover:text-blue-500 transition-all duration-300 ease-in-out hover:opacity-80" href="#apresentacao">Apresentação</a>
            <a className="text-slate-600 font-medium hover:text-blue-500 transition-all duration-300 ease-in-out hover:opacity-80" href="#funcionalidades">Funcionalidades</a>
            <a className="text-slate-600 font-medium hover:text-blue-500 transition-all duration-300 ease-in-out hover:opacity-80" href="#planos">Planos</a>
            <a className="text-slate-600 font-medium hover:text-blue-500 transition-all duration-300 ease-in-out hover:opacity-80" href="#sobre">Sobre</a>
          </div>
          
          <a href="https://pay.kiwify.com.br/chRzTuK" target="_blank" rel="noopener noreferrer" className="bg-green-500 text-white font-button px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-green-600 transition-colors shadow-sm inline-block text-xs sm:text-sm md:text-base font-bold whitespace-nowrap ml-4 animate-cta-pulse">
            Garantir <span className="hidden sm:inline">Acesso</span>
          </a>
        </div>
      </nav>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative pt-12 pb-16 md:pt-24 md:pb-32 overflow-hidden bg-gradient-to-b from-surface-bright to-background">
          {/* Decorative background elements */}
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 90, 0],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] md:w-[800px] md:h-[800px] bg-gradient-to-br from-primary-container/20 to-blue-200/20 rounded-full blur-3xl opacity-60 pointer-events-none z-0"
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, -90, 0],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] md:w-[600px] md:h-[600px] bg-gradient-to-tr from-secondary-container/20 to-green-100/20 rounded-full blur-3xl opacity-60 pointer-events-none z-0"
          />

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center text-center">
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
              className="space-y-6 md:space-y-8 flex flex-col items-center w-full"
            >
              <div className="inline-flex items-center space-x-2 bg-surface-container px-3 py-1.5 rounded-full">
                <BadgeCheck className="text-secondary w-4 h-4 md:w-5 md:h-5" />
                <span className="font-label-caps text-[10px] md:text-label-caps text-on-surface-variant uppercase tracking-wider">A Revolução na Prática Clínica</span>
              </div>
              <h1 className="font-headline-xl text-4xl md:text-5xl lg:text-5xl xl:text-headline-xl text-on-surface leading-tight tracking-tight max-w-4xl mx-auto">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-500 to-secondary animate-gradient-x">
                  O Software de Nutrição Completo.
                </span><br />
                Sem Mensalidades, Para Sempre.
              </h1>
              <p className="font-body-lg text-base md:text-body-lg text-on-surface-variant max-w-3xl">
                Automatize processos complexos, foque no atendimento e tenha acesso vitalício ao software definitivo para nutricionistas de alta performance com um único pagamento.
              </p>
              
              <div className="space-y-4 pt-4 flex flex-col items-center w-full">
                <a href="https://pay.kiwify.com.br/chRzTuK" target="_blank" rel="noopener noreferrer" className="relative group bg-green-500 text-white font-button px-4 py-4 md:px-8 md:py-4 rounded-lg hover:bg-green-600 transition-colors shadow-lg hover:shadow-2xl w-full sm:w-auto flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-2 overflow-hidden animate-cta-pulse">
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                  <span className="text-sm md:text-base text-center relative z-10">Sim, Quero Meu Acesso Vitalício Agora</span>
                  <ArrowRight className="w-5 h-5 hidden sm:block relative z-10 group-hover:translate-x-1 transition-transform" />
                </a>
                <p className="font-body-sm text-xs md:text-body-sm text-outline flex items-center justify-center space-x-2 max-w-sm sm:max-w-none text-center">
                  <CircleCheck className="text-secondary w-4 h-4 shrink-0 hidden sm:block" />
                  <span>Pagamento Único. Sem Mensalidades. Satisfação garantida.</span>
                </p>
              </div>

              {/* Mockup */}
              <div className="w-full max-w-4xl mx-auto mt-12 md:mt-16 relative group cursor-pointer hover:scale-[1.02] transition-transform duration-500">
                 <div className="aspect-[16/10] w-full bg-slate-50/50 backdrop-blur-sm rounded-t-xl md:rounded-t-2xl border-4 border-b-0 border-slate-200/60 shadow-2xl flex flex-col overflow-hidden relative">
                    <div className="w-full h-4 sm:h-6 bg-slate-200/80 border-b border-slate-300/50 flex items-center px-4 shrink-0">
                      <div className="flex space-x-1.5">
                        <div className="w-2 h-2 rounded-full bg-red-400"></div>
                        <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                        <div className="w-2 h-2 rounded-full bg-green-400"></div>
                      </div>
                    </div>
                    <div className="flex-1 w-full bg-white relative overflow-hidden">
                      <img 
                        src="https://i.postimg.cc/hPhmHg8G/Captura-de-tela-2026-05-07-175505.png" 
                        alt="Interface do BodyComp" 
                        className="w-full h-full object-cover object-top"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop";
                          target.onerror = null;
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent mix-blend-overlay"></div>
                    </div>
                 </div>
                 {/* Keyboard bottom line */}
                 <div className="h-4 sm:h-6 w-[105%] -ml-[2.5%] bg-slate-300/80 rounded-b-xl shadow-lg border-t border-slate-400/30 shrink-0"></div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Vídeo de Apresentação Section */}
        <section className="pb-16 md:pb-24 pt-4 md:pt-8 bg-background relative z-20" id="apresentacao">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
            >
              <h2 className="font-headline-lg text-3xl md:text-headline-lg text-on-surface mb-4">Veja o Body Comp em Ação</h2>
              <p className="font-body-lg text-base md:text-body-lg text-on-surface-variant mb-8 md:mb-10 max-w-2xl mx-auto">
                Descubra em poucos minutos como nossa plataforma vai transformar sua rotina clínica e multiplicar seus resultados.
              </p>

              <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black border border-surface-variant group hover:shadow-[0_20px_50px_rgba(0,82,255,0.15)] transition-all duration-500">
                {/* Background glow for video */}
                <div className="absolute -inset-1 bg-gradient-to-r from-primary via-blue-400 to-secondary opacity-30 blur-2xl group-hover:opacity-50 transition-opacity duration-500"></div>
                {/* YouTube Video Embed */}
                <iframe 
                  className="absolute inset-0 w-full h-full rounded-2xl z-10"
                  src="https://www.youtube.com/embed/4jDG9i7AR1Q?autoplay=0&showinfo=0&rel=0&modestbranding=1" 
                  title="Apresentação do BodyComp" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  allowFullScreen
                ></iframe>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section (Bento Grid Style) */}
        <section className="py-16 md:py-24 bg-surface-container-lowest relative" id="funcionalidades">
          <div className="max-w-container-max-width mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 md:mb-16 space-y-4">
              <h2 className="font-headline-lg text-3xl md:text-headline-lg text-on-surface">Ferramentas de Alta Performance</h2>
              <p className="font-body-lg text-base md:text-body-lg text-on-surface-variant max-w-2xl mx-auto">
                Tudo que você precisa para gerenciar sua clínica e entregar resultados excepcionais em um único ecossistema.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Feature 1 */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, type: "spring", bounce: 0.3, delay: 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-surface rounded-xl p-8 border border-surface-variant hover:shadow-lg transition-all group"
              >
                <div className="w-14 h-14 rounded-lg bg-primary-container/10 flex items-center justify-center mb-6 group-hover:bg-primary-container/20 transition-colors">
                  <Calendar className="text-primary w-8 h-8" />
                </div>
                <h3 className="font-headline-md text-xl mb-3 text-on-surface">Agendamento de Pacientes</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Gestão inteligente de horários, confirmações automáticas e redução drástica de faltas.
                </p>
              </motion.div>
              
              {/* Feature 2 */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, type: "spring", bounce: 0.3, delay: 0.2 }}
                whileHover={{ y: -5 }}
                className="bg-surface rounded-xl p-8 border border-surface-variant hover:shadow-lg transition-all group"
              >
                <div className="w-14 h-14 rounded-lg bg-secondary-container/20 flex items-center justify-center mb-6 group-hover:bg-secondary-container/40 transition-colors">
                  <ClipboardList className="text-secondary w-8 h-8" />
                </div>
                <h3 className="font-headline-md text-xl mb-3 text-on-surface">Anamnese Completa</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Colete dados clínicos de forma estruturada, com questionários personalizáveis pré-consulta.
                </p>
              </motion.div>

              {/* Feature 3 */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, type: "spring", bounce: 0.3, delay: 0.3 }}
                whileHover={{ y: -5 }}
                className="bg-surface rounded-xl p-8 border border-surface-variant hover:shadow-lg transition-all group"
              >
                <div className="w-14 h-14 rounded-lg bg-primary-container/10 flex items-center justify-center mb-6 group-hover:bg-primary-container/20 transition-colors">
                  <Utensils className="text-primary w-8 h-8" />
                </div>
                <h3 className="font-headline-md text-xl mb-3 text-on-surface">Prescrição de Dietas</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Cálculos automáticos, banco de alimentos extenso e montagem visual intuitiva de cardápios.
                </p>
              </motion.div>

              {/* Feature 4 */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, type: "spring", bounce: 0.3, delay: 0.4 }}
                whileHover={{ y: -5 }}
                className="bg-surface rounded-xl p-8 border border-surface-variant hover:shadow-lg transition-all group"
              >
                <div className="w-14 h-14 rounded-lg bg-secondary-container/20 flex items-center justify-center mb-6 group-hover:bg-secondary-container/40 transition-colors">
                  <User className="text-secondary w-8 h-8" />
                </div>
                <h3 className="font-headline-md text-xl mb-3 text-on-surface">Avaliações Físicas</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Registro preciso de antropometria, dobras cutâneas e bioimpedância com gráficos evolutivos.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Benefícios Section */}
        <section className="py-16 md:py-24 bg-surface relative overflow-hidden" id="sobre">
          <div className="max-w-container-max-width mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
              className="order-2 md:order-1 relative"
            >
              <div className="rounded-xl shadow-2xl overflow-hidden border border-surface-variant bg-surface relative group">
                <img 
                  alt="Print Real do Software BodyComp" 
                  className="object-cover md:object-contain h-64 sm:h-[400px] md:h-[500px] w-full bg-slate-50 transition-transform duration-700 group-hover:scale-105"
                  src="https://i.postimg.cc/QCvMLLsv/Captura-de-tela-2026-05-07-180456.png"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop";
                    target.onerror = null;
                  }}
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent p-6 pointer-events-none">
                  <div className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-md">
                    <span className="font-label-caps text-xs text-white uppercase tracking-wider">Interface Real do BodyComp</span>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent rounded-xl pointer-events-none"></div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.4, delay: 0.2 }}
              className="order-1 md:order-2 space-y-6 md:space-y-8"
            >
              <h2 className="font-headline-lg text-3xl md:text-headline-lg text-on-surface">Poupança de Tempo. Fidelização Garantida.</h2>
              <p className="font-body-lg text-base md:text-body-lg text-on-surface-variant">
                A verdadeira inteligência clínica não está apenas em calcular macros, mas em liberar seu tempo para o que realmente importa: a conexão humana com seu paciente.
              </p>
              <ul className="space-y-6">
                <li className="flex items-start space-x-4">
                  <div className="mt-1 bg-primary-container/10 p-2 rounded-full shrink-0">
                    <Timer className="text-primary w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-headline-md text-lg text-on-surface">Consultas mais Eficientes</h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                      Reduza o tempo de preenchimento de dados burocráticos em até 40%.
                    </p>
                  </div>
                </li>
                <li className="flex items-start space-x-4">
                  <div className="mt-1 bg-secondary-container/20 p-2 rounded-full shrink-0">
                    <Heart className="text-secondary w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-headline-md text-lg text-on-surface">Experiência Premium</h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                      Entregue relatórios e prescrições visuais de alta qualidade que encantam e fidelizam.
                    </p>
                  </div>
                </li>
              </ul>
            </motion.div>
          </div>
        </section>

        {/* Prova Social Section */}
        <section className="py-16 md:py-24 bg-surface relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 flex flex-col items-center">
              <span className="inline-flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-800 rounded-full font-label-caps text-xs uppercase tracking-wider mb-4 font-bold">
                <Star className="w-3 h-3 fill-current" />
                <Star className="w-3 h-3 fill-current" />
                <Star className="w-3 h-3 fill-current" />
                <Star className="w-3 h-3 fill-current" />
                <Star className="w-3 h-3 fill-current" />
              </span>
              <h2 className="font-headline-lg text-3xl md:text-4xl text-on-surface mb-4">O que dizem os Nutricionistas de Alta Performance</h2>
              <p className="font-body-lg text-base md:text-lg text-on-surface-variant max-w-2xl">
                Junte-se aos profissionais que já se libertaram das mensalidades abusivas e faturam mais.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Testimonial 1 */}
              <div className="bg-surface-container-lowest p-8 rounded-2xl border border-surface-variant shadow-lg flex flex-col relative">
                <Quote className="absolute top-6 right-6 w-8 h-8 text-primary/10" />
                <div className="flex space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />)}
                </div>
                <p className="font-body-md text-on-surface-variant mb-6 flex-grow italic">
                  "Eu pagava mais de R$ 900 por ano em um software que eu usava só 30%. O BodyComp me impressionou: visual moderno, anamnese super completa e não tem mensalidade alguma. Paguei em 1 consulta e já recuperei o investimento."
                </p>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center font-bold text-primary">DR</div>
                  <div>
                    <h4 className="font-headline-md text-sm md:text-base text-on-surface">Dra. Roberta Almeida</h4>
                    <p className="font-body-sm text-xs text-on-surface-variant">Nutricionista Esportiva</p>
                  </div>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="bg-surface-container-lowest p-8 rounded-2xl border border-surface-variant shadow-lg flex flex-col relative">
                <Quote className="absolute top-6 right-6 w-8 h-8 text-primary/10" />
                <div className="flex space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />)}
                </div>
                <p className="font-body-md text-on-surface-variant mb-6 flex-grow italic">
                  "A economia de tempo na hora de montar a dieta do paciente na frente dele é o grande diferencial. O paciente sai encantado com os materiais que gero em PDF. Sem dúvidas, o melhor custo x benefício do mercado atual."
                </p>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center font-bold text-secondary">FC</div>
                  <div>
                    <h4 className="font-headline-md text-sm md:text-base text-on-surface">Felipe Costa</h4>
                    <p className="font-body-sm text-xs text-on-surface-variant">Nutricionista Clínico</p>
                  </div>
                </div>
              </div>

              {/* Testimonial 3 */}
              <div className="bg-surface-container-lowest p-8 rounded-2xl border border-surface-variant shadow-lg flex flex-col relative">
                <Quote className="absolute top-6 right-6 w-8 h-8 text-primary/10" />
                <div className="flex space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />)}
                </div>
                <p className="font-body-md text-on-surface-variant mb-6 flex-grow italic">
                  "Tinha receio de mudar de plataforma, mas o suporte foi perfeito. A gestão de horários automatizou minha agenda que era um caos. O fato de ser pagamento único, num software tão de ponta, ainda me deixa pasma."
                </p>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center font-bold text-blue-600">JS</div>
                  <div>
                    <h4 className="font-headline-md text-sm md:text-base text-on-surface">Juliana Silva</h4>
                    <p className="font-body-sm text-xs text-on-surface-variant">Nutrição Materno-Infantil</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Oferta Irresistível */}
        <section className="py-16 md:py-24 bg-surface-container-lowest relative overflow-hidden" id="planos">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-container/5 via-background to-background pointer-events-none"></div>
          
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <span className="inline-block font-label-caps text-xs md:text-label-caps text-primary tracking-wider uppercase mb-4">Acesso Definitivo</span>
            <h2 className="font-headline-xl text-3xl md:text-headline-xl text-on-surface mb-4 md:mb-6 leading-tight">Invista uma vez. Use para sempre.</h2>
            <p className="font-body-lg text-base md:text-body-lg text-on-surface-variant mb-8 md:mb-12">
              Chega de assinaturas mensais que corroem seu faturamento. Adquira o Body Comp com pagamento único e tenha acesso vitalício a todas as atualizações.
            </p>
            
            <motion.div 
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
              whileHover={{ scale: 1.02 }}
              className="glass-panel p-6 sm:p-10 rounded-2xl border border-primary-container/20 shadow-xl max-w-lg mx-auto bg-white/80"
            >
              <div className="mb-6 md:mb-8 relative flex flex-col items-center">
                <span className="absolute -top-6 -left-4 w-12 h-12 bg-primary/10 rounded-full blur-xl"></span>
                <span className="absolute -bottom-4 -right-4 w-16 h-16 bg-secondary/10 rounded-full blur-xl"></span>
                
                {/* Ancoragem de Preço */}
                <span className="text-on-surface-variant font-body-sm text-sm md:text-base relative z-10 mb-1">
                  <s className="text-red-500/70 font-semibold">De R$ 1.198,00/ano</s> por apenas:
                </span>
                
                <div className="flex items-baseline relative z-10">
                  <span className="text-4xl md:text-5xl font-headline-xl text-on-surface font-bold">R$ 97,90</span>
                  <span className="text-on-surface-variant font-body-sm text-sm md:text-body-sm ml-1">/único</span>
                </div>
              </div>
              
              <ul className="text-left space-y-4 mb-8 font-body-sm text-body-sm text-on-surface">
                <li className="flex items-center space-x-3">
                  <CircleCheck className="text-secondary w-5 h-5 shrink-0" />
                  <span>Acesso vitalício à plataforma</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CircleCheck className="text-secondary w-5 h-5 shrink-0" />
                  <span>Pacientes ilimitados</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CircleCheck className="text-secondary w-5 h-5 shrink-0" />
                  <span>Atualizações futuras inclusas</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CircleCheck className="text-secondary w-5 h-5 shrink-0" />
                  <span>Suporte técnico prioritário</span>
                </li>
              </ul>
              
              <a href="https://pay.kiwify.com.br/chRzTuK" target="_blank" rel="noopener noreferrer" className="block text-center w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-button py-4 rounded-lg hover:shadow-[0_10px_30px_rgba(34,197,94,0.3)] transition-all duration-300 transform hover:-translate-y-1 text-lg font-bold animate-cta-pulse">
                Garantir Minha Licença Vitalícia
              </a>
              <p className="mt-4 font-body-sm text-body-sm text-outline text-sm">
                Risco zero: 7 dias de garantia incondicional de reembolso.
              </p>
            </motion.div>
          </div>
        </section>
        {/* FAQ Section */}
        <section className="py-16 md:py-24 bg-background border-t border-surface-variant" id="faq">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 md:mb-12">
              <h2 className="font-headline-lg text-3xl md:text-4xl text-on-surface mb-4">Perguntas Frequentes</h2>
              <p className="font-body-lg text-base md:text-lg text-on-surface-variant">
                Tire suas dúvidas e garanta sua licença agora.
              </p>
            </div>
            
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <FAQItem 
                  key={index} 
                  faq={faq} 
                  isOpen={openFaqIndex === index} 
                  toggleOpen={() => setOpenFaqIndex(openFaqIndex === index ? null : index)} 
                />
              ))}
            </div>

            <div className="mt-12 text-center bg-surface-container-lowest p-8 border border-primary-container/30 rounded-2xl">
              <h3 className="font-headline-md text-xl mb-3 text-on-surface">Ainda tem dúvidas?</h3>
              <p className="font-body-sm text-on-surface-variant mb-6">Não perca mais tempo pagando mensalidades.</p>
              <a href="https://pay.kiwify.com.br/chRzTuK" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center bg-green-500 text-white font-button px-6 py-3 rounded-lg hover:bg-green-600 transition-colors shadow-md text-base font-bold animate-cta-pulse">
                Aproveitar Oferta Única
                <ArrowRight className="ml-2 w-5 h-5" />
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white font-['Space_Grotesk'] text-sm w-full py-10 md:py-12 border-t border-slate-200 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center text-center md:text-left">
          <div className="flex flex-col space-y-4 items-center md:items-start">
            <img src="https://i.postimg.cc/jSR90w0Z/Body-Comp-(2500-x-1080-px).png" alt="Body Comp Logo" className="h-[38px] w-auto object-contain mb-1 md:mb-2" />
            <p className="text-slate-500">© 2026 Body Comp | Nutrição Inteligente. Todos os direitos reservados.</p>
          </div>
          <div className="flex flex-wrap gap-4 md:gap-6 justify-center md:justify-end">
            <a className="text-slate-500 hover:text-blue-600 transition-colors" href="#">Termos</a>
            <a className="text-slate-500 hover:text-blue-600 transition-colors" href="#">Privacidade</a>
            <a className="text-slate-500 hover:text-blue-600 transition-colors" href="#">Cookies</a>
            <a className="text-slate-500 hover:text-blue-600 transition-colors" href="#">Contato</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
