import React, { createContext } from 'react';
import TimelineNarrativa from '../components/plantillas/narrativa/TimelineNarrativa.jsx';

const ContextoPlantillas = createContext();

const ProveedorPlantillas = ({ children }) => {
  
  const renderizarTimeline = (fases, titulo = "Fases del Evento", nombrePlantilla = "Narrativa", esModoPDF = false) => {
    if (!fases || fases.length === 0) return null;

    const nombreNorm = (nombrePlantilla || '').toLowerCase();

    // RUTA 1: Plantilla Narrativa (Le paso esModoPDF al componente)
    if (nombreNorm.includes('narrativa')) {
      return <TimelineNarrativa fases={fases} titulo={titulo} esModoPDF={esModoPDF} />;
    }

    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mt-4">
        <h3 className="text-gray-400 text-xs font-black uppercase tracking-widest mb-4">{titulo}</h3>
        <p className="text-gray-500 italic">Timeline clásico por defecto...</p>
      </div>
    );
  };

  const datosInsertadosContexto = {
    renderizarTimeline,
  };

  return (
    <ContextoPlantillas.Provider value={datosInsertadosContexto}>
      {children}
    </ContextoPlantillas.Provider>
  );
};

export default ProveedorPlantillas;
export { ContextoPlantillas };