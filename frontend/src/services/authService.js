import api from './apiService';

export const login = async (credenciales) => {
  try {
    const respuesta = await api.post('/auth/login', credenciales);
    const { token, user } = respuesta.data;

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    return user;
  } catch (error) {
    throw error.response?.data?.error || 'Error al iniciar sesión';
  }
};

export const register = async (datosRegistro) => {
  try {
    const respuesta = await api.post('/auth/register', datosRegistro);
    return respuesta.data;
  } catch (error) {
    throw error.response?.data?.error || 'Error al registrar usuario';
  }
};

export const update = async (datosUsuario) => {
  try {
    const usuarioSesion = JSON.parse(localStorage.getItem('user'));
    
    if (!usuarioSesion || !usuarioSesion.id) {
      throw new Error('No se encontró el ID del usuario en sesión');
    }

    const idUsuario = usuarioSesion.id; 

    const respuesta = await api.put(`/auth/perfil/${idUsuario}`, datosUsuario);

    const usuarioActualizado = { ...usuarioSesion, ...respuesta.data.usuario };
    localStorage.setItem('user', JSON.stringify(usuarioActualizado));

    return respuesta.data;
  } catch (error) {
    throw error.response?.data?.error || 'Error al actualizar el perfil';
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  delete api.defaults.headers.common['Authorization'];
};