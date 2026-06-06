import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useInvitados } from '../hooks/useInvitado.js';
import ModalConfirmacion from '../components/ui/ModalConfirmacion.jsx';
import ContenedorPrincipal from "../components/layout/ContenedorPrincipal.jsx";
import fondoMosaico from '../../public/fondo_mosaico.png'; 
import Cargando from '../components/ui/Cargando.jsx';

const GestionInvitados = () => {
  const { id } = useParams();
  const navegar = useNavigate();
  
  const { invitados, cargando, agregarInvitado, eliminarInvitado } = useInvitados(id);
  
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [invitadoAEliminar, setInvitadoAEliminar] = useState(null);

  const manejarAgregarInvitado = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    setGuardando(true);
    const resultado = await agregarInvitado({ nombre, correo: email });
    
    if (resultado.success) {
      setNombre('');
      setEmail('');
    } else {
      alert(resultado.error);
    }
    setGuardando(false);
  };

  const solicitarEliminacion = (invitado) => {
    setInvitadoAEliminar(invitado);
    setModalAbierto(true);
  };

  const confirmarEliminacion = async () => {
    if (!invitadoAEliminar) return;
    
    const resultado = await eliminarInvitado(invitadoAEliminar.id);
    if (resultado.success) {
      setModalAbierto(false);
      setInvitadoAEliminar(null);
    } else {
      alert(resultado.error);
    }
  };

  const compartirEnlaceUnico = (invitado) => {
    const urlUnica = `${window.location.origin}/invitacion/${id}/invitado/${invitado.id}`;
    const mensaje = `¡Hola ${invitado.nombre}! Te invito a mi evento.\n\nEsta es tu invitación personal y exclusiva:\n${urlUnica}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(mensaje)}`, '_blank');
  };

  const renderEstado = (estado) => {
    switch(estado) {
      case 'confirmado': 
        return (
          <span className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-black px-3 py-1.5 rounded-full text-[8px] sm:text-[9px] uppercase tracking-widest shadow-sm flex items-center gap-1.5 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_5px_#34d399]"></span>Confirmado
          </span>
        );
      case 'rechazado': 
        return (
          <span className="bg-red-500/20 border border-red-500/30 text-red-300 font-black px-3 py-1.5 rounded-full text-[8px] sm:text-[9px] uppercase tracking-widest shadow-sm flex items-center gap-1.5 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 shadow-[0_0_5px_#f87171]"></span>No asistirá
          </span>
        );
      default: 
        return (
          <span className="bg-gray-500/20 border border-gray-500/30 text-gray-300 font-black px-3 py-1.5 rounded-full text-[8px] sm:text-[9px] uppercase tracking-widest shadow-sm flex items-center gap-1.5 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400 shadow-[0_0_5px_#9ca3af]"></span>Pendiente
          </span>
        );
    }
  };

  if (cargando) return <Cargando mensaje="Cargando lista de invitados " />;

  return (
    <div className="relative min-h-[calc(100vh-64px)] w-full overflow-hidden flex flex-col items-center bg-sky-50">

      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${fondoMosaico})` }}
      >
        <div className="absolute inset-0 bg-black/10"></div>
      </div>

      <ContenedorPrincipal className="relative z-10 w-full animate-fade-in-up py-5">

        <div className="bg-black/25 backdrop-blur-2xl rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden flex flex-col lg:flex-row items-stretch w-full max-w-6xl mx-auto">
          
          {/* LADO IZQUIERDO: CABECERA Y FORMULARIO */}
          <div className="w-full lg:w-5/12 flex flex-col relative border-b lg:border-b-0 lg:border-r border-white/10 bg-gradient-to-br from-black/30 to-transparent p-6 sm:p-10 md:p-12 lg:p-14">
            
            <div className="mb-8 md:mb-10">
              <span className="bg-pink-300/20 text-pink-300 px-3 py-1.5 sm:px-4 sm:py-1.5 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] mb-4 sm:mb-6 inline-block w-fit border border-pink-300/30 shadow-sm">
                Gestión
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tighter drop-shadow-sm leading-tight">
                Lista de <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-pink-300">Invitados</span>
              </h1>
              <p className="text-gray-300 font-medium text-xs sm:text-sm mt-3 sm:mt-4 drop-shadow-sm">
                Añade a tus invitados y envíales su enlace único y personal por WhatsApp.
              </p>
            </div>

            <form onSubmit={manejarAgregarInvitado} className="space-y-4 sm:space-y-6 text-gray-200 mt-auto">
              <div>
                <label className="block text-[10px] sm:text-xs font-bold text-gray-300 uppercase tracking-widest mb-1.5 sm:mb-2">Nombre y Apellidos *</label>
                <input 
                  type="text" 
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej: Laura Gómez"
                  className="w-full px-4 py-3 sm:py-4 bg-black/40 border border-white/10 text-white placeholder-gray-500 rounded-xl focus:outline-none focus:border-pink-400 transition-all text-sm sm:text-base font-medium shadow-inner"
                />
              </div>
              
              <button 
                type="submit" 
                disabled={guardando}
                className="w-full text-white font-black text-[10px] sm:text-[11px] uppercase tracking-widest px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl transition-all shadow-lg active:scale-95 disabled:bg-gray-600 disabled:shadow-none flex justify-center items-center gap-2 bg-pink-300 hover:bg-pink-400 mt-2 sm:mt-4"
              >
                {guardando ? 'Añadiendo...' : '+ Añadir a la lista'}
              </button>
            </form>

          </div>
          
          {/* LADO DERECHO: LISTA DE INVITADOS */}
          <div className="w-full lg:w-7/12 flex flex-col bg-black/20">
            
            <div className="p-6 sm:p-8 md:p-12 border-b border-white/10 flex flex-col h-full min-h-[400px] md:min-h-[500px]">
              <h3 className="text-lg sm:text-xl font-black text-white mb-6 sm:mb-8 flex items-center justify-between gap-3 drop-shadow-sm border-b border-white/10 pb-3 sm:pb-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-sky-400 drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Registrados
                </div>
                <span className="bg-sky-500/20 text-sky-300 px-3 py-1 rounded-full text-[10px] sm:text-xs font-black border border-sky-500/30">{invitados.length}</span>
              </h3>

              <div className="flex-grow flex flex-col">
                {invitados.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 border border-white/5 rounded-[1.5rem] bg-white/5 py-12 sm:py-16">
                    <svg className="w-12 h-12 sm:w-16 sm:h-16 text-white/20 mb-3 sm:mb-4 drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <p className="font-black text-lg sm:text-xl text-white mb-1 sm:mb-2">Aún no hay invitados</p>
                    <p className="font-medium text-xs sm:text-sm text-gray-400">Añade a la primera persona a tu lista para empezar a enviar invitaciones.</p>
                  </div>
                ) : (
                  <ul className="space-y-3 sm:space-y-4 max-h-[400px] sm:max-h-[500px] overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full">
                    {invitados.map((invitado) => (
                      <li key={invitado.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 sm:p-5 rounded-[1.2rem] sm:rounded-[1.5rem] bg-white/5 hover:bg-white/10 transition-colors border border-white/10 shadow-sm group">
                        
                        <div className="mb-3 flex items-center gap-2 sm:gap-3 w-full sm:w-auto mt-1 sm:mt-0">
                          <p className="font-black text-white text-base sm:text-lg drop-shadow-sm mb-1">{invitado.nombre}</p>
                          {invitado.email && <p className="text-[10px] sm:text-xs text-gray-400 font-medium mb-2.5 sm:mb-3">{invitado.email}</p>}
                          <div>{renderEstado(invitado.estado)}</div>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto mt-1 sm:mt-0">
                          <button 
                            onClick={() => compartirEnlaceUnico(invitado)}
                            className="flex-1 sm:flex-none flex items-center justify-center bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] hover:bg-[#25D366] hover:text-white px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl font-black text-[9px] sm:text-[10px] uppercase tracking-widest shadow-sm transition-all active:scale-95"
                            title="Enviar enlace único por WhatsApp"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                            </svg>
                            Enviar
                          </button>

                          <button 
                            onClick={() => solicitarEliminacion(invitado)}
                            className="p-2.5 sm:p-3 bg-pink-300/10 text-pink-300 hover:text-white hover:bg-pink-300 rounded-xl shadow-sm border border-pink-300/20 transition-all active:scale-95"
                            title="Eliminar invitado"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>

                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="w-full max-w-6xl mx-auto mt-4 sm:mt-6 px-2 sm:px-0">
          <button 
            onClick={() => navegar('/mis-creaciones')}
            className="flex items-center justify-center w-full sm:w-auto text-pink-300 bg-white/80 hover:bg-white backdrop-blur-md px-5 py-3 sm:py-2.5 rounded-full font-black text-[9px] sm:text-[10px] uppercase tracking-widest transition-all shadow-sm border border-white/50 group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
            </svg>
            Volver a mis creaciones
          </button>
        </div>
      </ContenedorPrincipal>

      <ModalConfirmacion 
        isOpen={modalAbierto}
        titulo="Eliminar invitado"
        mensaje={`¿Estás seguro de que deseas eliminar a ${invitadoAEliminar?.nombre} de la lista?`}
        textoConfirmar="Eliminar"
        textoCancelar="Cancelar"
        esDestructivo={true}
        onConfirm={confirmarEliminacion}
        onCancel={() => setModalAbierto(false)}
      />

    </div>
  );
};

export default GestionInvitados;