import React from 'react';
import { motion } from 'framer-motion';
import usePlantillas from '../../hooks/useCamposPlantilla.js';

const PlantillaNarrativa = ({ invitacion, urlImagen, esModoPDF = false }) => {
  
  const ComponenteAnimado = esModoPDF ? 'div' : motion.div;
  const { renderizarTimeline } = usePlantillas(); 

  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const animationProps = esModoPDF ? {} : {
    initial: "hidden",
    whileInView: "visible",
    viewport: { once: true, amount: 0.1 },
    variants: fadeIn
  };

  const entradasExtra = Object.entries(invitacion.datos_extra || {});

  let timelineData = null;
  let tituloTimeline = "";
  
  const entradasSinTimeline = entradasExtra.filter(([clave, valor]) => {
    const esTimeline = Array.isArray(valor) && valor.length > 0 && valor[0].hora !== undefined;
    if (esTimeline) {
      timelineData = valor;
      tituloTimeline = clave;
      return false; 
    }
    return true; 
  });

  const mitad = Math.ceil(entradasSinTimeline.length / 2);
  const extraIzquierda = entradasSinTimeline.slice(0, mitad);
  const extraDerecha = entradasSinTimeline.slice(mitad);

  let nombreCreador = 'el anfitrión';
  try {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData && userData.nombre) {
      nombreCreador = userData.nombre;
    }
  } catch (error) {
    console.error("No se pudo leer el usuario del localStorage");
  }

  const esUrlImagen = (valor) => {
    return typeof valor === 'string' && (valor.includes('/uploads/') || valor.match(/\.(jpeg|jpg|gif|png|webp)$/i) || valor.match(/^https?:\/\//i));
  };

  const formatearUrlImagen = (ruta) => {
    if (!ruta) return '';
    if (ruta.startsWith('http')) return ruta;
    return `http://localhost:3300/${ruta.replace(/^\//, '')}`;
  };

  const renderizarValor = (valor, esIzquierda, clave) => {
    const textColor = esIzquierda ? 'text-pink-400' : 'text-sky-400';

    if (typeof valor === 'boolean') {
      return (
        <span className={`font-serif font-medium text-[#252525] ${esModoPDF ? 'text-sm' : 'text-sm sm:text-base'}`}>
          {valor ? 'Sí' : 'No'}
        </span>
      );
    }

    if (esUrlImagen(valor)) {
      if (esModoPDF) {
        return (
          <div className={`mt-3 w-full bg-white p-2 shadow-md border border-gray-100 rounded-xl`}>
            <div 
              className="w-full rounded-lg"
              style={{
                height: '180px',
                backgroundImage: `url(${formatearUrlImagen(valor)})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                display: 'block'
              }}
            />
          </div>
        );
      }
      return (
        <div className={`mt-3 w-full bg-white p-2 sm:p-3 shadow-md border border-gray-100 rounded-xl ${esIzquierda ? '-rotate-2' : 'rotate-2 sm:hover:rotate-0 transition-transform'}`}>
          <img src={formatearUrlImagen(valor)} alt={clave} crossOrigin="anonymous" className="w-full h-auto max-h-48 object-cover rounded-lg" />
        </div>
      );
    }
    
    if (Array.isArray(valor)) {
      return (
        <ul className="mt-2 w-full space-y-1.5 font-sans">
          {valor.map((item, i) => (
            <li key={i} className="flex gap-2 items-start text-xs sm:text-sm text-gray-600">
              <span className={`font-black ${textColor}`}>•</span> {item}
            </li>
          ))}
        </ul>
      );
    }
    
    return <span className={`font-serif font-medium text-[#252525] block ${esModoPDF ? 'text-sm' : 'text-sm sm:text-base'}`}>{valor}</span>;
  };

  return (
    <div className={`w-full mx-auto flex flex-col relative overflow-hidden ${esModoPDF ? 'pb-0 max-w-[700px]' : 'pb-10 sm:pb-20 max-w-4xl'}`}>
      
      <div className="flex items-center justify-center sm:justify-start gap-3 mb-4 sm:mb-6 px-2 relative z-10">
        <span className="text-gray-400 font-bold text-[9px] sm:text-[10px] uppercase tracking-widest">Generado con</span>
        <img src="/logo_CWM_oficial.png" alt="Come With Me" className="h-6 sm:h-8 w-auto object-contain" />
      </div>

      {/* 1. TÍTULO Y MENSAJE */}
      <ComponenteAnimado {...animationProps} className="text-center px-4 relative z-10">
        <h1 className={`font-black mb-3 sm:mb-4 px-2 pb-2 sm:pb-3 leading-tight ${esModoPDF ? 'text-4xl text-[#252525]' : 'text-3xl sm:text-4xl md:text-5xl bg-gradient-to-r from-sky-500 via-pink-300 to-sky-500 bg-clip-text text-transparent'}`}>
          {invitacion.titulo}
        </h1>
        <p className={`${esModoPDF ? 'text-base mt-2' : 'text-sm sm:text-lg md:text-xl'} text-gray-600 font-serif leading-relaxed sm:leading-loose max-w-3xl mx-auto whitespace-pre-wrap`}>
          {invitacion.mensaje}
        </p>
      </ComponenteAnimado>

      {/* 2. COLLAGE VISUAL */}
      {urlImagen && (
        <ComponenteAnimado {...animationProps} className={`relative w-full flex justify-center items-center ${esModoPDF ? 'py-14 my-6' : 'py-8 sm:py-12 md:py-16 my-2 sm:my-4'} z-10`}>
          <svg className="absolute w-full h-full text-pink-100 -z-10" viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M 0,100 C 100,200 300,0 400,100" stroke="currentColor" strokeWidth="4" strokeDasharray="10 10" strokeLinecap="round" />
          </svg>
          
          <div className={`absolute w-32 h-32 md:w-56 md:h-56 bg-white p-1.5 sm:p-2 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 z-0 left-2 sm:left-4 md:left-12 opacity-50 ${esModoPDF ? 'w-48 h-48 left-10 transform -rotate-12' : 'hidden sm:block -rotate-12'}`}>
            <div className="w-full h-full rounded-lg sm:rounded-xl grayscale" style={{ backgroundImage: `url(${urlImagen})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
          </div>
          
          <div className={`absolute w-32 h-32 md:w-56 md:h-56 bg-white p-1.5 sm:p-2 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 z-0 right-2 sm:right-4 md:right-12 opacity-50 ${esModoPDF ? 'w-48 h-48 right-10 transform rotate-12' : 'hidden sm:block rotate-12'}`}>
            <div className="w-full h-full rounded-lg sm:rounded-xl grayscale" style={{ backgroundImage: `url(${urlImagen})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
          </div>
          
          <div className={`relative z-10 w-[85%] max-w-[280px] sm:max-w-none sm:w-56 sm:h-56 md:w-80 md:h-80 bg-white p-2.5 sm:p-3 md:p-4 rounded-[1.5rem] sm:rounded-3xl shadow-2xl border border-sky-50 ${esModoPDF ? 'w-64 h-64 mx-auto' : 'sm:rotate-2 sm:hover:rotate-0 transition-transform duration-500'}`}>
            <div className={`w-full ${esModoPDF ? 'h-full' : 'h-48 sm:h-full'} rounded-[1rem] sm:rounded-2xl`} style={{ backgroundImage: `url(${urlImagen})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
          </div>
        </ComponenteAnimado>
      )}

      {/* 3. FECHA Y LUGAR */}
      <ComponenteAnimado {...animationProps} style={{ pageBreakInside: 'avoid' }} className={`w-full relative z-10 px-2 ${esModoPDF ? 'mb-12 mt-6' : 'mb-8 sm:mb-10 mt-4 sm:mt-6'}`}>
        <div className={`flex bg-white rounded-[1.5rem] sm:rounded-[2rem] shadow-md border border-gray-100 overflow-hidden ${esModoPDF ? 'flex-row' : 'flex-col md:flex-row'}`}>
          <div className={`w-full p-5 sm:p-6 md:p-8 bg-pink-50 border-pink-100 flex flex-col justify-center text-center ${esModoPDF ? 'w-1/2 border-r items-center' : 'md:w-1/2 border-b md:border-b-0 md:border-r items-center sm:items-start sm:text-left'}`}>
            <span className="text-pink-400 uppercase text-[9px] sm:text-[10px] font-black tracking-widest mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-pink-400"></span> Día del evento
            </span>
            <div className={`font-black text-[#252525] ${esModoPDF ? 'text-2xl mt-1' : 'text-xl sm:text-2xl md:text-3xl'}`}>
              {new Date(invitacion.fecha_evento).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
            </div>
            {invitacion.hora_inicio && (
              <div className={`mt-1 sm:mt-2 text-pink-500 font-bold ${esModoPDF ? 'text-lg' : 'text-base sm:text-lg md:text-xl'}`}>
                A las {invitacion.hora_inicio.slice(0, 5)} h
              </div>
            )}
          </div>
          <div className={`w-full p-5 sm:p-6 md:p-8 bg-sky-50 flex flex-col justify-center text-center ${esModoPDF ? 'w-1/2 items-center' : 'md:w-1/2 items-center sm:items-start sm:text-left'}`}>
            <span className="text-sky-400 uppercase text-[9px] sm:text-[10px] font-black tracking-widest mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-400"></span> Coordenadas
            </span>
            <div className={`font-black text-[#252525] ${esModoPDF ? 'text-2xl mt-1' : 'text-xl sm:text-2xl md:text-3xl'}`}>
              {invitacion.lugar}
            </div>
            <div className="mt-2 sm:mt-3">
              <span className="px-2.5 sm:px-3 py-1 bg-white text-sky-500 rounded-full text-[9px] sm:text-[10px] font-bold border border-sky-100 uppercase tracking-wider">
                Ubicación Oficial
              </span>
            </div>
          </div>
        </div>
      </ComponenteAnimado>

      {/* 4. TIMELINE */}
      {timelineData && (
        <ComponenteAnimado {...animationProps} className="w-full relative z-10 px-2 mt-2 sm:mt-4">
           {renderizarTimeline(timelineData, tituloTimeline, 'Narrativa', esModoPDF)}
        </ComponenteAnimado>
      )}

      {/* 5. LISTA A DOS COLUMNAS */}
      {entradasSinTimeline.length > 0 && (
        <ComponenteAnimado {...animationProps} className={`px-2 w-full relative z-10 ${esModoPDF ? 'mt-8' : ''}`}>
          <h3 className="text-center text-gray-400 font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[9px] sm:text-[10px] md:text-xs mb-5 sm:mb-8 border-b border-gray-100 pb-3 sm:pb-4">
            Notas de la historia
          </h3>
          
          <div className={`flex items-start w-full ${esModoPDF ? 'flex-row gap-8' : 'flex-col sm:flex-row gap-4 sm:gap-6 md:gap-12'}`}>
            
            <div className={`flex flex-col gap-3 sm:gap-4 ${esModoPDF ? 'w-1/2' : 'w-full sm:w-1/2'}`}>
              {extraIzquierda.map(([clave, valor]) => (
                <div key={clave} className="flex items-start gap-3 sm:gap-4 bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-gray-50 shadow-sm w-full" style={esModoPDF ? { pageBreakInside: 'avoid' } : {}}>
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-500 shrink-0 mt-0.5 font-bold text-xs sm:text-base">★</div>
                  <div className="flex flex-col w-full">
                    <span className="text-[8px] sm:text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5 sm:mb-1">{clave}</span>
                    {renderizarValor(valor, true, clave)}
                  </div>
                </div>
              ))}
            </div>

            <div className={`flex flex-col gap-3 sm:gap-4 ${esModoPDF ? 'w-1/2' : 'w-full sm:w-1/2'}`}>
              {extraDerecha.map(([clave, valor]) => (
                <div key={clave} className="flex items-start gap-3 sm:gap-4 bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-gray-50 shadow-sm w-full" style={esModoPDF ? { pageBreakInside: 'avoid' } : {}}>
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-sky-100 flex items-center justify-center text-sky-500 shrink-0 mt-0.5 font-bold text-xs sm:text-base">★</div>
                  <div className="flex flex-col w-full">
                    <span className="text-[8px] sm:text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5 sm:mb-1">{clave}</span>
                    {renderizarValor(valor, false, clave)}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </ComponenteAnimado>
      )}

      {/* FOOTER CREADOR Y MARCA DE AGUA */}
      <ComponenteAnimado {...animationProps} style={esModoPDF ? { pageBreakInside: 'avoid', marginTop: '50px' } : {}} className="text-center mt-10 sm:mt-12 flex flex-col items-center justify-center relative z-10 w-full">
        <div className="w-16 sm:w-24 h-[1px] bg-gray-200 mb-4 sm:mb-6" />
        <p className="text-gray-400 font-serif italic text-xs sm:text-sm mb-3 sm:mb-4">
          Un evento organizado por <span className="font-bold text-gray-600 not-italic">{nombreCreador}</span>
        </p>
        <img src="/logo_CWM_largo.png" alt="Come With Me" className="w-32 sm:w-48 opacity-70 object-contain grayscale" />
      </ComponenteAnimado>

    </div>
  );
};

export default PlantillaNarrativa;