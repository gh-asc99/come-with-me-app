import React, { useState, useEffect } from 'react';
import api from '../../services/apiService';
import ContenedorPrincipal from "../../components/layout/ContenedorPrincipal.jsx";
import Cargando from "../../components/ui/Cargando.jsx";
import ModalConfirmacion from "../../components/ui/ModalConfirmacion.jsx";

const GestionSugerencias = () => {
  const [sugerencias, setSugerencias] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [paquetes, setPaquetes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState('');

  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [ordenTabla, setOrdenTabla] = useState({ columna: null, direccion: 'asc' });

  const [tipoAsignacion, setTipoAsignacion] = useState('evento'); 

  const [modalConfirmacion, setModalConfirmacion] = useState({
    abierto: false,
    sugerenciaId: null,
    tituloCampo: ''
  });

  const estadoInicial = { 
    id: '', 
    titulo_campo: '', 
    descripcion_sugerida: '', 
    tipo_campo: 'texto', 
    obligatorio: false,
    evento_id: '', 
    paquete_id: '' 
  };
  const [formData, setFormData] = useState(estadoInicial);
  const [guardando, setGuardando] = useState(false);

  const cargarDatos = async () => {
    setCargando(true);
    try {
      const [resSugerencias, resEventos, resPaquetes] = await Promise.all([
        api.get('/sugerencias').catch(() => ({ data: [] })), 
        api.get('/eventos'),
        api.get('/paquetes')
      ]);
      setSugerencias(resSugerencias.data);
      setEventos(resEventos.data);
      setPaquetes(resPaquetes.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Error al cargar los datos de las sugerencias.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { cargarDatos(); }, []);

  const normalizarId = (idRaw) => {
    if (!idRaw) return null;
    if (typeof idRaw === 'string') return idRaw.replace(/-/g, '').toLowerCase();
    if (idRaw.type === 'Buffer' && Array.isArray(idRaw.data)) {
      return idRaw.data.map(b => b.toString(16).padStart(2, '0')).join('').toLowerCase();
    }
    return String(idRaw).replace(/-/g, '').toLowerCase();
  };

  const obtenerNombreAsignacion = (sug) => {
    if (sug.paquete_id) {
      const idSugerencia = normalizarId(sug.paquete_id);
      const pkt = paquetes.find(p => normalizarId(p.id) === idSugerencia);
      return { tipo: 'Paquete', nombre: pkt ? pkt.nombre : 'Desconocido', color: 'pink' };
    }
    if (sug.evento_id) {
      const idSugerencia = normalizarId(sug.evento_id);
      const evt = eventos.find(e => normalizarId(e.id) === idSugerencia);
      return { tipo: 'Evento', nombre: evt ? evt.nombre : 'Desconocido', color: 'sky' };
    }
    return { tipo: 'Global', nombre: 'Todos', color: 'gray' };
  };

  const traducirTipo = (tipo_campo) => {
    if (!tipo_campo) return 'Desconocido';
    const tipos = {
      'texto': 'Texto Corto',
      'textarea': 'Texto Largo',
      'url': 'Imagen',
      'fecha': 'Fecha',
      'numero': 'Numérico',
      'boolean': 'Sí / No',
      'timeline': 'Línea de Tiempo',
      'listado': 'Listado Dinámico'
    };
    return tipos[tipo_campo] || String(tipo_campo);
  };

  const manejarOrden = (columna) => {
    setOrdenTabla((prev) => ({
      columna, 
      direccion: prev.columna === columna && prev.direccion === 'asc' ? 'desc' : 'asc' 
    }));
  };

  const sugerenciasFiltradas = sugerencias.filter(sug => {
    const termino = busqueda.toLowerCase();
    const titulo = (sug.titulo_campo || '').toLowerCase();
    const tipoTraducido = traducirTipo(sug.tipo_campo).toLowerCase();
    
    return titulo.includes(termino) || tipoTraducido.includes(termino);
  });

  const sugerenciasOrdenadas = [...sugerenciasFiltradas].sort((a, b) => {
    if (!ordenTabla.columna) return 0;
    
    let valorA, valorB;
    if (ordenTabla.columna === 'titulo') {
      valorA = a.titulo_campo.toLowerCase();
      valorB = b.titulo_campo.toLowerCase();
    } else if (ordenTabla.columna === 'tipo') {
      valorA = a.tipo_campo;
      valorB = b.tipo_campo;
    } else if (ordenTabla.columna === 'asignacion') {
      valorA = obtenerNombreAsignacion(a).nombre.toLowerCase();
      valorB = obtenerNombreAsignacion(b).nombre.toLowerCase();
    }

    if (valorA < valorB) return ordenTabla.direccion === 'asc' ? -1 : 1;
    if (valorA > valorB) return ordenTabla.direccion === 'asc' ? 1 : -1;
    return 0;
  });

  const abrirModalCrear = () => {
    setFormData(estadoInicial);
    setTipoAsignacion('evento');
    setModoEdicion(false);
    setModalAbierto(true);
  };

  const abrirModalEditar = (sug) => {
    setFormData({ 
      id: sug.id, 
      titulo_campo: sug.titulo_campo, 
      descripcion_sugerida: sug.descripcion_sugerida || '',
      tipo_campo: sug.tipo_campo || 'texto',
      obligatorio: Boolean(sug.obligatorio),
      evento_id: sug.evento_id || '',
      paquete_id: sug.paquete_id || ''
    });
    
    if (sug.paquete_id) setTipoAsignacion('paquete');
    else if (sug.evento_id) setTipoAsignacion('evento');
    else setTipoAsignacion('global');

    setModoEdicion(true);
    setModalAbierto(true);
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setGuardando(true);

    try {
      const payload = { ...formData };
      
      if (tipoAsignacion === 'global') {
        payload.evento_id = null;
        payload.paquete_id = null;
      } else if (tipoAsignacion === 'evento') {
        payload.paquete_id = null;
      } else if (tipoAsignacion === 'paquete') {
        payload.evento_id = null;
      }

      payload.obligatorio = payload.obligatorio ? 1 : 0;
      const { id, ...datosAEnviar } = payload;

      if (modoEdicion) {
        await api.patch(`/sugerencias/${id}`, payload);
      } else {
        await api.post('/sugerencias', datosAEnviar);
      }
      
      await cargarDatos(); 
      setModalAbierto(false); 
    } catch (err) {
      console.error(err.response?.data);
      alert('Error al guardar la sugerencia. Revisa la consola.');
    } finally {
      setGuardando(false);
    }
  };

  const solicitarBorradoSugerencia = (id, titulo_campo) => {
    setModalConfirmacion({
      abierto: true,
      sugerenciaId: id,
      tituloCampo: titulo_campo
    });
  };

  const confirmarBorrado = async () => {
    try {
      await api.delete(`/sugerencias/${modalConfirmacion.sugerenciaId}`);
      await cargarDatos();
    } catch (err) {
      console.error(err);
      alert('Error al eliminar la sugerencia.');
    } finally {
      setModalConfirmacion({ abierto: false, sugerenciaId: null, tituloCampo: '' });
    }
  };

  const cancelarBorrado = () => {
    setModalConfirmacion({ abierto: false, sugerenciaId: null, tituloCampo: '' });
  };

  const IconoOrden = ({ columnaActual }) => {
    if (ordenTabla.columna !== columnaActual) return <span className="w-4 h-4 inline-block opacity-0 group-hover:opacity-30 transition-opacity">↕</span>;
    return ordenTabla.direccion === 'asc' 
      ? <svg className="w-4 h-4 text-pink-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg>
      : <svg className="w-4 h-4 text-pink-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>;
  };

  return (
    <ContenedorPrincipal className="flex flex-col animate-fade-in-up">
      
      <div className="w-full bg-black/25 backdrop-blur-2xl rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 md:px-12 md:py-8 mb-5 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-5 sm:gap-6">
        <div className="text-left w-full xl:w-auto">
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tighter drop-shadow-sm leading-tight">Sugerencias</h1>
          <p className="text-xs sm:text-sm text-gray-300 mt-2 font-medium">Configura los campos dinámicos para los formularios.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row w-full xl:w-auto items-center gap-4 sm:gap-6 mt-2 xl:mt-0">
          <div className="relative w-full sm:w-80 flex-shrink-0">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
            <input 
              type="text" 
              placeholder="Buscar por pregunta o tipo..."
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
            Nueva Sugerencia
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/20 backdrop-blur-md border border-red-500/30 text-red-200 p-4 rounded-xl mb-6 flex items-center gap-3">
           <svg className="w-5 h-5 flex-shrink-0 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
           <span className="text-sm font-bold tracking-wide">{error}</span>
        </div>
      )}

      {cargando && sugerencias.length === 0 ? (
        <div className="flex-1 flex justify-center items-center py-32">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-sky-400"></div>
        </div>
      ) : sugerenciasOrdenadas.length === 0 ? (
        <div className="flex-1 bg-black/10 backdrop-blur-md p-8 sm:p-12 rounded-[2rem] border border-white/5 flex flex-col items-center justify-center text-center shadow-inner min-h-[300px]">
          <svg className="w-12 h-12 text-gray-500 mb-4 drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-lg sm:text-xl font-black text-white mb-2">
            {busqueda ? 'No se encontraron sugerencias' : 'No hay sugerencias configuradas.'}
          </p>
          <p className="text-sm text-gray-400 font-medium">
            {busqueda ? 'Prueba con otros términos de búsqueda.' : 'Crea tu primer campo dinámico.'}
          </p>
        </div>
      ) : (
        <div className="bg-black/25 backdrop-blur-md p-4 sm:p-6 md:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-white/5 shadow-inner min-h-[500px]">
          
          {/* Cabecera del Listado (Solo visible desde md:) */}
          <div className="hidden md:grid md:grid-cols-12 gap-4 px-6 pb-4 border-b border-white/10 text-gray-300 uppercase text-[10px] tracking-[0.2em] font-black mb-6">
            <div className="col-span-5 cursor-pointer hover:text-white transition-colors flex items-center gap-2 select-none" onClick={() => manejarOrden('titulo')}>
              Sugerencia <IconoOrden columnaActual="titulo" />
            </div>
            <div className="col-span-2 flex justify-center items-center gap-2 cursor-pointer hover:text-white transition-colors select-none" onClick={() => manejarOrden('tipo')}>
              Tipo <IconoOrden columnaActual="tipo" />
            </div>
            <div className="col-span-3 flex justify-center items-center gap-2 cursor-pointer hover:text-white transition-colors select-none" onClick={() => manejarOrden('asignacion')}>
              Asignado a <IconoOrden columnaActual="asignacion" />
            </div>
            <div className="col-span-2 text-center">Acciones</div>
          </div>

          <div className="space-y-4">
            {sugerenciasOrdenadas.map((sug) => {
              const asig = obtenerNombreAsignacion(sug);
              
              return (
                <div key={sug.id} className="flex flex-col md:grid md:grid-cols-12 gap-4 items-start md:items-center bg-[#252525]/60 hover:bg-[#252525]/40 p-5 md:p-6 rounded-3xl border border-white/5 hover:border-white/20 transition-all shadow-lg relative min-h-[120px] pb-16 md:pb-6">
                  
                  <div className="md:col-span-5 flex flex-col justify-center w-full">
                    <div className="flex items-center gap-3 mb-1">
                      <div className="font-black text-white text-lg drop-shadow-md truncate">{sug.titulo_campo}</div>
                      {Boolean(sug.obligatorio) && (
                        <span className="text-[9px] bg-pink-300/20 text-pink-300 border border-pink-300/30 px-2 py-0.5 rounded uppercase font-black tracking-widest flex-shrink-0">Req</span>
                      )}
                    </div>
                    <div className="text-sm text-gray-400 font-medium truncate">{sug.descripcion_sugerida || 'Sin descripción'}</div>
                    
                    {/* Metadatos visibles en móvil */}
                    <div className="md:hidden flex flex-wrap items-center gap-2 mt-3">
                      <span className="bg-sky-500/10 text-sky-400 border border-sky-500/30 text-[10px] uppercase tracking-wider px-3 py-1 rounded-full font-bold">
                        {traducirTipo(sug.tipo_campo)}
                      </span>
                      <span className={`bg-${asig.color}-300/10 text-${asig.color}-300 border border-${asig.color}-300/30 text-[10px] uppercase tracking-wider px-3 py-1 rounded-full font-bold`}>
                        {asig.nombre}
                      </span>
                    </div>
                  </div>
                  
                  <div className="hidden md:flex md:col-span-2 justify-center items-center">
                    <span className={`border text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-xl font-black shadow-inner truncate max-w-full ${
                      sug.tipo_campo === 'timeline' || sug.tipo_campo === 'listado' || sug.tipo_campo === 'url'
                        ? 'bg-pink-400/10 text-pink-400 border-pink-400/30' 
                        : 'bg-sky-500/10 text-sky-500 border-sky-500/30'    
                    }`}>
                      {traducirTipo(sug.tipo_campo)}
                    </span>
                  </div>

                  <div className="hidden md:flex md:col-span-3 flex-col items-center justify-center text-center px-2">
                    <span className={`text-[9px] font-black uppercase tracking-[0.2em] mb-1 text-${asig.color}-300`}>
                      {asig.tipo}
                    </span>
                    <span className={`bg-${asig.color}-300/10 text-${asig.color}-300 text-xs px-4 py-1 rounded-full font-bold border border-${asig.color}-300/30 truncate max-w-full w-full`}>
                      {asig.nombre}
                    </span>
                  </div>
                  
                  <div className="absolute bottom-4 right-4 md:relative md:bottom-auto md:right-auto md:col-span-2 flex justify-end md:justify-center items-center gap-3 w-full pr-0 md:pr-4">
                    <button 
                      onClick={() => abrirModalEditar(sug)} 
                      className="p-2.5 text-sky-400 bg-sky-500/30 border border-sky-500/20 hover:bg-sky-500 hover:text-white rounded-xl transition-all shadow-md backdrop-blur-sm hover:scale-110"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>
                    </button>
                    <button 
                      onClick={() => solicitarBorradoSugerencia(sug.id, sug.titulo_campo)} 
                      className="p-2.5 text-pink-300 bg-pink-300/30 border border-pink-300/20 hover:bg-pink-300 hover:text-white rounded-xl transition-all shadow-md backdrop-blur-sm hover:scale-110"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

      <ModalConfirmacion
        isOpen={modalConfirmacion.abierto}
        titulo="Eliminar Sugerencia"
        mensaje={`¿Estás seguro de que deseas eliminar el campo dinámico "${modalConfirmacion.tituloCampo}"? Esta acción no se puede deshacer.`}
        textoConfirmar="Eliminar"
        textoCancelar="Cancelar"
        onConfirm={confirmarBorrado}
        onCancel={cancelarBorrado}
        esDestructivo={true}
        tipo="error"
      />

      {/* MODAL ADMIN */}
      {modalAbierto && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#121212]/95 backdrop-blur-3xl w-full max-w-2xl rounded-[2.5rem] shadow-2xl relative border border-white/10 animate-scale-up max-h-[85vh] top-8 flex flex-col">
            
            <div className="p-6 sm:p-8 border-b border-white/10 flex justify-between items-center flex-shrink-0">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {modoEdicion ? 'Editar Sugerencia' : 'Nueva Sugerencia'}
              </h2>
              <button onClick={() => setModalAbierto(false)} className="text-gray-500 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10">
                <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <form onSubmit={manejarEnvio} className="p-6 sm:p-8 space-y-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Pregunta o Etiqueta *</label>
                  <input type="text" required value={formData.titulo_campo} onChange={(e) => setFormData({ ...formData, titulo_campo: e.target.value })} className="w-full px-4 py-3.5 bg-black/50 border border-white/10 text-white rounded-xl focus:outline-none focus:border-sky-400 transition-all font-medium text-sm" placeholder="Ej: Sabor del pastel..." />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Descripción (Ayuda visual)</label>
                  <textarea value={formData.descripcion_sugerida} onChange={(e) => setFormData({ ...formData, descripcion_sugerida: e.target.value })} rows="2" className="w-full px-4 py-3.5 bg-black/50 border border-white/10 text-white rounded-xl focus:outline-none focus:border-sky-400 transition-all font-medium resize-none text-sm" placeholder="Texto de ayuda..."></textarea>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Tipo de Dato *</label>
                  <select value={formData.tipo_campo} onChange={(e) => setFormData({ ...formData, tipo_campo: e.target.value })} className="w-full px-4 py-3.5 bg-black/50 border border-white/10 text-white rounded-xl focus:outline-none focus:border-sky-400 transition-all font-medium text-sm [&>optgroup]:bg-[#121212] [&>option]:bg-[#1a1a1a]">
                    <optgroup label="Datos Básicos">
                      <option value="texto">Texto Corto</option>
                      <option value="textarea">Texto Largo</option>
                      <option value="numero">Número</option>
                      <option value="boolean">Interruptor (Sí/No)</option>
                      <option value="fecha">Fecha</option>
                    </optgroup>
                    <optgroup label="Módulos Visuales">
                      <option value="url">Imagen (Subida)</option>
                      <option value="timeline">Línea de Tiempo</option>
                      <option value="listado">Listado Dinámico</option>
                    </optgroup>
                  </select>
                </div>

                <div className="flex flex-col justify-end pb-2 sm:pb-3 sm:pl-2">
                  <label className="flex items-center gap-3 cursor-pointer mt-4 md:mt-0">
                    <div className="relative">
                      <input type="checkbox" checked={formData.obligatorio} onChange={(e) => setFormData({ ...formData, obligatorio: e.target.checked })} className="sr-only peer" />
                      <div className="w-12 h-6 bg-white/10 rounded-full peer peer-checked:after:translate-x-full after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-400 shadow-inner"></div>
                    </div>
                    <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">Requerido</span>
                  </label>
                </div>

                <div className="md:col-span-2 mt-2 pt-6 border-t border-white/10">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Alcance: ¿Dónde debe aparecer?</label>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-5">
                    <label className={`cursor-pointer border-2 rounded-2xl p-3 sm:p-4 flex flex-col items-center justify-center text-center transition-all ${tipoAsignacion === 'evento' ? 'border-sky-400 bg-sky-500/10 text-sky-300' : 'border-white/10 text-gray-500 hover:bg-white/5'}`}>
                      <input type="radio" name="asignacion" checked={tipoAsignacion === 'evento'} onChange={() => setTipoAsignacion('evento')} className="hidden" />
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                      <span className="font-black text-[9px] sm:text-[10px] uppercase tracking-widest">Evento</span>
                    </label>

                    <label className={`cursor-pointer border-2 rounded-2xl p-3 sm:p-4 flex flex-col items-center justify-center text-center transition-all ${tipoAsignacion === 'paquete' ? 'border-pink-300 bg-pink-300/10 text-pink-300' : 'border-white/10 text-gray-500 hover:bg-white/5'}`}>
                      <input type="radio" name="asignacion" checked={tipoAsignacion === 'paquete'} onChange={() => setTipoAsignacion('paquete')} className="hidden" />
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                      <span className="font-black text-[9px] sm:text-[10px] uppercase tracking-widest">Paquete</span>
                    </label>

                    <label className={`cursor-pointer border-2 rounded-2xl p-3 sm:p-4 flex flex-col items-center justify-center text-center transition-all ${tipoAsignacion === 'global' ? 'border-gray-400 bg-gray-500/20 text-gray-200' : 'border-white/10 text-gray-500 hover:bg-white/5'}`}>
                      <input type="radio" name="asignacion" checked={tipoAsignacion === 'global'} onChange={() => setTipoAsignacion('global')} className="hidden" />
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      <span className="font-black text-[9px] sm:text-[10px] uppercase tracking-widest">Global</span>
                    </label>
                  </div>

                  {tipoAsignacion === 'evento' && (
                    <select required value={formData.evento_id} onChange={(e) => setFormData({ ...formData, evento_id: e.target.value })} className="w-full px-4 py-3.5 bg-black/50 border border-white/10 text-white rounded-xl focus:outline-none focus:border-sky-400 transition-all text-sm [&>option]:bg-[#121212]">
                      <option value="" disabled>-- Selecciona el Evento --</option>
                      {eventos.map(ev => <option key={ev.id} value={ev.id}>{ev.nombre}</option>)}
                    </select>
                  )}

                  {tipoAsignacion === 'paquete' && (
                    <select required value={formData.paquete_id} onChange={(e) => setFormData({ ...formData, paquete_id: e.target.value })} className="w-full px-4 py-3.5 bg-black/50 border border-white/10 text-white rounded-xl focus:outline-none focus:border-pink-400 transition-all text-sm [&>option]:bg-[#121212]">
                      <option value="" disabled>-- Selecciona el Paquete --</option>
                      {paquetes.map(pk => <option key={pk.id} value={pk.id}>{pk.nombre} (Evento: {obtenerNombreAsignacion({paquete_id: pk.id}).nombre})</option>)}
                    </select>
                  )}
                  
                  {tipoAsignacion === 'global' && (
                    <div className="w-full px-4 py-3.5 bg-white/5 border border-white/10 text-gray-400 rounded-xl text-sm text-center italic">
                      Aparecerá en todas las invitaciones.
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-6 flex flex-col sm:flex-row gap-3 sm:gap-4 border-t border-white/10 mt-6">
                <button type="button" onClick={() => setModalAbierto(false)} className="w-full sm:flex-1 py-4 px-4 font-black text-[10px] uppercase tracking-widest text-gray-400 bg-white/5 hover:bg-white/10 border border-white/10 hover:text-white rounded-xl transition-colors">
                  Cancelar
                </button>
                <button type="submit" disabled={guardando} className={`w-full sm:flex-1 py-4 px-4 font-black text-[10px] uppercase tracking-widest rounded-xl transition-all shadow-lg flex justify-center items-center gap-2 ${guardando ? 'bg-gray-600 text-gray-400 border border-gray-500' : 'bg-pink-300 hover:bg-pink-400 text-white'}`}>
                  {guardando ? 'Guardando...' : (modoEdicion ? 'Actualizar' : 'Crear')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </ContenedorPrincipal>
  );
};

export default GestionSugerencias;