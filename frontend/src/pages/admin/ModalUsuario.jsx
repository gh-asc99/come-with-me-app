// src/pages/admin/ModalUsuario.jsx
import React, { useState, useEffect } from 'react';

const ModalUsuario = ({ usuario, alCerrar, alGuardar }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    rol: 'user'
  });
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (usuario) {
      setFormData({
        nombre: usuario.nombre || '',
        correo: usuario.correo || '',
        rol: usuario.rol || 'user'
      });
    }
  }, [usuario]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGuardando(true);
    await alGuardar(usuario.id, formData);
    setGuardando(false);
  };

  if (!usuario) return null;

  // NUEVA PALETA DARK GLASS
  const estilosRol = {
    admin: { 
      bordeFoco: 'border-gray-400 bg-gray-500/10 text-gray-300 shadow-[0_0_15px_rgba(156,163,175,0.2)]', 
      btnNormal: 'border-white/10 text-gray-500 hover:bg-gray-500/10 hover:border-gray-500/30',
      btnGuardar: 'bg-gray-600 hover:bg-gray-500 text-white shadow-lg' 
    },
    subscriber: { 
      bordeFoco: 'border-pink-400 bg-pink-500/10 text-pink-300 shadow-[0_0_15px_rgba(244,114,182,0.2)]', 
      btnNormal: 'border-white/10 text-gray-500 hover:bg-pink-500/10 hover:border-pink-500/30',
      btnGuardar: 'bg-pink-500 hover:bg-pink-400 text-white shadow-lg shadow-pink-500/30' 
    },
    user: { 
      bordeFoco: 'border-sky-400 bg-sky-500/10 text-sky-300 shadow-[0_0_15px_rgba(56,189,248,0.2)]', 
      btnNormal: 'border-white/10 text-gray-500 hover:bg-sky-500/10 hover:border-sky-500/30',
      btnGuardar: 'bg-sky-500 hover:bg-sky-400 text-white shadow-lg shadow-sky-500/30' 
    }
  };

  const estiloActual = estilosRol[formData.rol] || estilosRol.user;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#121212]/95 backdrop-blur-3xl rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl border border-white/10 w-full max-w-[500px] overflow-hidden animate-scale-up flex flex-col max-h-[90vh]">
        
        {/* Cabecera del Modal */}
        <div className="p-6 sm:p-8 border-b border-white/10 flex justify-between items-center bg-white/5 flex-shrink-0">
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">Editar Permisos</h2>
          <button 
            onClick={alCerrar}
            className="text-gray-500 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Formulario con Scroll Interno para móviles pequeños */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div>
              <label className="block text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 sm:mb-2">Nombre completo</label>
              <input 
                type="text" 
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-black/50 border border-white/10 text-white rounded-xl focus:outline-none focus:border-sky-400 transition-all font-medium shadow-inner text-sm"
              />
            </div>

            <div>
              <label className="block text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 sm:mb-2">Correo electrónico</label>
              <input 
                type="email" 
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-black/50 border border-white/10 text-white rounded-xl focus:outline-none focus:border-sky-400 transition-all font-medium shadow-inner text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 sm:mb-3">Nivel de Acceso (Rol)</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              
              {/* Opción: USUARIO BASE (Azul) */}
              <label className={`cursor-pointer border-2 rounded-2xl p-3 sm:p-4 flex flex-row sm:flex-col items-center justify-start sm:justify-center gap-3 sm:gap-0 transition-all duration-300 ${formData.rol === 'user' ? estilosRol.user.bordeFoco : estilosRol.user.btnNormal}`}>
                <input type="radio" name="rol" value="user" checked={formData.rol === 'user'} onChange={handleChange} className="hidden" />
                <svg className="w-5 h-5 sm:w-6 sm:h-6 sm:mb-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                <span className="font-black text-[10px] uppercase tracking-widest">Base</span>
              </label>

              {/* Opción: SUSCRIPTOR VIP (Rosa) */}
              <label className={`cursor-pointer border-2 rounded-2xl p-3 sm:p-4 flex flex-row sm:flex-col items-center justify-start sm:justify-center gap-3 sm:gap-0 transition-all duration-300 ${formData.rol === 'subscriber' ? estilosRol.subscriber.bordeFoco : estilosRol.subscriber.btnNormal}`}>
                <input type="radio" name="rol" value="subscriber" checked={formData.rol === 'subscriber'} onChange={handleChange} className="hidden" />
                <svg className="w-5 h-5 sm:w-6 sm:h-6 sm:mb-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                <span className="font-black text-[10px] uppercase tracking-widest">Premium</span>
              </label>

              {/* Opción: ADMINISTRADOR (Gris Neutro) */}
              <label className={`cursor-pointer border-2 rounded-2xl p-3 sm:p-4 flex flex-row sm:flex-col items-center justify-start sm:justify-center gap-3 sm:gap-0 transition-all duration-300 ${formData.rol === 'admin' ? estilosRol.admin.bordeFoco : estilosRol.admin.btnNormal}`}>
                <input type="radio" name="rol" value="admin" checked={formData.rol === 'admin'} onChange={handleChange} className="hidden" />
                <svg className="w-5 h-5 sm:w-6 sm:h-6 sm:mb-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                <span className="font-black text-[10px] uppercase tracking-widest">Admin</span>
              </label>

            </div>
          </div>

          {/* Botonera */}
          <div className="pt-4 sm:pt-6 flex gap-3 sm:gap-4 border-t border-white/10 mt-6">
            <button 
              type="button" 
              onClick={alCerrar}
              className="flex-1 py-3.5 sm:py-4 px-4 font-black text-[9px] sm:text-[10px] uppercase tracking-widest text-gray-400 bg-white/5 hover:bg-white/10 border border-white/10 hover:text-white rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={guardando}
              className={`flex-1 py-3.5 sm:py-4 px-4 font-black text-[9px] sm:text-[10px] uppercase tracking-widest rounded-xl transition-all ${guardando ? 'bg-gray-600 text-gray-400 cursor-not-allowed border border-gray-500' : estiloActual.btnGuardar}`}
            >
              {guardando ? 'Guardando...' : 'Aplicar Rol'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ModalUsuario;