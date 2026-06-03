// src/pages/AcercaDe.jsx
import React from 'react'
import logoCwm from "../assets/logo_CWM_oficial.png";
import logoCrs from "../assets/logo_CRS_oficial.png";
import fotoCeo from "../assets/foto_CEO.png";
import fondoMosaico from "../../public/fondo_mosaico.png"
import ContenedorPrincipal from "../components/layout/ContenedorPrincipal.jsx";

const AcercaDe = () => {
  return (
    <div className="relative min-h-[calc(100vh-64px)] w-full overflow-hidden flex items-center justify-center py-5 bg-sky-50">
      
      {/* FONDO MOSAICO SIN DIFUMINAR (Igual que en Suscripciones) */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${fondoMosaico})` }}
      >
        <div className="absolute inset-0 bg-black/10"></div>
      </div>

      <ContenedorPrincipal className="relative z-10 w-full animate-fade-in-up">
        
        {/* TARJETA UNIFICADA CON EFECTO CRISTAL */}
        <div className="bg-black/25 backdrop-blur-2xl border border-white/10 rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden flex flex-col lg:flex-row items-stretch w-full max-w-6xl mx-auto">
          
          {/* ==========================================
              LADO IZQUIERDO: CABECERA Y ESENCIA
              ========================================== */}
          <div className="w-full lg:w-1/2 p-6 sm:p-10 md:p-12 lg:p-16 flex flex-col justify-center relative border-b lg:border-b-0 lg:border-r border-white/10 bg-gradient-to-br from-black/30 to-transparent">
            

            <div className="mb-8 md:mb-10">
              <span className="bg-sky-500/20 text-sky-300 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] mb-4 sm:mb-6 inline-block w-fit border border-sky-500/30">
                Nuestra Historia
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 sm:mb-6 tracking-tighter leading-tight drop-shadow-sm">
                Mucho más que <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-pink-300">una aplicación</span>
              </h1>
              <p className="text-gray-200 text-xs sm:text-sm md:text-base font-medium leading-relaxed drop-shadow-md">
                Una herramienta ideal para conectar, compartir momentos únicos y construir una comunidad auténtica.
              </p>
            </div>

            <div className="mb-10 md:mb-12">
              <img 
                src={logoCwm} 
                alt="Come With Me" 
                className="w-40 sm:w-48 object-contain opacity-90 drop-shadow-[0_0_15px_rgba(255,255,255,0.15)] hover:scale-105 transition-transform duration-500" 
              />
            </div>

            <h3 className="text-[9px] sm:text-[10px] font-black text-white uppercase tracking-widest mb-4 sm:mb-6">Nuestra Esencia</h3>
            <ul className="space-y-4 sm:space-y-5">
                <li className="flex items-start gap-3 sm:gap-4">
                  <div className="mt-1 p-1.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30 flex-shrink-0">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <div className="text-gray-200 font-medium text-xs sm:text-sm leading-relaxed">
                    En un mundo hiperconectado, facilitamos encuentros <span className="text-pink-300 font-bold">reales y significativos</span>.
                  </div>
                </li>
                <li className="flex items-start gap-3 sm:gap-4">
                  <div className="mt-1 p-1.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 flex-shrink-0">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <div className="text-gray-200 font-medium text-xs sm:text-sm leading-relaxed">
                    Diseñada para crear lazos mediante una interfaz <span className="text-sky-300 font-bold">limpia, rápida y segura</span>.
                  </div>
                </li>
            </ul>
          </div>

          {/* ==========================================
              LADO DERECHO: PERFIL PROFESIONAL
              ========================================== */}
          <div className="w-full lg:w-1/2 p-6 sm:p-10 md:p-12 lg:p-16 flex flex-col justify-center items-center text-center relative bg-black/20 group">
            
            <div className="relative mb-6 max-w-[140px] sm:max-w-[160px] md:max-w-[180px]">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-300/50 to-sky-500/50 rounded-[1.5rem] sm:rounded-[2rem] rotate-6 group-hover:rotate-3 transition-transform duration-500 shadow-xl blur-[2px]"></div>
              <div className="relative bg-[#1a1a1a] p-1.5 rounded-[1.5rem] sm:rounded-[2rem] shadow-xl overflow-hidden border border-white/10">
                <img 
                  src={fotoCeo} 
                  alt="Alejandro Soler Cruz" 
                  className="w-full aspect-square object-cover rounded-[1.2rem] sm:rounded-[1.6rem] grayscale group-hover:grayscale-0 transition-all duration-700" 
                />
              </div>
            </div>

            <div className="mb-6 w-full">
              <img src={logoCrs} alt="codeRAIN Studio" className="h-6 sm:h-8 mx-auto mb-3 sm:mb-4 opacity-60 brightness-200" />
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white mb-1 drop-shadow-sm">Alejandro Soler Cruz</h2>
              <p className="text-pink-300 font-black uppercase tracking-[0.2em] text-[9px] sm:text-[10px]">Full-Stack Developer & CEO</p>
            </div>
            
            <div className="flex gap-3 sm:gap-4 mb-8 sm:mb-10">
              <a href="https://github.com/gh-asc99" target="_blank" rel="noopener noreferrer" className="p-3 sm:p-3.5 rounded-2xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-all shadow-sm active:scale-95" title="GitHub">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.068.069-.068 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>
              </a>
              <a href="https://linkedin.com/in/alejandrosc99/" target="_blank" rel="noopener noreferrer" className="p-3 sm:p-3.5 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400 hover:text-white hover:bg-sky-500 transition-all shadow-sm active:scale-95" title="LinkedIn">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
              <a href="mailto:just.asc99@gmail.com" className="p-3 sm:p-3.5 rounded-2xl bg-pink-300/10 border border-pink-300/20 text-pink-300 hover:text-white hover:bg-pink-400 transition-all shadow-sm active:scale-95" title="Email">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L22 8m-2 11H4a2 2 0 01-2-2V7a2 2 0 012-2h16a2 2 0 012 2v10a2 2 0 01-2 2z"/></svg>
              </a>
            </div>

            <div className="w-full max-w-lg text-left bg-white/5 p-5 sm:p-7 rounded-2xl border border-white/10 shadow-inner group-hover:border-white/20 transition-colors">
              <h3 className="text-[9px] sm:text-[10px] font-black text-sky-400 uppercase tracking-widest mb-4 sm:mb-5 flex items-center gap-2">
                <span>🎓</span> Formación Oficial
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs sm:text-sm md:text-base font-bold text-white leading-tight">DAW - Técnico Superior en Desarrollo de Aplicaciones Web</h4>
                  <p className="text-[10px] sm:text-xs text-gray-400 font-bold mt-1">I.E.S. Paco Mollá (Alicante)</p>
                </div>
                <div className="border-t border-white/10 pt-4">
                  <h4 className="text-xs sm:text-sm md:text-base font-bold text-white leading-tight">Certificado Prof. Desarrollo de Aplicaciones Web</h4>
                  <p className="text-[10px] sm:text-xs text-gray-400 font-bold mt-1">Formación Universitaria</p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </ContenedorPrincipal>
    </div>
  )
}

export default AcercaDe