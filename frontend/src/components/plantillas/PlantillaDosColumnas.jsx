// src/components/plantillas/PlantillaDosColumnas.jsx
import React from 'react';
import { motion } from 'framer-motion';

const PlantillaDosColumnas = ({ invitacion, urlImagen, esModoPDF = false }) => {
  
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

  const entradasExtra = Object.entries(invitacion.datos_extra || {});
  const mitad = Math.ceil(entradasExtra.length / 2);
  const extraIzquierda = entradasExtra.slice(0, mitad);
  const extraDerecha = entradasExtra.slice(mitad);

  let nombreCreador = 'el anfitrión';
  try {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData && userData.nombre) {
      nombreCreador = userData.nombre;
    }
  } catch (error) {
    console.error("No se pudo leer el usuario del localStorage");
  }

  // --- DETECTOR DE IMÁGENES ---
  const esUrlImagen = (valor) => {
    return typeof valor === 'string' && (valor.includes('/uploads/') || valor.match(/\.(jpeg|jpg|gif|png|webp)$/i) || valor.match(/^https?:\/\//i));
  };

  const formatearUrlImagen = (ruta) => {
    if (!ruta) return '';
    if (ruta.startsWith('http')) return ruta;
    return `http://localhost:3300/${ruta.replace(/^\//, '')}`;
  };

  // --- RENDERIZADOR MAGICO PARA DATOS COMPLEJOS ---
  const renderizarValor = (valor) => {
    if (typeof valor === 'boolean') {
      return (
        <span className={`${valor ? 'text-pink-600 font-bold' : 'text-gray-500'}`}>
          {valor ? 'Sí, muy importante' : 'No incluido'}
        </span>
      );
    }

    if (esUrlImagen(valor)) {
      return (
        <img 
          src={formatearUrlImagen(valor)} 
          alt="Sugerencia Visual" 
          crossOrigin="anonymous" 
          className="mt-3 w-full h-48 sm:h-56 object-cover rounded-xl shadow-sm border border-pink-100" 
        />
      );
    }
    
    if (Array.isArray(valor)) {
      if (valor.length > 0 && valor[0].hora !== undefined) {
        return (
          <div className="mt-2 ml-1 border-l-2 border-pink-200 pl-3 space-y-2 py-1 font-sans w-full">
            {valor.map((fase, i) => (
              <div key={i} className="relative w-full">
                <span className="absolute -left-[17px] top-1.5 w-1.5 h-1.5 rounded-full bg-pink-400"></span>
                <span className="font-black text-pink-500 text-[10px] md:text-xs block leading-none mb-0.5">{fase.hora}</span>
                <span className="text-gray-700 text-xs md:text-sm leading-tight block">{fase.titulo}</span>
              </div>
            ))}
          </div>
        );
      }
      return (
        <ul className="mt-1 space-y-1 font-sans w-full pl-1">
          {valor.map((item, i) => (
            <li key={i} className="flex gap-2 items-start text-gray-700 text-xs md:text-sm">
              <span className="text-pink-300 font-bold shrink-0">-</span> 
              <span className="flex-1">{item}</span>
            </li>
          ))}
        </ul>
      );
    }
    
    return <span className="block text-sm sm:text-base leading-snug">{valor}</span>;
  };

  const BloqueSugerencias = ({ titulo, items }) => (
    <div className="bg-gradient-to-br from-pink-50 to-white p-4 sm:p-5 rounded-[1.2rem] sm:rounded-[1.5rem] border border-pink-100 shadow-sm w-full">
      <h3 className="text-pink-500 font-black uppercase tracking-[0.2em] text-[9px] sm:text-[10px] mb-3 sm:mb-4 border-b border-pink-100 pb-2">
        {titulo}
      </h3>
      <div className="flex flex-col gap-3 sm:gap-4 w-full">
        {items.map(([clave, valor]) => (
          <div key={clave} className="flex items-start break-inside-avoid w-full">
            <span className="h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-pink-400 text-white flex items-center justify-center mr-2.5 sm:mr-3 flex-shrink-0 mt-0.5 text-[8px] sm:text-[10px] shadow-sm">
              ✓
            </span>
            <div className="flex-1 w-full overflow-hidden">
              <span className="block text-[8px] sm:text-[9px] font-bold text-gray-400 uppercase tracking-wider">{clave}</span>
              <div className={`${esModoPDF ? 'text-xs' : 'text-sm'} text-gray-800 font-serif font-medium mt-0.5 w-full`}>
                {renderizarValor(valor)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className={`w-full mx-auto flex flex-col relative overflow-hidden ${esModoPDF ? 'pb-0 max-w-[700px]' : 'pb-10 sm:pb-20 max-w-5xl px-2 sm:px-4'}`}>
      
      {/* HEADER: Logo y "Generado con" */}
      <div className="flex items-center justify-center sm:justify-start gap-3 mb-4 sm:mb-6 px-2 relative z-10">
        <span className="text-gray-400 font-bold text-[9px] sm:text-[10px] uppercase tracking-widest">Generado con</span>
        <img src="/logo_CWM_oficial.png" alt="Come With Me" className="h-6 sm:h-8 w-auto object-contain" />
      </div>

      <div className={`relative z-10 flex ${esModoPDF ? 'flex-row gap-6' : 'flex-col md:flex-row gap-6 sm:gap-10'} items-start w-full`}>
        
        {/* --- COLUMNA IZQUIERDA (50%) --- */}
        <div className={`flex flex-col ${esModoPDF ? 'w-1/2 gap-6' : 'w-full md:w-1/2 gap-6 sm:gap-8'}`}>
          
          <ComponenteAnimado {...animationProps} className="text-center sm:text-left px-2 sm:px-0">
            <h1 className={`font-black mb-3 sm:mb-4 leading-tight ${esModoPDF ? 'text-3xl text-[#252525]' : 'text-3xl sm:text-4xl md:text-5xl bg-gradient-to-r from-sky-500 via-pink-300 to-sky-500 bg-clip-text text-transparent'}`}>
              {invitacion.titulo}
            </h1>
            <p className={`${esModoPDF ? 'text-sm' : 'text-sm sm:text-base md:text-lg'} text-gray-700 font-serif leading-relaxed sm:leading-loose whitespace-pre-wrap`}>
              {invitacion.mensaje}
            </p>
          </ComponenteAnimado>

          {extraIzquierda.length > 0 && (
            <ComponenteAnimado {...animationProps} style={{ pageBreakInside: 'avoid' }} className="w-full">
              <BloqueSugerencias titulo="Detalles del evento" items={extraIzquierda} />
            </ComponenteAnimado>
          )}
        </div>

        {/* --- COLUMNA DERECHA (50%) --- */}
        <div className={`flex flex-col ${esModoPDF ? 'w-1/2 gap-6' : 'w-full md:w-1/2 gap-6 sm:gap-8'}`}>
          
          {urlImagen && (
            <ComponenteAnimado {...animationProps} className="w-full shadow-md rounded-[1.5rem] sm:rounded-[2rem]">
              {esModoPDF ? (
                <div 
                  className="w-full h-[250px] rounded-[2rem] bg-white"
                  style={{
                    backgroundImage: `url(${urlImagen})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                />
              ) : (
                <img 
                  src={urlImagen} 
                  alt="Portada" 
                  className="w-full h-56 sm:h-64 md:h-[300px] object-cover rounded-[1.5rem] sm:rounded-[2rem] bg-white" 
                  crossOrigin="anonymous" 
                />
              )}
            </ComponenteAnimado>
          )}

          {/* TEMPORAL Y LUGAR */}
          <ComponenteAnimado {...animationProps} style={{ pageBreakInside: 'avoid' }} className="flex flex-col gap-3 sm:gap-4">
            <div className="bg-gradient-to-br from-sky-400 to-sky-600 p-4 sm:p-5 rounded-[1.2rem] sm:rounded-[1.5rem] shadow-md text-white flex flex-col items-center justify-center text-center">
              <span className="text-sky-100 uppercase text-[8px] sm:text-[9px] font-black tracking-[0.2em] mb-1">¿Cuándo nos vemos?</span>
              <div className={`font-bold ${esModoPDF ? 'text-sm' : 'text-base sm:text-lg'}`}>
                {new Date(invitacion.fecha_evento).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
              </div>
              {invitacion.hora_inicio && (
                <div className={`font-black ${esModoPDF ? 'mt-1 text-2xl' : 'mt-1 text-2xl sm:text-3xl'}`}>
                  {invitacion.hora_inicio.slice(0, 5)} <span className={`${esModoPDF ? 'text-sm' : 'text-sm sm:text-lg'} font-normal opacity-80`}>h</span>
                </div>
              )}
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-[1.2rem] sm:rounded-[1.5rem] shadow-md border border-sky-100 flex flex-col items-center justify-center text-center">
              <span className="text-sky-400 uppercase text-[8px] sm:text-[9px] font-black tracking-[0.2em] mb-1">¿Dónde será?</span>
              <p className={`font-black text-[#252525] ${esModoPDF ? 'text-lg' : 'text-lg sm:text-xl'}`}>
                {invitacion.lugar}
              </p>
              <div className="mt-2 sm:mt-3 px-3 py-1.5 bg-sky-50 text-sky-500 rounded-full text-[9px] sm:text-[10px] font-bold border border-sky-100 inline-block leading-none uppercase tracking-wider">
                Punto de encuentro
              </div>
            </div>
          </ComponenteAnimado>

          {extraDerecha.length > 0 && (
            <ComponenteAnimado {...animationProps} style={{ pageBreakInside: 'avoid' }} className="w-full">
              <BloqueSugerencias titulo="Más información" items={extraDerecha} />
            </ComponenteAnimado>
          )}
        </div>

      </div>

      {/* FOOTER CREADOR Y MARCA DE AGUA */}
      <ComponenteAnimado 
        {...animationProps} 
        style={{ pageBreakInside: 'avoid' }} 
        className="text-center mt-10 sm:mt-12 flex flex-col items-center justify-center relative z-10 w-full"
      >
        <p className="text-gray-500 font-serif italic text-xs sm:text-sm mb-3 sm:mb-4">
          Invitación creada por <span className="font-bold text-gray-700 not-italic">{nombreCreador}</span>
        </p>
        <img src="/logo_CWM_largo.png" alt="Come With Me" className="w-32 sm:w-48 opacity-70 object-contain grayscale" />
      </ComponenteAnimado>
      
    </div>
  );
};

export default PlantillaDosColumnas;