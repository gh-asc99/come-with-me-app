import api from './apiService';

export const obtenerInvitados = async (idInvitacion) => {
  try {
    const respuesta = await api.get(`/invitados/invitacion/${idInvitacion}`);
    return respuesta.data;
  } catch (error) {
    throw error.response?.data?.error || 'Error al cargar los invitados';
  }
};

export const agregarInvitado = async (idInvitacion, datosInvitado) => {
  try {
    const payload = { ...datosInvitado, invitacion_id: idInvitacion };

    const respuesta = await api.post('/invitados', payload);
    return respuesta.data;
  } catch (error) {
    console.error("Detalles del Bad Request:", error.response?.data?.error);
    
    const mensajeError = error.response?.data?.error;
    const mensajeAmigable = Array.isArray(mensajeError) 
      ? mensajeError[0].message
      : mensajeError || 'Error al añadir el invitado';

    throw mensajeAmigable;
  }
};

export const eliminarInvitado = async (idInvitado) => {
  try {
    const respuesta = await api.delete(`/invitados/${idInvitado}`);
    return respuesta.data;
  } catch (error) {
    throw error.response?.data?.error || 'Error al eliminar el invitado';
  }
};

export const obtenerInvitadoPublico = async (idInvitado) => {
  try {
    const respuesta = await api.get(`/invitados/publico/${idInvitado}`);
    return respuesta.data;
  } catch (error) {
    throw error.response?.data?.error || 'Error al identificar al invitado';
  }
};

export const responderAsistencia = async (idInvitado, estado) => {
  try {
    const respuesta = await api.patch(`/invitados/publico/${idInvitado}`, { estado });
    return respuesta.data;
  } catch (error) {
    throw error.response?.data?.error || 'Error al enviar la respuesta';
  }
};