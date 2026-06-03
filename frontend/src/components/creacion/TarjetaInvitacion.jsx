import React from "react";

const TarjetaInvitacion = ({
  invitacion,
  onVisualizar,
  onGestionar,
  onEliminar,
  onDescargarPDF,
  onMostrarQR,
  onEditar
}) => {
  // Función para construir la URL correcta de la imagen hacia el backend
  // Lógica inteligente para saber de dónde sacar la imagen
  let urlImagen = null; // En HistorialCreaciones llámalo urlImagenActiva y usa invitacionActiva.imagen

  if (invitacion?.imagen) {
    if (invitacion.imagen.startsWith("http")) {
      // 1. Es un enlace externo (ej: Cloudinary o una web cualquiera)
      urlImagen = invitacion.imagen;
    } else if (invitacion.imagen.includes("uploads")) {
      // 2. Es una imagen subida por el usuario (vive en el Backend)
      // Usamos .replace(/^\//, '') para quitar la barra inicial si la trae y evitar "//uploads"
      urlImagen = `http://localhost:3300/${invitacion.imagen.replace(/^\//, "")}`;
    } else {
      // 3. Es la imagen por defecto de un paquete (vive en el Frontend /public)
      urlImagen = `/${invitacion.imagen.replace(/^\//, "")}`;
    }
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all flex flex-col relative group">
      <button
        onClick={() => onEliminar(invitacion.id, invitacion.titulo)}
        className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-sm text-gray-400 hover:text-red-500 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
        title="Eliminar invitación"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>

      {/* --- AQUÍ ESTÁ EL CAMBIO DE LA IMAGEN --- */}
      <div className="h-48 bg-pink-50 relative flex items-center justify-center overflow-hidden border-b border-gray-100">
        {urlImagen ? (
          <img
            src={urlImagen}
            alt={`Portada de ${invitacion.titulo}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onClick={() => onVisualizar(invitacion.id)} 
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = "none"; // Si falla, se oculta y se ve el fondo rosa
            }}
          />
        ) : (
          <span className="text-pink-300 font-bold uppercase tracking-widest text-xs">
            Sin Portada
          </span>
        )}
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-extrabold text-[#252525] mb-1 truncate">
          {invitacion.titulo}
        </h3>
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          {new Date(invitacion.fecha_evento).toLocaleDateString("es-ES")}
        </div>

        <div className="bg-sky-50 rounded-xl p-4 mb-6 flex justify-between items-center border border-sky-100">
          <div>
            <span className="block text-xs font-bold text-sky-500 uppercase tracking-tighter">
              Confirmados
            </span>
            <span className="text-lg font-black text-[#252525]">
              {invitacion.total_confirmados || 0}{" "}
              <span className="text-sm font-normal text-gray-500">
                / {invitacion.total_invitados || 0}
              </span>
            </span>
          </div>
          <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-sky-500 shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
          </div>
        </div>

        <div className="flex-1"></div>

        <button
          onClick={() => onGestionar(invitacion.id)}
          className="w-full bg-[#252525] text-white font-bold py-3 rounded-xl hover:bg-black transition-colors mb-2"
        >
          Gestionar Invitados
        </button>

        {/* --- FILA DE 4 ICONOS --- */}
        {/* CORRECCIÓN: Cambiamos grid-cols-3 por grid-cols-4 para que quepan todos */}
        <div className="grid grid-cols-4 gap-2 border-t border-gray-100 pt-4 mt-4">
          
          {/* 1. Botón Visualizar (Rosa) */}
          <button 
            onClick={() => onVisualizar(invitacion.id)} 
            title="Visualizar en web"
            className="flex items-center justify-center p-2 text-gray-400 hover:bg-pink-50 hover:text-pink-500 rounded-lg transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>

          {/* 2. Botón Descargar PDF (Azul) */}
          <button 
            onClick={() => onDescargarPDF(invitacion)} 
            title="Descargar en PDF"
            className="flex items-center justify-center p-2 text-gray-400 hover:bg-sky-50 hover:text-sky-500 rounded-lg transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>

          {/* 3. Botón Mostrar QR (Verde) */}
          <button 
            onClick={() => onMostrarQR(invitacion)} 
            title="Ver Código QR"
            className="flex items-center justify-center p-2 text-gray-400 hover:bg-green-50 hover:text-[#25D366] rounded-lg transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
          </button>

          {/* 4. Botón Editar (Amarillo) */}
          <button 
            onClick={() => onEditar(invitacion.id)} // O usar navegar(`/editar-invitacion/${invitacion.id}`) según la opción que eligieras
            title="Editar contenido"
            className="flex items-center justify-center p-2 text-gray-400 hover:bg-yellow-50 hover:text-yellow-500 rounded-lg transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          
        </div>
      </div>
    </div>
  );
};

export default TarjetaInvitacion;
