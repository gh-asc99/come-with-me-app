import React, { useState, useEffect } from 'react';
import api from '../../services/apiService';
import { subirImagen } from '../../services/invitacionService.js';
import ContenedorPrincipal from "../../components/layout/ContenedorPrincipal.jsx";
import ModalConfirmacion from "../../components/ui/ModalConfirmacion.jsx";

const GestionPaquetes = () => {
  const [paquetes, setPaquetes] = useState([]);
  const [eventos, setEventos] = useState([]); 
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState('');

  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);

  const [imagenFile, setImagenFile] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);
  const [subiendoImg, setSubiendoImg] = useState(false);

  const [orden, setOrden] = useState({ columna: null, direccion: 'asc' });

  const [modalConfirmacion, setModalConfirmacion] = useState({
    abierto: false,
    paqueteId: null,
    nombrePaquete: ''
  });

  const estadoInicial = { 
    id: '', 
    nombre: '', 
    descripcion: '', 
    precio: '', 
    evento_id: '', 
    imagen: '' 
  };
  const [formData, setFormData] = useState(estadoInicial);
  const [guardando, setGuardando] = useState(false);

  const cargarDatos = async () => {
    setCargando(true);
    try {
      const [resPaquetes, resEventos] = await Promise.all([
        api.get('/paquetes'),
        api.get('/eventos')
      ]);
      setPaquetes(resPaquetes.data);
      setEventos(resEventos.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Error al cargar los datos del servidor.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const obtenerNombreEvento = (evento_id) => {
    if (!evento_id) return 'Sin Evento';
    const evento = eventos.find(e => String(e.id) === String(evento_id));
    return evento ? evento.nombre : 'Evento Desconocido';
  };

  const manejarOrden = (columna) => {
    setOrden((prevOrden) => {
      if (prevOrden.columna === columna) {
        return { columna, direccion: prevOrden.direccion === 'asc' ? 'desc' : 'asc' };
      }
      return { columna, direccion: 'asc' };
    });
  };

  const paquetesFiltrados = paquetes.filter(pkt =>
    pkt.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const paquetesOrdenados = [...paquetesFiltrados].sort((a, b) => {
    if (!orden.columna) return 0;

    let valorA, valorB;

    if (orden.columna === 'paquete') {
      valorA = a.nombre.toLowerCase();
      valorB = b.nombre.toLowerCase();
    } else if (orden.columna === 'evento') {
      valorA = obtenerNombreEvento(a.evento_id).toLowerCase();
      valorB = obtenerNombreEvento(b.evento_id).toLowerCase();
    }

    if (valorA < valorB) return orden.direccion === 'asc' ? -1 : 1;
    if (valorA > valorB) return orden.direccion === 'asc' ? 1 : -1;
    return 0;
  });

  const abrirModalCrear = () => {
    setFormData({ ...estadoInicial, evento_id: eventos.length > 0 ? eventos[0].id : '' });
    setImagenFile(null);
    setPreviewImg(null);
    setModoEdicion(false);
    setModalAbierto(true);
  };

  const getUrlImagen = (ruta) => {
    if (!ruta) return "https://via.placeholder.com/400x300?text=Paquete";
    if (ruta.startsWith("http")) return ruta;
    if (ruta.includes("uploads")) {
      const rutaLimpia = ruta.startsWith("/") ? ruta.substring(1) : ruta;
      return `http://localhost:3300/${rutaLimpia}`;
    }
    if (!ruta.includes("/")) return `/paquetes/${ruta}`;
    return ruta.startsWith("/") ? ruta : `/${ruta}`;
  };

  const abrirModalEditar = (pkt) => {
    setFormData({ 
      id: pkt.id, 
      nombre: pkt.nombre, 
      descripcion: pkt.descripcion || '',
      precio: pkt.precio || '',
      evento_id: pkt.evento_id || '',
      imagen: pkt.imagen || ''
    });
    setImagenFile(null);
    
    if (pkt.imagen) {
      setPreviewImg(getUrlImagen(pkt.imagen));
    } else {
      setPreviewImg(null);
    }

    setModoEdicion(true);
    setModalAbierto(true);
  };

  const manejarCambioImagen = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const MAX_SIZE = 15 * 1024 * 1024; 
    if (file.size > MAX_SIZE) {
      alert("La imagen es demasiado grande. Por favor, elige una que pese menos de 15MB.");
      e.target.value = ''; 
      return;
    }

    setImagenFile(file);
    setPreviewImg(URL.createObjectURL(file));
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    
    if (!formData.evento_id) {
      alert("Debes seleccionar a qué evento pertenece este paquete.");
      return;
    }

    setGuardando(true);

    try {
      let urlImagenFinal = formData.imagen;

      if (imagenFile) {
        setSubiendoImg(true);
        urlImagenFinal = await subirImagen(imagenFile); 
        setSubiendoImg(false);
      }

      if (!urlImagenFinal && !modoEdicion) {
        alert("Debes seleccionar una imagen para el paquete.");
        setGuardando(false);
        return;
      }

      const payloadFinal = { 
        ...formData, 
        imagen: urlImagenFinal,
        precio: parseFloat(formData.precio) 
      };
      
      const { id, ...datosAEnviar } = payloadFinal;

      if (modoEdicion) {
        await api.patch(`/paquetes/${id}`, payloadFinal);
      } else {
        await api.post('/paquetes', datosAEnviar);
      }
      
      await cargarDatos(); 
      setModalAbierto(false); 
    } catch (err) {
      console.error("Error detallado del Backend:", err.response?.data);
      alert('Hubo un error al guardar el paquete. Revisa la consola.');
    } finally {
      setGuardando(false);
      setSubiendoImg(false);
    }
  };

  const solicitarBorradoPaquete = (id, nombre) => {
    setModalConfirmacion({
      abierto: true,
      paqueteId: id,
      nombrePaquete: nombre
    });
  };

  const confirmarBorrado = async () => {
    try {
      await api.delete(`/paquetes/${modalConfirmacion.paqueteId}`);
      await cargarDatos();
    } catch (err) {
      console.error(err);
      alert('Error al eliminar el paquete.');
    } finally {
      setModalConfirmacion({ abierto: false, paqueteId: null, nombrePaquete: '' });
    }
  };

  const cancelarBorrado = () => {
    setModalConfirmacion({ abierto: false, paqueteId: null, nombrePaquete: '' });
  };
  // ------------------------------------

  const toggleBloqueoPaquete = async (pkt) => {
    try {
      await api.patch(`/paquetes/${pkt.id}`, { bloqueado: !pkt.bloqueado });
      await cargarDatos(); 
    } catch (err) {
      console.error(err);
      alert('Error al cambiar el estado de bloqueo del paquete.');
    }
  };

  const IconoOrden = ({ columnaActual }) => {
    if (orden.columna !== columnaActual) return <span className="w-3 h-3 sm:w-4 sm:h-4 inline-block opacity-0 group-hover:opacity-30 transition-opacity">↕</span>;
    return orden.direccion === 'asc' 
      ? <svg className="w-3 h-3 sm:w-4 sm:h-4 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" /></svg>
      : <svg className="w-3 h-3 sm:w-4 sm:h-4 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>;
  };

  return (
    <>
      <ContenedorPrincipal className="flex flex-col animate-fade-in-up py-6 sm:py-0">
        
        <div className="w-full bg-black/25 backdrop-blur-2xl rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 md:px-12 md:py-8 mb-5 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-5 sm:gap-6">
          <div className="text-left w-full xl:w-auto">
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tighter drop-shadow-sm leading-tight">Gestión de Paquetes</h1>
            <p className="text-xs sm:text-sm text-gray-300 mt-2 font-medium">Crea, asigna y configura los planes que ofreces en cada evento.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row w-full xl:w-auto items-center gap-4 sm:gap-6 mt-2 xl:mt-0">
            <div className="relative w-full sm:w-80 flex-shrink-0">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </div>
              <input 
                type="text" 
                placeholder="Buscar por nombre del paquete"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-3.5 bg-black/40 border border-white/10 text-white placeholder-gray-500 rounded-xl sm:rounded-2xl focus:outline-none focus:border-sky-400 transition-colors shadow-inner text-sm"
              />
            </div>

            <button 
              onClick={abrirModalCrear}
              className="w-full sm:w-auto bg-pink-300 text-white font-black text-[11px] uppercase tracking-widest px-6 sm:px-8 py-3.5 sm:py-3.5 rounded-xl sm:rounded-2xl hover:bg-pink-400 hover:scale-105 active:scale-95 transition-all flex justify-center items-center gap-2 flex-shrink-0"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
              Nuevo Paquete
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/20 backdrop-blur-md border border-red-500/30 text-red-200 p-4 rounded-xl sm:rounded-2xl mb-6 flex items-center gap-3">
             <svg className="w-5 h-5 flex-shrink-0 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
             <span className="text-xs sm:text-sm font-bold tracking-wide">{error}</span>
          </div>
        )}

        {/* ZONA DEL LISTADO */}
        {cargando && paquetes.length === 0 ? (
          <div className="flex-1 flex justify-center items-center py-32">
            <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-4 border-sky-400"></div>
          </div>
        ) : paquetesOrdenados.length === 0 ? (
          <div className="flex-1 bg-black/10 backdrop-blur-md p-8 sm:p-12 rounded-[2rem] sm:rounded-[2.5rem] border border-white/5 flex flex-col items-center justify-center text-center shadow-inner min-h-[300px]">
            <svg className="w-12 h-12 sm:w-16 sm:h-16 text-gray-500 mb-4 drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <p className="text-lg sm:text-xl font-black text-white mb-2 tracking-tight">
              {busqueda ? 'No se encontraron paquetes' : 'No hay paquetes creados.'}
            </p>
            <p className="text-xs sm:text-sm text-gray-400 font-medium">
              {busqueda ? 'Prueba con otros términos de búsqueda.' : 'Comienza asociando tu primer paquete a un evento.'}
            </p>
          </div>
        ) : (
          <div className="bg-black/25 backdrop-blur-md p-4 sm:p-6 md:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-white/5 shadow-inner min-h-[500px]">
            
            {/* Cabecera del Listado (Oculto en móvil) */}
            <div className="hidden sm:grid sm:grid-cols-12 gap-4 px-6 pb-4 border-b border-white/10 text-gray-300 uppercase text-[10px] tracking-[0.2em] font-black mb-6">
              <div 
                className="sm:col-span-6 cursor-pointer hover:text-white transition-colors flex items-center gap-2 select-none"
                onClick={() => manejarOrden('paquete')}
              >
                Paquete <IconoOrden columnaActual="paquete" />
              </div>
              <div 
                className="sm:col-span-3 flex justify-center items-center gap-2 cursor-pointer hover:text-white transition-colors select-none"
                onClick={() => manejarOrden('evento')}
              >
                Evento <IconoOrden columnaActual="evento" />
              </div>
              <div className="sm:col-span-3 text-center">Acciones</div>
            </div>

            {/* Filas del Listado */}
            <div className="space-y-4">
              {paquetesOrdenados.map((pkt) => {
                return (
                  <div 
                    key={pkt.id} 
                    className="flex flex-col sm:grid sm:grid-cols-12 gap-4 items-start sm:items-center rounded-3xl overflow-hidden relative group transition-all hover:border-white/20 min-h-[140px] sm:min-h-[120px] pb-16 sm:pb-0 shadow-lg"
                    style={{
                      backgroundImage: `
                        linear-gradient(135deg, rgba(25,25,25,0.8) 30%, rgba(0,0,0,0.4) 80%), 
                        url('${getUrlImagen(pkt.imagen)}')
                      `,
                      backgroundSize: '100% 100%, cover',
                      backgroundPosition: 'center, right center',
                      backgroundRepeat: 'no-repeat, no-repeat'
                    }}
                  >
                    <div className="sm:col-span-6 p-5 sm:p-6 flex flex-col justify-center relative z-10 w-full">
                      <div className="font-black text-white text-xl drop-shadow-md line-clamp-1" title={pkt.nombre}>{pkt.nombre}</div>
                      <div className="text-sm text-gray-300 mt-1 line-clamp-2 max-w-sm font-medium drop-shadow-sm" title={pkt.descripcion}>{pkt.descripcion}</div>
                      
                      <div className="sm:hidden mt-3 inline-flex">
                        <span className="bg-white/10 text-sky-300 text-xs px-3 py-1 rounded-full font-black shadow-inner backdrop-blur-md border border-white/20">
                          {obtenerNombreEvento(pkt.evento_id)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="hidden sm:flex sm:col-span-3 justify-center items-center relative z-10">
                      <span className="bg-white/10 text-sky-300 text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-full font-black shadow-inner backdrop-blur-md border border-white/20 truncate max-w-full" title={obtenerNombreEvento(pkt.evento_id)}>
                        {obtenerNombreEvento(pkt.evento_id)}
                      </span>
                    </div>
                    
                    <div className="absolute bottom-4 right-4 sm:relative sm:top-0 sm:right-0 sm:col-span-3 flex justify-end sm:justify-center items-center gap-2 sm:gap-3 z-10 w-full pr-4 sm:pr-6">
                      
                      {/* BOTÓN BLOQUEAR / DESBLOQUEAR */}
                      <button 
                        onClick={() => toggleBloqueoPaquete(pkt)} 
                        className={`p-2.5 rounded-xl transition-all shadow-md backdrop-blur-sm border ${
                          pkt.bloqueado 
                            ? 'text-white bg-red-500/50 border-red-500/40 hover:bg-red-500 hover:scale-110' 
                            : 'text-emerald-300 bg-emerald-500/50 border-emerald-500/30 hover:bg-emerald-500 hover:text-white hover:scale-110'
                        }`}
                        title={pkt.bloqueado ? "Desbloquear" : "Bloquear"}
                      >
                        {pkt.bloqueado ? (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
                        )}
                      </button>

                      {/* BOTÓN EDITAR */}
                      <button 
                        onClick={() => abrirModalEditar(pkt)} 
                        className="p-2.5 text-sky-300 bg-sky-500/50 border border-sky-500/30 hover:bg-sky-500 hover:text-white rounded-xl transition-all shadow-md backdrop-blur-sm hover:scale-110"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>
                      </button>
                      
                      {/* BOTÓN BORRAR */}
                      <button 
                        onClick={() => solicitarBorradoPaquete(pkt.id, pkt.nombre)} 
                        className="p-2.5 text-pink-300 bg-pink-300/50 border border-pink-300/30 hover:bg-pink-400 hover:text-white rounded-xl transition-all shadow-md backdrop-blur-sm hover:scale-110"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </ContenedorPrincipal>

      <ModalConfirmacion
        isOpen={modalConfirmacion.abierto}
        titulo="Eliminar Paquete"
        mensaje={`¿Estás seguro de que deseas eliminar el paquete "${modalConfirmacion.nombrePaquete}"? Esta acción no se puede deshacer.`}
        textoConfirmar="Eliminar"
        textoCancelar="Cancelar"
        onConfirm={confirmarBorrado}
        onCancel={cancelarBorrado}
        esDestructivo={true}
        tipo="error"
      />

      {modalAbierto && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#121212]/95 backdrop-blur-3xl w-full max-w-2xl rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl relative border border-white/10 animate-scale-up max-h-[90vh] overflow-hidden flex flex-col">
            
            <div className="p-6 sm:p-8 border-b border-white/10 flex justify-between items-center bg-white/5 flex-shrink-0">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {modoEdicion ? 'Editar Paquete' : 'Crear Nuevo Paquete'}
              </h2>
              <button onClick={() => setModalAbierto(false)} className="text-gray-500 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <form onSubmit={manejarEnvio} className="p-6 sm:p-8 space-y-6 overflow-y-auto">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Nombre del Paquete *</label>
                  <input type="text" required value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} className="w-full px-4 py-3.5 bg-black/50 border border-white/10 text-white rounded-xl focus:outline-none focus:border-sky-400 transition-all font-medium shadow-inner text-sm" placeholder="Ej: Básico, Premium..." />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Precio (€) *</label>
                  <input type="number" step="0.01" min="0" required value={formData.precio} onChange={(e) => setFormData({ ...formData, precio: e.target.value })} className="w-full px-4 py-3.5 bg-black/50 border border-white/10 text-white rounded-xl focus:outline-none focus:border-sky-400 transition-all font-black text-sm" placeholder="0.00" />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Asignar a Evento *</label>
                  {eventos.length === 0 ? (
                    <div className="text-red-400 text-sm font-bold bg-red-500/10 p-4 rounded-xl border border-red-500/20">
                      ¡Atención! Primero debes crear un Evento antes de crear paquetes.
                    </div>
                  ) : (
                    <select required value={formData.evento_id} onChange={(e) => setFormData({ ...formData, evento_id: e.target.value })} className="w-full px-4 py-3.5 bg-black/50 border border-white/10 text-white rounded-xl focus:outline-none focus:border-sky-400 transition-all font-medium shadow-inner text-sm [&>option]:bg-[#121212] [&>option]:text-white">
                      <option value="" disabled>-- Selecciona un evento --</option>
                      {eventos.map(ev => (
                        <option key={ev.id} value={ev.id}>{ev.nombre}</option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Descripción *</label>
                  <textarea required value={formData.descripcion} onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })} rows="3" className="w-full px-4 py-3.5 bg-black/50 border border-white/10 text-white rounded-xl focus:outline-none focus:border-sky-400 transition-all font-medium shadow-inner resize-none text-sm" placeholder="Breve descripción de lo que incluye..."></textarea>
                </div>

                {/* Zona de Imagen */}
                <div className="md:col-span-2 bg-white/5 p-5 sm:p-6 rounded-2xl border border-white/10 shadow-inner mt-2">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Imagen del Paquete *</label>
                  <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-6">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 bg-black/40 rounded-2xl overflow-hidden relative border border-white/20 flex items-center justify-center shadow-lg">
                      {previewImg ? (
                        <img src={previewImg} alt="Vista previa" className="w-full h-full object-cover" />
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-10 sm:w-10 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 00-2-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      )}
                      {subiendoImg && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                          <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-white"></div>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 w-full text-center sm:text-left">
                      <input type="file" id="imagenPaquete" accept="image/*" onChange={manejarCambioImagen} disabled={subiendoImg || guardando} className="hidden" />
                      <label htmlFor="imagenPaquete" className="cursor-pointer inline-flex justify-center items-center gap-2 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all border border-pink-300/30 bg-pink-300/20 text-pink-300 hover:bg-pink-400 hover:text-white shadow-md w-full sm:w-auto">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                        {imagenFile ? 'Cambiar Foto' : 'Elegir Imagen'}
                      </label>
                      <p className="text-xs text-gray-500 mt-3 font-medium">JPG, PNG, WEBP (Max. 15MB).</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 flex flex-col sm:flex-row gap-3 sm:gap-4 border-t border-white/10 mt-6">
                <button type="button" onClick={() => setModalAbierto(false)} className="w-full sm:flex-1 py-4 px-4 font-black text-[10px] uppercase tracking-widest text-gray-400 bg-white/5 hover:bg-white/10 border border-white/10 hover:text-white rounded-xl transition-colors">
                  Cancelar
                </button>
                <button type="submit" disabled={guardando || eventos.length === 0} className={`w-full sm:flex-1 py-4 px-4 font-black text-[10px] uppercase tracking-widest rounded-xl transition-all flex justify-center items-center gap-2 ${guardando || eventos.length === 0 ? 'bg-gray-600 text-gray-400 border border-gray-500' : 'bg-pink-300 hover:bg-pink-400 text-white shadow-lg'}`}>
                  {guardando ? 'Guardando...' : (modoEdicion ? 'Actualizar' : 'Crear')}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default GestionPaquetes;