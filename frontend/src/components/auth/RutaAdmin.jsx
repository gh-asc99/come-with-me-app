import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useSesion from '../../hooks/useSesion';

const RutaAdmin = () => {
  const { isAuth, user } = useSesion();

  // Si no está logueado, o si su rol no es 'admin', lo echamos
  if (!isAuth || user?.rol !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // Si es admin, le dejamos pasar y renderizamos las rutas hijas
  return <Outlet />;
};

export default RutaAdmin;