import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import useSesion from "../../hooks/useSesion.js";

const Menu = () => {
  const { isAuth, user } = useSesion();
  const location = useLocation();
  const [menuAbierto, setMenuAbierto] = useState(false);

  const isActive = (path) => location.pathname === path;

  const linkStyle = (path) => `
    block w-full md:w-auto text-center md:text-left px-4 py-3 md:py-2 rounded-xl font-bold text-[10px] uppercase tracking-[0.15em] transition-all
    ${isActive(path) 
      ? 'bg-white/20 text-white shadow-inner' 
      : 'text-white/80 hover:text-white hover:bg-sky-300/40'
    }
  `;

  return (
    <>
      {/* Botón Hamburguesa para Móvil */}
      <button 
        className="md:hidden text-white p-2 focus:outline-none"
        onClick={() => setMenuAbierto(!menuAbierto)}
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          {menuAbierto ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Contenedor de Navegación (Desplegable en móvil, Fila en Desktop) */}
      <nav className={`${menuAbierto ? 'flex' : 'hidden'} md:flex absolute md:relative top-16 md:top-0 left-0 w-full md:w-auto bg-sky-500 md:bg-transparent shadow-md md:shadow-none p-4 md:p-0 flex-col md:flex-row items-center gap-2 md:gap-1 lg:gap-2 z-50`}>
        
        <Link to="/acerca-de" className={linkStyle('/acerca-de')} onClick={() => setMenuAbierto(false)}>
          Conócenos
        </Link>
        <Link to="/suscripciones" className={linkStyle('/suscripciones')} onClick={() => setMenuAbierto(false)}>
          Planes
        </Link>

        {isAuth ? (
          <>
            <Link to="/mis-creaciones" className={linkStyle('/mis-creaciones')} onClick={() => setMenuAbierto(false)}>
              Mis Creaciones
            </Link>

            <Link 
              to="/nueva-creacion" 
              onClick={() => setMenuAbierto(false)}
              className="w-full md:w-auto md:ml-2 bg-pink-300 hover:bg-pink-400 text-white px-5 py-3 md:py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-md shadow-pink-500/20 transition-all active:scale-95 flex items-center justify-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span className="inline md:hidden lg:inline">Crear</span>
            </Link>

            {user?.rol === "admin" && (
              <Link
                to="/admin/dashboard"
                onClick={() => setMenuAbierto(false)}
                className="w-full md:w-auto md:ml-2 bg-[#252525] hover:bg-black text-white px-4 py-3 md:py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5 border border-white/10"
              >
                <svg className="w-4 h-4 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                <span className="inline md:hidden xl:inline">Admin</span>
              </Link>
            )}
          </>
        ) : (
          <Link
            to="/acceso-usuario"
            onClick={() => setMenuAbierto(false)}
            className="w-full md:w-auto md:ml-2 bg-white text-sky-500 hover:text-sky-600 hover:bg-sky-50 px-6 py-3 md:py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-md transition-all active:scale-95 text-center"
          >
            Acceder
          </Link>
        )}
      </nav>
    </>
  );
};

export default Menu;