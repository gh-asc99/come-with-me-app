import api from './apiService.js';

export const obtenerSuscripciones = async () => {
  try {
    const respuesta = await api.get('/suscripciones');
    return respuesta.data;
  } catch (error) {
    console.error("Error obteniendo los planes de suscripción:", error);
    throw error;
  }
};