import { useState, useEffect } from 'react';
import { obtenerPaquetesPorEvento } from '../services/paqueteService.js';

const usePaquetes = (eventoId) => {
  const [paquetes, setPaquetes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!eventoId) {
      setCargando(false);
      return;
    }

    const cargarPaquetes = async () => {
      try {
        setCargando(true);
        const data = await obtenerPaquetesPorEvento(eventoId);
        setPaquetes(data);
      } catch (err) {
        setError(err);
      } finally {
        setCargando(false);
      }
    };

    cargarPaquetes();
  }, [eventoId]);

  return { paquetes, cargando, error };
};

export default usePaquetes;