import api from './apiService';

export const obtenerEventos = async () => {
  try {
    const respuesta = await api.get('/eventos'); 
    return respuesta.data;
  } catch (error) {
    throw error.response?.data?.error || 'Error al obtener los eventos';
  }
};