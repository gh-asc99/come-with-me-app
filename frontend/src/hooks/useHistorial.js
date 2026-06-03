// src/hooks/useHistorial.js
import { useState, useEffect, useCallback } from 'react';
import { obtenerMisInvitaciones, eliminarInvitacion as apiEliminar } from '../services/invitacionService.js';

export const useHistorial = () => {
  const [invitaciones, setInvitaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // useCallback asegura que la función no se redibuje innecesariamente
  const cargarHistorial = useCallback(async () => {
    setCargando(true);
    try {
      const data = await obtenerMisInvitaciones();
      setInvitaciones(data);
    } catch (err) {
      setError(err);
      console.error(err);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarHistorial();
  }, [cargarHistorial]);

  // Función envuelta para manejar la lógica y devolver un resultado limpio a la UI
  const eliminarInvitacion = async (id) => {
    try {
      await apiEliminar(id);
      // Actualizamos el estado local filtrando la invitación eliminada
      setInvitaciones(prev => prev.filter(inv => inv.id !== id));
      return { success: true };
    } catch (err) {
      return { success: false, error: err };
    }
  };

  return {
    invitaciones,
    cargando,
    error,
    eliminarInvitacion,
    recargar: cargarHistorial
  };
};