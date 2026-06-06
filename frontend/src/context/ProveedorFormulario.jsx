import React, { createContext, useState, useEffect } from "react";
import useCreacion from "../hooks/useCreacion.js";
import { obtenerSugerencias } from "../services/sugerenciaService.js";
import { obtenerPlantillas } from "../services/plantillaService.js";

const ContextoFormulario = createContext();

const ProveedorFormulario = ({ children }) => {
  const { datosCreacion, generarInvitacionFinal } = useCreacion();

  const [sugerencias, setSugerencias] = useState([]);
  const [plantillas, setPlantillas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const [datosFijos, setDatosFijos] = useState({
    titulo: "",
    mensaje: "",
    fecha_evento: "",
    hora_inicio: "",
    lugar: "",
    imagen: ""
  });
  const [datosDinamicos, setDatosDinamicos] = useState({});
  const [plantillaSeleccionada, setPlantillaSeleccionada] = useState(null);

  useEffect(() => {
    setDatosFijos({
      titulo: "",
      mensaje: "",
      fecha_evento: "",
      hora_inicio: "",
      lugar: "",
      imagen: ""
    });
    setDatosDinamicos({});
    setPlantillaSeleccionada(null);
    setError(null);

    const eventoId = datosCreacion.evento?.id;
    const paqueteId = datosCreacion.paquete?.id;

    if (!eventoId || !paqueteId) {
      setCargando(false);
      return;
    }

    const cargarDatos = async () => {
      try {
        setCargando(true);
        const [datosSugerencias, datosPlantillas] = await Promise.all([
          obtenerSugerencias(eventoId, paqueteId),
          obtenerPlantillas(),
        ]);

        setSugerencias(datosSugerencias);
        setPlantillas(datosPlantillas);

        // INICIALIZAMOS LOS DATOS DINÁMICOS SEGÚN SU TIPO
        const iniciales = {};
        datosSugerencias.forEach(sug => {
          if (sug.tipo_campo === 'timeline') {
            iniciales[sug.titulo_campo] = [{ hora: '', titulo: 'Comienza el evento' }];
          } else if (sug.tipo_campo === 'listado') {
            iniciales[sug.titulo_campo] = [''];
          } else if (sug.tipo_campo === 'boolean') {
            iniciales[sug.titulo_campo] = false;
          } else {
            iniciales[sug.titulo_campo] = '';
          }
        });
        setDatosDinamicos(iniciales);

      } catch (err) {
        let textoError = 'Error de conexión al cargar los datos';
        if (typeof err === 'string') {
          textoError = err;
        } else if (err?.response?.data?.error) {
          textoError = String(err.response.data.error); 
        } else if (err?.message) {
          textoError = err.message;
        }
        setError(textoError);
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, [datosCreacion.evento?.id, datosCreacion.paquete?.id]);

  const manejarCambioFijo = (e) => {
    setDatosFijos({ ...datosFijos, [e.target.name]: e.target.value });
  };

  const manejarCambioDinamico = (nombreCampo, valor) => {
    setDatosDinamicos({ ...datosDinamicos, [nombreCampo]: valor });
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    if (!plantillaSeleccionada) {
      alert("Por favor, selecciona una estructura visual (plantilla) para continuar.");
      return;
    }

    // Se usa la imagen del paquete si el usuario no subió ninguna portada
    const imagenFinal = datosFijos.imagen || datosCreacion.paquete?.imagen;
    
    const datosFijosActualizados = {
      ...datosFijos,
      imagen: imagenFinal
    };

    await generarInvitacionFinal(
      datosFijosActualizados,
      datosDinamicos,
      plantillaSeleccionada,
    );
  };

  const datosInsertadosContexto = {
    sugerencias,
    plantillas,
    cargando,
    error,
    datosFijos,
    datosDinamicos,
    plantillaSeleccionada,
    setPlantillaSeleccionada,
    manejarCambioFijo,
    manejarCambioDinamico,
    manejarEnvio,
  };

  return (
    <ContextoFormulario.Provider value={datosInsertadosContexto}>
      {children}
    </ContextoFormulario.Provider>
  );
};

export default ProveedorFormulario;
export { ContextoFormulario };