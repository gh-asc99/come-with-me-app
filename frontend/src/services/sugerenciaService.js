import api from './apiService';

export const obtenerSugerencias = async (eventoId, paqueteId) => {
  try {
    const respuesta = await api.get('/sugerencias', {
      params: { evento_id: eventoId, paquete_id: paqueteId }
    });
    return respuesta.data;
  } catch (error) {
    throw error.response?.data?.error || 'Error al obtener los campos del formulario';
  }
};