// src/components/ui/Aviso.jsx
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Aviso = ({ mensaje, tipo = 'info', visible, onClose, duracion = 5000 }) => {
  
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onClose();
      }, duracion);
      return () => clearTimeout(timer);
    }
  }, [visible, duracion, onClose]);

  const estilos = {
    exito: 'bg-emerald-500/90 border-emerald-400 text-white shadow-[0_10px_30px_rgba(16,185,129,0.3)]',
    error: 'bg-pink-300/95 border-pink-300 text-white shadow-[0_10px_30px_rgba(239,68,68,0.4)]',
    info: 'bg-sky-500/90 border-sky-400 text-white shadow-[0_10px_30px_rgba(14,165,233,0.3)]',
  };

  const iconos = {
    exito: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />,
    error: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />,
    info: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: 50, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 50, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="fixed top-20 sm:top-24 right-2 sm:right-8 z-[9999] pointer-events-none"
        >
          <div className={`pointer-events-auto backdrop-blur-xl border rounded-2xl p-4 sm:p-5 flex items-start gap-3 sm:gap-4 w-[calc(100vw-1rem)] sm:w-auto min-w-[280px] sm:min-w-[300px] max-w-sm sm:max-w-md ${estilos[tipo]}`}>
            
            <div className="flex-shrink-0 bg-white/20 rounded-full p-1.5 backdrop-blur-sm mt-0.5">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {iconos[tipo]}
              </svg>
            </div>
            
            <p className="font-bold text-xs sm:text-sm tracking-wide leading-relaxed flex-1 whitespace-pre-line break-words">
              {mensaje}
            </p>
            
            <button 
              onClick={onClose} 
              className="flex-shrink-0 ml-1 sm:ml-2 text-white/60 hover:text-white bg-black/5 hover:bg-black/10 rounded-full p-1 sm:p-1.5 transition-colors mt-0.5"
            >
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Aviso;