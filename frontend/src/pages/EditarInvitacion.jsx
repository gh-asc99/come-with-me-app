// src/views/EditarInvitacion.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/apiService.js';
import { FormularioInvitacionUI } from '../components/creacion/FaseFormularioDinamico.jsx';
import ContenedorPrincipal from "../components/layout/ContenedorPrincipal.jsx";
import fondoMosaico from '../../public/fondo_mosaico.png'; 
import Cargando from '../components/ui/Cargando.jsx'; // <-- IMPORTAMOS CARGANDO

const EditarInvitacion = () => {
  const { id } = useParams();
  const navegar = useNavigate();
  
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [guardando, setGuardando] = useState(false);

  // Estados locales que simulan el "useFormulario"
  const [datosFijos, setDatosFijos] = useState({});
  const [datosDinamicos, setDatosDinamicos] = useState({});
  const [plantillaSeleccionada, setPlantillaSeleccionada] = useState('');
  const [paqueteId, setPaqueteId] = useState(''); 
  
  // Listas de apoyo y datos originales
  const [plantillasDisponibles, setPlantillasDisponibles] = useState([]);
  const [sugerencias, setSugerencias] = useState([]); 
  const [paqueteOriginal, setPaqueteOriginal] = useState(null);

  // Helper a prueba de balas para garantizar que sacamos un String válido
  const formatearID = (idRaw) => {
    if (!idRaw) return null;
    let hex = '';
    if (typeof idRaw === 'string') {
      hex = idRaw.replace(/-/g, '');
    } else if (idRaw.type === 'Buffer' && Array.isArray(idRaw.data)) {
      hex = idRaw.data.map(b => b.toString(16).padStart(2, '0')).join('');
    } else {
      return null;
    }
    if (hex.length === 32) {
      return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
    }
    return idRaw;
  };

  useEffect(() => {
    const cargarTodo = async () => {
      try {
        const resInvitacion = await api.get(`/invitaciones/${id}`);
        const inv = resInvitacion.data;

        // Limpiamos los IDs antes de enviarlos a Axios para evitar "[object Object]"
        const evtIdLimpio = formatearID(inv.evento_id);
        const paqIdLimpio = formatearID(inv.paquete_id);
        const plantillaLimpia = formatearID(inv.plantilla_id);

        const paramsSugerencias = {};
        if (evtIdLimpio) paramsSugerencias.evento_id = evtIdLimpio;
        if (paqIdLimpio) paramsSugerencias.paquete_id = paqIdLimpio;

        const [resPlantillas, resSugerencias] = await Promise.all([
          api.get('/plantillas'),
          api.get('/sugerencias', { params: paramsSugerencias }).catch(() => ({ data: [] }))
        ]);

        setDatosFijos({
          titulo: inv.titulo,
          lugar: inv.lugar,
          fecha_evento: inv.fecha_evento ? inv.fecha_evento.split('T')[0] : '',
          hora_inicio: inv.hora_inicio || '',
          mensaje: inv.mensaje || '',
          imagen: inv.imagen || ''
        });

        setDatosDinamicos(inv.datos_extra || {});
        setPlantillasDisponibles(resPlantillas.data);
        setSugerencias(resSugerencias.data);
        
        setPlantillaSeleccionada(plantillaLimpia || '');
        setPaqueteId(paqIdLimpio || '');

        if (paqIdLimpio) {
          try {
            const resPaquete = await api.get(`/paquetes/${paqIdLimpio}`);
            setPaqueteOriginal(resPaquete.data);
          } catch (errPaquete) {
            console.error("No se pudo cargar el paquete asociado.");
          }
        }

      } catch (err) {
        setError('No se pudo cargar la información para editar.');
      } finally {
        setCargando(false);
      }
    };

    cargarTodo();
  }, [id]);

  const manejarCambioFijo = (e) => {
    setDatosFijos({ ...datosFijos, [e.target.name]: e.target.value });
  };

  const manejarCambioDinamico = (nombreCampo, valor) => {
    setDatosDinamicos({ ...datosDinamicos, [nombreCampo]: valor });
  };

  // Usamos la misma función interceptora que en crear para no enviar opcionales vacíos
  const manejarEnvio = async (e) => {
    if (e?.preventDefault) e.preventDefault();
    
    setGuardando(true);
    
    const payload = {
      ...datosFijos,
      datos_extra: datosDinamicos,
      plantilla_id: plantillaSeleccionada,
      paquete_id: paqueteId
    };

    try {
      await api.patch(`/invitaciones/${id}`, payload);
      navegar('/mis-creaciones');
    } catch (err) {
      console.log("Error detallado del Backend:", err.response?.data);
      alert("Hubo un error al guardar los cambios. Revisa la consola.");
      setGuardando(false);
    }
  };

  if (cargando) return <Cargando mensaje="Cargando entorno de edición..." />;

  return (
    <div className="relative min-h-[calc(100vh-64px)] w-full overflow-hidden flex flex-col items-center py-6 sm:py-10 bg-sky-50">
      
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${fondoMosaico})` }}
      >
        <div className="absolute inset-0 bg-black/10"></div>
      </div>

      <ContenedorPrincipal className="relative z-10 w-full animate-fade-in-up flex flex-col">
        <div className="w-full max-w-6xl mx-auto flex flex-col">
          
          {error && (
            <div className="w-full mb-6 bg-red-500/10 backdrop-blur-md border border-red-500/30 text-red-200 p-4 rounded-2xl shadow-sm flex items-center gap-3">
               <svg className="w-5 h-5 flex-shrink-0 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              <p className="text-sm font-bold">{error}</p>
            </div>
          )}

          <FormularioInvitacionUI 
            tituloCabecera="Editar Invitación"
            subtituloCabecera="Modifica los campos necesarios y guarda los cambios para que se apliquen al instante."
            datosFijos={datosFijos}
            datosDinamicos={datosDinamicos}
            sugerencias={sugerencias} 
            plantillas={plantillasDisponibles}
            plantillaSeleccionada={plantillaSeleccionada}
            manejarCambioFijo={manejarCambioFijo}
            manejarCambioDinamico={manejarCambioDinamico}
            setPlantillaSeleccionada={setPlantillaSeleccionada}
            manejarEnvio={manejarEnvio}
            volverFaseAnterior={null} 
            textoBoton="Actualizar invitación"
            cargandoAccion={guardando}
            imagenPaquete={paqueteOriginal?.imagen}
          />

        </div>
      </ContenedorPrincipal>
    </div>
  );
};

export default EditarInvitacion;