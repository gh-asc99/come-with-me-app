// src/pages/PerfilUsuario.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ImagenesPerfil from "../components/profile/ImagenesPerfil.jsx";
import useSesion from "../hooks/useSesion.js";
import api from '../services/apiService.js';
import { eliminarCuenta } from '../services/apiService.js'; 
import ContenedorPrincipal from "../components/layout/ContenedorPrincipal.jsx";
import fondoMosaico from '../../public/fondo_mosaico.png'; 
import Aviso from "../components/ui/Aviso.jsx";
import ModalConfirmacion from "../components/ui/ModalConfirmacion.jsx";
import Cargando from "../components/ui/Cargando.jsx"; // <-- IMPORTAMOS CARGANDO

const PerfilUsuario = () => {
  const { user, actualizarUsuario, cargandoAccion, errorSesion, cerrarSesion } = useSesion();
  const navegar = useNavigate();

  const [cargandoDatos, setCargandoDatos] = useState(true); // <-- ESTADO PARA LA ANIMACIÓN DE CARGA
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modalBorrarCuenta, setModalBorrarCuenta] = useState(false); 
  const [mostrarZonaPeligro, setMostrarZonaPeligro] = useState(false); 
  const [misCompras, setMisCompras] = useState([]);
  const [suscripcionActiva, setSuscripcionActiva] = useState(null);

  const [aviso, setAviso] = useState({ visible: false, mensaje: '', tipo: 'info' });

  const [datosUsuario, setDatosUsuario] = useState({
    nombre: "", correo: "", imagen: "/avatar/perfil_6.png", fechaNacimiento: "",
  });

  const formatearFecha = (cadenaFecha) => {
    if (!cadenaFecha) return "Fecha no especificada";
    const fecha = new Date(cadenaFecha);
    if (isNaN(fecha.getTime())) return "Fecha no especificada";
    return new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "long", year: "numeric" }).format(fecha);
  };

  const getUrlImagen = (ruta, tipo) => {
    if (!ruta) return null;
    if (ruta.startsWith('http')) return ruta;
    if (ruta.includes('uploads')) {
      const rutaLimpia = ruta.startsWith('/') ? ruta.substring(1) : ruta;
      return `http://localhost:3300/${rutaLimpia}`;
    }
    if (!ruta.includes('/')) {
      return tipo === 'evento' ? `/eventos/${ruta}` : `/paquetes/${ruta}`;
    }
    return ruta.startsWith('/') ? ruta : `/${ruta}`;
  };

  useEffect(() => {
    if (errorSesion) {
      setAviso({ visible: true, mensaje: errorSesion, tipo: 'error' });
    }
  }, [errorSesion]);

  useEffect(() => {
    if (user) {
      setDatosUsuario({
        nombre: user.nombre || "",
        correo: user.correo || "",
        imagen: user.imagen || "/avatar/perfil_6.png",
        fechaNacimiento: formatearFecha(user.fecha_nacimiento),
      });

      const cargarExtras = async () => {
        try {
          const resCompras = await api.get('/compras/mis-compras');
          setMisCompras(resCompras.data || []);
        } catch (e) { console.error("Error al cargar compras", e); }

        try {
          const resSub = await api.get('/suscripciones/mis-suscripciones'); 
          const historialSuscripciones = resSub.data;
          if (historialSuscripciones && historialSuscripciones.length > 0) {
            const ultimaSuscripcion = historialSuscripciones[0];
            setSuscripcionActiva(ultimaSuscripcion.estado === 'activa' ? ultimaSuscripcion : null);
          } else {
            setSuscripcionActiva(null);
          }
        } catch (e) { 
          setSuscripcionActiva(null); 
        } finally {
          setCargandoDatos(false); // Apagamos el Cargando al terminar todo
        }
      };
      cargarExtras();
    } else {
      setCargandoDatos(false);
    }
  }, [user]);

  const manejarGuardado = async (e) => {
    e.preventDefault();
    const errores = [];
    
    const regexNombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;
    if (!datosUsuario.nombre.trim()) {
      errores.push("• El campo 'Nombre' no puede estar vacío.");
    } else if (!regexNombre.test(datosUsuario.nombre.trim())) {
      errores.push("• El 'Nombre' solo admite letras y espacios.");
    }

    if (errores.length > 0) {
      setAviso({ visible: true, mensaje: `No se pudo actualizar:\n${errores.join('\n')}`, tipo: 'error' });
      return;
    }

    const resultado = await actualizarUsuario(datosUsuario);
    if (resultado.success) {
      setAviso({ visible: true, mensaje: "¡Perfil actualizado correctamente!", tipo: 'exito' });
    } else {
      setAviso({ visible: true, mensaje: resultado.error || "Error al actualizar", tipo: 'error' });
    }
  };

  const actualizarImagen = (nuevaImagen) => {
    setDatosUsuario({ ...datosUsuario, imagen: nuevaImagen });
    setMostrarModal(false);
  };

  const manejarEliminarCuenta = async () => {
    try {
      await eliminarCuenta(); 
      cerrarSesion(); 
      navegar('/'); 
    } catch (err) {
      setModalBorrarCuenta(false); 
      setAviso({ visible: true, mensaje: err || "No se pudo eliminar la cuenta. Inténtalo de nuevo.", tipo: 'error' });
    }
  };

  const estilosRol = {
    admin: { badgeBg: "bg-gray-500/20 border-gray-500/30 text-gray-300", btnBg: "bg-gray-600 hover:bg-gray-500 shadow-gray-500/30", avatarRing: "ring-gray-400/50", avatarBg: "bg-gray-500/20", label: "Administrador", icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /> },
    subscriber: { badgeBg: "bg-pink-300/20 border-pink-400/30 text-pink-300", btnBg: "bg-pink-300 hover:bg-pink-400 shadow-pink-400/30", avatarRing: "ring-pink-300/50", avatarBg: "bg-pink-300/80", label: "Usuario Premium", icon: <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /> },
    user: { badgeBg: "bg-sky-400/20 border-sky-400/30 text-sky-400", btnBg: "bg-sky-500 hover:bg-sky-400 shadow-sky-500/30", avatarRing: "ring-sky-400/50", avatarBg: "bg-sky-500/80", label: "Usuario Base", icon: <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /> }
  };
  const configRol = estilosRol[user?.rol] || estilosRol.user;

  // COMPONENTE DE CARGA
  if (cargandoDatos) return <Cargando mensaje="Cargando tu Área Personal..." />;

  return (
    <div className="relative min-h-[calc(100vh-64px)] w-full overflow-hidden flex flex-col items-center py-5 bg-sky-50">
      
      <Aviso mensaje={aviso.mensaje} tipo={aviso.tipo} visible={aviso.visible} onClose={() => setAviso({ ...aviso, visible: false })} />

      <div className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${fondoMosaico})` }}>
        <div className="absolute inset-0 bg-black/10"></div>
      </div>

      <ContenedorPrincipal className="relative z-10 w-full animate-fade-in-up">
        
        <div className="bg-black/25 backdrop-blur-2xl rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden flex flex-col lg:flex-row items-stretch w-full max-w-6xl mx-auto mb-5 shadow-2xl">
          
          <div className="w-full lg:w-7/12 flex flex-col relative border-b lg:border-b-0 lg:border-r border-white/10 bg-gradient-to-br from-black/30 to-transparent p-6 sm:p-10 md:p-12 lg:p-14">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 md:mb-12">
              <div className="text-left w-full sm:w-auto">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tighter drop-shadow-sm">
                  Área <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-pink-300">Personal</span>
                </h1>
                <p className="text-gray-300 font-medium text-xs sm:text-sm mt-1 sm:mt-2">Gestiona tu información, compras y estado VIP.</p>
              </div>
              <span className={`${configRol.badgeBg} px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 border shadow-sm flex-shrink-0 w-fit`}>
                 <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>{configRol.icon}</svg>
                 {configRol.label}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-8 xl:gap-10 items-center sm:items-start flex-1">
              
              {/* AVATAR */}
              <div className="flex flex-col items-center flex-shrink-0">
                <div className={`p-2 sm:p-2.5 rounded-full bg-[#1a1a1a] ring-4 ${configRol.avatarRing} border border-white/10 shadow-2xl mb-4 sm:mb-6 relative group`}>
                  <div className={`w-24 h-24 sm:w-32 sm:h-32 lg:w-36 lg:h-36 rounded-full overflow-hidden ${configRol.avatarBg}`}>
                    <img src={datosUsuario.imagen} alt="Avatar" className="w-full h-full object-cover mix-blend-normal drop-shadow-lg" />
                  </div>
                </div>
                <button type="button" onClick={() => setMostrarModal(true)} className="text-gray-300 hover:text-white font-black text-[9px] sm:text-[10px] uppercase tracking-widest transition-colors flex items-center gap-1">
                  Cambiar Avatar
                </button>
              </div>

              {/* FORMULARIO */}
              <form onSubmit={manejarGuardado} className="w-full space-y-4 sm:space-y-6 text-gray-200 flex-1 flex flex-col justify-center">
                <div>
                  <label className="block text-[10px] sm:text-xs font-bold text-gray-300 uppercase tracking-widest mb-1.5 sm:mb-2">Nombre completo</label>
                  <input type="text" value={datosUsuario.nombre} onChange={(e) => setDatosUsuario({ ...datosUsuario, nombre: e.target.value })} className="w-full px-4 py-3 sm:py-4 bg-black/40 border border-white/10 text-white rounded-xl focus:outline-none focus:border-sky-400 transition-all text-sm sm:text-base font-medium shadow-inner" placeholder="Tu nombre" />
                </div>
                <div>
                  <label className="block text-[10px] sm:text-xs font-bold text-gray-300 uppercase tracking-widest mb-1.5 sm:mb-2">Correo electrónico</label>
                  <input type="email" value={datosUsuario.correo} onChange={(e) => setDatosUsuario({ ...datosUsuario, correo: e.target.value })} className="w-full px-4 py-3 sm:py-4 bg-black/40 border border-white/10 text-white rounded-xl focus:outline-none focus:border-sky-400 transition-all text-sm sm:text-base font-medium shadow-inner" placeholder="Tu correo" />
                </div>
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-end">
                  <div className="w-full sm:flex-1">
                    <label className="block text-[10px] sm:text-xs font-bold text-gray-300 uppercase tracking-widest mb-1.5 sm:mb-2">Fecha de nacimiento</label>
                    <div className="w-full bg-white/5 border border-white/10 text-gray-300 rounded-xl px-4 py-3 sm:py-4 cursor-not-allowed text-sm sm:text-base font-medium shadow-inner">
                      {datosUsuario.fechaNacimiento}
                    </div>
                  </div>
                  <div className="w-full sm:w-auto mt-2 sm:mt-0">
                    <button type="submit" disabled={cargandoAccion} className={`w-full text-white font-black text-[10px] sm:text-[11px] uppercase tracking-widest px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl transition-all shadow-lg active:scale-95 disabled:bg-gray-600 flex justify-center items-center gap-2 ${configRol.btnBg}`}>
                      {cargandoAccion ? "Guardando..." : "Guardar"}
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* BOTÓN MOSTRAR ZONA DE PELIGRO */}
            <div className="mt-8 flex justify-center sm:justify-start">
              <button 
                type="button" 
                onClick={() => setMostrarZonaPeligro(!mostrarZonaPeligro)}
                className="text-[9px] sm:text-[10px] font-bold text-gray-400 hover:text-red-400 uppercase tracking-widest transition-colors"
              >
                Eliminar mi cuenta
              </button>
            </div>

          </div>
          
          <div className="w-full lg:w-5/12 flex flex-col bg-black/20">
            {/* PANEL SUSCRIPCIÓN */}
            <div className="p-6 sm:p-8 md:p-10 border-b border-white/10 flex flex-col">
              <h3 className="text-base sm:text-lg font-black text-white mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3 drop-shadow-sm">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-pink-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
                Tu Suscripción
              </h3>
              
              {user?.rol === 'admin' ? (
                <div className="bg-gradient-to-br from-gray-500/20 to-gray-600/10 border border-gray-400/30 rounded-[1.5rem] p-5 sm:p-6 text-center flex-grow flex flex-col justify-center items-center shadow-inner">
                  <p className="font-black text-white text-base sm:text-lg mb-1">Administrador</p>
                  <p className="text-[10px] sm:text-xs text-gray-400 font-medium">Acceso total sin restricciones a toda la plataforma.</p>
                </div>
              ) : suscripcionActiva ? (
                <div className="bg-gradient-to-br from-pink-500/20 to-pink-600/10 border border-pink-400/30 rounded-[1.5rem] p-5 sm:p-6 flex-grow flex flex-col shadow-inner">
                  <div className="flex justify-between items-center mb-4">
                    <span className="bg-pink-500/20 border border-pink-500/50 text-pink-300 font-black text-[8px] sm:text-[9px] px-2 sm:px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">Activa</span>
                    <span className="font-black text-white text-lg sm:text-xl text-right ml-2 leading-tight">{suscripcionActiva.tipo.replace('_', ' ').toUpperCase()}</span>
                  </div>
                  <div className="space-y-2 sm:space-y-3 mt-auto">
                    <div className="flex justify-between text-[10px] sm:text-xs items-center border-b border-white/10 pb-2">
                      <span className="text-gray-400 font-bold uppercase tracking-wider">Válida desde</span>
                      <span className="font-bold text-white ml-2 text-right">{formatearFecha(suscripcionActiva.fecha_inicio)}</span>
                    </div>
                    {suscripcionActiva.fecha_fin && (
                      <div className="flex justify-between text-[10px] sm:text-xs items-center">
                        <span className="text-gray-400 font-bold uppercase tracking-wider">Válida hasta</span>
                        <span className="font-bold text-white ml-2 text-right">{formatearFecha(suscripcionActiva.fecha_fin)}</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-white/5 border border-white/10 rounded-[1.5rem] p-5 sm:p-6 text-center flex-grow flex flex-col justify-center items-center shadow-inner">
                  <p className="font-black text-white text-xs sm:text-sm mb-1">Sin suscripción</p>
                  <p className="text-[10px] sm:text-xs text-gray-400 font-medium mb-4">Elimina marcas de agua y desbloquea todo.</p>
                  <Link to="/suscripciones" className="bg-sky-500 text-white font-black text-[9px] sm:text-[10px] uppercase tracking-widest px-5 sm:px-6 py-2 sm:py-2.5 rounded-xl hover:bg-sky-400 transition-all shadow-lg shadow-sky-500/30 active:scale-95">
                    Ver Planes
                  </Link>
                </div>
              )}
            </div>

            {/* PANEL COMPRAS INDIVIDUALES */}
            <div className="p-6 sm:p-8 md:p-10 flex-1 flex flex-col bg-black/10">
              <h3 className="text-base sm:text-lg font-black text-white mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3 drop-shadow-sm">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Compras Individuales
              </h3>

              <div className="flex-grow flex flex-col">
                {misCompras.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-5 sm:p-6 border border-white/5 rounded-[1.5rem] bg-white/5">
                    <p className="font-medium text-[10px] sm:text-xs text-gray-400">No has comprado ningún evento o paquete por separado.</p>
                  </div>
                ) : (
                  <ul className="space-y-3 max-h-[160px] sm:max-h-[180px] overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full">
                    {misCompras.map((compra, idx) => (
                      <li key={idx} className="flex justify-between items-center bg-white/5 p-3 sm:p-4 rounded-2xl shadow-sm border border-white/5 hover:border-white/20 transition-all group/item">
                        <div className="flex items-center gap-3 sm:gap-4 w-full">
                          <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-sky-500/10 border border-sky-500/20 rounded-xl flex items-center justify-center text-sky-400 font-bold shadow-inner overflow-hidden group-hover/item:border-sky-400/50 transition-colors">
                            {compra.imagen ? (
                              <img src={getUrlImagen(compra.imagen, compra.tipo)} alt={compra.item_nombre} className="w-full h-full object-cover opacity-90 group-hover/item:opacity-100 transition-opacity" />
                            ) : (
                              compra.tipo === 'evento' ? (
                                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                              ) : (
                                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                              )
                            )}
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-[8px] sm:text-[9px] font-black text-sky-400 uppercase tracking-widest mb-0.5 sm:mb-1">{compra.tipo}</p>
                            <p className="font-bold text-white text-xs sm:text-sm leading-tight truncate">{compra.item_nombre || 'Artículo Comprado'}</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* ZONA DE PELIGRO */}
        {mostrarZonaPeligro && (
          <div className="w-full max-w-6xl mx-auto mt-2 sm:mt-4 bg-gradient-to-br from-gray-500 to-red-400/70 border border-red-500/20 rounded-[1.5rem] sm:rounded-[2rem] p-6 sm:p-8 flex flex-col md:flex-row justify-between items-center gap-5 sm:gap-6 backdrop-blur-md text-center md:text-left">
            <div>
              <h4 className="text-lg sm:text-xl font-black text-red-400 mb-1.5 sm:mb-2">Eliminar Cuenta</h4>
              <p className="text-xs sm:text-sm text-white font-medium">Una vez elimines tu cuenta, perderás todo el acceso, compras e invitaciones de forma irreversible. Esta acción no se puede deshacer.</p>
            </div>
            <button 
              onClick={() => setModalBorrarCuenta(true)} 
              className="flex-shrink-0 w-full md:w-auto bg-white/60 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/50 font-black text-[10px] sm:text-[11px] uppercase tracking-widest px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl transition-all shadow-md active:scale-95 whitespace-nowrap mt-2 md:mt-0"
            >
              Borrar mi cuenta
            </button>
          </div>
        )}

      </ContenedorPrincipal>

      {/* Modal para el Avatar */}
      {mostrarModal && (
        <ImagenesPerfil onClose={() => setMostrarModal(false)} onConfirmar={actualizarImagen} avatarActual={datosUsuario.imagen} />
      )}

      {/* Modal Destructivo para Borrar Cuenta */}
      <ModalConfirmacion 
        isOpen={modalBorrarCuenta}
        titulo="¿Borrar cuenta definitivamente?"
        mensaje={`Estás a punto de eliminar la cuenta asociada a ${datosUsuario.correo}. Perderás todas tus invitaciones, estadísticas y acceso. Esta acción NO se puede deshacer.`}
        textoConfirmar="Sí, borrar mi cuenta"
        textoCancelar="Mantener mi cuenta"
        esDestructivo={true}
        onConfirm={manejarEliminarCuenta}
        onCancel={() => setModalBorrarCuenta(false)}
      />

    </div>
  );
};

export default PerfilUsuario;