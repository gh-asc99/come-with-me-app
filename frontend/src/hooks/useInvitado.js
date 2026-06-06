import { useState, useEffect, useCallback } from 'react';
import { obtenerInvitados, agregarInvitado as apiAgregar, eliminarInvitado as apiEliminar } from '../services/invitadoService.js';

export const useInvitados = (idInvitacion) => {
  const [invitados, setInvitados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const cargarInvitados = useCallback(async () => {
    setCargando(true);
    try {
      const data = await obtenerInvitados(idInvitacion);
      setInvitados(data);
    } catch (err) {
      setError(err);
      console.error(err);
    } finally {
      setCargando(false);
    }
  }, [idInvitacion]);

  useEffect(() => {
    if (idInvitacion) cargarInvitados();
  }, [idInvitacion, cargarInvitados]);

  const agregarInvitado = async (datos) => {
    try {
      const nuevo = await apiAgregar(idInvitacion, datos);
      setInvitados(prev => [...prev, nuevo]);
      return { success: true };
    } catch (err) {
      return { success: false, error: err };
    }
  };

  const eliminarInvitado = async (idInvitado) => {
    try {
      await apiEliminar(idInvitado);
      setInvitados(prev => prev.filter(inv => inv.id !== idInvitado));
      return { success: true };
    } catch (err) {
      return { success: false, error: err };
    }
  };

  return {
    invitados,
    cargando,
    error,
    agregarInvitado,
    eliminarInvitado,
    recargar: cargarInvitados
  };
};