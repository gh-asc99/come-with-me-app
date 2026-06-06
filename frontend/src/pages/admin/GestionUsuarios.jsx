import React, { useState, useEffect } from 'react';
import api from '../../services/apiService';
import TarjetaUsuario from '../../pages/admin/TarjetaUsuario.jsx';
import ModalUsuario from '../../pages/admin/ModalUsuario.jsx';
import useSesion from '../../hooks/useSesion.js';
import ContenedorPrincipal from "../../components/layout/ContenedorPrincipal.jsx";
import Cargando from "../../components/ui/Cargando.jsx";

const GestionUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const { user } = useSesion();

  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  const cargarUsuarios = async () => {
    setCargando(true);
    try {
      const res = await api.get('/auth/usuarios'); 
      setUsuarios(res.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Error al cargar la lista de usuarios. Verifica la conexión con el backend.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const editarUsuario = (usuario) => {
    setUsuarioEditando(usuario);
    setMostrarModal(true);
  };

  const guardarEdicionUsuario = async (id, datosActualizados) => {
    try {
      await api.put(`/auth/usuarios/${id}`, datosActualizados);
      setMostrarModal(false);
      setUsuarioEditando(null);
      await cargarUsuarios();
    } catch (err) {
      console.error(err);
      alert('Hubo un error al intentar guardar los cambios.');
    }
  };

  const borrarUsuario = async (id, nombre) => {
    if (window.confirm(`¿Estás completamente seguro de que deseas eliminar al usuario "${nombre}"? Esta acción borrará todas sus compras, eventos e invitaciones.`)) {
      try {
        await api.delete(`/auth/usuarios/${id}`);
        await cargarUsuarios();
      } catch (err) {
        console.error(err);
        alert('Hubo un error al intentar eliminar el usuario.');
      }
    }
  };

  const usuariosFiltrados = usuarios.filter(u => {
    const termino = busqueda.toLowerCase();
    return (
      u.nombre.toLowerCase().includes(termino) || 
      u.correo.toLowerCase().includes(termino) ||
      u.rol.toLowerCase().includes(termino)
    );
  });

  if (cargando) return <Cargando mensaje="Cargando panel de usuarios..." />;

  return (
    <ContenedorPrincipal className="flex flex-col animate-fade-in-up">
      
      {/* CABECERA Y BUSCADOR (Estilo CRUD Admin) */}
      <div className="w-full bg-black/25 backdrop-blur-2xl rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 md:px-12 md:py-8 mb-5 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 sm:gap-6">
        <div className="text-left w-full xl:w-auto">
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tighter drop-shadow-sm leading-tight">Gestión de Usuarios</h1>
          <p className="text-xs sm:text-sm text-gray-300 mt-2 font-medium">Administra las cuentas, roles y accesos de la plataforma.</p>
        </div>
        
        <div className="relative w-full xl:w-96 flex-shrink-0 mt-2 xl:mt-0">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
          <input 
            type="text" 
            placeholder="Buscar por nombre, correo o rol"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 bg-black/40 border border-white/10 text-white placeholder-gray-500 rounded-xl sm:rounded-2xl focus:outline-none focus:border-sky-400 transition-colors shadow-inner text-sm"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-500/20 backdrop-blur-md border border-red-500/30 text-red-200 p-4 rounded-xl sm:rounded-2xl mb-6 sm:mb-8 flex items-center gap-3">
           <svg className="w-5 h-5 flex-shrink-0 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
           <span className="text-xs sm:text-sm font-bold tracking-wide">{error}</span>
        </div>
      )}

      {/* ZONA DEL LISTADO */}
      {usuariosFiltrados.length === 0 ? (
        <div className="flex-1 bg-black/25 backdrop-blur-md p-8 sm:p-12 rounded-[2rem] sm:rounded-[2.5rem] border border-white/5 flex flex-col items-center justify-center text-center shadow-inner min-h-[300px]">
          <svg className="w-12 h-12 sm:w-16 sm:h-16 text-gray-500 mb-3 sm:mb-4 drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <p className="text-lg sm:text-xl font-black text-white mb-2 tracking-tight">No se encontraron usuarios</p>
          <p className="text-xs sm:text-sm text-gray-400 font-medium">Prueba con otros términos de búsqueda.</p>
        </div>
      ) : (
        <div className="bg-black/25 backdrop-blur-md p-4 sm:p-6 md:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] border border-white/5 shadow-inner min-h-[500px] mb-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {usuariosFiltrados.map((usuario) => (
              <TarjetaUsuario 
                key={usuario.id} 
                usuario={usuario} 
                alEditar={editarUsuario}
                alBorrar={borrarUsuario}
                esUsuarioActual={user?.id === usuario.id} 
              />
            ))}
          </div>
        </div>
      )}

      {/*  MODAL */}
      {mostrarModal && (
        <ModalUsuario 
          usuario={usuarioEditando} 
          alCerrar={() => {
            setMostrarModal(false);
            setUsuarioEditando(null);
          }} 
          alGuardar={guardarEdicionUsuario} 
        />
      )}

    </ContenedorPrincipal>
  );
};

export default GestionUsuarios;