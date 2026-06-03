// src/components/creacion/FaseSeleccionPaquete.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useCreacion from "../../hooks/useCreacion.js";
import usePaquetes from "../../hooks/usePaquetes.js";
import useSesion from "../../hooks/useSesion.js";
import api from "../../services/apiService.js";
import Cargando from "../ui/Cargando.jsx"; // <-- IMPORTAMOS CARGANDO

const FaseSeleccionPaquete = () => {
  // ==========================================
  // 1. ZONA DE HOOKS
  // ==========================================
  const { datosCreacion, seleccionarPaquete, volverFaseAnterior } = useCreacion();
  const { paquetes, cargando, error } = usePaquetes(datosCreacion.evento?.id);
  const { user } = useSesion();
  const navegar = useNavigate();

  const [misCompras, setMisCompras] = useState([]);

  useEffect(() => {
    const cargarCompras = async () => {
      // Solo gastamos recursos en buscar compras si es un usuario base
      if (user && user.rol === 'user') {
        try {
          const res = await api.get('/compras/mis-compras');
          setMisCompras(res.data.map(c => c.evento_id || c.paquete_id));
        } catch (err) {
          console.error("Error cargando compras", err);
        }
      }
    };
    cargarCompras();
  }, [user]);

  // ==========================================
  // 2. FUNCIONES
  // ==========================================
  const getUrlImagen = (ruta) => {
    if (!ruta) return "https://via.placeholder.com/400x300?text=Paquete";
    if (ruta.startsWith("http")) return ruta;
    if (ruta.includes("uploads")) {
      const rutaLimpia = ruta.startsWith("/") ? ruta.substring(1) : ruta;
      return `http://localhost:3300/${rutaLimpia}`;
    }
    if (!ruta.includes("/")) return `/paquetes/${ruta}`;
    return ruta.startsWith("/") ? ruta : `/${ruta}`;
  };

  // ==========================================
  // PANTALLAS DE CARGA Y ERROR 
  // ==========================================
  if (cargando) return <Cargando mensaje="Cargando paquetes..." />;

  if (error)
    return (
      <div className="w-full max-w-6xl mx-auto bg-red-500/10 backdrop-blur-md border border-red-500/30 text-red-200 p-6 rounded-2xl shadow-sm text-center mt-10">
        <p className="font-bold tracking-wide">{error}</p>
      </div>
    );

  // ==========================================
  // 3. RENDERIZADO PRINCIPAL
  // ==========================================
  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col animate-fade-in-up">

      {/* ==================================================
          CABECERA DE CRISTAL OSCURO
          ================================================== */}
      <div className="w-full bg-black/25 backdrop-blur-2xl rounded-[2rem] sm:rounded-[2.5rem] border border-white/10 overflow-hidden mb-5">
        <div className="w-full bg-black/20 p-6 sm:p-8 md:px-12 md:py-6 flex flex-col items-center gap-4 sm:gap-6">
          <div className="text-center">
            <span className="bg-sky-500/20 text-sky-300 px-3 py-1.5 sm:px-4 sm:py-1.5 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] mb-4 sm:mb-5 inline-block border border-sky-500/30 shadow-sm">
              Selección de Paquete
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tighter drop-shadow-sm mb-2 leading-tight">
              Elige un paquete de
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-pink-300">
                {" "} {datosCreacion.evento?.nombre || "evento"}
              </span>
            </h1>
            <p className="text-gray-200 font-medium text-xs sm:text-sm md:text-base drop-shadow-sm mt-3 sm:mt-4">
              Selecciona el plan que mejor se adapte a lo que necesitas crear.
            </p>
          </div>
        </div>
      </div>

      {/* ==================================================
          GRILLA DE PAQUETES
          ================================================== */}
      {paquetes.length === 0 ? (
        <div className="w-full flex-1 bg-black/20 backdrop-blur-2xl p-8 sm:p-12 rounded-[2rem] sm:rounded-[2.5rem] border border-white/10 flex flex-col items-center justify-center text-center shadow-inner min-h-[300px]">
          <svg className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mb-4 drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <p className="text-lg sm:text-xl font-black text-white mb-2 tracking-tight">
            No hay paquetes disponibles.
          </p>
          <p className="text-xs sm:text-sm text-gray-300 font-medium">
            Actualmente no hay paquetes configurados para esta temática.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
          {paquetes.map((paquete) => {
            const haComprado = misCompras.includes(paquete.id);
            const estaBloqueado = paquete.bloqueado && user?.rol === "user" && !haComprado;

            return (
              <div
                key={paquete.id}
                onClick={() => !estaBloqueado && seleccionarPaquete(paquete)}
                className={`relative overflow-hidden rounded-[2rem] transition-all duration-300 transform aspect-[3/4] flex flex-col justify-end border border-white/10 ${
                  estaBloqueado
                    ? "cursor-not-allowed opacity-90"
                    : "hover:shadow-[0_20px_50px_rgba(244,114,182,0.25)] cursor-pointer hover:-translate-y-2 hover:border-pink-400/50 group"
                }`}
              >
                <img
                  src={getUrlImagen(paquete.imagen)}
                  alt={paquete.nombre}
                  className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 z-0 ${!estaBloqueado ? "group-hover:scale-110" : ""}`}
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/400x300?text=Paquete";
                  }}
                />

                <div
                  className={`absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent z-10 transition-opacity duration-500 ${!estaBloqueado ? "group-hover:from-black" : ""}`}
                ></div>

                {/* --- CAPA DE BLOQUEO --- */}
                {estaBloqueado && (
                  <div className="absolute inset-0 bg-black/80 z-30 flex flex-col items-center justify-center p-4 sm:p-6 text-center backdrop-blur-md">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-12 h-12 sm:w-16 sm:h-16 text-white/40 mb-3 sm:mb-4 drop-shadow-md">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                    <p className="text-gray-300 text-xs sm:text-sm font-medium leading-relaxed drop-shadow-sm px-2">
                      Para desbloquear el paquete <br />
                      <span className="text-base sm:text-lg font-black text-white mt-1 inline-block leading-tight">
                        {paquete.nombre}
                      </span>
                    </p>
                    <div className="mt-5 sm:mt-6 flex flex-col xl:flex-row items-center justify-center gap-2.5 sm:gap-3 w-full px-2 sm:px-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navegar(`/comprar/paquete/${paquete.id}`);
                        }}
                        className="w-full xl:w-auto bg-sky-500 text-white font-black text-[9px] sm:text-[10px] tracking-widest uppercase px-4 sm:px-6 py-3 sm:py-3.5 rounded-full hover:bg-sky-400 transition-all shadow-lg active:scale-95"
                      >
                        CÓMPRALO
                      </button>
                      <span className="text-white/50 font-bold text-[10px] sm:text-xs">o</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navegar("/suscripciones");
                        }}
                        className="w-full xl:w-auto bg-pink-500 text-white font-black text-[9px] sm:text-[10px] tracking-widest uppercase px-4 sm:px-6 py-3 sm:py-3.5 rounded-full hover:bg-pink-400 transition-all shadow-lg active:scale-95"
                      >
                        SUSCRÍBETE
                      </button>
                    </div>
                  </div>
                )}

                <div className="relative z-20 p-6 sm:p-8 flex flex-col justify-end items-center text-center h-full mt-auto">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white mb-2 sm:mb-3 drop-shadow-md tracking-tight">
                    {paquete.nombre}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-300 line-clamp-3 drop-shadow-sm font-medium">
                    {paquete.descripcion}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Usamos max-w-6xl mx-auto para asegurar que respete el mismo ancho del perfil */}
        <div className="w-full max-w-6xl mx-auto mt-6">
          <button 
            onClick={volverFaseAnterior}
            className="flex w-full sm:w-auto justify-center sm:justify-start items-center text-pink-300 bg-white hover:bg-pink-300 hover:text-white backdrop-blur-md px-5 py-3 sm:py-2.5 rounded-full font-black text-[9px] sm:text-[10px] uppercase tracking-widest transition-all shadow-sm group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
            </svg>
            Volver a la selección del evento
          </button>
        </div>
        
    </div>
  );
};

export default FaseSeleccionPaquete;