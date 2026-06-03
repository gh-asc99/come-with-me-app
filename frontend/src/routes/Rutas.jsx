import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Inicio from '../pages/Inicio.jsx'
import Suscripciones from '../pages/Suscripciones.jsx'
import AcercaDe from '../pages/AcercaDe.jsx'
import AccesoApp from '../pages/AccesoApp.jsx'
import PerfilUsuario from '../pages/PerfilUsuario.jsx'
import NuevaCreacion from '../pages/NuevaCreacion.jsx'
import VisualizadorInvitacion from '../pages/VisualizadorInvitacion.jsx'
import HistorialCreaciones from '../pages/HistorialCreaciones.jsx'
import GestionInvitados from '../pages/GestionInvitados.jsx'
import VistaInvitado from '../pages/VistaInvitado.jsx'
import EditarInvitacion from '../pages/EditarInvitacion.jsx'
import RutaAdmin from '../components/auth/RutaAdmin.jsx';
import AdminLayout from '../components/layout/AdminLayout.jsx';
import GestionEventos from '../pages/admin/GestionEventos.jsx'
import GestionPaquetes from '../pages/admin/GestionPaquetes.jsx'
import GestionSugerencias from '../pages/admin/GestionSugerencias.jsx'
import GestionUsuarios from '../pages/admin/GestionUsuarios.jsx'
import GestionPlanes from '../pages/admin/GestionPlanes.jsx'
import GestionEstadisticas from '../pages/admin/GestionEstadisticas.jsx'
import GestionCompras from '../pages/admin/GestionCompras.jsx'
import Checkout from '../pages/Checkout.jsx'
import AccesoUsuario from '../pages/AccesoUsuario.jsx'
import Error from '../pages/Error.jsx';

const Rutas = () => {
  return (
    <>
        <Routes>
            <Route path="*" element={<Error />} />
            <Route path='/' element={<Inicio/>}/>
            <Route path='/acceso-usuario' element={<AccesoUsuario/>}/>
            <Route path='/suscripciones' element={<Suscripciones/>}/>
            <Route path='/acerca-de' element={<AcercaDe/>}/>
            <Route path='/acceso-app' element={<AccesoApp/>}/>
            <Route path='/perfil-usuario' element={<PerfilUsuario/>}/>
            <Route path='/nueva-creacion' element={<NuevaCreacion/>}/>
            <Route path="/invitacion/:id" element={<VisualizadorInvitacion />} />
            <Route path='/mis-creaciones' element={<HistorialCreaciones/>}/>
            <Route path="/gestion-invitados/:id" element={<GestionInvitados />} />
            <Route path="/invitacion/:idInvitacion/invitado/:idInvitado" element={<VistaInvitado />} />
            <Route path="/editar-invitacion/:id" element={<EditarInvitacion />} />
            <Route path="/comprar/:tipo/:id" element={<Checkout />} />
            {/* --- ZONA PROTEGIDA: ADMINISTRADOR --- */}
            <Route element={<RutaAdmin />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin/dashboard" element={<GestionEstadisticas />} />
                <Route path="/admin/usuarios" element={<GestionUsuarios />} />
                
                <Route path="/admin/eventos" element={<GestionEventos />} />
                <Route path="/admin/paquetes" element={<GestionPaquetes />} />
                <Route path="/admin/sugerencias" element={<GestionSugerencias />} />
                <Route path="/admin/planes" element={<GestionPlanes />} />
                <Route path="/admin/compras" element={<GestionCompras />} />
              </Route>
            </Route>
            
        </Routes>
    </>
  )
}

export default Rutas