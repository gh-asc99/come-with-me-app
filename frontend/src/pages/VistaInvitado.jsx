import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  obtenerInvitadoPublico,
  responderAsistencia,
} from "../services/invitadoService.js";
import { obtenerInvitacionPublica } from "../services/invitacionService.js";
import RenderizadorPlantilla from '../components/plantillas/RenderizadorPlantilla.jsx';
import Cargando from "../components/ui/Cargando.jsx";

const VistaInvitado = () => {
  const { idInvitacion, idInvitado } = useParams();
  const navegar = useNavigate();

  const [invitacion, setInvitacion] = useState(null);
  const [invitado, setInvitado] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [datosInvitacion, datosInvitado] = await Promise.all([
          obtenerInvitacionPublica(idInvitacion),
          obtenerInvitadoPublico(idInvitado),
        ]);

        if (typeof datosInvitacion.datos_extra === 'string') {
          datosInvitacion.datos_extra = JSON.parse(datosInvitacion.datos_extra);
        }

        setInvitacion(datosInvitacion);
        setInvitado(datosInvitado);
      } catch (err) {
        setError("No hemos podido cargar la invitación. Puede que el enlace sea incorrecto o haya sido eliminada.");
      } finally {
        setCargando(false);
      }
    };
    cargarDatos();
  }, [idInvitacion, idInvitado]);

  const manejarRespuesta = async (nuevoEstado) => {
    setEnviando(true);
    try {
      await responderAsistencia(idInvitado, nuevoEstado);
      setInvitado({ ...invitado, estado: nuevoEstado });
    } catch (err) {
      alert("Hubo un error al enviar tu respuesta.");
    } finally {
      setEnviando(false);
    }
  };

  if (cargando) return <Cargando mensaje="Abriendo invitación " />;
  
  if (error) return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center text-center px-4 bg-sky-50">
      <div className="bg-white p-8 rounded-[2rem] shadow-xl max-w-md w-full border border-gray-100">
        <h2 className="text-xl sm:text-2xl font-black text-[#252525] mb-3 sm:mb-4 tracking-tight">Ups, algo salió mal</h2>
        <p className="text-sm sm:text-base text-gray-500 font-medium mb-6">{error}</p>
        <button onClick={() => navegar('/')} className="w-full bg-pink-300 text-white font-black text-[10px] sm:text-xs uppercase tracking-widest px-6 py-3.5 sm:py-4 rounded-xl hover:bg-pink-400 transition-colors shadow-sm active:scale-95">
          Ir a la página principal
        </button>
      </div>
    </div>
  );

  let urlImagen = null; 
  if (invitacion?.imagen) {
    if (invitacion.imagen.startsWith('http')) {
      urlImagen = invitacion.imagen;
    } else if (invitacion.imagen.includes('uploads')) {
      urlImagen = `http://localhost:3300/${invitacion.imagen.replace(/^\//, '')}`;
    } else {
      urlImagen = `/${invitacion.imagen.replace(/^\//, '')}`;
    }
  }

  return (
    <div className="min-h-screen bg-sky-50 flex flex-col items-center pb-24 sm:pb-20 relative">
      
      {/* INVITACIÓN REAL (Usando el RenderizadorPlantilla) */}
      <div className="max-w-4xl w-full mt-6 sm:mt-10 px-2 sm:px-4">
        {/* El invitado ve exactamente la misma plantilla que el creador diseñó */}
        <RenderizadorPlantilla 
          invitacion={invitacion} 
          urlImagen={urlImagen} 
        />
      </div>

      {invitado && (
        <div className="w-full bg-white/80 sm:bg-transparent backdrop-blur-xl border-t border-white/20 fixed bottom-0 z-50 animate-fade-in-up shadow-[0_-10px_30px_rgba(0,0,0,0.05)] sm:shadow-none">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
            
            {/* Mensaje de bienvenida al invitado */}
            <div className="text-center sm:text-left w-full sm:w-auto">
              <p className="text-[9px] sm:text-[10px] font-bold text-gray-500 sm:text-gray-400 uppercase tracking-widest mb-0.5 sm:mb-1">
                Invitación personal para
              </p>
              <p className="text-lg sm:text-xl font-black text-sky-500 drop-shadow-sm leading-none">
                {invitado.nombre}
              </p>
            </div>

            {/* Botones de acción / Estado actual */}
            <div className="flex items-center justify-center gap-2 sm:gap-3 w-full sm:w-auto">
              {invitado.estado === 'confirmado' ? (
                <div className="w-full sm:w-auto bg-emerald-500/10 sm:bg-emerald-500/20 border border-emerald-500/20 sm:border-emerald-500/30 text-emerald-500 sm:text-emerald-400 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl font-black text-xs sm:text-sm flex justify-center items-center gap-2 shadow-sm">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  Has confirmado asistencia
                </div>
              ) : invitado.estado === 'rechazado' ? (
                <div className="w-full sm:w-auto bg-red-500/10 sm:bg-red-500/20 border border-red-500/20 sm:border-red-500/30 text-red-500 sm:text-red-400 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl font-black text-xs sm:text-sm flex justify-center items-center gap-2 shadow-sm">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  Has declinado
                </div>
              ) : (
                <>
                  <button 
                    onClick={() => manejarRespuesta('confirmado')}
                    disabled={enviando}
                    className="flex-1 sm:flex-none bg-pink-400 sm:bg-pink-300 hover:bg-pink-500 sm:hover:bg-pink-400 text-white font-black text-[10px] sm:text-[11px] uppercase tracking-widest px-4 sm:px-6 py-3 sm:py-3.5 rounded-xl transition-all active:scale-95 disabled:bg-gray-400 sm:disabled:bg-gray-600 disabled:shadow-none shadow-md sm:shadow-none"
                  >
                    {enviando ? 'Enviando...' : 'Sí, asistiré'}
                  </button>
                  <button 
                    onClick={() => manejarRespuesta('rechazado')}
                    disabled={enviando}
                    className="flex-1 sm:flex-none bg-gray-100 sm:bg-gray-400/10 hover:bg-gray-200 sm:hover:bg-gray-400/30 border border-gray-200 sm:border-gray-400/20 text-gray-500 sm:text-gray-400 font-black text-[10px] sm:text-[11px] uppercase tracking-widest px-4 sm:px-6 py-3 sm:py-3.5 rounded-xl transition-all active:scale-95 disabled:opacity-50"
                  >
                    No puedo
                  </button>
                </>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default VistaInvitado;