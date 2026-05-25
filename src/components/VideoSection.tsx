import React from 'react';

export default function VideoSection() {
  return (
    <section className="pb-16 md:pb-24 pt-16 md:pt-24 bg-slate-50 relative z-20 w-full" id="apresentacao">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-fade-in-up">
          <h2 className="font-headline-lg text-3xl md:text-headline-lg text-on-surface mb-8 md:mb-12">Descubra o Poder do BodyComp por Dentro (Vídeo de 3 Minutos)</h2>

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
  );
}
