// src/components/ui/Cargando.jsx
import React from 'react';
import fondoMosaico from '../../../public/fondo_mosaico.png'; // Ajusta la ruta a tu carpeta public/assets si es necesario

const Cargando = ({ mensaje = "Cargando " }) => {
  return (
    <div className="relative min-h-[calc(100vh-64px)] w-full overflow-hidden flex flex-col items-center justify-center bg-sky-50">
      
      {/* CAPA DE FONDO MOSAICO (Igual que en el resto de la app) */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${fondoMosaico})` }}
      >
        <div className="absolute inset-0 bg-black/5 backdrop-blur-[1px]"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center animate-fade-in-up">
        
        {/* ==================================================
            ANIMACIÓN PRINCIPAL DEL LOGOTIPO
            ================================================== */}
        <div className="relative flex items-center justify-center mb-12">
          
          {/* Favicon Flotante */}
          <div className="relative w-20 h-20 md:w-28 md:h-28 animate-bounce drop-shadow-2xl">
            <img 
              src="/logo_CWM_favicon.png" 
              alt="Cargando Come With Me" 
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* ==================================================
            PANEL DE TEXTO Y PUNTOS DE CARGA (Glassmorphism)
            ================================================== */}
        <div className="bg-white/80 backdrop-blur-xl px-8 py-3.5 rounded-full shadow-lg border border-white flex items-center gap-4">
          
          {/* Texto dinámico con gradiente */}
          <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-pink-400 uppercase tracking-widest text-xs md:text-sm">
            {mensaje}
          </span>

          {/* Puntos saltarines intercalados de colores */}
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-bounce shadow-sm" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2.5 h-2.5 rounded-full bg-pink-300 animate-bounce shadow-sm" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-bounce shadow-sm" style={{ animationDelay: '300ms' }}></div>
          </div>
          
        </div>

      </div>
    </div>
  );
};

export default Cargando;