import { useState, useEffect } from 'react';
import { obtenerEventos } from '../services/eventoService.js';

const useEventos = () => {
  const [eventos, setEventos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarEventos = async () => {
      try {
        setCargando(true);
        const data = await obtenerEventos();
        setEventos(data);
      } catch (err) {
        setError(err);
      } finally {
        setCargando(false);
      }
    };

    cargarEventos();
  }, []);

  return { eventos, cargando, error };
};

export default useEventos;