// src/components/creacion/FaseFormularioDinamico.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useCreacion from "../../hooks/useCreacion.js";
import useFormulario from "../../hooks/useFormulario.js";
import CampoFormulario from "../forms/CampoFormulario.jsx";
import { subirImagen } from "../../services/invitacionService.js";
import usePlantillas from "../../hooks/useCamposPlantilla.js";
import { MAPA_PLANTILLAS } from "../plantillas/RenderizadorPlantilla.jsx";
import Cargando from "../ui/Cargando.jsx"; // <-- IMPORTAMOS CARGANDO

const obtenerTipoInput = (tipoSugerencia) => {
  const mapaTipos = { texto: "text", numero: "number", fecha: "date", boolean: "checkbox" };
  return mapaTipos[tipoSugerencia] || "text";
};

const traducirTipo = (tipo_campo) => {
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

const SubidaImagenDinamica = ({ sug, valorActual, manejarCambioDinamico }) => {
  const [subiendo, setSubiendo] = useState(false);
  const [errorImg, setErrorImg] = useState(null);

  const preview = valorActual && valorActual.startsWith('http') 
    ? valorActual 
    : (valorActual ? `http://localhost:3300/${valorActual.replace(/^\//, '')}` : null);

  const manejarCambio = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSubiendo(true);
    setErrorImg(null);

    try {
      const urlServer = await subirImagen(file);
      manejarCambioDinamico(sug.titulo_campo, urlServer);
    } catch (err) {
      setErrorImg("Error al subir la imagen. Inténtalo de nuevo.");
    } finally {
      setSubiendo(false);
    }
  };

  const quitarImagen = () => {
    manejarCambioDinamico(sug.titulo_campo, '');
    setErrorImg(null);
  };

  return (
    <div className="bg-white/5 p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] border border-white/10 shadow-inner mt-2">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 text-center sm:text-left">
        <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 bg-black/40 rounded-2xl overflow-hidden relative border border-white/20 flex items-center justify-center shadow-lg">
          {preview ? (
            <img src={preview} alt="Vista previa" className="w-full h-full object-cover" />
          ) : (
            <svg className="h-6 w-6 sm:h-8 sm:w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 00-2-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          )}
          {subiendo && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
              <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-white"></div>
            </div>
          )}
        </div>
        <div className="flex-1 w-full flex flex-col items-center sm:items-start justify-center">
          <input type="file" id={`img-${sug.id || sug.titulo_campo}`} accept="image/*" onChange={manejarCambio} disabled={subiendo} className="hidden" />
          <div className="flex flex-wrap justify-center sm:justify-start gap-2 sm:gap-3 w-full">
            <label htmlFor={`img-${sug.id || sug.titulo_campo}`} className={`w-full sm:w-auto cursor-pointer px-4 sm:px-6 py-3 rounded-xl font-black text-[9px] sm:text-[10px] uppercase tracking-widest transition-all shadow-md flex items-center justify-center sm:justify-start gap-2 ${subiendo ? 'bg-white/5 text-gray-500 border border-white/10' : 'bg-sky-500/20 text-sky-300 border border-sky-500/30 hover:bg-sky-500 hover:text-white'}`}>
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
              {subiendo ? 'Subiendo...' : 'Seleccionar Foto'}
            </label>
            {preview && !subiendo && (
              <button type="button" onClick={quitarImagen} className="w-full sm:w-auto px-4 sm:px-6 py-3 text-red-400 hover:text-white border border-red-400/30 hover:bg-red-500 rounded-xl font-black text-[9px] sm:text-[10px] uppercase tracking-widest transition-all shadow-md flex items-center justify-center sm:justify-start gap-2">
                Quitar
              </button>
            )}
          </div>
          {errorImg && <p className="text-red-400 text-[10px] sm:text-xs mt-2 sm:mt-3 font-bold">{errorImg}</p>}
        </div>
      </div>
    </div>
  );
};

export const FormularioInvitacionUI = ({
  tituloCabecera, subtituloCabecera, datosFijos, datosDinamicos, sugerencias, 
  plantillas, plantillaSeleccionada, manejarCambioFijo, manejarCambioDinamico, 
  setPlantillaSeleccionada, manejarEnvio, volverFaseAnterior, errorGlobal, 
  textoBoton, cargandoAccion, imagenPaquete
}) => {
  const navegar = useNavigate();
  const [previewImg, setPreviewImg] = useState(null);
  const [subiendoImg, setSubiendoImg] = useState(false);
  const [errorImg, setErrorImg] = useState(null);

  const [opcionalesActivos, setOpcionalesActivos] = useState([]);
  const [mostrarMenuOpcionales, setMostrarMenuOpcionales] = useState(false);

  const contextoPlantillas = usePlantillas() || {};
  const { renderInputTimelineContext, renderInputListadoContext } = contextoPlantillas;

  const idNormalizado = plantillaSeleccionada ? plantillaSeleccionada.replace(/-/g, '').toLowerCase() : '';
  const nombrePlantillaActual = MAPA_PLANTILLAS[idNormalizado] || 'clasica';

  const urlPaquete = imagenPaquete 
    ? (imagenPaquete.startsWith('http') ? imagenPaquete : `http://localhost:3300/${imagenPaquete.replace(/^\//, '')}`)
    : null;

  useEffect(() => {
    if (datosFijos?.imagen && !previewImg) {
      const url = datosFijos.imagen.startsWith('http') 
        ? datosFijos.imagen 
        : `http://localhost:3300/${datosFijos.imagen.replace(/^\//, '')}`;
      setPreviewImg(url);
    }
  }, [datosFijos?.imagen]);

  const esObligatorio = (sug) => {
    if (sug.obligatorio === 1 || sug.obligatorio === true || sug.obligatorio === '1') return true;
    if (sug.obligatorio?.type === 'Buffer' && sug.obligatorio.data?.[0] === 1) return true;
    return false;
  };

  useEffect(() => {
    if (sugerencias && sugerencias.length > 0) {
      const preActivos = [];
      sugerencias.forEach(sug => {
        if (!esObligatorio(sug)) {
          const valor = datosDinamicos[sug.titulo_campo];
          let tieneDato = false;
          if (valor !== undefined && valor !== null && valor !== '') {
            if (Array.isArray(valor)) {
              if (valor.length > 1) tieneDato = true;
              else if (valor.length === 1) {
                if (typeof valor[0] === 'string' && valor[0].trim() !== '') tieneDato = true;
                if (typeof valor[0] === 'object' && (valor[0].hora || valor[0].titulo)) tieneDato = true;
              }
            } else if (typeof valor === 'boolean') {
              tieneDato = true; 
            } else {
              tieneDato = true;
            }
          }
          if (tieneDato) preActivos.push(sug.id || sug.titulo_campo);
        }
      });
      if (preActivos.length > 0) {
        setOpcionalesActivos(prev => [...new Set([...prev, ...preActivos])]);
      }
    }
  }, [sugerencias]);

  const manejarCambioImagen = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const urlLocal = URL.createObjectURL(file);
    setPreviewImg(urlLocal);
    setSubiendoImg(true);
    setErrorImg(null);

    try {
      const urlServer = await subirImagen(file);
      manejarCambioFijo({ target: { name: 'imagen', value: urlServer } });
    } catch (err) {
      setErrorImg("Error al subir la imagen. Inténtalo de nuevo.");
      setPreviewImg(null);
    } finally {
      setSubiendoImg(false);
    }
  };

  const quitarImagen = () => {
    if (imagenPaquete) {
      setPreviewImg(urlPaquete);
      manejarCambioFijo({ target: { name: 'imagen', value: imagenPaquete } });
    } else {
      setPreviewImg(null);
      manejarCambioFijo({ target: { name: 'imagen', value: '' } });
    }
    setErrorImg(null);
  };

  const mostrarBotonQuitar = previewImg && !subiendoImg && datosFijos?.imagen !== imagenPaquete;

  const sugerenciasObligatorias = (sugerencias || []).filter(esObligatorio);
  const sugerenciasOpcionales = (sugerencias || []).filter(s => !esObligatorio(s));

  const opcionalesMostradas = sugerenciasOpcionales.filter(s => opcionalesActivos.includes(s.id || s.titulo_campo));
  const opcionalesDisponibles = sugerenciasOpcionales.filter(s => !opcionalesActivos.includes(s.id || s.titulo_campo));

  const agregarOpcional = (sug) => {
    setOpcionalesActivos(prev => [...prev, sug.id || sug.titulo_campo]);
    setMostrarMenuOpcionales(false);
  };

  const quitarOpcional = (sug) => {
    setOpcionalesActivos(prev => prev.filter(id => id !== (sug.id || sug.titulo_campo)));
    manejarCambioDinamico(sug.titulo_campo, null);
    delete datosDinamicos[sug.titulo_campo]; 
  };

  const interceptarEnvio = (e) => {
    e.preventDefault();

    sugerenciasOpcionales.forEach(sug => {
      const estaVisible = opcionalesActivos.includes(sug.id || sug.titulo_campo);
      const valor = datosDinamicos[sug.titulo_campo];
      let vacio = false;

      if (!estaVisible) {
        vacio = true;
      } else {
        if (valor === undefined || valor === null || valor === '') vacio = true;
        else if (Array.isArray(valor)) {
          if (valor.length === 0) vacio = true;
          else if (valor.length === 1) {
            if (typeof valor[0] === 'string' && String(valor[0]).trim() === '') vacio = true;
            if (typeof valor[0] === 'object' && !valor[0].hora && !valor[0].titulo) vacio = true;
          }
        }
      }

      if (vacio) delete datosDinamicos[sug.titulo_campo];
    });

    manejarEnvio(e);
  };

  const renderTimeline = (sug) => {
    if (renderInputTimelineContext) {
      return renderInputTimelineContext({ sug, datosDinamicos, manejarCambioDinamico, datosFijos, nombrePlantillaActual });
    }

    const items = Array.isArray(datosDinamicos[sug.titulo_campo]) && datosDinamicos[sug.titulo_campo].length > 0
      ? datosDinamicos[sug.titulo_campo]
      : [{ hora: datosFijos?.hora_inicio || '', titulo: 'Comienza el evento' }];

    useEffect(() => {
      if (items.length > 0 && items[0].hora !== datosFijos?.hora_inicio && datosFijos?.hora_inicio) {
        const nuevosItems = [...items];
        nuevosItems[0].hora = datosFijos.hora_inicio;
        manejarCambioDinamico(sug.titulo_campo, nuevosItems);
      }
    }, [datosFijos?.hora_inicio]);

    const actualizarItem = (index, campo, valor) => {
      const nuevosItems = [...items];
      nuevosItems[index] = { ...nuevosItems[index], [campo]: valor };
      manejarCambioDinamico(sug.titulo_campo, nuevosItems);
    };

    const agregarItem = () => {
      if (items.length < 8) manejarCambioDinamico(sug.titulo_campo, [...items, { hora: '', titulo: '' }]);
    };

    const quitarItem = (index) => {
      const nuevosItems = items.filter((_, i) => i !== index);
      manejarCambioDinamico(sug.titulo_campo, nuevosItems);
    };

    return (
      <div className="mt-3 space-y-3 bg-white/5 p-4 sm:p-5 rounded-2xl border border-white/10 shadow-inner">
        {items.map((item, index) => (
          <div key={index} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            <div className="w-full sm:w-1/3">
              <input type="time" value={item.hora} onChange={(e) => actualizarItem(index, 'hora', e.target.value)} required={esObligatorio(sug) && index === 0} className="w-full bg-black/20 border border-white/10 text-white rounded-xl px-3 py-2.5 focus:outline-none focus:border-pink-400 font-bold transition-colors text-sm" />
            </div>
            <div className="flex-1 flex gap-2 items-center">
              <input type="text" placeholder="Ej: Ceremonia, Banquete..." value={item.titulo} onChange={(e) => actualizarItem(index, 'titulo', e.target.value)} readOnly={index === 0} required={esObligatorio(sug) && index === 0} className={`w-full bg-black/20 border border-white/10 text-white rounded-xl px-3 py-2.5 focus:outline-none focus:border-pink-400 transition-colors text-sm ${index === 0 ? 'text-gray-400 italic' : ''}`} />
              {index > 0 && (
                <button type="button" onClick={() => quitarItem(index)} className="text-red-400 hover:text-red-300 px-1 sm:px-2 font-bold hover:scale-110 transition-transform">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              )}
            </div>
          </div>
        ))}
        {items.length < 8 && (
          <button type="button" onClick={agregarItem} className="w-full mt-2 py-3 border-2 border-dashed border-pink-400/30 text-pink-400 rounded-xl hover:bg-pink-400/10 font-bold text-[11px] sm:text-sm tracking-wide transition-colors flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            Añadir nueva fase ({items.length}/8)
          </button>
        )}
      </div>
    );
  };

  const renderListado = (sug) => {
    if (renderInputListadoContext) {
      return renderInputListadoContext({ sug, datosDinamicos, manejarCambioDinamico, nombrePlantillaActual });
    }

    const items = Array.isArray(datosDinamicos[sug.titulo_campo]) && datosDinamicos[sug.titulo_campo].length > 0
      ? datosDinamicos[sug.titulo_campo]
      : [''];

    const actualizarItem = (index, valor) => {
      const nuevosItems = [...items];
      nuevosItems[index] = valor;
      manejarCambioDinamico(sug.titulo_campo, nuevosItems);
    };

    const agregarItem = () => {
      if (items.length < 10) manejarCambioDinamico(sug.titulo_campo, [...items, '']);
    };

    const quitarItem = (index) => {
      const nuevosItems = items.filter((_, i) => i !== index);
      manejarCambioDinamico(sug.titulo_campo, nuevosItems);
    };

    return (
      <div className="mt-3 space-y-3 bg-white/5 p-4 sm:p-5 rounded-2xl border border-white/10 shadow-inner">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <span className="text-white font-black w-4 sm:w-6 text-right select-none text-xs sm:text-base">{index + 1}.</span>
            <input type="text" placeholder={`Elemento ${index + 1}`} value={item} onChange={(e) => actualizarItem(index, e.target.value)} required={esObligatorio(sug) && index === 0} className="flex-1 bg-black/20 border border-white/10 text-white rounded-xl px-3 sm:px-4 py-2.5 focus:outline-none focus:border-sky-400 transition-colors placeholder-white/50 text-sm" />
            {items.length > 1 && (
                <button type="button" onClick={() => quitarItem(index)} className="text-red-400 hover:text-red-300 px-1 sm:px-2 font-bold hover:scale-110 transition-transform">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            )}
          </div>
        ))}
        {items.length < 10 && (
          <button type="button" onClick={agregarItem} className="w-full mt-2 py-3 border-2 border-dashed border-white/30 text-white rounded-xl hover:bg-sky-400/10 font-bold text-[11px] sm:text-sm tracking-wide transition-colors flex items-center justify-center gap-2">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            Añadir elemento ({items.length}/10)
          </button>
        )}
      </div>
    );
  };

  const renderCampoDinamico = (sug) => {
    const oblig = esObligatorio(sug);
    
    if (sug.tipo_campo === "timeline") {
      return (
        <div>
          <label className="block text-[11px] sm:text-sm font-bold text-gray-200 mb-1 uppercase tracking-wide">{sug.titulo_campo} {oblig ? "*" : ""}</label>
          {sug.descripcion_sugerida && <p className="text-[10px] sm:text-xs text-pink-300 mb-2">{sug.descripcion_sugerida}</p>}
          {renderTimeline(sug)}
        </div>
      );
    } else if (sug.tipo_campo === "listado") {
      return (
        <div>
          <label className="block text-[11px] sm:text-sm font-bold text-gray-200 mb-1 uppercase tracking-wide">{sug.titulo_campo} {oblig ? "*" : ""}</label>
          {sug.descripcion_sugerida && <p className="text-[10px] sm:text-xs text-pink-300 mb-2">{sug.descripcion_sugerida}</p>}
          {renderListado(sug)}
        </div>
      );
    } else if (sug.tipo_campo === "url") {
      return (
        <div>
          <label className="block text-[11px] sm:text-sm font-bold text-gray-200 mb-1 uppercase tracking-wide">{sug.titulo_campo} {oblig ? "*" : ""}</label>
          {sug.descripcion_sugerida && <p className="text-[10px] sm:text-xs text-pink-300 mb-2">{sug.descripcion_sugerida}</p>}
          <SubidaImagenDinamica sug={sug} valorActual={datosDinamicos[sug.titulo_campo]} manejarCambioDinamico={manejarCambioDinamico} />
        </div>
      );
    } else if (sug.tipo_campo === "textarea") {
      return (
        <div>
          <label className="block text-[11px] sm:text-sm font-bold text-gray-200 mb-1 uppercase tracking-wide">{sug.titulo_campo} {oblig ? "*" : ""}</label>
          <textarea placeholder={sug.descripcion_sugerida || ""} required={oblig} value={datosDinamicos[sug.titulo_campo] || ""} onChange={(e) => manejarCambioDinamico(sug.titulo_campo, e.target.value)} className="w-full bg-black/20 border border-white/10 text-white placeholder-gray-500 rounded-2xl px-4 py-4 focus:outline-none focus:border-pink-400 transition-colors resize-none shadow-inner text-sm" rows="3" />
        </div>
      );
    } else if (sug.tipo_campo === "boolean") {
      return (
        <label className="flex items-center space-x-3 sm:space-x-4 cursor-pointer mt-4 sm:mt-5 p-3 sm:p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors">
          <input type="checkbox" required={oblig} checked={!!datosDinamicos[sug.titulo_campo]} onChange={(e) => manejarCambioDinamico(sug.titulo_campo, e.target.checked)} className="w-4 h-4 sm:w-5 sm:h-5 text-pink-500 rounded border-white/20 focus:ring-pink-500 bg-black/40" />
          <span className="text-[11px] sm:text-sm font-bold text-white tracking-wide">{sug.titulo_campo}</span>
        </label>
      );
    } else {
      return (
        <CampoFormulario label={`${sug.titulo_campo} ${oblig ? "*" : ""}`} name={sug.titulo_campo} type={obtenerTipoInput(sug.tipo_campo)} placeholder={sug.descripcion_sugerida || ""} value={datosDinamicos[sug.titulo_campo] || ""} onChange={(e) => manejarCambioDinamico(sug.titulo_campo, e.target.value)} required={oblig} />
      );
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col animate-fade-in-up">

      <div className="w-full bg-black/25 backdrop-blur-2xl rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden mb-5">
        <div className="w-full bg-black/20 p-6 sm:p-8 md:px-12 md:py-10 flex flex-col items-center gap-4 sm:gap-6">
          <div className="text-center">
            <span className="bg-pink-300/20 text-pink-300 px-3 py-1.5 sm:px-4 sm:py-1.5 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] mb-4 sm:mb-5 inline-block border border-pink-300/30 shadow-sm">
              Personalización
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tighter drop-shadow-sm mb-2 leading-tight">
              {tituloCabecera.includes('Personaliza tu') ? (
                <>
                  Personaliza tu 
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-sky-300 ml-2 block sm:inline">
                    {tituloCabecera.replace('Personaliza tu', '')}
                  </span>
                </>
              ) : (
                tituloCabecera
              )}
            </h1>
            <p className="text-gray-200 font-medium text-xs sm:text-sm md:text-base drop-shadow-sm mt-3 sm:mt-4">
              {subtituloCabecera}
            </p>
          </div>
        </div>
      </div>

      <div className="w-full bg-black/20 backdrop-blur-2xl p-6 sm:p-8 md:p-12 rounded-[2rem] sm:rounded-[2.5rem] flex flex-col">
        {errorGlobal && (
          <div className="mb-6 sm:mb-8 bg-red-500/10 backdrop-blur-md border border-red-500/30 text-red-200 p-4 rounded-2xl shadow-sm flex items-center gap-3">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-[11px] sm:text-sm font-bold tracking-wide">{errorGlobal}</p>
          </div>
        )}

        <form onSubmit={interceptarEnvio} className="space-y-8 sm:space-y-12 text-gray-200">
          
          <div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-black text-white mb-5 sm:mb-6 pb-3 sm:pb-4 border-b border-white/10 drop-shadow-sm flex items-center gap-2 sm:gap-3">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              Datos Principales
            </h3>
            
            <div className="mb-6 sm:mb-8 bg-white/5 p-5 sm:p-6 md:p-8 rounded-[1.5rem] sm:rounded-[2rem] border border-white/10 shadow-inner">
              <label className="block text-[11px] sm:text-sm font-bold text-gray-200 mb-3 sm:mb-4 tracking-wide uppercase">
                Foto de Portada <span className="text-gray-400 font-normal lowercase tracking-normal">(Opcional)</span>
              </label>
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 text-center sm:text-left">
                <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 bg-black/40 rounded-2xl overflow-hidden relative border border-white/20 flex items-center justify-center shadow-lg">
                  {previewImg ? (
                    <img src={previewImg} alt="Vista previa" className="w-full h-full object-cover" />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-10 sm:w-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 00-2-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  )}
                  {subiendoImg && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                      <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-white"></div>
                    </div>
                  )}
                </div>
                <div className="flex-1 w-full flex flex-col items-center sm:items-start justify-center">
                  <input type="file" id="imagenPortada" accept="image/*" onChange={manejarCambioImagen} disabled={subiendoImg} className="hidden" />
                  <div className="flex flex-wrap justify-center sm:justify-start gap-2 sm:gap-3 w-full">
                    <label htmlFor="imagenPortada" className={`w-full sm:w-auto cursor-pointer px-5 sm:px-6 py-3 rounded-xl font-black text-[9px] sm:text-[10px] uppercase tracking-widest transition-all shadow-md flex items-center justify-center sm:justify-start gap-2 ${subiendoImg ? 'bg-white/5 text-gray-500 border border-white/10' : 'bg-sky-500/20 text-sky-200 border border-sky-500/30 hover:bg-sky-500 hover:text-white'}`}>
                      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                      {subiendoImg ? 'Subiendo...' : 'Seleccionar Foto'}
                    </label>
                    {mostrarBotonQuitar && (
                      <button type="button" onClick={quitarImagen} className="w-full sm:w-auto px-5 sm:px-6 py-3 text-red-400 hover:text-white border border-red-400/30 hover:bg-red-500 rounded-xl font-black text-[9px] sm:text-[10px] uppercase tracking-widest transition-all shadow-md flex items-center justify-center sm:justify-start gap-2">
                        Quitar
                      </button>
                    )}
                  </div>
                  {errorImg && <p className="text-red-400 text-[10px] sm:text-xs mt-2 sm:mt-3 font-bold">{errorImg}</p>}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <CampoFormulario label="Título de la invitación *" name="titulo" type="text" placeholder="Ej: Mi 30 Cumpleaños" value={datosFijos.titulo} onChange={manejarCambioFijo} required />
              <CampoFormulario label="Lugar de celebración *" name="lugar" type="text" placeholder="Ej: Restaurante El Paraíso" value={datosFijos.lugar} onChange={manejarCambioFijo} required />
              <CampoFormulario label="Fecha del evento *" name="fecha_evento" type="date" value={datosFijos.fecha_evento} onChange={manejarCambioFijo} required />
              <CampoFormulario label="Hora de inicio *" name="hora_inicio" type="time" value={datosFijos.hora_inicio} onChange={manejarCambioFijo} required />
              
              <div className="relative md:col-span-2 mt-2 sm:mt-4">
                <label className="block text-[11px] sm:text-sm font-bold text-gray-200 mb-2 uppercase tracking-wide">Mensaje de la invitación *</label>
                <textarea name="mensaje" value={datosFijos.mensaje} onChange={manejarCambioFijo} maxLength={600} rows="5" className="w-full bg-black/20 border border-white/10 text-white placeholder-white/50 rounded-2xl px-4 py-4 focus:outline-none focus:border-pink-400 transition-colors resize-none shadow-inner text-sm" placeholder="Escribe un mensaje emocionante para tus invitados..." required />
                <div className={`text-right text-[10px] sm:text-xs mt-1 sm:mt-2 font-bold uppercase tracking-widest ${datosFijos.mensaje?.length >= 600 ? 'text-red-400' : 'text-white'}`}>
                  {datosFijos.mensaje?.length || 0} / 600
                </div>
              </div>
            </div>
          </div>

          {sugerencias && sugerencias.length > 0 && (
            <>
              <div className="h-px w-full bg-gradient-to-r from-transparent via-pink-400/50 to-transparent my-2 sm:my-4"></div>
              <div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-black text-white mb-5 sm:mb-6 pb-3 sm:pb-4 border-b border-white/10 drop-shadow-sm flex items-center gap-2 sm:gap-3">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-pink-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                  Detalles Específicos
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-start">
                  {sugerenciasObligatorias.map((sug) => (
                    <div key={sug.id || sug.titulo_campo} className={sug.tipo_campo === "textarea" || sug.tipo_campo === "timeline" || sug.tipo_campo === "listado" || sug.tipo_campo === "url" ? "md:col-span-2" : ""}>
                      {renderCampoDinamico(sug)}
                    </div>
                  ))}

                  {opcionalesMostradas.map((sug) => (
                    <div key={sug.id || sug.titulo_campo} className={`relative group/campo ${sug.tipo_campo === "textarea" || sug.tipo_campo === "timeline" || sug.tipo_campo === "listado" || sug.tipo_campo === "url" ? "md:col-span-2" : ""}`}>
                      <button 
                        type="button" 
                        onClick={() => quitarOpcional(sug)} 
                        className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 z-10 bg-red-500 text-white p-1 sm:p-1.5 rounded-full border border-red-400 md:opacity-0 md:group-hover/campo:opacity-100 transition-opacity shadow-lg"
                        title="Quitar campo opcional"
                      >
                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                      {renderCampoDinamico(sug)}
                    </div>
                  ))}
                </div>

                {opcionalesDisponibles.length > 0 && (
                  <div className="mt-6 sm:mt-8 pt-3 sm:pt-4">
                    {!mostrarMenuOpcionales ? (
                      <button 
                        type="button" 
                        onClick={() => setMostrarMenuOpcionales(true)} 
                        className="text-sky-100 bg-sky-500 border border-sky-500/20 px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl font-black text-[9px] sm:text-[10px] uppercase tracking-widest hover:bg-sky-600 hover:text-white transition-colors flex items-center justify-center gap-2 w-full md:w-auto"
                      >
                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                        Añadir más detalles (Opcional)
                      </button>
                    ) : (
                      <div className="p-4 sm:p-5 md:p-6 bg-black/40 border border-white/10 rounded-[1.5rem] sm:rounded-[2rem] flex flex-col gap-3 shadow-inner animate-fade-in-down">
                        <div className="flex justify-between items-center border-b border-white/10 pb-2 sm:pb-3 mb-1 sm:mb-2">
                          <p className="text-[10px] sm:text-xs text-pink-300 font-bold uppercase tracking-widest">Campos adicionales disponibles</p>
                          <button type="button" onClick={() => setMostrarMenuOpcionales(false)} className="text-gray-500 hover:text-white transition-colors p-1">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                          {opcionalesDisponibles.map(sug => (
                            <div key={sug.id || sug.titulo_campo} className="flex justify-between items-center bg-white/5 p-3 sm:p-4 rounded-xl border border-white/5 hover:border-white/20 transition-colors group/item">
                              <div className="pr-2 sm:pr-4 truncate">
                                <p className="text-xs sm:text-sm font-bold text-white mb-0.5 truncate" title={sug.titulo_campo}>{sug.titulo_campo}</p>
                                <p className="text-[8px] sm:text-[9px] text-sky-400 uppercase tracking-widest">{traducirTipo(sug.tipo_campo)}</p>
                              </div>
                              <button 
                                type="button" 
                                onClick={() => agregarOpcional(sug)} 
                                className="bg-pink-400/20 text-pink-300 p-2 sm:p-2.5 rounded-lg hover:bg-pink-400 hover:text-white transition-all active:scale-95 shadow-sm md:group-hover/item:scale-110 flex-shrink-0"
                                title="Añadir campo al formulario"
                              >
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}

          {plantillas && plantillas.length > 0 && (
            <>
              <div className="h-px w-full bg-gradient-to-r from-transparent via-sky-400/50 to-transparent my-2 sm:my-4"></div>
              <div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-black text-white mb-5 sm:mb-8 pb-3 sm:pb-4 border-b border-white/10 drop-shadow-sm flex items-center gap-2 sm:gap-3">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 00-2-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  Diseño de la Invitación
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                  {plantillas.map((plantilla) => (
                    <div 
                      key={plantilla.id} 
                      onClick={() => setPlantillaSeleccionada(plantilla.id)} 
                      className={`cursor-pointer rounded-3xl border-2 transition-all duration-300 flex flex-col p-1.5 sm:p-2 group ${
                        plantillaSeleccionada === plantilla.id 
                          ? "border-pink-300 shadow-[0_0_20px_rgba(244,114,182,0.4)] bg-pink-300/10 scale-[1.02] sm:scale-105" 
                          : "border-transparent bg-white/5 hover:bg-white/10 hover:border-sky-400/50 md:hover:-translate-y-1"
                      }`}
                    >
                      <div className="w-full aspect-[3/4] bg-black/40 relative rounded-[1.2rem] sm:rounded-2xl overflow-hidden shadow-inner">
                        <img 
                          src={`/${plantilla.imagen}`} 
                          alt={plantilla.titulo} 
                          className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ${plantillaSeleccionada === plantilla.id ? "scale-110" : "md:group-hover:scale-105"}`} 
                          onError={(e) => { e.target.onerror = null; e.target.style.display = "none"; }} 
                        />
                        {plantillaSeleccionada === plantilla.id && (
                           <div className="absolute inset-0 bg-pink-300/20 mix-blend-overlay"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <div className="pt-6 sm:pt-10 flex justify-end">
            <button 
              type="submit" 
              disabled={cargandoAccion || subiendoImg} 
              className="w-full sm:w-auto bg-pink-400 text-white font-black text-[10px] sm:text-[11px] uppercase tracking-[0.2em] px-8 sm:px-12 py-4 sm:py-5 rounded-2xl hover:bg-pink-300 transition-all shadow-lg shadow-pink-400/30 active:scale-95 disabled:bg-gray-600 disabled:shadow-none flex items-center justify-center gap-2 sm:gap-3"
            >
              {cargandoAccion ? "Generando..." : textoBoton}
              {!cargandoAccion && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>}
            </button>
          </div>
        </form>
      </div>

      <div className="w-full max-w-6xl mx-auto mt-4 sm:mt-6">
        <button 
          type="button"
          onClick={volverFaseAnterior ? volverFaseAnterior : () => navegar('/mis-creaciones')} 
          className="w-full sm:w-auto flex justify-center sm:justify-start items-center text-pink-300 bg-white hover:bg-pink-300 hover:text-white backdrop-blur-md px-5 py-3 sm:py-2.5 rounded-full font-black text-[9px] sm:text-[10px] uppercase tracking-widest transition-all shadow-sm group border border-white/50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 md:group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          {volverFaseAnterior ? "Volver a la selección del paquete" : "Cancelar edición"}
        </button>
      </div>
    </div>
  );
};

const FaseFormularioDinamico = () => {
  const { datosCreacion, volverFaseAnterior, cargandoCreacion, errorCreacion } = useCreacion();
  const {
    sugerencias, plantillas, cargando, error, datosFijos, datosDinamicos, plantillaSeleccionada,
    setPlantillaSeleccionada, manejarCambioFijo, manejarCambioDinamico, manejarEnvio,
  } = useFormulario();

  if (cargando) return <Cargando mensaje="Cargando entorno de diseño..." />;
  
  if (error) return (
    <div className="w-full max-w-6xl mx-auto bg-red-500/10 backdrop-blur-md border border-red-500/30 text-red-200 p-6 rounded-2xl shadow-sm text-center mt-10">
      <p className="font-bold tracking-wide">{error}</p>
    </div>
  );

  return (
    <FormularioInvitacionUI 
      tituloCabecera={`Personaliza tu ${datosCreacion.paquete?.nombre}`}
      subtituloCabecera="Completa los datos y elige el diseño visual final para tu creación."
      datosFijos={datosFijos}
      datosDinamicos={datosDinamicos}
      sugerencias={sugerencias}
      plantillas={plantillas}
      plantillaSeleccionada={plantillaSeleccionada}
      manejarCambioFijo={manejarCambioFijo}
      manejarCambioDinamico={manejarCambioDinamico}
      setPlantillaSeleccionada={setPlantillaSeleccionada}
      manejarEnvio={manejarEnvio}
      volverFaseAnterior={volverFaseAnterior}
      errorGlobal={errorCreacion}
      textoBoton="¡Generar Invitación!"
      cargandoAccion={cargandoCreacion}
      imagenPaquete={datosCreacion.paquete?.imagen}
    />
  );
};

export default FaseFormularioDinamico;