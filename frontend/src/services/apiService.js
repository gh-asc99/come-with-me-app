import axios from 'axios';

// Detecta automáticamente si está en Vercel (producción) o en mi PC (desarrollo)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3300';

const api = axios.create({
  baseURL: API_URL,
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

// Función para limpiar la sesión desde los servicios (sin usar hooks)
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

    // 1. Llamo a la API para eliminar la cuenta en la base de datos
    const respuesta = await api.delete(`/auth/perfil/${idUsuario}`);
    
    // 2. Si tiene éxito, limpio la sesión localmente
    logout();

    return respuesta.data;
  } catch (error) {
    throw error.response?.data?.error || 'Error al eliminar la cuenta';
  }
};

export default api;