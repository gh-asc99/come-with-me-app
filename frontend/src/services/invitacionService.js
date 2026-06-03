import api from './apiService';

export const crearInvitacion = async (datosInvitacion) => {
  try {
    const respuesta = await api.post('/invitaciones', datosInvitacion);
    return respuesta.data;
  } catch (error) {
    throw error.response?.data?.error || 'Error al generar la invitación';
  }
};

export const obtenerInvitacionPorId = async (id) => {
  try {
    const respuesta = await api.get(`/invitaciones/${id}`);
    return respuesta.data;
  } catch (error) {
    throw error.response?.data?.error || 'Error al cargar la invitación';
  }
};

export const obtenerInvitacionPublica = async (id) => {
  try {
    const respuesta = await api.get(`/invitaciones/publica/${id}`);
    return respuesta.data;
  } catch (error) {
    throw error.response?.data?.error || 'Error al cargar la invitación pública';
  }
};

export const obtenerMisInvitaciones = async () => {
  try {
    const respuesta = await api.get('/invitaciones');
    return respuesta.data;
  } catch (error) {
    throw error.response?.data?.error || 'Error al cargar tu historial de invitaciones';
  }
};

export const eliminarInvitacion = async (id) => {
  try {
    const respuesta = await api.delete(`/invitaciones/${id}`);
    return respuesta.data;
  } catch (error) {
    throw error.response?.data?.error || 'No se pudo eliminar la invitación';
  }
};

export const subirImagen = async (archivoArchivo) => {
  const formData = new FormData();
  formData.append('archivo', archivoArchivo);

  try {
    const respuesta = await api.post('/upload/imagen', formData);
    return respuesta.data.url;
  } catch (error) {
    throw error.response?.data?.error || 'Error al subir la imagen';
  }
};