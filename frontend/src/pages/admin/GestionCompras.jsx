// src/pages/admin/GestionCompras.jsx
import React, { useState, useEffect } from 'react';
import api from '../../services/apiService';
import ModalUsuario from '../../pages/admin/ModalUsuario.jsx';
import ContenedorPrincipal from "../../components/layout/ContenedorPrincipal.jsx";

const GestionCompras = () => {
  const [compras, setCompras] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  
  const [usuarioEditando, setUsuarioEditando] = useState(null);

  const cargarCompras = async () => {
    try {
      const res = await api.get('/admin/compras');
      setCompras(res.data);
    } catch (err) {
      console.error(err);
      setError('Error al cargar el historial de transacciones.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarCompras();
  }, []);

  const guardarEdicionUsuario = async (id, datosActualizados) => {
    try {
      await api.put(`/auth/usuarios/${id}`, datosActualizados);
      setUsuarioEditando(null);
      await cargarCompras(); 
    } catch (err) {
      console.error(err);
      alert('Hubo un error al intentar guardar los cambios del usuario.');
    }
  };

  const formatearFechaObj = (fecha) => {
    const d = new Date(fecha);
    return {
      dia: d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
      hora: d.toLocaleTimeString('es-ES', { hour: '2-digit', minute:'2-digit' })
    };
  };

  // --- LÓGICA DE AVATAR CORREGIDA ---
  const renderAvatar = (imagen, nombre) => {
    if (imagen) {
      let url = imagen;
      if (!url.startsWith('http') && !url.startsWith('/avatar/')) {
        url = `http://localhost:3300/${url.replace(/^\//, '')}`;
      }
      return <img src={url} alt={nombre} className="w-11 h-11 rounded-xl object-cover border border-white/20 shadow-md flex-shrink-0 bg-sky-100" />;
    }
    
    return (
      <div className="w-11 h-11 rounded-xl bg-gray-700/50 text-gray-300 font-black flex flex-shrink-0 items-center justify-center border border-white/10 shadow-md">
        {nombre ? nombre.charAt(0).toUpperCase() : '?'}
      </div>
    );
  };

  return (
    <ContenedorPrincipal className="flex flex-col animate-fade-in-up">
      
      {/* CABECERA */}
      <div className="w-full bg-black/25 backdrop-blur-2xl rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 md:px-12 md:py-8 mb-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-5 sm:gap-6">
        <div className="w-full text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tighter drop-shadow-sm leading-tight">Historial de Compras</h1>
          <p className="text-xs sm:text-sm text-gray-300 mt-2 font-medium">Todas las transacciones de paquetes, eventos y suscripciones de la plataforma.</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/20 backdrop-blur-md border border-red-500/30 text-red-200 p-4 rounded-xl sm:rounded-2xl mb-6 flex items-center gap-3">
           <svg className="w-5 h-5 flex-shrink-0 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
           <span className="text-xs sm:text-sm font-bold tracking-wide">{error}</span>
        </div>
      )}

      {/* ZONA DEL LISTADO */}
      <div className="bg-black/25 backdrop-blur-md p-4 sm:p-6 md:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-white/5 shadow-inner min-h-[400px] overflow-hidden">
        
        {cargando ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-emerald-400"></div>
          </div>
        ) : compras.length === 0 ? (
          <div className="p-10 sm:p-16 text-center flex flex-col items-center">
            <svg className="w-12 h-12 sm:w-16 sm:h-16 text-gray-500 mb-4 drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-lg sm:text-xl font-black text-white mb-2 tracking-tight">No hay transacciones registradas.</p>
            <p className="text-xs sm:text-sm text-gray-400 font-medium">Las compras de los usuarios aparecerán aquí automáticamente.</p>
          </div>
        ) : (
          <>
            {/* Cabecera oculta en móvil */}
            <div className="hidden md:grid md:grid-cols-12 gap-4 px-6 pb-4 border-b border-white/10 text-gray-300 uppercase text-[10px] tracking-[0.2em] font-black mb-6 select-none">
              <div className="md:col-span-4 lg:col-span-3 flex items-center">Cliente</div>
              <div className="hidden lg:flex lg:col-span-2 justify-center items-center">Tipo</div>
              <div className="md:col-span-4 lg:col-span-3 flex justify-center items-center">Artículo</div>
              <div className="md:col-span-2 lg:col-span-2 flex justify-center items-center">Fecha y Hora</div>
              <div className="md:col-span-2 lg:col-span-2 text-right md:text-center pr-2">Importe</div>
            </div>
            
            <div className="space-y-4">
              {compras.map((compra) => {
                const fechaObj = formatearFechaObj(compra.fecha);
                
                return (
                  <div key={compra.id} className="flex flex-col md:grid md:grid-cols-12 gap-4 items-start md:items-center bg-[#252525]/60 hover:bg-[#252525]/40 p-5 rounded-3xl border border-white/5 hover:border-white/20 transition-all shadow-lg min-h-[90px] relative pb-16 md:pb-5">
                    
                    <div 
                      onClick={() => setUsuarioEditando({
                        id: compra.usuario_id,
                        nombre: compra.usuario_nombre,
                        correo: compra.usuario_correo,
                        rol: compra.usuario_rol
                      })}
                      className="md:col-span-4 lg:col-span-3 flex items-center gap-4 truncate pr-2 cursor-pointer group w-full"
                      title="Hacer clic para editar permisos del usuario"
                    >
                      {renderAvatar(compra.usuario_imagen, compra.usuario_nombre)}
                      <div className="flex flex-col truncate w-full">
                        <span className="font-bold text-white text-sm truncate group-hover:text-pink-300 transition-colors">
                          {compra.usuario_nombre || 'Usuario Borrado'}
                        </span>
                        <span className="text-[11px] text-gray-400 truncate">
                          {compra.usuario_correo || '---'}
                        </span>
                        
                        {/* Badges y datos para móvil */}
                        <div className="md:hidden flex flex-col gap-1.5 mt-2">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border shadow-inner ${
                              compra.tipo === 'paquete' ? 'bg-sky-500/10 text-sky-400 border-sky-500/30' : 
                              compra.tipo === 'evento' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' : 
                              'bg-pink-500/10 text-pink-400 border-pink-500/30'
                            }`}>
                              {compra.tipo}
                            </span>
                            <span className="text-[11px] font-bold text-gray-300 truncate max-w-[150px]">
                              {compra.item_nombre.replace('_', ' ')}
                            </span>
                          </div>
                          <div className="text-[10px] text-gray-400 font-medium">
                            {fechaObj.dia} • {fechaObj.hora}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="hidden lg:flex lg:col-span-2 justify-center items-center">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest inline-flex items-center border shadow-inner ${
                        compra.tipo === 'paquete' ? 'bg-sky-500/10 text-sky-400 border-sky-500/30' : 
                        compra.tipo === 'evento' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' : 
                        'bg-pink-500/10 text-pink-400 border-pink-500/30'
                      }`}>
                        {compra.tipo}
                      </span>
                    </div>

                    <div className="hidden md:flex md:col-span-4 lg:col-span-3 justify-center items-center text-center">
                      <span className="font-bold text-gray-200 text-sm capitalize truncate max-w-full px-2" title={compra.item_nombre.replace('_', ' ')}>
                        {compra.item_nombre.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="hidden md:flex md:col-span-2 lg:col-span-2 flex-col justify-center items-center text-center">
                      <span className="text-[11px] font-bold text-white uppercase tracking-widest">{fechaObj.dia}</span>
                      <span className="text-[10px] font-semibold text-gray-400">{fechaObj.hora}</span>
                    </div>

                    <div className="absolute bottom-4 right-4 md:relative md:bottom-auto md:right-auto md:col-span-2 lg:col-span-2 flex justify-end md:justify-center items-center pr-0 md:pr-2 w-full md:w-auto">
                      <span className="font-black text-emerald-400 text-lg md:text-xl drop-shadow-md">
                        +{parseFloat(compra.precio_pagado).toFixed(2)}<span className="text-sm ml-1 text-emerald-500">€</span>
                      </span>
                    </div>

                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {usuarioEditando && (
        <ModalUsuario 
          usuario={usuarioEditando} 
          alCerrar={() => setUsuarioEditando(null)} 
          alGuardar={guardarEdicionUsuario} 
        />
      )}

    </ContenedorPrincipal>
  );
};

export default GestionCompras;