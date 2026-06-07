import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import FaseSeleccionEvento from '../components/creacion/FaseSeleccionEvento.jsx';
import FaseSeleccionPaquete from '../components/creacion/FaseSeleccionPaquete.jsx';
import FaseFormularioDinamico from '../components/creacion/FaseFormularioDinamico.jsx';
import useCreacion from '../hooks/useCreacion.js';
import FaseExito from '../components/creacion/FaseExito.jsx';
import ContenedorPrincipal from "../components/layout/ContenedorPrincipal.jsx";
import fondoMosaico from '../../public/fondo_mosaico.png';

const NuevaCreacion = () => {
  const navegar = useNavigate();
  // Asegúrate de exportar limiteAlcanzado y setLimiteAlcanzado desde tu hook useCreacion
  const { faseActual, limiteAlcanzado, setLimiteAlcanzado } = useCreacion();

  const fases = [
    { id: 1, titulo: "Fase 1", desc: "Selección de Evento", color: "pink" },
    { id: 2, titulo: "Fase 2", desc: "Selección de Paquete", color: "sky" },
    { id: 3, titulo: "Fase 3", desc: "Personalización", color: "pink" },
    { id: 4, titulo: "Fase 4", desc: "Confirmación", color: "sky" }
  ];

  const getProgressWidth = () => {
    if (faseActual === 1) return '0%';
    if (faseActual === 2) return '33.33%';
    if (faseActual === 3) return '66.66%';
    if (faseActual >= 4) return '100%';
    return '0%';
  };

  return (
    <div className="relative min-h-[calc(100vh-64px)] w-full overflow-hidden flex flex-col bg-sky-50">

      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${fondoMosaico})` }}
      >
        <div className="absolute inset-0 bg-black/10"></div>
      </div>

      {/* BARRA DE PROGRESO VERTICAL */}
      <div className="fixed right-4 md:right-8 lg:right-12 top-1/2 -translate-y-1/2 z-50 h-[300px] md:h-[500px] bg-black/25 backdrop-blur-2xl p-2 md:p-3 py-6 md:py-8 rounded-full border border-white/10 shadow-xl hidden sm:flex flex-col justify-between items-center">

        <div className="absolute left-1/2 top-8 bottom-8 md:top-10 md:bottom-10 w-1 bg-white/10 z-0 rounded-full -translate-x-1/2">
          <div 
            className="w-full bg-gradient-to-b from-pink-300 via-sky-400 to-pink-300 transition-all duration-1000 ease-in-out rounded-full"
            style={{ height: getProgressWidth() }}
          ></div>
        </div>

        {fases.map((fase) => {
          const activo = faseActual === fase.id;
          const completado = faseActual > fase.id;
          
          const colorBg = fase.color === 'pink' ? 'bg-pink-300' : 'bg-sky-400';
          const colorShadow = fase.color === 'pink' ? 'shadow-[0_0_15px_rgba(244,114,182,0.6)]' : 'shadow-[0_0_15px_rgba(56,189,248,0.6)]';

          return (
            <div key={fase.id} className="relative z-10 flex items-center gap-2 md:gap-3 bg-black/40 md:bg-transparent p-1.5 md:p-0 rounded-full border md:border-none border-white/5 backdrop-blur-md md:backdrop-blur-none group">
              
              <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-black text-xs md:text-sm transition-all duration-700 border-2 flex-shrink-0 ${
                activo 
                  ? `${colorBg} border-transparent text-white ${colorShadow} scale-110` 
                  : completado 
                    ? `${colorBg} border-transparent text-white scale-100` 
                    : 'bg-[#1a1a1a] border-white/20 text-gray-400 scale-100'
              }`}>
                {completado ? (
                  <svg className="w-4 h-4 md:w-5 md:h-5 text-white animate-fade-in" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  fase.id
                )}
              </div>

            </div>
          );
        })}
      </div>

      <ContenedorPrincipal className="relative z-10 w-full animate-fade-in-up py-5 flex flex-col items-center">
        
        {/* CONTENEDOR DE FASES */}
        <div className="w-full">
          {faseActual === 1 && <FaseSeleccionEvento />}
          {faseActual === 2 && <FaseSeleccionPaquete />}
          {faseActual === 3 && <FaseFormularioDinamico />}
          {faseActual === 4 && <FaseExito />}
        </div>

      </ContenedorPrincipal>

      {/* MODAL DE LÍMITE ALCANZADO */}
      <AnimatePresence>
        {limiteAlcanzado && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[2rem] sm:rounded-[2.5rem] p-8 sm:p-10 max-w-md w-full text-center shadow-2xl relative border border-white/20 overflow-hidden"
            >
              {/* Decoración de fondo */}
              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-pink-100 to-sky-100 opacity-50 -z-10"></div>
              
              <div className="w-20 h-20 mx-auto bg-gradient-to-tr from-yellow-400 to-amber-300 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(251,191,36,0.4)] mb-6 border-4 border-white">
                <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              
              <h2 className="text-2xl sm:text-3xl font-black text-[#252525] tracking-tight mb-3">
                ¡Límite Alcanzado!
              </h2>
              <p className="text-gray-500 font-medium mb-8 leading-relaxed text-sm sm:text-base">
                Has alcanzado el límite de 6 creaciones gratuitas. Desbloquea todo el potencial de la plataforma y crea invitaciones ilimitadas.
              </p>
              
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => navegar('/suscripciones')}
                  className="w-full bg-[#252525] hover:bg-black text-white font-black text-xs sm:text-sm uppercase tracking-widest py-4 sm:py-4 rounded-xl transition-all shadow-[0_10px_20px_rgba(0,0,0,0.1)] active:scale-95 flex justify-center items-center gap-2"
                >
                  <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Ver Planes Premium
                </button>
                <button 
                  onClick={() => setLimiteAlcanzado(false)}
                  className="w-full py-4 font-bold text-gray-400 hover:text-gray-600 transition-colors text-xs uppercase tracking-widest"
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default NuevaCreacion;