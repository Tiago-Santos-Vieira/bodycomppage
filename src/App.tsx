import React, { useState, useEffect, useRef, Suspense } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  CircleCheck,
} from 'lucide-react';

const BelowTheFold = React.lazy(() => import('./components/BelowTheFold'));

const mockupImages = [
  "https://i.postimg.cc/hPhmHg8G/Captura-de-tela-2026-05-07-175505.webp",
  "https://i.postimg.cc/3JXL7cKt/Captura-de-tela-2026-05-21-143421.webp",
  "https://i.postimg.cc/yYmfBbVp/Captura-de-tela-2026-05-21-143528.webp",
  "https://i.postimg.cc/qMsm05km/Captura-de-tela-2026-05-21-143637.webp",
  "https://i.postimg.cc/qMsm05kb/Captura-de-tela-2026-05-21-143659.webp"
];

export default function App() {
  const [currentMockupIndex, setCurrentMockupIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMockupIndex((prev) => {
        const nextIndex = (prev + 1) % mockupImages.length;
        if (scrollRef.current) {
          const container = scrollRef.current;
          const width = container.clientWidth;
          container.scrollTo({ left: width * nextIndex, behavior: 'smooth' });
        }
        return nextIndex;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col antialiased">
      {/* TopNavBar */}
      <nav className="sticky top-0 w-full z-50 bg-white font-['Space_Grotesk'] antialiased border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <a href="#" className="flex items-center shrink-0">
            <img fetchPriority="high" width="231" height="100" src="https://i.postimg.cc/jSR90w0Z/Body-Comp-(2500-x-1080-px).webp" alt="Body Comp Logo" className="h-[32px] sm:h-[45px] md:h-[57px] w-auto object-contain" />
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
          <div 
            className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] md:w-[800px] md:h-[800px] bg-gradient-to-br from-primary-container/20 to-blue-200/20 rounded-full blur-3xl opacity-60 pointer-events-none z-0"
          />
          <div 
            className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] md:w-[600px] md:h-[600px] bg-gradient-to-tr from-secondary-container/20 to-green-100/20 rounded-full blur-3xl opacity-60 pointer-events-none z-0"
          />

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center text-center">
            <div 
              className="space-y-6 md:space-y-8 flex flex-col items-center w-full animate-fade-in-up"
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
                    <div className="flex-1 w-full bg-white relative overflow-hidden group">
                      <div 
                        ref={scrollRef}
                        className="flex w-full h-full overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar"
                        onScroll={(e) => {
                          const target = e.target as HTMLDivElement;
                          const index = Math.round(target.scrollLeft / target.clientWidth);
                          setCurrentMockupIndex(index);
                        }}
                      >
                        {mockupImages.map((src, idx) => (
                          <div key={idx} className="w-full h-full shrink-0 relative snap-center">
                            <img 
                              src={src} 
                              alt={`Interface do BodyComp ${idx + 1}`} 
                              className="w-full h-full object-cover object-top"
                              fetchPriority={idx === 0 ? "high" : "auto"}
                              loading={idx === 0 ? "eager" : "lazy"}
                              width="1920"
                              height="1080"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                if (!target.src.includes('.png')) {
                                  target.src = target.src.replace('.webp', '.png');
                                }
                              }}
                            />
                          </div>
                        ))}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent mix-blend-overlay pointer-events-none"></div>
                      
                      {/* Optional: Add navigation indicators */}
                      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-10 pointer-events-none">
                        {mockupImages.map((_, idx) => (
                          <div 
                            key={idx} 
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${currentMockupIndex === idx ? 'bg-primary w-4' : 'bg-primary/30'}`}
                          />
                        ))}
                      </div>
                    </div>
                 </div>
                 {/* Keyboard bottom line */}
                 <div className="h-4 sm:h-6 w-[105%] -ml-[2.5%] bg-slate-300/80 rounded-b-xl shadow-lg border-t border-slate-400/30 shrink-0"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Vídeo de Apresentação Section */}
        <section className="pb-16 md:pb-24 pt-4 md:pt-8 bg-background relative z-20" id="apresentacao">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div 
              className="animate-fade-in-up"
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
                  loading="lazy"
                  className="absolute inset-0 w-full h-full rounded-2xl z-10"
                  src="https://www.youtube.com/embed/4jDG9i7AR1Q?autoplay=0&showinfo=0&rel=0&modestbranding=1" 
                  title="Apresentação do BodyComp" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        </section>

        <Suspense fallback={<div className="h-[200vh] w-full" />}>
          <BelowTheFold />
        </Suspense>

      </main>
    </div>
  );
}
