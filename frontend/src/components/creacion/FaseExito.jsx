import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useCreacion from "../../hooks/useCreacion.js";
import { QRCodeCanvas } from "qrcode.react";
import html2pdf from "html2pdf.js";
import RenderizadorPlantilla from "../plantillas/RenderizadorPlantilla.jsx";
import ContenedorPrincipal from "../layout/ContenedorPrincipal.jsx";

const FaseExito = () => {
  const { datosCreacion, reiniciarCreacion } = useCreacion();
  const navegar = useNavigate();
  const [mostrarQR, setMostrarQR] = useState(false);
  const [generandoPDF, setGenerandoPDF] = useState(false);
  const [imagenBase64, setImagenBase64] = useState(null);

  const areaPdfRef = useRef();

  const invitacion = datosCreacion.invitacionGenerada;
  const urlVisualizacion = `/invitacion/${invitacion?.id || ""}`;
  const urlCompleta = `${window.location.origin}${urlVisualizacion}`;

  const urlImagenActiva = invitacion?.imagen 
    ? (invitacion.imagen.startsWith('http') 
        ? invitacion.imagen 
        : (invitacion.imagen.includes('uploads')
            ? `http://localhost:3300/${invitacion.imagen.replace(/^\//, '')}`
            : `/paquetes/${invitacion.imagen}`)) 
    : null;

  useEffect(() => {
    if (urlImagenActiva) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        setImagenBase64(canvas.toDataURL("image/jpeg", 0.95));
      };
      img.onerror = () => console.error("Error al transformar la imagen a Base64");
      img.src = urlImagenActiva;
    }
  }, [urlImagenActiva]);

  const descargarPDF = () => {
    setGenerandoPDF(true);

    setTimeout(async () => {
      const elemento = areaPdfRef.current;
      if (!elemento) {
        setGenerandoPDF(false);
        return;
      }

      const opciones = {
        margin: [15, 0, 15, 0], 
        filename: `Invitacion_${invitacion?.titulo?.replace(/\s+/g, '_') || "Evento"}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          letterRendering: true,
          scrollY: 0,
        },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        pagebreak: { mode: ['css', 'legacy'] }
      };

      try {
        await html2pdf().set(opciones).from(elemento).save();
      } catch (error) {
        console.error("Error al generar PDF:", error);
      } finally {
        setGenerandoPDF(false);
      }
    }, 1000);
  };

  const descargarQR = () => {
    const canvas = document.getElementById("qr-canvas");
    if (canvas) {
      const urlImagen = canvas.toDataURL("image/png");
      const enlaceDescarga = document.createElement("a");
      enlaceDescarga.href = urlImagen;
      enlaceDescarga.download = `QR_${invitacion?.titulo || "Invitacion"}.png`;
      enlaceDescarga.click();
    }
  };

  const compartirWhatsApp = () => {
    const titulo = invitacion?.titulo || "este evento tan especial";
    const mensaje = `¡Hola! Te invito a ${titulo}.\n\nPuedes ver todos los detalles, el lugar y la fecha exacta entrando en este enlace:\n${urlCompleta}`;
    const mensajeCodificado = encodeURIComponent(mensaje);
    const urlWhatsApp = `https://api.whatsapp.com/send?text=${mensajeCodificado}`;
    window.open(urlWhatsApp, "_blank");
  };

  return (
    <ContenedorPrincipal className="w-full flex flex-col items-center animate-fade-in-up">
      
      {/* PANEL CENTRAL DE ÉXITO */}
      <div className="w-full bg-gradient-to-br from-black/50 to-black/20 backdrop-blur-2xl p-8 sm:p-10 md:p-16 rounded-[2rem] sm:rounded-[3rem] border border-white/10 flex flex-col items-center text-center mb-5 shadow-2xl">
        
        <div className="flex justify-center mb-4 sm:mb-5 relative">
          <div className="absolute inset-0 bg-green-400 blur-2xl opacity-20 rounded-full animate-pulse"></div>
          <div className="h-20 w-20 sm:h-28 sm:w-28 bg-green-500/20 border border-green-400/50 rounded-full flex items-center justify-center relative z-10 shadow-[0_0_30px_rgba(74,222,128,0.3)]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 sm:h-14 sm:w-14 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-3 sm:mb-4 tracking-tighter drop-shadow-md leading-tight">
          ¡Invitación Creada!
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-gray-200 font-medium mb-8 sm:mb-10 drop-shadow-sm max-w-xl">
          Tu invitación <span className="font-black text-pink-300">"{invitacion?.titulo || "Nueva Invitación"}"</span> ya está lista y configurada para que la compartas.
        </p>

        <button
          onClick={() => navegar(urlVisualizacion)}
          className="w-full sm:w-auto bg-gradient-to-r from-sky-400 to-sky-500 text-white font-black text-[10px] sm:text-[12px] uppercase tracking-widest px-8 sm:px-12 py-4 sm:py-5 rounded-full hover:scale-105 transition-all shadow-[0_0_20px_rgba(56,189,248,0.4)] active:scale-95"
        >
          Visualizar mi Invitación
        </button>
      </div>

      {/* OPCIONES DE COMPARTIR Y DESCARGAR */}
      <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10">
        <button 
          onClick={compartirWhatsApp} 
          className="flex flex-row sm:flex-col items-center justify-start sm:justify-center p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] bg-black/50 border border-sky-400 hover:bg-sky-500/10 hover:border-sky-400 transition-all group backdrop-blur-md gap-4 sm:gap-0"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-10 sm:w-10 sm:mb-4 text-sky-400 md:group-hover:scale-110 transition-transform drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          <span className="font-black text-[10px] sm:text-xs text-white uppercase tracking-widest text-left sm:text-center">Enviar Enlace</span>
        </button>

        <button 
          onClick={() => setMostrarQR(true)} 
          className="flex flex-row sm:flex-col items-center justify-start sm:justify-center p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] bg-black/50 border border-pink-400 hover:bg-pink-400/10 hover:border-pink-300 transition-all group backdrop-blur-md shadow-lg gap-4 sm:gap-0"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-10 sm:w-10 sm:mb-4 text-pink-400 md:group-hover:scale-110 transition-transform drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
          </svg>
          <span className="font-black text-[10px] sm:text-xs text-white uppercase tracking-widest text-left sm:text-center">Código QR</span>
        </button>

        <button 
          onClick={descargarPDF} 
          disabled={generandoPDF} 
          className="flex flex-row sm:flex-col items-center justify-start sm:justify-center p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] bg-black/50 border border-gray-400 hover:bg-white/10 transition-all group backdrop-blur-md shadow-lg disabled:opacity-50 disabled:cursor-not-allowed gap-4 sm:gap-0"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 sm:h-10 sm:w-10 sm:mb-4 text-gray-300 drop-shadow-md transition-transform ${generandoPDF ? 'animate-bounce' : 'md:group-hover:scale-110 md:group-hover:text-white'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4-4m0 0l-4-4m4 4V4" />
          </svg>
          <span className={`font-black text-[10px] sm:text-xs uppercase tracking-widest transition-colors text-left sm:text-center ${generandoPDF ? 'text-gray-400' : 'text-gray-200 md:group-hover:text-white'}`}>
            {generandoPDF ? "Generando..." : "Descargar PDF"}
          </span>
        </button>
      </div>

      {/* NAVEGACIÓN FINAL */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 w-full max-w-2xl px-2 sm:px-0">
        <button 
          onClick={() => navegar("/acceso-app")} 
          className="w-full sm:w-auto px-6 sm:px-8 py-4 bg-white hover:bg-white/30 text-pink-300 font-black text-[9px] sm:text-[10px] uppercase tracking-widest rounded-2xl sm:rounded-[1rem] transition-all shadow-md border border-white/30"
        >
          Volver a mi panel
        </button>
        <button 
          onClick={reiniciarCreacion} 
          className="w-full sm:w-auto px-6 sm:px-8 py-4 bg-pink-300 hover:bg-pink-500/40 border border-pink-500/30 text-white hover:text-white font-black text-[9px] sm:text-[10px] uppercase tracking-widest rounded-2xl sm:rounded-[1rem] transition-all shadow-md"
        >
          Hacer otra creación
        </button>
      </div>

      {/* ZONA OCULTA PARA GENERAR EL PDF */}
      <div style={{ position: "absolute", top: "-10000px", left: "-10000px", width: "794px", pointerEvents: "none" }}>
        <div ref={areaPdfRef} className="bg-white relative" style={{ width: '680px', margin: '0 auto', paddingBottom: '20px' }}>
           <RenderizadorPlantilla 
             invitacion={invitacion} 
             urlImagen={imagenBase64 || urlImagenActiva} 
             esModoPDF={true} 
           />
        </div>
      </div>

      {/* MODAL QR */}
      {mostrarQR && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[9999] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 md:p-10 max-w-sm w-full relative shadow-2xl">
            <button 
              onClick={() => setMostrarQR(false)} 
              className="absolute top-4 right-4 sm:top-6 sm:right-6 text-gray-400 hover:text-pink-500 transition-colors bg-gray-50 hover:bg-pink-50 p-2 rounded-full"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            
            <h3 className="text-xl sm:text-2xl font-black text-[#252525] mb-2 text-center tracking-tight">Código QR</h3>
            <p className="text-center text-gray-500 text-xs sm:text-sm font-medium mb-6 sm:mb-8 truncate px-2 sm:px-4">{invitacion?.titulo}</p>
            
            <div className="bg-sky-50 p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] flex justify-center mb-6 sm:mb-8 border border-sky-100 shadow-inner">
              <QRCodeCanvas id="qr-canvas" value={urlCompleta} size={180} lg:size={200} level={"H"} />
            </div>
            
            <button 
              onClick={descargarQR} 
              className="w-full bg-sky-500 text-white font-black text-[9px] sm:text-[10px] uppercase tracking-widest py-3.5 sm:py-4 rounded-2xl hover:bg-sky-400 transition-all shadow-lg shadow-sky-500/30 active:scale-95 flex justify-center items-center gap-2"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4-4m0 0l-4-4m4 4V4" /></svg>
              Descargar Imagen
            </button>
          </div>
        </div>
      )}
    </ContenedorPrincipal>
  );
};

export default FaseExito;