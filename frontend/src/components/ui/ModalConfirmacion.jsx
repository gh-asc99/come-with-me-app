import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ModalConfirmacion = ({ 
  isOpen, 
  titulo, 
  mensaje, 
  textoConfirmar = "Confirmar", 
  textoCancelar = "Cancelar", 
  onConfirm, 
  onCancel,
  esDestructivo = false,
  tipo = 'info', // 'exito', 'error', 'info'. Si pasas onConfirm, asume que es 'confirmacion'.
  duracion = 4000 // Tiempo en ms antes de desaparecer (solo si no hay botones)
}) => {

  // --- LÓGICA DE AUTO-CIERRE ---
  useEffect(() => {
    if (isOpen && !onConfirm) {
      const timer = setTimeout(() => {
        if (onCancel) onCancel(); // Usamos onCancel() genéricamente para cerrar el modal
      }, duracion);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onConfirm, duracion, onCancel]);

  // --- CONFIGURACIÓN VISUAL (Ajustada a la nueva paleta) ---
  const determinarEstilo = () => {
    if (esDestructivo || tipo === 'error') {
      return {
        bg: 'bg-white', 
        border: 'border-pink-300', 
        iconColor: 'text-pink-400', 
        iconBg: 'bg-pink-50', 
        btnConfirmar: 'bg-pink-300 hover:bg-pink-400', // Colores suavizados como pediste
        icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      };
    }
    if (tipo === 'exito') {
      return {
        bg: 'bg-white', border: 'border-sky-400', iconColor: 'text-sky-500', iconBg: 'bg-sky-50', btnConfirmar: 'bg-sky-500 hover:bg-sky-600',
        icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
      };
    }
    // Por defecto (Info / Confirmación estándar en tonos rosas)
    return {
      bg: 'bg-white', border: 'border-pink-300', iconColor: 'text-pink-500', iconBg: 'bg-pink-50', btnConfirmar: 'bg-pink-500 hover:bg-pink-600',
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    };
  };

  const estilo = determinarEstilo();
  const requiereRespuesta = !!onConfirm; // Si onConfirm existe, mostramos los botones

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* BACKDROP: Solo se muestra si es una confirmación que bloquea la pantalla */}
          {requiereRespuesta && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9998] bg-black/40 backdrop-blur-sm"
              onClick={onCancel} // Cerrar si hacen clic fuera
            />
          )}

          {/* EL MODAL / TOAST */}
          <motion.div
            initial={{ opacity: 0, x: requiereRespuesta ? 0 : 100, y: requiereRespuesta ? 20 : 0, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: requiereRespuesta ? 0 : 100, y: requiereRespuesta ? 20 : 0, scale: 0.95, transition: { duration: 0.2 } }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className={`fixed z-[9999] p-4 pointer-events-none flex ${
              requiereRespuesta 
                ? 'inset-0 items-center justify-center' // Centrado si es confirmación
                : 'top-6 right-6 items-start justify-end w-full max-w-sm' // Arriba a la derecha si es solo aviso
            }`}
          >
            {/* Se elimina el border-l-4 si es una confirmación central. 
              Se cambia max-w-md a max-w-lg para ensancharlo un poco. 
            */}
            <div className={`pointer-events-auto bg-white rounded-3xl p-6 md:p-8 shadow-2xl ${requiereRespuesta ? 'w-full max-w-xl' : `w-full border-l-4 ${estilo.border}`}`}>
              
              <div className={`flex ${requiereRespuesta ? 'flex-col items-center' : 'items-start gap-4'}`}>
                
                {/* ICONO */}
                <div className={`flex-shrink-0 flex items-center justify-center rounded-full ${estilo.iconBg} ${estilo.iconColor} ${requiereRespuesta ? 'w-16 h-16 mb-6' : 'w-10 h-10'}`}>
                  <svg className={`${requiereRespuesta ? 'w-8 h-8' : 'w-6 h-6'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {estilo.icon}
                  </svg>
                </div>

                {/* CONTENIDO (Textos) */}
                <div className={`flex-1 ${requiereRespuesta ? 'text-center w-full' : 'pt-1'}`}>
                  <h3 className={`font-bold text-[#252525] ${requiereRespuesta ? 'text-2xl md:text-3xl mb-3' : 'text-sm uppercase tracking-wide'}`}>
                    {titulo}
                  </h3>
                  <p className={`text-gray-500 ${requiereRespuesta ? 'mb-8 md:text-lg' : 'mt-1 text-sm font-medium leading-relaxed'}`}>
                    {mensaje}
                  </p>

                  {/* BOTONES (Para confirmación) */}
                  {requiereRespuesta && (
                    <div className="flex flex-col sm:flex-row gap-3 w-full mt-2">
                      <button 
                        onClick={onCancel}
                        className="flex-1 px-6 py-3.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                      >
                        {textoCancelar}
                      </button>
                      <button 
                        onClick={onConfirm}
                        className={`flex-1 px-6 py-3.5 font-bold rounded-xl text-white transition-colors shadow-md ${estilo.btnConfirmar}`}
                      >
                        {textoConfirmar}
                      </button>
                    </div>
                  )}
                </div>

                {/* BOTÓN X (Cerrar rápido para avisos top-right) */}
                {!requiereRespuesta && (
                  <button onClick={onCancel} className="flex-shrink-0 ml-4 text-gray-400 hover:text-pink-500 transition-colors p-1">
                    <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}

              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ModalConfirmacion;