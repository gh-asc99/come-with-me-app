// src/components/plantillas/RenderizadorPlantilla.jsx
import React from 'react';
import PlantillaClasica from './PlantillaClasica.jsx';
import PlantillaDosColumnas from './PlantillaDosColumnas.jsx';
import PlantillaNarrativa from './PlantillaNarrativa.jsx';
import PlantillaVisual from './PlantillaVisual.jsx';

// Hacemos el mapa EXPORTABLE para que el Formulario Dinámico pueda saber 
// qué plantilla se está seleccionando sin repetir código.
export const MAPA_PLANTILLAS = {
  'fdb4eec5959f4550a3814e536f93793b': 'clasica',
  '913f8a5bed9a45148ab894ba9c93ed88': 'dos_columnas',
  '9a529f37a279467aa92e5cfa704bce28': 'narrativa',
  'ae9ff9e642cb49279f02069cdfa8be74': 'visual'
};

const RenderizadorPlantilla = ({ invitacion, urlImagen, esModoPDF = false }) => {
  
  // MAGIA ANTI-GUIONES: Venga como venga el ID (con guiones o sin ellos), 
  // eliminamos cualquier guión y lo pasamos a minúsculas.
  const idNormalizado = invitacion?.plantilla_id 
    ? invitacion.plantilla_id.replace(/-/g, '').toLowerCase() 
    : '';

  // Buscamos en el mapa. Si no coincide, cae en la clásica.
  const nombrePlantilla = MAPA_PLANTILLAS[idNormalizado] || 'clasica';

  switch (nombrePlantilla) {
    case 'clasica':
      return <PlantillaClasica invitacion={invitacion} urlImagen={urlImagen} esModoPDF={esModoPDF} />;
    case 'dos_columnas':
      return <PlantillaDosColumnas invitacion={invitacion} urlImagen={urlImagen} esModoPDF={esModoPDF} />;
    case 'narrativa':
      return <PlantillaNarrativa invitacion={invitacion} urlImagen={urlImagen} esModoPDF={esModoPDF} />;
    case 'visual':
      return <PlantillaVisual invitacion={invitacion} urlImagen={urlImagen} esModoPDF={esModoPDF} />;
    default:
      return <PlantillaClasica invitacion={invitacion} urlImagen={urlImagen} esModoPDF={esModoPDF} />;
  }
};

export default RenderizadorPlantilla;