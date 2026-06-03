// src/pages/NuevaCreacion.jsx
import React from 'react';
import FaseSeleccionEvento from '../components/creacion/FaseSeleccionEvento.jsx';
import FaseSeleccionPaquete from '../components/creacion/FaseSeleccionPaquete.jsx';
import FaseFormularioDinamico from '../components/creacion/FaseFormularioDinamico.jsx';
import useCreacion from '../hooks/useCreacion.js';
import FaseExito from '../components/creacion/FaseExito.jsx';
import ContenedorPrincipal from "../components/layout/ContenedorPrincipal.jsx";
import fondoMosaico from '../../public/fondo_mosaico.png';

const NuevaCreacion = () => {
  const { faseActual } = useCreacion();

  // Textos descriptivos e información para cada fase
  const fases = [
    { id: 1, titulo: "Fase 1", desc: "Selección de Evento", color: "pink" },
    { id: 2, titulo: "Fase 2", desc: "Selección de Paquete", color: "sky" },
    { id: 3, titulo: "Fase 3", desc: "Personalización", color: "pink" },
    { id: 4, titulo: "Fase 4", desc: "Confirmación", color: "sky" }
  ];

  // Cálculo para el llenado suave de la línea de progreso
  const getProgressWidth = () => {
    if (faseActual === 1) return '0%';
    if (faseActual === 2) return '33.33%';
    if (faseActual === 3) return '66.66%';
    if (faseActual >= 4) return '100%';
    return '0%';
  };

  return (
    <div className="relative min-h-[calc(100vh-64px)] w-full overflow-hidden flex flex-col bg-sky-50">
      
      {/* CAPA DE FONDO */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${fondoMosaico})` }}
      >
        <div className="absolute inset-0 bg-black/10"></div>
      </div>

      {/* BARRA DE PROGRESO VERTICAL (Se oculta en móvil para dar más espacio a la interfaz principal) */}
      <div className="fixed right-4 md:right-8 lg:right-12 top-1/2 -translate-y-1/2 z-50 h-[300px] md:h-[500px] bg-black/25 backdrop-blur-2xl p-2 md:p-3 py-6 md:py-8 rounded-full border border-white/10 shadow-xl hidden sm:flex flex-col justify-between items-center">
        
        {/* Línea base de conexión */}
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
          const colorText = fase.color === 'pink' ? 'text-pink-400' : 'text-sky-400';
          const colorShadow = fase.color === 'pink' ? 'shadow-[0_0_15px_rgba(244,114,182,0.6)]' : 'shadow-[0_0_15px_rgba(56,189,248,0.6)]';

          return (
            <div key={fase.id} className="relative z-10 flex items-center gap-2 md:gap-3 bg-black/40 md:bg-transparent p-1.5 md:p-0 rounded-full border md:border-none border-white/5 backdrop-blur-md md:backdrop-blur-none group">
              
              {/* Círculo Animado */}
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

      {/* CONTENEDOR PRINCIPAL: Ajustado con padding responsivo */}
      <ContenedorPrincipal className="relative z-10 w-full animate-fade-in-up py-5 flex flex-col items-center">
        
        {/* CONTENEDOR DE FASES */}
        <div className="w-full">
          {faseActual === 1 && <FaseSeleccionEvento />}
          {faseActual === 2 && <FaseSeleccionPaquete />}
          {faseActual === 3 && <FaseFormularioDinamico />}
          {faseActual === 4 && <FaseExito />}
        </div>

      </ContenedorPrincipal>
    </div>
  );
};

export default NuevaCreacion;