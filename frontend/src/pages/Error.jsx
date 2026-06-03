// src/pages/Error.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import ContenedorPrincipal from '../components/layout/ContenedorPrincipal.jsx';

const Error = () => {
  return (
    <div className="relative min-h-[calc(100vh-64px)] w-full overflow-hidden flex flex-col items-center bg-sky-50">
      
      {/* FONDO DINÁMICO EN BLANCO Y NEGRO (Estilo Historial vacío) */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-700 grayscale"
        style={{ backgroundImage: "url('/historial_vacio.png')" }}
      >
        <div className="absolute inset-0 bg-black/10"></div>
      </div>

      {/* CONTENEDOR PRINCIPAL: Respeta los márgenes laterales y aplica py-8 */}
      <ContenedorPrincipal className="relative z-10 w-full flex-1 flex flex-col py-8 animate-fade-in-up">
        
        {/* CENTRADO VERTICAL Y HORIZONTAL (Misma estructura que HistorialCreaciones vacío) */}
        <div className="flex-1 flex flex-col items-center justify-center text-center w-full h-full min-h-[50vh]">
          <div className="bg-black/40 backdrop-blur-2xl p-6 md:p-8 rounded-[3rem] border border-white/10 flex flex-col items-center max-w-3xl w-full">
            
            {/* TEXTOS Y BOTÓN ORIGINALES */}
            <span className="bg-pink-300/20 text-pink-300 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-6 inline-block border border-pink-300/30 shadow-sm">
              Error 404
            </span>
            
            <h1 className="text-6xl md:text-7xl font-black text-white mb-2 tracking-tighter drop-shadow-md">
              ¡Oh no!
            </h1>
            
            <h2 className="text-2xl md:text-4xl font-black text-white mb-6 drop-shadow-sm tracking-tight">
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-pink-300">
                 En esta ruta no hay nada...
               </span>
            </h2>
            
            <p className="text-base md:text-lg text-gray-200 font-medium mb-8 drop-shadow-md max-w-lg">
              La página que estás buscando no existe. Puede que haya sido movida a otro lugar o que el enlace sea incorrecto.
            </p>
            
            <Link 
              to="/" 
              className="bg-sky-500 text-white font-black text-[12px] uppercase tracking-widest px-10 py-5 rounded-2xl hover:bg-sky-400 transition-all active:scale-95 flex items-center gap-3"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              VOLVER AL INICIO
            </Link>

          </div>
        </div>

      </ContenedorPrincipal>
    </div>
  );
};

export default Error;