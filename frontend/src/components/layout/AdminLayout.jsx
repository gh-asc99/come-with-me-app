import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const AdminLayout = () => {
  const linkClasses = ({ isActive }) =>
    `flex-shrink-0 whitespace-nowrap block px-4 py-2.5 md:px-5 md:py-3.5 rounded-2xl font-black text-[10px] md:text-[11px] uppercase tracking-widest transition-all duration-300 border ${
      isActive 
        ? 'bg-pink-300/20 border-pink-300/30 text-pink-300 ' 
        : 'border-transparent text-gray-400 hover:bg-white/5 hover:text-white'
    }`;

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-64px)] overflow-hidden relative bg-[#121212]">
      
      {/* FONDO ADMIN */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat "
        style={{ backgroundImage: `url('/admin_mosaico.png')` }}
      ></div>
      <div className="absolute inset-0 bg-black/30 z-0 backdrop-blur-[2px]"></div>

      {/* SIDEBAR (Barra lateral en Desktop / Barra superior horizontal en Móvil) */}
      <aside className="w-full md:w-64 bg-black/40 backdrop-blur-2xl border-b md:border-b-0 md:border-r border-white/10 flex-shrink-0 flex flex-col relative z-10">
        <div className="p-4 md:p-8 flex flex-row md:flex-col items-center md:items-stretch overflow-hidden">
          
          <h2 className="hidden md:flex text-gray-300 text-[10px] font-black uppercase tracking-[0.3em] mb-8 border-b border-white/10 pb-4 items-center gap-2">
            <svg className="w-5 h-5 text-pink-300 drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Panel de Control
          </h2>
          
          <nav className="flex flex-row md:flex-col gap-2 md:gap-0 md:space-y-3 w-full overflow-x-auto md:overflow-visible pb-2 md:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <NavLink to="/admin/dashboard" className={linkClasses}>Estadísticas</NavLink>
            <NavLink to="/admin/usuarios" className={linkClasses}>Usuarios</NavLink>
            <NavLink to="/admin/eventos" className={linkClasses}>Eventos</NavLink>
            <NavLink to="/admin/paquetes" className={linkClasses}>Paquetes</NavLink>
            <NavLink to="/admin/sugerencias" className={linkClasses}>Sugerencias</NavLink>
            <NavLink to="/admin/planes" className={linkClasses}>Planes</NavLink>
            <NavLink to="/admin/compras" className={linkClasses}>Compras</NavLink>
          </nav>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL DINÁMICO */}
      <main className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] relative z-10 py-5">
        <Outlet />
      </main>
      
    </div>
  );
};

export default AdminLayout;