import api from './apiService';

export const obtenerPaquetesPorEvento = async (eventoId) => {
  try {
    const respuesta = await api.get(`/paquetes/evento/${eventoId}`);
    return respuesta.data;
  } catch (error) {
    throw error.response?.data?.error || 'Error al obtener los paquetes de este evento';
  }
};