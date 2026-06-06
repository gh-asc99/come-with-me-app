import React from 'react';
import { motion } from 'framer-motion';

const PlantillaClasica = ({ invitacion, urlImagen, esModoPDF = false }) => {
  
  const ComponenteAnimado = esModoPDF ? 'div' : motion.div;

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

  const renderizarValor = (valor) => {
    if (typeof valor === 'boolean') {
      return (
        <span className={`inline-block px-2.5 sm:px-3 py-1 rounded-full text-[9px] sm:text-[10px] md:text-xs font-bold font-sans mt-1.5 ${valor ? 'bg-white text-pink-300' : 'bg-black/20 text-white'}`}>
          {valor ? 'Sí, incluido' : 'No incluido'}
        </span>
      );
    }
    
    if (esUrlImagen(valor)) {
      return (
        <div className="mt-3 w-full rounded-xl overflow-hidden border border-white/20 shadow-md">
          <img src={formatearUrlImagen(valor)} alt="Imagen extra" crossOrigin="anonymous" className="w-full h-auto max-h-48 object-cover" />
        </div>
      );
    }

    if (Array.isArray(valor)) {
      if (valor.length > 0 && valor[0].hora !== undefined) {
        return (
          <ul className="mt-3 border-l-2 border-white/40 pl-3 sm:pl-4 space-y-3 font-sans w-full">
            {valor.map((fase, i) => (
              <li key={i} className="flex flex-col relative w-full">
                <span className="absolute -left-[17px] sm:-left-[21px] top-1.5 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-white rounded-full shadow-[0_0_5px_rgba(255,255,255,0.8)]"></span>
                <span className="font-black text-pink-200 text-[10px] sm:text-xs tracking-wider">{fase.hora}</span>
                <span className="text-white text-xs sm:text-sm font-medium leading-tight mt-0.5">{fase.titulo}</span>
              </li>
            ))}
          </ul>
        );
      }
      return (
        <ul className="mt-2 list-disc pl-4 sm:pl-5 space-y-1 font-sans text-xs sm:text-sm text-white/90">
          {valor.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      );
    }
    
    return <span className="font-serif leading-relaxed sm:leading-snug text-sm sm:text-base">{valor}</span>;
  };

  return (
    <div className={`w-full mx-auto flex flex-col relative overflow-hidden ${esModoPDF ? 'gap-8 pb-0 max-w-[700px]' : 'gap-8 sm:gap-10 pb-10 sm:pb-20 max-w-4xl'}`}>

      <div className="flex items-center justify-center sm:justify-start gap-3 mb-2 sm:mb-4 px-2 relative z-10">
        <span className="text-gray-400 font-bold text-[9px] sm:text-[10px] uppercase tracking-widest">Generado con</span>
        <img 
          src="/logo_CWM_oficial.png" 
          alt="Come With Me" 
          className="h-6 sm:h-8 w-auto object-contain" 
        />
      </div>

      {/* 1. IMAGEN */}
      {urlImagen && (
        <ComponenteAnimado {...animationProps} className="relative w-full flex justify-center z-10 px-2 sm:px-0">
          <img 
            src={urlImagen} 
            alt="Portada" 
            className="w-full sm:max-w-full max-h-[250px] sm:max-h-[350px] object-cover sm:object-contain rounded-[1.5rem] sm:rounded-[2rem] shadow-xl bg-white" 
            crossOrigin="anonymous" 
          />
        </ComponenteAnimado>
      )}

      {/* 2. CABECERA */}
      <ComponenteAnimado {...animationProps} className="text-center px-4 sm:px-2 relative z-10 mt-2 sm:mt-0">
        <h1 className={`font-black mb-3 sm:mb-4 px-2 pb-2 sm:pb-3 leading-tight ${esModoPDF ? 'text-4xl text-[#252525]' : 'text-3xl sm:text-5xl md:text-6xl bg-gradient-to-r from-sky-500 via-pink-300 to-sky-500 bg-clip-text text-transparent'}`}>
          {invitacion.titulo}
        </h1>
        <p className={`${esModoPDF ? 'text-base md:text-lg' : 'text-sm sm:text-lg md:text-xl'} text-gray-700 font-serif leading-relaxed sm:leading-loose max-w-3xl mx-auto whitespace-pre-wrap text-left md:text-center px-2`}>
          {invitacion.mensaje}
        </p>
        <div className="w-12 sm:w-16 h-1 bg-gradient-to-r from-sky-300 to-pink-300 mx-auto mt-4 sm:mt-6 rounded-full opacity-50" />
      </ComponenteAnimado>

      {/* 3. TIEMPO Y LUGAR */}
      <ComponenteAnimado 
        {...animationProps} 
        style={{ pageBreakInside: 'avoid' }} 
        className={`grid grid-cols-1 sm:grid-cols-2 ${esModoPDF ? 'grid-cols-2 gap-4' : 'gap-4 sm:gap-6'} px-2 relative z-10`}
      >
        <div className="bg-gradient-to-br from-sky-400 to-sky-600 p-5 sm:p-6 rounded-[1.5rem] shadow-md text-white flex flex-col items-center justify-center text-center">
          <span className="text-sky-100 uppercase text-[9px] sm:text-[10px] font-black tracking-[0.2em] mb-1 sm:mb-2">¿Cuándo nos vemos?</span>
          <div className={`font-bold ${esModoPDF ? 'text-lg' : 'text-lg sm:text-xl md:text-2xl'}`}>
            {new Date(invitacion.fecha_evento).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>
          {invitacion.hora_inicio && (
            <div className={`font-black ${esModoPDF ? 'mt-1 text-3xl' : 'mt-1 sm:mt-2 text-3xl md:text-4xl'}`}>
              {invitacion.hora_inicio.slice(0, 5)} <span className={`${esModoPDF ? 'text-base' : 'text-base sm:text-lg'} font-normal opacity-80`}>h</span>
            </div>
          )}
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-[1.5rem] shadow-md border border-sky-100 flex flex-col items-center justify-center text-center">
          <span className="text-sky-400 uppercase text-[9px] sm:text-[10px] font-black tracking-[0.2em] mb-1 sm:mb-2">¿Dónde será?</span>
          <p className={`font-black text-[#252525] ${esModoPDF ? 'text-xl' : 'text-lg sm:text-xl md:text-2xl'}`}>
            {invitacion.lugar}
          </p>
          <div className="mt-3 sm:mt-4 px-3 py-1 sm:px-4 sm:py-1.5 bg-sky-50 text-sky-500 rounded-full text-[9px] sm:text-[10px] md:text-xs font-bold border border-sky-100 inline-block leading-none uppercase tracking-wider">
            Punto de encuentro
          </div>
        </div>
      </ComponenteAnimado>

      {/* 4. SUGERENCIAS */}
      {invitacion.datos_extra && Object.keys(invitacion.datos_extra).length > 0 && (
        <ComponenteAnimado 
          {...animationProps} 
          style={{ pageBreakInside: 'avoid' }} 
          className="px-2 mt-4 sm:mt-6 relative z-10"
        >
          <div className="bg-gradient-to-br from-pink-300 to-pink-500 px-5 sm:px-6 pb-6 sm:pb-8 md:px-8 md:pb-10 rounded-[1.5rem] sm:rounded-[2rem] shadow-md border border-pink-300 text-white relative">
            <div className="flex justify-center -mt-4 sm:-mt-5 mb-5 sm:mb-6 md:-mt-6 md:mb-8">
              <h3 className="bg-white text-pink-300 font-black uppercase tracking-[0.2em] text-[9px] sm:text-[10px] md:text-xs py-1.5 sm:py-2 px-4 sm:px-6 rounded-full shadow-sm border border-pink-100">
                Más detalles del evento
              </h3>
            </div>
            
            <div className={`columns-1 ${esModoPDF ? 'columns-2' : 'sm:columns-2'} gap-4 sm:gap-4 md:gap-6 space-y-4 sm:space-y-4 md:space-y-6`}>
              {Object.entries(invitacion.datos_extra).map(([clave, valor]) => (
                <div 
                  key={clave} 
                  className={`break-inside-avoid inline-block rounded-[1rem] sm:rounded-xl p-4 sm:p-5 border border-white/20 w-full ${esModoPDF ? 'bg-pink-300' : 'bg-white/10 backdrop-blur-md hover:bg-white/20 transition-colors'}`}
                >
                  <span className="block text-[8px] sm:text-[9px] md:text-[10px] font-bold text-pink-100 uppercase mb-1.5 sm:mb-2 tracking-[0.1em] sm:tracking-[0.15em]">
                    {clave}
                  </span>
                  <div className="text-sm sm:text-base md:text-lg text-white font-serif leading-snug w-full">
                    {renderizarValor(valor)}
                  </div>
                </div>
              ))}
            </div>
            
          </div>
        </ComponenteAnimado>
      )}

      {/* FOOTER CREADOR Y MARCA DE AGUA */}
      <ComponenteAnimado 
        {...animationProps} 
        style={{ pageBreakInside: 'avoid' }} 
        className="text-center mt-8 sm:mt-12 flex flex-col items-center justify-center relative z-10 w-full"
      >
        <p className="text-gray-500 font-serif italic text-xs sm:text-sm mb-3 sm:mb-4">
          Invitación creada por <span className="font-bold text-gray-700 not-italic">{nombreCreador}</span>
        </p>
        <img 
          src="/logo_CWM_largo.png" 
          alt="Come With Me" 
          className="w-32 sm:w-48 opacity-70 object-contain grayscale" 
        />
      </ComponenteAnimado>
      
    </div>
  );
};

export default PlantillaClasica;