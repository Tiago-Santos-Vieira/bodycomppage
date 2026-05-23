import React, { useState } from 'react';
import {
  Calendar,
  ClipboardList,
  User,
  Utensils,
  Timer,
  Heart,
  Star,
  Quote,
  CircleCheck,
  ChevronDown,
  ArrowRight
} from 'lucide-react';

const faqs = [
  { question: "Vou ter que pagar por atualizações futuras?", answer: "Não, o seu pagamento único garante acesso vitalício a todas as melhorias e novas funcionalidades lançadas." },
  { question: "Funciona no Mac ou Celular?", answer: "Sim, o BodyComp é 100% em nuvem. Você pode acessar de qualquer dispositivo (Mac, Windows, iOS ou Android) pelo navegador." },
  { question: "Meus dados e dos pacientes estão seguros?", answer: "Sim, utilizamos segurança de ponta (criptografia a nível bancário) e adequação total à LGPD, mantendo o controle em suas mãos." },
  { question: "Como recebo o acesso?", answer: "Imediatamente por e-mail após a confirmação do pagamento, com instruções de login e suporte." },
  { question: "Tem garantia?", answer: "Sim, 7 dias de garantia incondicional. Se a ferramenta não acelerar sua rotina, devolvemos seu dinheiro na hora." },
];

function FAQItem({ faq, isOpen, toggleOpen }: { faq: any, isOpen: boolean, toggleOpen: () => void, key?: string | number }) {
  return (
    <div className="border border-surface-variant bg-surface rounded-xl overflow-hidden mb-3 md:mb-4 transition-all">
      <div 
        role="button"
        tabIndex={0}
        onClick={toggleOpen}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleOpen();
          }
        }}
        className="w-full flex items-center justify-between p-4 md:p-6 text-left focus:outline-none cursor-pointer"
      >
        <span className="font-headline-md text-base md:text-lg text-on-surface font-medium pr-4">{faq.question}</span>
        <div className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <ChevronDown className="w-5 h-5 text-on-surface-variant" />
        </div>
      </div>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-4 md:p-6 pt-0 font-body-sm text-on-surface-variant">
          {faq.answer}
        </div>
      </div>
    </div>
  );
}

export default function BelowTheFold() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  return (
    <>
      <section className="py-16 md:py-24 bg-surface-container-lowest relative" id="funcionalidades">
        <div className="max-w-container-max-width mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16 space-y-4">
            <h2 className="font-headline-lg text-3xl md:text-headline-lg text-on-surface">Ferramentas de Alta Performance</h2>
            <p className="font-body-lg text-base md:text-body-lg text-on-surface-variant max-w-2xl mx-auto">
              Tudo que você precisa para gerenciar sua clínica e entregar resultados excepcionais em um único ecossistema.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-surface rounded-xl p-8 border border-surface-variant hover:shadow-lg transition-all group hover:-translate-y-1">
              <div className="w-14 h-14 rounded-lg bg-primary-container/10 flex items-center justify-center mb-6 group-hover:bg-primary-container/20 transition-colors">
                <Calendar className="text-primary w-8 h-8" />
              </div>
              <h3 className="font-headline-md text-xl mb-3 text-on-surface">Agendamento de Pacientes</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Gestão inteligente de horários, confirmações automáticas e redução drástica de faltas.
              </p>
            </div>
            
            <div className="bg-surface rounded-xl p-8 border border-surface-variant hover:shadow-lg transition-all group hover:-translate-y-1">
              <div className="w-14 h-14 rounded-lg bg-secondary-container/20 flex items-center justify-center mb-6 group-hover:bg-secondary-container/40 transition-colors">
                <ClipboardList className="text-secondary w-8 h-8" />
              </div>
              <h3 className="font-headline-md text-xl mb-3 text-on-surface">Anamnese Completa</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Colete dados clínicos de forma estruturada, com questionários personalizáveis pré-consulta.
              </p>
            </div>

            <div className="bg-surface rounded-xl p-8 border border-surface-variant hover:shadow-lg transition-all group hover:-translate-y-1">
              <div className="w-14 h-14 rounded-lg bg-primary-container/10 flex items-center justify-center mb-6 group-hover:bg-primary-container/20 transition-colors">
                <Utensils className="text-primary w-8 h-8" />
              </div>
              <h3 className="font-headline-md text-xl mb-3 text-on-surface">Prescrição de Dietas</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Cálculos automáticos, banco de alimentos extenso e montagem visual intuitiva de cardápios.
              </p>
            </div>

            <div className="bg-surface rounded-xl p-8 border border-surface-variant hover:shadow-lg transition-all group hover:-translate-y-1">
              <div className="w-14 h-14 rounded-lg bg-secondary-container/20 flex items-center justify-center mb-6 group-hover:bg-secondary-container/40 transition-colors">
                <User className="text-secondary w-8 h-8" />
              </div>
              <h3 className="font-headline-md text-xl mb-3 text-on-surface">Avaliações Físicas</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Registro preciso de antropometria, dobras cutâneas e bioimpedância com gráficos evolutivos.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-surface relative overflow-hidden" id="sobre">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 md:space-y-8">
          <h2 className="font-headline-lg text-3xl md:text-headline-lg text-on-surface">Poupança de Tempo. Fidelização Garantida.</h2>
          <p className="font-body-lg text-base md:text-body-lg text-on-surface-variant">
            A verdadeira inteligência clínica não está apenas em calcular macros, mas em liberar seu tempo para o que realmente importa: a conexão humana com seu paciente.
          </p>
          <ul className="space-y-6 text-left max-w-2xl mx-auto">
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
        </div>
      </section>

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

      <section className="py-16 md:py-24 bg-surface-container-lowest relative overflow-hidden" id="planos">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-container/5 via-background to-background pointer-events-none"></div>
        
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="inline-block font-label-caps text-xs md:text-label-caps text-primary tracking-wider uppercase mb-4">Acesso Definitivo</span>
          <h2 className="font-headline-xl text-3xl md:text-headline-xl text-on-surface mb-4 md:mb-6 leading-tight">Invista uma vez. Use para sempre.</h2>
          <p className="font-body-lg text-base md:text-body-lg text-on-surface-variant mb-8 md:mb-12">
            Chega de assinaturas mensais que corroem seu faturamento. Adquira o Body Comp com pagamento único e tenha acesso vitalício a todas as atualizações.
          </p>
          
          <div className="glass-panel p-6 sm:p-10 rounded-2xl border border-primary-container/20 shadow-xl max-w-lg mx-auto bg-white/80 hover:scale-105 transition-transform duration-300">
            <div className="mb-6 md:mb-8 relative flex flex-col items-center">
              <span className="absolute -top-6 -left-4 w-12 h-12 bg-primary/10 rounded-full blur-xl"></span>
              <span className="absolute -bottom-4 -right-4 w-16 h-16 bg-secondary/10 rounded-full blur-xl"></span>
              
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
          </div>
        </div>
      </section>

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

      <footer className="bg-white font-['Space_Grotesk'] text-sm w-full py-10 md:py-12 border-t border-slate-200 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center text-center md:text-left">
          <div className="flex flex-col space-y-4 items-center md:items-start">
            <img loading="lazy" width="231" height="100" src="https://i.postimg.cc/jSR90w0Z/Body-Comp-(2500-x-1080-px).webp" alt="Body Comp Logo" className="h-[38px] w-auto object-contain mb-1 md:mb-2" />
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
    </>
  );
}
