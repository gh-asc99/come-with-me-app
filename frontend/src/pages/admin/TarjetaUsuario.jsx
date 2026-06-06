import React from 'react';

const TarjetaUsuario = ({ usuario, alEditar, alBorrar, esUsuarioActual }) => {
  
  const obtenerAvatar = () => {
    const avatarPorDefecto = "/avatar/perfil_6.png";
    if (usuario.imagen) {
      let url = usuario.imagen;
      
      if (!url.startsWith('http')) {
        if (!url.startsWith('/avatar/')) {
          url = `http://localhost:3300/${url.replace(/^\//, '')}`;
        }
      }

      return <img src={url} alt={usuario.nombre} className="w-full h-full object-cover" />;
    }
    return <img src={avatarPorDefecto} alt={usuario.nombre} className="w-full h-full object-cover" />;
  };

  const configuracionRol = {
    admin: {
      tarjeta: 'bg-gray-400/40 border-gray-400/80 hover:shadow-[0_0_20px_rgba(156,163,175,0.2)]',
      avatarRing: 'ring-gray-400 border-black/50',
      avatarBg: 'bg-gradient-to-br from-gray-400 to-gray-600',
      etiqueta: 'text-gray-300 border-gray-400/80 bg-gray-300/20',
      etiquetaTexto: 'Administrador',
      pieLinea: 'border-gray-400/80',
      btnIcono: 'text-gray-300/80 hover:text-white hover:bg-gray-300/30 border-gray-300/80'
    },
    subscriber: {
      tarjeta: 'bg-pink-300/40 border-pink-300/80 hover:shadow-[0_0_20px_rgba(244,114,182,0.2)]',
      avatarRing: 'ring-pink-300 border-black/50',
      avatarBg: 'bg-gradient-to-br from-pink-300 to-pink-500',
      etiqueta: 'text-pink-300 border-pink-300/80 bg-pink-200/20',
      etiquetaTexto: 'Premium',
      pieLinea: 'border-pink-300/80',
      btnIcono: 'text-pink-300/80 hover:text-white hover:bg-pink-300/30 border-pink-300/80'
    },
    user: {
      tarjeta: 'bg-sky-500/40 border-sky-500/80 hover:shadow-[0_0_20px_rgba(56,189,248,0.2)]',
      avatarRing: 'ring-sky-500 border-black/50',
      avatarBg: 'bg-gradient-to-br from-sky-500 to-sky-700',
      etiqueta: 'text-sky-300 border-sky-500/80 bg-sky-400/20',
      etiquetaTexto: 'Usuario Base',
      pieLinea: 'border-sky-500/80',
      btnIcono: 'text-sky-500/80 hover:text-white hover:bg-sky-500/30 border-sky-500/80'
    }
  };

  const estilo = configuracionRol[usuario.rol] || configuracionRol.user;

  return (
    <div className={`rounded-[2rem] p-6 shadow-2xl border flex flex-col items-center relative transition-all hover:-translate-y-1 group backdrop-blur-md ${estilo.tarjeta}`}>
      
      {/* Botón de Borrar (Solo visible en hover si no es el usuario actual) */}
      {!esUsuarioActual && (
        <button 
          onClick={() => alBorrar(usuario.id, usuario.nombre)}
          className="absolute top-4 right-4 p-2 text-white hover:text-pink-300 hover:bg-white/80 rounded-xl transition-all opacity-0 group-hover:opacity-100"
          title="Eliminar usuario"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
          </svg>
        </button>
      )}

      {/* Avatar Neon */}
      <div className={`w-20 h-20 rounded-full flex items-center justify-center overflow-hidden mb-4 border-2 ring-2 ring-offset-2 ring-offset-[#1a1a1a] shadow-lg ${estilo.avatarBg} ${estilo.avatarRing}`}>
        {obtenerAvatar()}
      </div>

      {/* Info Principal */}
      <h3 className="text-xl font-black text-white text-center line-clamp-1 w-full drop-shadow-sm mb-1" title={usuario.nombre}>
        {usuario.nombre}
      </h3>
      <p className="text-xs text-[#252525]/70 mb-5 text-center line-clamp-1 w-full font-medium" title={usuario.correo}>
        {usuario.correo}
      </p>

      {/* Etiqueta de Rol */}
      <div className="mb-5 w-full flex flex-col items-center gap-2">
        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border shadow-inner ${estilo.etiqueta}`}>
          {estilo.etiquetaTexto}
        </span>
        
        {/* Detalles de Suscripción (Si es VIP) */}
        {usuario.rol === 'subscriber' && usuario.suscripciones?.[0] && (
          <div className="w-full bg-pink-300/40 border border-pink-300/80 rounded-xl p-2.5 text-center shadow-inner mt-2">
            <p className="text-[9px] font-black text-pink-200/80 uppercase tracking-widest mb-1">
              {usuario.suscripciones[0].tipo.replace('_', ' ')}
            </p>
            <div className="flex justify-center items-center gap-1.5 text-[10px] font-bold text-[#252525]/70">
              <span>{new Date(usuario.suscripciones[0].fecha_inicio).toLocaleDateString('es-ES', {day: '2-digit', month: '2-digit', year: '2-digit'})}</span>
              <span className="text-pink-500">➔</span>
              <span>{usuario.suscripciones[0].fecha_fin ? new Date(usuario.suscripciones[0].fecha_fin).toLocaleDateString('es-ES', {day: '2-digit', month: '2-digit', year: '2-digit'}) : '∞'}</span>
            </div>
          </div>
        )}
      </div>

      {/* Info Extra y Botón Editar */}
      <div className={`w-full pt-4 border-t flex items-center justify-between mt-auto ${estilo.pieLinea}`}>
        <div className="flex flex-col">
          <span className="text-[9px] font-bold uppercase tracking-widest text-[#252525]">Registro</span>
          <span className="text-xs font-bold text-gray-300">
            {new Date(usuario.fecha_registro).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })}
          </span>
        </div>
        
        {/* CONDICIONAL: Botón editar O etiqueta propia */}
        {!esUsuarioActual ? (
          <button 
            onClick={() => alEditar(usuario)}
            className={`p-2.5 rounded-xl transition-all shadow-sm border ${estilo.btnIcono}`}
            title="Editar permisos"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
            </svg>
          </button>
        ) : (
          <span className="px-3 py-1.5 bg-white/10 text-white text-[9px] font-black uppercase tracking-widest rounded-lg border border-white/20 shadow-inner">
            Tu Sesión
          </span>
        )}
      </div>

    </div>
  );
};

export default TarjetaUsuario;