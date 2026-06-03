// src/components/plantillas/TimelineNarrativa.jsx
import React from 'react';
import { motion } from 'framer-motion';

const TimelineNarrativa = ({ fases, titulo, esModoPDF = false }) => {
  const fasesDemo = fases && fases.length > 0 ? fases : [
    { hora: "10:30", titulo: "Comienza el evento", descripcion: "" },
    { hora: "11:00", titulo: "Catering", descripcion: "" },
    { hora: "12:30", titulo: "Ceremonia", descripcion: "" },
  ];

  // =========================================================================
  // VERSIÓN PDF: 100% A PRUEBA DE FALLOS (Diseño plano y seguro)
  // =========================================================================
  if (esModoPDF) {
    return (
      <div className="w-full bg-gray-50 p-6 rounded-3xl border border-gray-200 my-4" style={{ pageBreakInside: 'avoid' }}>
        <div className="text-center mb-6">
          <h3 className="text-xl font-black text-[#252525] uppercase tracking-widest">
            {titulo || "Nuestra Ruta"}
          </h3>
        </div>
        <div className="flex flex-col gap-4">
          {fasesDemo.map((fase, index) => {
            const isRight = index % 2 === 0;
            const borderColor = isRight ? 'border-sky-400' : 'border-pink-300';
            const badgeBg = isRight ? 'bg-sky-100' : 'bg-pink-100';
            const textColor = isRight ? 'text-sky-600' : 'text-pink-500';

            return (
              <div key={index} className={`flex items-center gap-4 bg-white p-4 rounded-xl border-l-4 ${borderColor} shadow-sm w-full`}>
                <div className={`px-3 py-1 ${badgeBg} ${textColor} font-black text-xs rounded-md min-w-[60px] text-center shrink-0`}>
                  {fase.hora}
                </div>
                <div className="font-bold text-[#252525] text-sm flex-1">
                  {fase.titulo}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // =========================================================================
  // VERSIÓN WEB: RESPONSIVE FLUIDO
  // =========================================================================
  const fadeInScroll = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20, duration: 0.6 } } };
  const scaleInDot = { hidden: { scale: 0, opacity: 0 }, visible: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 200, delay: 0.1 } } };
  const lineDraw = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.8, delay: 0.2 } } };

  return (
    <div className="relative w-full bg-[#fafafa] p-5 sm:p-8 md:p-10 rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[3rem] shadow-inner border-2 border-dashed border-gray-200 my-2 sm:my-4 overflow-hidden">
      
      {/* ELEMENTOS DECORATIVOS FONDO */}
      <div className="absolute top-0 left-0 w-48 sm:w-64 h-48 sm:h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-[60px] sm:blur-[80px] opacity-40 -z-0"></div>
      <div className="absolute bottom-10 sm:bottom-20 right-0 w-56 sm:w-72 h-56 sm:h-72 bg-sky-200 rounded-full mix-blend-multiply filter blur-[60px] sm:blur-[80px] opacity-40 -z-0"></div>
      <div className="absolute top-1/2 left-1/4 w-32 sm:w-48 h-32 sm:h-48 bg-sky-100 rounded-full mix-blend-multiply filter blur-[50px] sm:blur-[60px] opacity-50 -z-0"></div>
      
      {/* ÍCONOS (Ocultos en móvil pequeño para evitar ruido) */}
      <svg className="hidden sm:block absolute top-6 sm:top-10 left-6 sm:left-10 text-pink-300 w-5 sm:w-6 h-5 sm:h-6 opacity-60 animate-pulse z-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" /></svg>
      <svg className="hidden sm:block absolute top-32 sm:top-40 right-6 sm:right-12 text-sky-400 w-6 sm:w-8 h-6 sm:h-8 opacity-40 z-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" /></svg>

      <motion.div initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-6 sm:mb-10 relative z-10">
        <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-[#252525] uppercase tracking-widest font-serif flex items-center justify-center gap-2 sm:gap-3">
          {titulo || "Nuestra Ruta"}
        </h3>
        <p className="text-gray-500 font-medium text-xs sm:text-sm md:text-base mt-1.5 sm:mt-2 px-2">Sigue el camino para no perderte nada</p>
      </motion.div>

      {/* ESTRATEGIA RESPONSIVE:
        - sm (Móvil): Tarjetas apiladas 100% ancho sin la línea en forma de S.
        - md+ (Escritorio/Tablet): Diseño original en S.
      */}
      <div className="relative w-full max-w-2xl mx-auto flex flex-col mt-2 z-10 gap-3 sm:gap-0">
        {fasesDemo.map((fase, index) => {
          const isRight = index % 2 === 0;
          const isLast = index === fasesDemo.length - 1;
          const borderColor = isRight ? 'border-sky-400' : 'border-pink-300';
          const bgColor = isRight ? 'bg-sky-400' : 'bg-pink-300';
          const badgeBg = isRight ? 'bg-sky-100' : 'bg-pink-100';
          const textColor = isRight ? 'text-sky-600' : 'text-pink-500';

          return (
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} key={index} className="relative flex flex-col sm:flex-row w-full pb-0 sm:pb-8 md:pb-10 group">
              
              {/* LÍNEAS ZIGZAG (Solo Tablet/Desktop) */}
              {!isLast && (
                <motion.div variants={lineDraw} className={`hidden sm:block absolute top-[12px] h-full w-[25%] md:w-[20%] border-dashed border-2 border-gray-300/80 z-0 ${isRight ? 'left-1/2 border-l-0 border-t-2 border-r-2 border-b-2 rounded-r-[2rem]' : 'right-1/2 border-r-0 border-t-2 border-l-2 border-b-2 rounded-l-[2rem]'}`}></motion.div>
              )}

              {/* PUNTO CENTRAL (Solo Tablet/Desktop) */}
              <motion.div variants={scaleInDot} className="hidden sm:flex absolute left-1/2 top-0 -translate-x-1/2 z-20 items-center justify-center">
                <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full border-4 border-white shadow-md ${bgColor} relative`}>
                  <div className="absolute inset-0 m-auto w-1 h-1 md:w-1.5 md:h-1.5 bg-white rounded-full animate-ping opacity-75"></div>
                </div>
              </motion.div>

              {/* CONTENIDO (Izquierda en Desktop) */}
              <div className="hidden sm:flex w-1/2 relative z-10 justify-end pr-4 md:pr-8">
                {!isRight && (
                  <motion.div variants={fadeInScroll} className={`relative w-full max-w-[280px] bg-white/90 backdrop-blur-sm p-3 md:p-4 rounded-[1rem] md:rounded-2xl shadow-sm border-b-[3px] ${borderColor} hover:shadow-lg transition-shadow duration-300 hover:-translate-y-1`}>
                    <div className="absolute top-[4px] -right-[8px] w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-l-[8px] border-l-white/90"></div>
                    <div className="flex flex-col gap-1.5">
                      <span className={`inline-block w-max px-2.5 py-1 ${badgeBg} ${textColor} font-black text-[9px] md:text-[10px] uppercase rounded-full shadow-sm`}>{fase.hora}</span>
                      <h4 className="font-bold text-[#252525] text-sm md:text-base leading-tight mt-0.5">{fase.titulo}</h4>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* CONTENIDO (Derecha en Desktop) */}
              <div className="hidden sm:flex w-1/2 relative z-10 justify-start pl-4 md:pl-8">
                {isRight && (
                  <motion.div variants={fadeInScroll} className={`relative w-full max-w-[280px] bg-white/90 backdrop-blur-sm p-3 md:p-4 rounded-[1rem] md:rounded-2xl shadow-sm border-b-[3px] ${borderColor} hover:shadow-lg transition-shadow duration-300 hover:-translate-y-1`}>
                    <div className="absolute top-[4px] -left-[8px] w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-r-[8px] border-r-white/90"></div>
                    <div className="flex flex-col gap-1.5">
                      <span className={`inline-block w-max px-2.5 py-1 ${badgeBg} ${textColor} font-black text-[9px] md:text-[10px] uppercase rounded-full shadow-sm`}>{fase.hora}</span>
                      <h4 className="font-bold text-[#252525] text-sm md:text-base leading-tight mt-0.5">{fase.titulo}</h4>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* ===============================================================
                  VERSIÓN MÓVIL: Tarjetas 100% Ancho (Se muestran solo en sm:)
                  =============================================================== */}
              <div className="sm:hidden flex w-full relative z-10">
                <motion.div variants={fadeInScroll} className={`relative w-full bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-sm border-l-[4px] ${borderColor} hover:shadow-md transition-shadow`}>
                  <div className="flex items-center gap-3">
                    <span className={`inline-block px-3 py-1 ${badgeBg} ${textColor} font-black text-[10px] rounded-md shadow-sm shrink-0`}>{fase.hora}</span>
                    <h4 className="font-bold text-[#252525] text-sm leading-tight">{fase.titulo}</h4>
                  </div>
                </motion.div>
              </div>

            </motion.div>
          );
        })}
      </div>

      <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} className="hidden sm:flex justify-center mt-2 relative z-20">
        <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-gray-300 rounded-full shadow-inner ring-4 ring-white"></div>
      </motion.div>

    </div>
  );
};

export default TimelineNarrativa;