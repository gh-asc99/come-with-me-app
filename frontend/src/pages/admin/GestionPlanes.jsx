import React, { useState, useEffect } from 'react';
import api from '../../services/apiService';
import ContenedorPrincipal from "../../components/layout/ContenedorPrincipal.jsx";
import ModalConfirmacion from "../../components/ui/ModalConfirmacion.jsx";
import Cargando from "../../components/ui/Cargando.jsx";

const GestionPlanes = () => {
  const [suscripciones, setSuscripciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const [modalConfirmacion, setModalConfirmacion] = useState({
    abierto: false,
    suscripcionId: null,
    nombreUsuario: ''
  });

  const cargarSuscripciones = async () => {
    setCargando(true);
    try {
      const res = await api.get('/suscripciones');
      setSuscripciones(res.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Error al cargar las suscripciones. Verifica la conexión con el backend.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarSuscripciones();
  }, []);

  const solicitarCancelacion = (id, nombreUsuario) => {
    setModalConfirmacion({
      abierto: true,
      suscripcionId: id,
      nombreUsuario: nombreUsuario || 'Usuario Desconocido'
    });
  };

  const confirmarCancelacion = async () => {
    try {
      await api.put(`/suscripciones/${modalConfirmacion.suscripcionId}/cancelar`);
      await cargarSuscripciones(); 
    } catch (err) {
      console.error(err);
      alert('Hubo un error al intentar cancelar la suscripción.');
    } finally {
      setModalConfirmacion({ abierto: false, suscripcionId: null, nombreUsuario: '' });
    }
  };

  const abortarCancelacion = () => {
    setModalConfirmacion({ abierto: false, suscripcionId: null, nombreUsuario: '' });
  };

  const metricas = {
    mensual_1: { titulo: '1 Mes', color: 'text-sky-300', bg: 'bg-sky-500/30', border: 'border-sky-300/20', shadow: 'shadow-[0_0_15px_rgba(56,189,248,0.1)]', activas: 0, ingresos: 0 },
    mensual_3: { titulo: '3 Meses', color: 'text-indigo-300', bg: 'bg-indigo-500/30', border: 'border-indigo-300/20', shadow: 'shadow-[0_0_15px_rgba(99,102,241,0.1)]', activas: 0, ingresos: 0 },
    mensual_6: { titulo: '6 Meses', color: 'text-purple-300', bg: 'bg-purple-500/30', border: 'border-purple-300/20', shadow: 'shadow-[0_0_15px_rgba(168,85,247,0.1)]', activas: 0, ingresos: 0 },
    anual: { titulo: 'Anual', color: 'text-pink-300', bg: 'bg-pink-500/30', border: 'border-pink-300/20', shadow: 'shadow-[0_0_15px_rgba(244,114,182,0.1)]', activas: 0, ingresos: 0 },
    ilimitada: { titulo: 'Ilimitada', color: 'text-amber-300', bg: 'bg-amber-500/30', border: 'border-amber-300/20', shadow: 'shadow-[0_0_15px_rgba(251,191,36,0.1)]', activas: 0, ingresos: 0 },
  };

  suscripciones.forEach(sub => {
    if (metricas[sub.tipo]) {
      if (sub.estado === 'activa') metricas[sub.tipo].activas += 1;
      metricas[sub.tipo].ingresos += parseFloat(sub.precio);
    }
  });

  const formatearFecha = (fecha) => {
    if (!fecha) return '---';
    return new Date(fecha).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const renderAvatar = (usuario) => {
    if (!usuario) return <div className="w-12 h-12 rounded-xl bg-gray-800 border border-gray-600 flex-shrink-0"></div>;
    
    if (usuario.imagen) {
      let url = usuario.imagen;
      if (!url.startsWith('http') && !url.startsWith('/avatar/')) {
        url = `http://localhost:3300/${url.replace(/^\//, '')}`;
      }
      return <img src={url} alt={usuario.nombre} className="w-12 h-12 rounded-xl object-cover border border-white/20 shadow-md flex-shrink-0 bg-sky-100" />;
    }
    
    return (
      <div className="w-12 h-12 rounded-xl bg-gray-700/50 text-gray-300 font-black flex flex-shrink-0 items-center justify-center border border-white/10 shadow-md">
        {usuario.nombre ? usuario.nombre.charAt(0).toUpperCase() : '?'}
      </div>
    );
  };

  if (cargando && suscripciones.length === 0) return <Cargando mensaje="Cargando suscripciones " />;

  return (
    <ContenedorPrincipal className="flex flex-col animate-fade-in-up">
      
      {/* CABECERA */}
      <div className="w-full bg-black/25 backdrop-blur-2xl rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 md:px-12 md:py-8 mb-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-5 sm:gap-6">
        <div className="w-full text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tighter drop-shadow-sm leading-tight">Planes y Suscripciones</h1>
          <p className="text-xs sm:text-sm text-gray-300 mt-2 font-medium">Supervisa los ingresos y el estado de los usuarios VIP de la plataforma.</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/20 backdrop-blur-md border border-red-500/30 text-red-200 p-4 rounded-xl sm:rounded-2xl mb-6 flex items-center gap-3">
           <svg className="w-5 h-5 flex-shrink-0 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
           <span className="text-xs sm:text-sm font-bold tracking-wide">{error}</span>
        </div>
      )}

      {/* MÉTRICAS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6 mb-5">
        {Object.entries(metricas).map(([key, data]) => (
          <div key={key} className={`${data.bg} border ${data.border} rounded-2xl sm:rounded-[2rem] p-5 sm:p-6 backdrop-blur-md transition-all hover:-translate-y-1 hover:bg-white/10 flex flex-col justify-between min-h-[100px] sm:min-h-[120px]`}>
            <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] ${data.color} mb-3`}>{data.titulo}</h3>
            <div className="flex flex-col gap-0.5">
              <span className="text-2xl font-black text-white drop-shadow-md">
                {data.activas} <span className="text-xs font-bold text-gray-300 uppercase tracking-widest ml-1">activos</span>
              </span>
              <span className="text-[10px] sm:text-[11px] font-bold text-gray-300 sm:text-[#252525]/70 uppercase tracking-widest">{data.ingresos.toFixed(2)}€ generados</span>
            </div>
          </div>
        ))}
      </div>

      {/* ZONA DEL LISTADO */}
      <div className="bg-black/25 backdrop-blur-md p-4 sm:p-6 md:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-white/5 shadow-inner min-h-[400px] overflow-hidden">
        
        {/* Cabecera de la tabla (Oculta en móvil) */}
        <div className="hidden md:grid md:grid-cols-12 gap-4 px-6 pb-4 border-b border-white/10 text-gray-300 uppercase text-[10px] tracking-[0.2em] font-black mb-6 select-none">
          <div className="md:col-span-4 lg:col-span-3 flex items-center">Usuario</div>
          <div className="hidden lg:flex lg:col-span-2 justify-center items-center">Plan</div>
          <div className="md:col-span-3 lg:col-span-2 flex justify-center items-center">Estado</div>
          <div className="hidden lg:flex lg:col-span-3 justify-center items-center">Facturación</div>
          <div className="md:col-span-5 lg:col-span-2 text-right md:text-center pr-2">Precio / Acción</div>
        </div>
        
        {/* Renderizado de la lista limpio del spinner antiguo */}
        {suscripciones.length === 0 ? (
          <div className="p-10 sm:p-16 text-center flex flex-col items-center">
            <svg className="w-12 h-12 sm:w-16 sm:h-16 text-gray-500 mb-4 drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
            <p className="text-lg sm:text-xl font-black text-white mb-2 tracking-tight">No hay suscripciones registradas.</p>
            <p className="text-xs sm:text-sm text-gray-400 font-medium">Los planes activos aparecerán aquí automáticamente.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {suscripciones.map((sub) => (
              <div key={sub.id} className="flex flex-col md:grid md:grid-cols-12 gap-4 items-start md:items-center bg-[#252525]/60 hover:bg-[#252525]/40 p-5 rounded-3xl border border-white/5 hover:border-white/20 transition-all shadow-lg min-h-[90px] relative pb-16 md:pb-5">
                
                <div className="md:col-span-4 lg:col-span-3 flex items-center gap-4 truncate pr-2 w-full">
                  {renderAvatar(sub.usuario)}
                  <div className="flex flex-col truncate w-full">
                    <span className="font-bold text-white text-sm truncate" title={sub.usuario?.nombre || 'Usuario Borrado'}>
                      {sub.usuario?.nombre || 'Usuario Borrado'}
                    </span>
                    <span className="text-[11px] text-gray-400 truncate" title={sub.usuario?.correo || '---'}>
                      {sub.usuario?.correo || '---'}
                    </span>
                    
                    {/* Datos para móvil */}
                    <div className="md:hidden flex flex-wrap items-center gap-2 mt-2">
                      <span className="bg-white/10 text-white border border-white/20 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest truncate">
                        {sub.tipo.replace('_', ' ')}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest inline-flex items-center gap-1.5 border shadow-inner ${
                        sub.estado === 'activa' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 
                        sub.estado === 'vencida' ? 'bg-orange-500/10 text-orange-400 border-orange-500/30' : 
                        'bg-pink-400/10 text-pink-400 border-pink-400/30'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full shadow-[0_0_5px_currentColor] ${sub.estado === 'activa' ? 'bg-emerald-400' : sub.estado === 'vencida' ? 'bg-orange-400' : 'bg-red-400'}`}></span>
                        {sub.estado}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="hidden lg:flex lg:col-span-2 justify-center items-center">
                  <span className="bg-white/10 text-white border border-white/20 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-center truncate w-full max-w-[120px]">
                    {sub.tipo.replace('_', ' ')}
                  </span>
                </div>

                <div className="hidden md:flex md:col-span-3 lg:col-span-2 justify-center items-center">
                  <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest inline-flex items-center gap-2 border shadow-inner ${
                    sub.estado === 'activa' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 
                    sub.estado === 'vencida' ? 'bg-orange-500/10 text-orange-400 border-orange-500/30' : 
                    'bg-pink-400/10 text-pink-400 border-pink-400/30'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full shadow-[0_0_5px_currentColor] ${sub.estado === 'activa' ? 'bg-emerald-400' : sub.estado === 'vencida' ? 'bg-orange-400' : 'bg-red-400'}`}></span>
                    {sub.estado}
                  </span>
                </div>

                <div className="hidden lg:flex lg:col-span-3 flex-col justify-center items-center">
                  <div className="flex items-center gap-2 text-[11px] font-medium text-gray-300">
                    <span className="text-sky-500">Inicia:</span> 
                    <span className="font-bold text-white">{formatearFecha(sub.fecha_inicio)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] font-medium text-gray-300 mt-1">
                    <span className="text-pink-300">Vence:</span> 
                    <span className="font-bold text-white">{formatearFecha(sub.fecha_fin)}</span>
                  </div>
                </div>

                <div className="absolute bottom-4 right-4 md:relative md:bottom-auto md:right-auto md:col-span-5 lg:col-span-2 flex flex-row justify-end md:justify-between items-center gap-3 md:gap-2 pr-0 md:pr-2 w-full md:w-auto">
                  <span className="font-black text-white text-lg md:text-xl drop-shadow-md">
                    {parseFloat(sub.precio).toFixed(2)}<span className="text-sm ml-1">€</span>
                  </span>
                  
                  {sub.estado === 'activa' ? (
                    <button 
                      onClick={() => solicitarCancelacion(sub.id, sub.usuario?.nombre)}
                      className="px-4 py-2 sm:px-3 bg-pink-300/10 border border-pink-300/30 text-pink-300 hover:bg-pink-400 hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shadow-md md:hover:scale-105"
                      title="Cancelar Suscripción"
                    >
                      Cancelar
                    </button>
                  ) : (
                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-500 px-3 py-2">
                      Inactiva
                    </span>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      <ModalConfirmacion
        isOpen={modalConfirmacion.abierto}
        titulo="Cancelar Suscripción"
        mensaje={`¿Estás seguro de que quieres CANCELAR la suscripción de ${modalConfirmacion.nombreUsuario}? Perderá sus privilegios VIP de inmediato.`}
        textoConfirmar="Cancelar Suscripción"
        textoCancelar="Mantener"
        onConfirm={confirmarCancelacion}
        onCancel={abortarCancelacion}
        esDestructivo={true}
        tipo="error"
      />

    </ContenedorPrincipal>
  );
};

export default GestionPlanes;