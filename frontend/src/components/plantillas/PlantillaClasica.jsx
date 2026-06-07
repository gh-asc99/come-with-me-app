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

  const esUrlImagen = (valor) => {
    return typeof valor === 'string' && (valor.includes('/uploads/') || valor.match(/\.(jpeg|jpg|gif|png|webp)$/i) || valor.match(/^https?:\/\//i));
  };

  const formatearUrlImagen = (ruta) => {
    if (!ruta) return '';
    if (ruta.startsWith('http')) return ruta;
    return `http://localhost:3300/${ruta.replace(/^\//, '')}`;
  };

  const renderizarValor = (valor, indice) => {
    const esPar = indice % 2 === 0;
    const colorPrimario = esPar ? 'pink' : 'sky';

    if (typeof valor === 'boolean') {
      return (
        <span className={`inline-block px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-bold font-sans mt-2 shadow-sm ${valor ? `bg-${colorPrimario}-100 text-${colorPrimario}-600 border border-${colorPrimario}-200` : 'bg-gray-100 text-gray-500 border border-gray-200'}`}>
          {valor ? 'Sí, incluido' : 'No incluido'}
        </span>
      );
    }
    
    if (esUrlImagen(valor)) {
      if (esModoPDF) {
        return (
          <div 
            className={`mt-4 w-full rounded-xl shadow-sm border border-${colorPrimario}-100 flex-shrink-0`}
            style={{
              height: '160px',
              backgroundImage: `url(${formatearUrlImagen(valor)})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              display: 'block'
            }}
          />
        );
      }
      return (
        <div className={`mt-4 w-full rounded-xl overflow-hidden shadow-sm border border-${colorPrimario}-100`}>
          <img src={formatearUrlImagen(valor)} alt="Imagen extra" crossOrigin="anonymous" className="w-full h-auto max-h-48 object-cover transition-transform hover:scale-105 duration-500" />
        </div>
      );
    }

    if (Array.isArray(valor)) {
      if (valor.length > 0 && valor[0].hora !== undefined) {
        return (
          <ul className={`mt-4 border-l-2 border-${colorPrimario}-200 pl-4 space-y-4 font-sans w-full`}>
            {valor.map((fase, i) => (
              <li key={i} className="flex flex-col relative w-full" style={esModoPDF ? { pageBreakInside: 'avoid' } : {}}>
                <span className={`absolute -left-[21px] top-1.5 w-2.5 h-2.5 bg-white border-2 border-${colorPrimario}-400 rounded-full shadow-sm`}></span>
                <span className={`font-black text-${colorPrimario}-500 text-[11px] sm:text-xs tracking-widest`}>{fase.hora}</span>
                <span className="text-[#252525] text-xs sm:text-sm font-medium leading-tight mt-1">{fase.titulo}</span>
              </li>
            ))}
          </ul>
        );
      }
      return (
        <ul className={`mt-3 space-y-2 font-sans text-xs sm:text-sm text-gray-600`}>
          {valor.map((item, i) => (
            <li key={i} className="flex gap-2 items-start" style={esModoPDF ? { pageBreakInside: 'avoid' } : {}}>
               <span className={`text-${colorPrimario}-400 font-bold shrink-0`}>•</span> 
               <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    }
    
    return <span className="font-serif leading-relaxed sm:leading-snug text-sm sm:text-base text-gray-700 mt-2 block">{valor}</span>;
  };

  return (
    <div className={`w-full mx-auto flex flex-col relative overflow-hidden bg-[#fafafa] ${esModoPDF ? 'gap-8 pb-0 max-w-[700px]' : 'gap-8 sm:gap-10 pb-10 sm:pb-20 max-w-4xl shadow-2xl'}`}>

      <div className="flex items-center justify-center sm:justify-start gap-3 mb-2 sm:mb-4 px-2 pt-6 relative z-10">
        <span className="text-gray-400 font-bold text-[9px] sm:text-[10px] uppercase tracking-widest">Generado con</span>
        <img 
          src="/logo_CWM_oficial.png" 
          alt="Come With Me" 
          className="h-6 sm:h-8 w-auto object-contain" 
        />
      </div>

      {/* 1. IMAGEN */}
      {urlImagen && (
        <ComponenteAnimado {...animationProps} className="relative w-full flex justify-center z-10 px-4 sm:px-6">
          {esModoPDF ? (
            <div 
              className="w-full rounded-[1.5rem] bg-white shadow-lg"
              style={{
                height: '250px',
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
              className="w-full sm:max-w-full max-h-[250px] sm:max-h-[380px] object-cover rounded-[1.5rem] sm:rounded-[2rem] shadow-xl bg-white border border-gray-100" 
              crossOrigin="anonymous" 
            />
          )}
        </ComponenteAnimado>
      )}

      {/* 2. CABECERA */}
      <ComponenteAnimado {...animationProps} className="text-center px-6 sm:px-8 relative z-10 mt-2 sm:mt-0">
        <h1 className={`font-black mb-4 sm:mb-5 px-2 pb-2 leading-tight ${esModoPDF ? 'text-4xl text-[#252525]' : 'text-4xl sm:text-5xl md:text-6xl text-[#1a1a1a]'}`}>
          {invitacion.titulo}
        </h1>
        <p className={`${esModoPDF ? 'text-base' : 'text-sm sm:text-lg md:text-xl'} text-gray-600 font-serif leading-relaxed sm:leading-loose max-w-3xl mx-auto whitespace-pre-wrap text-left md:text-center`}>
          {invitacion.mensaje}
        </p>
        <div className="w-16 sm:w-20 h-1.5 bg-gradient-to-r from-pink-300 to-sky-300 mx-auto mt-6 sm:mt-8 rounded-full opacity-60" />
      </ComponenteAnimado>

      {/* 3. TIEMPO Y LUGAR */}
      <ComponenteAnimado 
        {...animationProps} 
        style={{ pageBreakInside: 'avoid' }} 
        className={`flex ${esModoPDF ? 'flex-row gap-6' : 'flex-col sm:flex-row gap-4 sm:gap-6'} px-4 sm:px-6 relative z-10 w-full`}
      >
        <div className={`bg-gradient-to-br from-pink-50 to-white p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] shadow-sm border border-pink-100 flex flex-col items-center justify-center text-center ${esModoPDF ? 'w-1/2' : 'w-full sm:w-1/2'}`}>
          <span className="text-pink-400 uppercase text-[9px] sm:text-[10px] font-black tracking-[0.2em] mb-2 sm:mb-3">¿Cuándo nos vemos?</span>
          <div className={`font-black text-[#252525] ${esModoPDF ? 'text-lg' : 'text-lg sm:text-xl md:text-2xl'}`}>
            {new Date(invitacion.fecha_evento).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>
          {invitacion.hora_inicio && (
            <div className={`font-black text-pink-500 ${esModoPDF ? 'mt-2 text-3xl' : 'mt-2 sm:mt-3 text-3xl md:text-4xl'}`}>
              {invitacion.hora_inicio.slice(0, 5)} <span className={`${esModoPDF ? 'text-base' : 'text-base sm:text-lg'} font-normal opacity-80`}>h</span>
            </div>
          )}
        </div>

        <div className={`bg-gradient-to-br from-sky-50 to-white p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] shadow-sm border border-sky-100 flex flex-col items-center justify-center text-center ${esModoPDF ? 'w-1/2' : 'w-full sm:w-1/2'}`}>
          <span className="text-sky-400 uppercase text-[9px] sm:text-[10px] font-black tracking-[0.2em] mb-2 sm:mb-3">¿Dónde será?</span>
          <p className={`font-black text-[#252525] ${esModoPDF ? 'text-lg' : 'text-lg sm:text-xl md:text-2xl'}`}>
            {invitacion.lugar}
          </p>
          <div className="mt-4 sm:mt-5 px-4 py-1.5 sm:px-5 sm:py-2 bg-white text-sky-500 rounded-full text-[9px] sm:text-[10px] md:text-xs font-bold border border-sky-200 inline-block leading-none uppercase tracking-widest shadow-sm">
            Punto de encuentro
          </div>
        </div>
      </ComponenteAnimado>

      {/* 4. SUGERENCIAS (REDISEÑADO) */}
      {invitacion.datos_extra && Object.keys(invitacion.datos_extra).length > 0 && (
        <ComponenteAnimado 
          {...animationProps} 
          className="px-4 sm:px-6 mt-6 sm:mt-8 relative z-10 w-full"
        >
          <div className="bg-white px-6 sm:px-8 pt-8 pb-8 sm:pb-10 rounded-[1.5rem] sm:rounded-[2.5rem] shadow-lg border border-gray-100 relative">
            
            <div className="text-center mb-8 sm:mb-10 relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-gray-100"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-4 text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] text-gray-400">
                  Más Detalles del Evento
                </span>
              </div>
            </div>
            
            {/* NUEVA ESTRUCTURA GRID 2 COLUMNAS (Estable para PDF y Web) */}
            <div className={`flex items-start w-full ${esModoPDF ? 'flex-row gap-6' : 'flex-col md:flex-row gap-6 md:gap-8'}`}>
              
              {/* Columna Izquierda */}
              <div className={`flex flex-col gap-6 ${esModoPDF ? 'w-1/2' : 'w-full md:w-1/2'}`}>
                {extraIzquierda.map(([clave, valor], idx) => {
                  const color = idx % 2 === 0 ? 'pink' : 'sky';
                  return (
                    <div key={clave} className="break-inside-avoid" style={esModoPDF ? { pageBreakInside: 'avoid' } : {}}>
                      <div className={`bg-${color}-50/50 p-5 rounded-2xl border border-${color}-100/50 relative overflow-hidden group hover:bg-${color}-50 transition-colors duration-300`}>
                        <div className={`absolute top-0 left-0 w-1 h-full bg-${color}-300 opacity-50`}></div>
                        
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm border border-${color}-100 shrink-0 text-[10px]`}>
                            ✨
                          </div>
                          <h4 className={`text-[9px] sm:text-[10px] md:text-xs font-black text-${color}-400 uppercase tracking-widest`}>
                            {clave}
                          </h4>
                        </div>
                        
                        <div className="pl-9 w-full">
                          {renderizarValor(valor, idx)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Columna Derecha */}
              <div className={`flex flex-col gap-6 ${esModoPDF ? 'w-1/2' : 'w-full md:w-1/2'}`}>
                {extraDerecha.map(([clave, valor], idx) => {
                  // Invertimos los colores en la columna derecha para hacer un patrón cruzado
                  const color = idx % 2 === 0 ? 'sky' : 'pink'; 
                  return (
                    <div key={clave} className="break-inside-avoid" style={esModoPDF ? { pageBreakInside: 'avoid' } : {}}>
                      <div className={`bg-${color}-50/50 p-5 rounded-2xl border border-${color}-100/50 relative overflow-hidden group hover:bg-${color}-50 transition-colors duration-300`}>
                        <div className={`absolute top-0 left-0 w-1 h-full bg-${color}-300 opacity-50`}></div>
                        
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm border border-${color}-100 shrink-0 text-[10px]`}>
                            ✨
                          </div>
                          <h4 className={`text-[9px] sm:text-[10px] md:text-xs font-black text-${color}-400 uppercase tracking-widest`}>
                            {clave}
                          </h4>
                        </div>
                        
                        <div className="pl-9 w-full">
                          {renderizarValor(valor, idx + 1)} {/* +1 para que los estilos alternen bien */}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
            
          </div>
        </ComponenteAnimado>
      )}

      {/* FOOTER CREADOR Y MARCA DE AGUA */}
      <ComponenteAnimado 
        {...animationProps} 
        style={esModoPDF ? { pageBreakInside: 'avoid', marginTop: '60px' } : {}} 
        className="text-center mt-8 sm:mt-12 flex flex-col items-center justify-center relative z-10 w-full mb-6"
      >
        <p className="text-gray-400 font-serif italic text-xs sm:text-sm mb-3 sm:mb-4">
          Un evento diseñado por <span className="font-bold text-gray-600 not-italic">{nombreCreador}</span>
        </p>
        <img 
          src="/logo_CWM_largo.png" 
          alt="Come With Me" 
          className="w-32 sm:w-48 opacity-60 object-contain grayscale" 
        />
      </ComponenteAnimado>
      
    </div>
  );
};

export default PlantillaClasica;