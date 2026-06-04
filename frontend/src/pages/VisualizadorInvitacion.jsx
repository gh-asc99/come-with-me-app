// src/pages/VisualizadorInvitacion.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { obtenerInvitacionPorId } from '../services/invitacionService.js';
import RenderizadorPlantilla from '../components/plantillas/RenderizadorPlantilla.jsx';
import Cargando from '../components/ui/Cargando.jsx'; // <-- IMPORTAMOS CARGANDO

const VisualizadorInvitacion = () => {
  const { id } = useParams();
  const navegar = useNavigate();
  
  const [invitacion, setInvitacion] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarInvitacion = async () => {
      try {
        const data = await obtenerInvitacionPorId(id);
        if (typeof data.datos_extra === 'string') {
          data.datos_extra = JSON.parse(data.datos_extra);
        }
        setInvitacion(data);
      } catch (err) {
        setError(err);
      } finally {
        setCargando(false);
      }
    };
    cargarInvitacion();
  }, [id]);

  if (cargando) return <Cargando mensaje="Preparando invitación " />;
  
  if (error) return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center text-center px-4 bg-sky-50">
      <h2 className="text-2xl sm:text-3xl font-black text-red-500 mb-4 tracking-tight">Ups, algo salió mal</h2>
      <p className="text-sm sm:text-base text-gray-600 font-medium mb-6">{error}</p>
      <button onClick={() => navegar(-1)} className="text-pink-500 hover:text-pink-400 underline font-black text-sm uppercase tracking-widest transition-colors">Volver atrás</button>
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
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 flex flex-col items-center py-6 sm:py-10">
      
      <div className="max-w-4xl w-full px-4 sm:px-6">
        <RenderizadorPlantilla 
          invitacion={invitacion} 
          urlImagen={urlImagen} 
        />
      </div>

      <div className="w-full max-w-4xl mx-auto mt-8 sm:mt-12 px-4 sm:px-6">
        <button 
          onClick={() => navegar('/mis-creaciones')}
          className="flex items-center justify-center w-full sm:w-auto text-pink-400 bg-white hover:bg-pink-400 hover:text-white backdrop-blur-md px-6 py-3.5 sm:px-8 sm:py-4 rounded-2xl font-black text-[10px] sm:text-[11px] uppercase tracking-widest transition-all shadow-md group border border-pink-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Volver a mis creaciones
        </button>
      </div>
    </div>
  );
};

export default VisualizadorInvitacion;