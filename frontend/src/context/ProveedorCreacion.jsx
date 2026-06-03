import React, { createContext, useState } from 'react';
import { crearInvitacion } from '../services/invitacionService.js';

const ContextoCreacion = createContext();

const ProveedorCreacion = ({ children }) => {
  const [faseActual, setFaseActual] = useState(1);
  const [datosCreacion, setDatosCreacion] = useState({
    evento: null,
    paquete: null,
    plantilla: null,
    datosFijos: null,
    datosExtra: null,
    invitacionGenerada: null // Aquí guardaremos la respuesta del backend
  });

  // Estados para controlar el botón de la Fase 3
  const [cargandoCreacion, setCargandoCreacion] = useState(false);
  const [errorCreacion, setErrorCreacion] = useState(null);

  const seleccionarEvento = (eventoSeleccionado) => {
    setDatosCreacion(prev => ({ ...prev, evento: eventoSeleccionado }));
    setFaseActual(2);
  };

  const seleccionarPaquete = (paqueteSeleccionado) => {
    setDatosCreacion(prev => ({ ...prev, paquete: paqueteSeleccionado }));
    setFaseActual(3);
  };

  // --- NUEVA FUNCIÓN PARA LA FASE 3 ---
  const generarInvitacionFinal = async (datosFijos, datosDinamicos, plantillaId) => {
    setCargandoCreacion(true);
    setErrorCreacion(null);
    
    try {
      // Construimos el objeto tal y como lo espera tu base de datos
      const payload = {
        titulo: datosFijos.titulo,
        mensaje: datosFijos.mensaje,
        fecha_evento: datosFijos.fecha_evento,
        lugar: datosFijos.lugar,
        imagen: datosFijos.imagen,
        hora_inicio: datosFijos.hora_inicio,
        paquete_id: datosCreacion.paquete?.id,
        plantilla_id: plantillaId,
        datos_extra: datosDinamicos,
      };

      const nuevaInvitacion = await crearInvitacion(payload);
      
      // Actualizamos el contexto con todo lo que hemos generado
      setDatosCreacion(prev => ({ 
        ...prev, 
        datosFijos,
        datosExtra: datosDinamicos, 
        plantilla: plantillaId,
        invitacionGenerada: nuevaInvitacion
      }));
      
      // ¡Avanzamos a la fase de éxito/compartir!
      setFaseActual(4); 
      return { success: true };

    } catch (err) {
      let textoError = 'Error al generar la invitación';
      if (typeof err === 'string') textoError = err;
      else if (err?.response?.data?.error) textoError = String(err.response.data.error);
      else if (err?.message) textoError = err.message;
      
      setErrorCreacion(textoError);
      return { success: false };
    } finally {
      setCargandoCreacion(false);
    }
  };

  const volverFaseAnterior = () => {
    setFaseActual(prev => Math.max(1, prev - 1));
  };

  const reiniciarCreacion = () => {
    setFaseActual(1);
    setDatosCreacion({
      evento: null,
      paquete: null,
      plantilla: null,
      datosFijos: null,
      datosExtra: null,
      invitacionGenerada: null
    });
    setErrorCreacion(null);
  };

  const datosInsertadosContexto = {
    faseActual,
    datosCreacion,
    seleccionarEvento,
    seleccionarPaquete,
    generarInvitacionFinal,
    cargandoCreacion,
    errorCreacion,
    volverFaseAnterior,
    reiniciarCreacion
  };

  return (
    <ContextoCreacion.Provider value={datosInsertadosContexto}>
      {children}
    </ContextoCreacion.Provider>
  );
};

export default ProveedorCreacion;
export { ContextoCreacion };