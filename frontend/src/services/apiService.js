// src/services/apiService.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3300',
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); 
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Función nativa para limpiar la sesión desde los servicios (sin usar hooks)
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  delete api.defaults.headers.common['Authorization'];
};

export const eliminarCuenta = async () => {
  try {
    const usuarioSesion = JSON.parse(localStorage.getItem('user'));
    
    if (!usuarioSesion || !usuarioSesion.id) {
      throw new Error('No se encontró el ID del usuario en sesión');
    }

    const idUsuario = usuarioSesion.id; 

    // 1. Llamamos a la API para eliminar la cuenta en la base de datos
    const respuesta = await api.delete(`/auth/perfil/${idUsuario}`);
    
    // 2. Si tiene éxito, limpiamos la sesión localmente
    logout();

    return respuesta.data;
  } catch (error) {
    throw error.response?.data?.error || 'Error al eliminar la cuenta';
  }
};

// Asegúrate de que el resto de tus funciones (login, register, update...) 
// también estén en este archivo si las exportas desde aquí.

export default api;