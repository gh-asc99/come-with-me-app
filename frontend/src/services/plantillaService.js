import api from './apiService';

export const obtenerPlantillas = async () => {
  try {
    const respuesta = await api.get('/plantillas');
    return respuesta.data;
  } catch (error) {
    throw error.response?.data?.error || 'Error al obtener las plantillas';
  }
};