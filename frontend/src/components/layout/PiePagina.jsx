import React from 'react'
import logoCrs from "../../assets/logo_CRS_oficial.png";
import ContenedorPrincipal from './ContenedorPrincipal.jsx';

const PiePagina = () => {
  const añoActual = new Date().getFullYear();

  return (
    <footer className="bg-[#252525] text-gray-300 py-5 w-full z-10 relative border-t border-white/5">
      <ContenedorPrincipal className="flex flex-col lg:flex-row items-center justify-between gap-5 lg:gap-0">
        
        {/* MARCA Y COPYRIGHT */}
        <div className="flex flex-col items-center lg:items-start gap-1.5 w-full lg:w-auto text-center lg:text-left">
          <h3 className="font-black text-white tracking-widest uppercase leading-none">
             Come With Me
          </h3>
          <p className="text-[10px] font-medium text-gray-500 uppercase tracking-widest leading-none">
            © {añoActual} · Todos los derechos reservados
          </p>
        </div>

        {/* ENLACES Y CODERAIN STUDIO */}
        <div className="flex flex-wrap justify-center lg:justify-end items-center gap-4 md:gap-6 w-full lg:w-auto">
          
          <nav className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Ayuda</a>
            <a href="#" className="hover:text-white transition-colors">Términos</a>
            <a href="#" className="hover:text-white transition-colors">Privacidad</a>
          </nav>

          <span className="hidden md:block text-gray-700">|</span>

          <div className="flex items-center gap-3 opacity-80 hover:opacity-100 transition-opacity">
            <div className="text-right flex flex-col justify-center">
              <p className="text-[9px] text-gray-300 font-black uppercase tracking-widest leading-none mb-1">codeRAIN Studio</p>
              <p className="text-[8px] text-sky-400/80 font-medium italic leading-none">CEO: Alejandro Soler Cruz</p>
            </div>
            <img 
              src={logoCrs} 
              alt="codeRAIN Studio" 
              className="h-6 md:h-7 w-auto object-contain brightness-0 invert" 
            />
          </div>

        </div>

      </ContenedorPrincipal>
    </footer>
  )
}

export default PiePagina;