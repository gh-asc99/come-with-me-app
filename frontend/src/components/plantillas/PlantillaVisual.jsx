import React from 'react';
import { motion } from 'framer-motion';

const PlantillaVisual = ({ invitacion, urlImagen, esModoPDF = false }) => {
  
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
  let rolUsuario = 'user';
  try {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
      if (userData.nombre) nombreCreador = userData.nombre;
      if (userData.rol) rolUsuario = userData.rol;
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
    const colorBg = esIzquierda ? 'bg-pink-50' : 'bg-sky-50';
    const colorText = esIzquierda ? 'text-pink-500' : 'text-sky-500';
    const colorBorder = esIzquierda ? 'border-pink-100' : 'border-sky-100';

    if (typeof valor === 'boolean') {
      return (
        <span className={`font-serif font-medium text-[#252525] block ${esModoPDF ? 'text-sm' : 'text-sm sm:text-base'}`}>
          {valor ? 'Sí' : 'No'}
        </span>
      );
    }

    if (esUrlImagen(valor)) {
      if (esModoPDF) {
        return (
          <div className="mt-3 w-full rounded-2xl overflow-hidden border-[3px] border-white shadow-md bg-white relative z-10">
             <div 
              className="w-full"
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
        <div className="mt-3 w-full rounded-2xl overflow-hidden border-[3px] border-white shadow-md bg-white relative z-10">
          <img src={formatearUrlImagen(valor)} alt={clave} crossOrigin="anonymous" className="w-full h-auto max-h-48 object-cover" />
        </div>
      );
    }

    if (Array.isArray(valor)) {
      if (valor.length > 0 && valor[0].hora !== undefined) {
        return (
          <div className="mt-3 w-full flex flex-col gap-2.5 font-sans relative z-10">
            {valor.map((fase, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 bg-white/50 p-2.5 rounded-xl border border-gray-100/50 shadow-[0_2px_10px_rgba(0,0,0,0.02)] break-inside-avoid" style={esModoPDF ? { pageBreakInside: 'avoid' } : {}}>
                <div className={`w-fit px-2.5 py-1 rounded-lg ${colorBg} ${colorText} font-black text-[10px] tracking-wider shrink-0`}>
                  {fase.hora}
                </div>
                <div className="text-gray-700 text-xs sm:text-sm font-medium leading-tight">{fase.titulo}</div>
              </div>
            ))}
          </div>
        );
      }
      return (
        <div className="mt-2 w-full flex flex-wrap gap-2 font-sans relative z-10">
          {valor.map((item, i) => (
            <span key={i} className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[9px] sm:text-[10px] md:text-xs font-bold border bg-white shadow-sm ${colorText} ${colorBorder}`} style={esModoPDF ? { pageBreakInside: 'avoid', display: 'inline-block', marginBottom: '4px' } : {}}>
              {item}
            </span>
          ))}
        </div>
      );
    }
    
    return <span className={`font-serif font-medium text-[#252525] block relative z-10 ${esModoPDF ? 'text-sm' : 'text-sm sm:text-base'}`}>{valor}</span>;
  };

  return (
    // EL CONTENEDOR PRINCIPAL AHORA TIENE POSICION RELATIVA
    <div className={`w-full mx-auto flex flex-col relative ${esModoPDF ? 'pb-0 max-w-[700px] min-h-screen' : 'pb-10 sm:pb-20 max-w-4xl px-2 sm:px-4 overflow-hidden'}`}>

      {/* MARCA DE AGUA (SOLO PDF Y USUARIOS GRATIS) */}
      {esModoPDF && rolUsuario === 'user' && (
        <div 
          className="absolute z-0 pointer-events-none opacity-[0.20]"
          style={{
            top: 0,
            left: '-50%',
            right: '-50%',
            bottom: '-100%', 
            backgroundImage: 'url(/logo_CWM_oficial.png)',
            backgroundSize: '350px',
            backgroundRepeat: 'repeat',
            transform: 'rotate(-25deg)',
            transformOrigin: 'center center'
          }}
        />
      )}

      <div className="flex items-center justify-center sm:justify-start gap-3 mb-6 sm:mb-8 px-2 relative z-10">
        <span className="text-gray-400 font-bold text-[9px] sm:text-[10px] uppercase tracking-widest">Generado con</span>
        <img src="/logo_CWM_oficial.png" alt="Come With Me" className="h-6 sm:h-8 w-auto object-contain" />
      </div>

      {/* 1. SECCIÓN SUPERIOR */}
      <div className={`relative z-10 flex w-full ${esModoPDF ? 'flex-row gap-8 items-center' : 'flex-col sm:flex-row gap-8 sm:gap-12 items-center sm:items-center'}`}>
        
        <div className={`relative ${esModoPDF ? 'w-[45%]' : 'w-full sm:w-[45%] max-w-[280px] sm:max-w-none'} flex justify-center`}>
          <ComponenteAnimado {...animationProps} className="relative w-full">
            <div className="absolute inset-0 bg-sky-200 translate-x-3 translate-y-3 sm:translate-x-4 sm:translate-y-4 rounded-[1.5rem] sm:rounded-3xl -z-10" />
            {urlImagen ? (
              esModoPDF ? (
                <div 
                  className="w-full rounded-[1.5rem] bg-white shadow-lg border-2 border-white relative z-10"
                  style={{ 
                    height: '280px',
                    backgroundImage: `url(${urlImagen})`, 
                    backgroundSize: 'cover', 
                    backgroundPosition: 'center', 
                    backgroundRepeat: 'no-repeat' 
                  }}
                />
              ) : (
                <img src={urlImagen} alt="Portada" className="w-full h-56 sm:h-64 md:h-[320px] object-cover rounded-[1.5rem] sm:rounded-3xl bg-white shadow-lg border-2 border-white relative z-10" crossOrigin="anonymous" />
              )
            ) : (
              <div className="w-full h-56 sm:h-[280px] rounded-[1.5rem] sm:rounded-3xl bg-gray-100 flex items-center justify-center border-2 border-white shadow-lg relative z-10">
                <span className="text-gray-300 font-bold text-sm sm:text-base">Sin imagen</span>
              </div>
            )}
          </ComponenteAnimado>
        </div>

        <div className={`flex flex-col text-center sm:text-left ${esModoPDF ? 'w-[55%]' : 'w-full sm:w-[55%]'}`}>
          <ComponenteAnimado {...animationProps} className="relative z-10 bg-white/40 backdrop-blur-sm p-4 rounded-2xl">
            <h1 className={`font-black mb-4 sm:mb-6 px-2 pb-2 sm:pb-3 leading-tight ${esModoPDF ? 'text-3xl text-[#252525]' : 'text-3xl sm:text-4xl md:text-5xl bg-gradient-to-r from-pink-300 to-sky-500 bg-clip-text text-transparent'}`}>
              {invitacion.titulo}
            </h1>
            <p className={`${esModoPDF ? 'text-sm' : 'text-sm sm:text-base md:text-lg'} text-gray-700 font-serif leading-relaxed sm:leading-loose whitespace-pre-wrap px-2`}>
              {invitacion.mensaje}
            </p>
          </ComponenteAnimado>
        </div>

      </div>

      {/* LÍNEA CONECTORA */}
      <ComponenteAnimado {...animationProps} className="w-full h-12 sm:h-16 md:h-24 relative my-4 flex justify-center overflow-hidden -z-10 opacity-60">
        <svg viewBox="0 0 400 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-pink-200">
          <path d="M 50,0 C 50,80 350,20 350,100" stroke="currentColor" strokeWidth="4" strokeDasharray="10 10" strokeLinecap="round" />
        </svg>
      </ComponenteAnimado>

      {/* 2. SECCIÓN MEDIA: Fecha y Lugar */}
      <ComponenteAnimado {...animationProps} style={esModoPDF ? { pageBreakInside: 'avoid' } : {}} className={`grid ${esModoPDF ? 'grid-cols-2 gap-6' : 'grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6'} px-2 relative z-10 w-full`}>
        <div className="bg-white/90 backdrop-blur-sm p-5 sm:p-6 md:p-8 rounded-[1.5rem] sm:rounded-[2rem] shadow-sm border-2 border-pink-100 flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="absolute -top-6 -right-6 sm:-top-10 sm:-right-10 w-16 h-16 sm:w-24 sm:h-24 bg-pink-50 rounded-full -z-10" />
          <span className="text-pink-400 uppercase text-[9px] sm:text-[10px] font-black tracking-[0.2em] mb-2 sm:mb-3 relative z-10">¿Cuándo nos vemos?</span>
          <div className={`font-black text-[#252525] relative z-10 ${esModoPDF ? 'text-lg' : 'text-lg sm:text-xl md:text-2xl'}`}>
            {new Date(invitacion.fecha_evento).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>
          {invitacion.hora_inicio && (
            <div className={`font-black text-pink-500 relative z-10 ${esModoPDF ? 'mt-1 text-3xl' : 'mt-1 sm:mt-2 text-3xl sm:text-4xl'}`}>
              {invitacion.hora_inicio.slice(0, 5)} <span className={`${esModoPDF ? 'text-base' : 'text-base sm:text-lg'} font-normal opacity-80`}>h</span>
            </div>
          )}
        </div>

        <div className="bg-white/90 backdrop-blur-sm p-5 sm:p-6 md:p-8 rounded-[1.5rem] sm:rounded-[2rem] shadow-sm border-2 border-sky-100 flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="absolute -bottom-6 -left-6 sm:-bottom-10 sm:-left-10 w-16 h-16 sm:w-24 sm:h-24 bg-sky-50 rounded-full -z-10" />
          <span className="text-sky-400 uppercase text-[9px] sm:text-[10px] font-black tracking-[0.2em] mb-2 sm:mb-3 relative z-10">¿Dónde será?</span>
          <p className={`font-black text-[#252525] relative z-10 ${esModoPDF ? 'text-lg' : 'text-lg sm:text-xl md:text-2xl'}`}>
            {invitacion.lugar}
          </p>
          <div className="mt-3 sm:mt-4 px-3 py-1 sm:px-4 sm:py-1.5 bg-sky-50 text-sky-500 rounded-full text-[9px] sm:text-[10px] md:text-xs font-bold uppercase tracking-wider inline-block leading-none relative z-10">
            Punto de encuentro
          </div>
        </div>
      </ComponenteAnimado>

      {/* 3. SECCIÓN INFERIOR: Datos Extra */}
      {/* ELIMINADO EL PAGEBREAKINSIDE: 'AVOID' DEL PADRE PARA QUE LAS COLUMNAS FLUYAN LIBRES */}
      {invitacion.datos_extra && Object.keys(invitacion.datos_extra).length > 0 && (
        <ComponenteAnimado {...animationProps} className="px-2 w-full mt-8 sm:mt-12 relative z-10">
          <div className="text-center mb-6 sm:mb-8" style={esModoPDF ? { pageBreakInside: 'avoid' } : {}}>
            <span className="inline-block px-5 py-1.5 sm:px-6 sm:py-2 bg-gray-50/90 backdrop-blur-sm text-gray-400 font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[9px] sm:text-[10px] rounded-full border border-gray-100">
              Datos de interés
            </span>
          </div>
          
          <div className={`flex items-start w-full ${esModoPDF ? 'flex-row gap-8' : 'flex-col sm:flex-row gap-6 sm:gap-8 md:gap-12'}`}>
            
            {/* Columna Izquierda */}
            <div className={`flex flex-col gap-5 sm:gap-6 ${esModoPDF ? 'w-1/2' : 'w-full sm:w-1/2'}`}>
              {extraIzquierda.map(([clave, valor]) => (
                <div key={clave} className="flex items-start gap-3 sm:gap-4 break-inside-avoid w-full bg-white/80 backdrop-blur-sm p-3 rounded-xl border border-white" style={esModoPDF ? { pageBreakInside: 'avoid' } : {}}>
                  <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-pink-300 shadow-[0_0_10px_rgba(244,114,182,0.4)] shrink-0 mt-0.5 sm:mt-1" />
                  <div className="flex flex-col border-b border-gray-100 pb-3 w-full">
                    <span className="text-[8px] sm:text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1 sm:mb-1.5">{clave}</span>
                    {renderizarValor(valor, true, clave)}
                  </div>
                </div>
              ))}
            </div>

            {/* Columna Derecha */}
            <div className={`flex flex-col gap-5 sm:gap-6 ${esModoPDF ? 'w-1/2' : 'w-full sm:w-1/2'}`}>
              {extraDerecha.map(([clave, valor]) => (
                <div key={clave} className="flex items-start gap-3 sm:gap-4 break-inside-avoid w-full bg-white/80 backdrop-blur-sm p-3 rounded-xl border border-white" style={esModoPDF ? { pageBreakInside: 'avoid' } : {}}>
                  <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-sky-300 shadow-[0_0_10px_rgba(56,189,248,0.4)] shrink-0 mt-0.5 sm:mt-1" />
                  <div className="flex flex-col border-b border-gray-100 pb-3 w-full">
                    <span className="text-[8px] sm:text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1 sm:mb-1.5">{clave}</span>
                    {renderizarValor(valor, false, clave)}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </ComponenteAnimado>
      )}

      {/* FOOTER */}
      <ComponenteAnimado {...animationProps} style={esModoPDF ? { pageBreakInside: 'avoid', marginTop: '60px' } : {}} className="text-center mt-10 sm:mt-12 flex flex-col items-center justify-center relative z-10 w-full bg-white/60 backdrop-blur-sm py-4 rounded-xl">
        <p className="text-gray-400 font-serif italic text-xs sm:text-sm mb-3 sm:mb-4">
          Diseñado por <span className="font-bold text-gray-600 not-italic">{nombreCreador}</span>
        </p>
        <img src="/logo_CWM_largo.png" alt="Come With Me" className="w-32 sm:w-48 opacity-70 object-contain grayscale" />
      </ComponenteAnimado>

    </div>
  );
};

export default PlantillaVisual;