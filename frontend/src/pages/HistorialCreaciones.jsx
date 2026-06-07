import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useHistorial } from "../hooks/useHistorial.js";
import TarjetaInvitacion from "../components/creacion/TarjetaInvitacion.jsx";
import ModalConfirmacion from "../components/ui/ModalConfirmacion.jsx";
import RenderizadorPlantilla from "../components/plantillas/RenderizadorPlantilla.jsx";
import { QRCodeCanvas } from "qrcode.react";
import html2pdf from "html2pdf.js";
import ContenedorPrincipal from "../components/layout/ContenedorPrincipal.jsx";
import fondoMosaico from "../../public/fondo_mosaico.png";
import Aviso from "../components/ui/Aviso.jsx";
import Cargando from "../components/ui/Cargando.jsx";

const HistorialCreaciones = () => {
  const navegar = useNavigate();
  const { invitaciones, cargando, eliminarInvitacion } = useHistorial();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [invitacionAEliminar, setInvitacionAEliminar] = useState(null);
  const [modalQR, setModalQR] = useState(false);
  const [invitacionActiva, setInvitacionActiva] = useState(null);
  const [generandoPDF, setGenerandoPDF] = useState(false);
  const [aviso, setAviso] = useState({
    visible: false,
    mensaje: "",
    tipo: "info",
  });

  const areaPdfRef = useRef(null);
  const tieneCreaciones = invitaciones.length > 0;

  // LÓGICA DE GENERACIÓN DE PDF
  useEffect(() => {
    if (generandoPDF && invitacionActiva && areaPdfRef.current) {
      const generarDocumento = async () => {
        try {
          const elemento = areaPdfRef.current;
          const opciones = {
            margin: [15, 0, 15, 0],
            filename: `Invitacion_${invitacionActiva.titulo.replace(/\s+/g, "_")}.pdf`,
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: {
              scale: 2,
              useCORS: true,
              letterRendering: true,
              scrollY: 0,
              logging: false,
              allowTaint: true,
              removeContainer: true,
            },
            jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
            pagebreak: { mode: ["css", "legacy"] },
          };

          await html2pdf().set(opciones).from(elemento).save();

          setAviso({
            visible: true,
            mensaje: "¡Invitación en PDF descargada con éxito!",
            tipo: "exito",
          });
        } catch (error) {
          console.error("Error crítico al generar PDF:", error);

          setAviso({
            visible: true,
            mensaje: "Hubo un problema al crear el archivo. Inténtalo de nuevo.",
            tipo: "error",
          });
        } finally {
          setGenerandoPDF(false);
        }
      };

      generarDocumento();
    }
  }, [generandoPDF, invitacionActiva]);

  const manejarDescargaPDF = (invitacion) => {
    setInvitacionActiva(invitacion);
    setGenerandoPDF(true);
  };

  const solicitarEliminacion = (id, titulo) => {
    setInvitacionAEliminar({ id, titulo });
    setModalAbierto(true);
  };

  const confirmarEliminacion = async () => {
    if (!invitacionAEliminar) return;

    const resultado = await eliminarInvitacion(invitacionAEliminar.id);

    if (resultado.success) {
      setModalAbierto(false);
      setInvitacionAEliminar(null);
    } else {
      setAviso({ visible: true, mensaje: resultado.error, tipo: "error" });
    }
  };

  const mostrarQR = (invitacion) => {
    setInvitacionActiva(invitacion);
    setModalQR(true);
  };

  const descargarQR = () => {
    const canvas = document.getElementById("qr-canvas-historial");

    if (canvas) {
      const urlImagen = canvas.toDataURL("image/png");
      const enlaceDescarga = document.createElement("a");
      enlaceDescarga.href = urlImagen;
      enlaceDescarga.download = `QR_${invitacionActiva?.titulo || "Invitacion"}.png`;
      enlaceDescarga.click();
      setAviso({
        visible: true,
        mensaje: "¡Código QR descargado con éxito!",
        tipo: "exito",
      });
    }
  };

  let urlImagenActiva = null;

  if (invitacionActiva?.imagen) {
    if (invitacionActiva.imagen.startsWith("http")) {
      urlImagenActiva = invitacionActiva.imagen;
    } else if (invitacionActiva.imagen.includes("uploads")) {
      urlImagenActiva = `http://localhost:3300/${invitacionActiva.imagen.replace(/^\//, "")}`;
    } else {
      urlImagenActiva = `/${invitacionActiva.imagen.replace(/^\//, "")}`;
    }
  }

  if (cargando) return <Cargando mensaje="Cargando tus creaciones " />;

  if (generandoPDF) {
    return (
      <>
        <Cargando mensaje="Generando archivo PDF..." />
        {/* ZONA OCULTA PARA GENERAR EL PDF */}
        <div
          style={{
            position: "absolute",
            zIndex: "-100",
            top: "0",
            left: "0",
            opacity: 0,
            pointerEvents: "none",
            width: "100%",
          }}
        >
          <div
            ref={areaPdfRef}
            className="bg-white relative"
            style={{ width: "680px", margin: "0 auto", paddingBottom: "20px" }}
          >
            <RenderizadorPlantilla
              invitacion={invitacionActiva}
              urlImagen={urlImagenActiva}
              esModoPDF={true}
            />
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-64px)] w-full overflow-hidden flex flex-col items-center bg-sky-50">

      <Aviso
        mensaje={aviso.mensaje}
        tipo={aviso.tipo}
        visible={aviso.visible}
        onClose={() => setAviso({ ...aviso, visible: false })}
      />

      <div
        className={`fixed inset-0 z-0 bg-cover bg-center bg-no-repeat  ${!tieneCreaciones ? "grayscale" : ""}`}
        style={{
          backgroundImage: `url(${tieneCreaciones ? fondoMosaico : "/historial_vacio.png"})`,
        }}
      >
        <div className="absolute inset-0 bg-black/10"></div>
      </div>

      <ContenedorPrincipal className="relative z-10 w-full flex-1 animate-fade-in-up py-5 flex flex-col">
        {tieneCreaciones ? (
          <div className="w-full max-w-6xl mx-auto flex flex-col">
            
            {/* MODO CON CREACIONES: PANEL SUPERIOR RESPONSIVE */}
            <div className="w-full bg-black/25 backdrop-blur-2xl rounded-[2rem] sm:rounded-[2.5rem] border border-white/10 overflow-hidden mb-5 flex flex-col">
              <div className="w-full bg-black/20 p-5 sm:p-8 md:px-12 md:py-6 flex flex-col md:flex-row justify-between items-center md:items-center gap-4 md:gap-6 text-center md:text-left">
                <div className="flex flex-col">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tighter drop-shadow-sm">
                    Mis{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-pink-300">
                      Creaciones
                    </span>
                  </h1>

                  <p className="text-gray-200 font-medium text-xs sm:text-sm mt-1 sm:text-sm md:mt-2 drop-shadow-sm">
                    Visualiza, gestiona y comparte todas tus invitaciones.
                  </p>
                </div>

                <button onClick={() => navegar("/nueva-creacion")} className="w-full md:w-auto bg-pink-300 text-white font-black text-[11px] sm:text-[12px] uppercase tracking-widest px-6 py-3.5 sm:px-8 sm:py-4 rounded-2xl hover:bg-pink-400 transition-all active:scale-95 flex-shrink-0 flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
                  </svg>
                  NUEVA CREACIÓN
                </button>
              </div>
            </div>

            {/* LISTA DE INVITACIONES */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 pb-4">
              {invitaciones.map((inv) => (
                <TarjetaInvitacion
                  key={inv.id}
                  invitacion={inv}
                  onVisualizar={(id) => navegar(`/invitacion/${id}`)}
                  onGestionar={(id) => navegar(`/gestion-invitados/${id}`)}
                  onEliminar={solicitarEliminacion}
                  onDescargarPDF={manejarDescargaPDF}
                  onMostrarQR={mostrarQR}
                  onEditar={(id) => navegar(`/editar-invitacion/${id}`)}
                />
              ))}
            </div>
          </div>
        ) : (
          /* MODO VACÍO: ADAPTADO A RESOLUCIONES MÓVILES */
          <div className="flex-1 flex flex-col items-center justify-center text-center w-full h-full min-h-[50vh] px-2 sm:px-4">
            <div className="bg-black/40 backdrop-blur-2xl p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] border border-white/10 flex flex-col items-center shadow-2xl max-w-2xl w-full">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-3 md:mb-4 tracking-tighter drop-shadow-md">
                ¡Vaya! Aún no tienes creaciones
              </h2>

              <p className="text-xs sm:text-sm md:text-lg text-gray-200 font-medium mb-8 sm:mb-10 drop-shadow-md px-2 sm:px-4">
                Tu historial está vacío. Anímate a diseñar tu primera invitación
                y empieza a compartir momentos inolvidables.
              </p>

              <button
                onClick={() => navegar("/nueva-creacion")}
                className="w-full sm:w-auto bg-pink-300 text-white font-black text-[11px] sm:text-[12px] uppercase tracking-widest px-8 py-4 sm:px-10 sm:py-5 rounded-2xl hover:bg-pink-400 transition-all active:scale-95 flex items-center justify-center gap-3"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                NUEVA CREACIÓN
              </button>
            </div>
          </div>
        )}
      </ContenedorPrincipal>

      <ModalConfirmacion
        isOpen={modalAbierto}
        titulo="¿Eliminar invitación?"
        mensaje={`Estás a punto de borrar "${invitacionAEliminar?.titulo}". Se perderán todos los datos y la lista de invitados.`}
        textoConfirmar="Sí, eliminar"
        textoCancelar="Cancelar"
        esDestructivo={true}
        onConfirm={confirmarEliminacion}
        onCancel={() => setModalAbierto(false)}
      />

      {modalQR && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[9999] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 md:p-10 max-w-sm w-full relative shadow-2xl">
            <button
              onClick={() => setModalQR(false)}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 text-gray-400 hover:text-pink-500 transition-colors bg-gray-50 hover:bg-pink-50 p-2 rounded-full"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <h3 className="text-xl sm:text-2xl font-black text-[#252525] mb-2 text-center tracking-tight">
              Código QR
            </h3>

            <p className="text-center text-gray-500 text-xs sm:text-sm font-medium mb-6 sm:mb-8 truncate px-4">
              {invitacionActiva?.titulo}
            </p>

            <div className="bg-sky-50 p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] flex justify-center mb-6 sm:mb-8 border border-sky-100 shadow-inner">
              <QRCodeCanvas
                id="qr-canvas-historial"
                value={`${window.location.origin}/invitacion/${invitacionActiva?.id}`}
                size={180}
                level={"H"}
              />
            </div>

            <button
              onClick={descargarQR}
              className="w-full bg-sky-500 text-white font-black text-[10px] uppercase tracking-widest py-3.5 sm:py-4 rounded-2xl hover:bg-sky-400 transition-all shadow-lg shadow-sky-500/30 active:scale-95 flex justify-center items-center gap-2"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Descargar Imagen
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default HistorialCreaciones;