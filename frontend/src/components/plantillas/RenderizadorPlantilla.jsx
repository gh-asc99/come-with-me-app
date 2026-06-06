import React from 'react';
import PlantillaClasica from './PlantillaClasica.jsx';
import PlantillaDosColumnas from './PlantillaDosColumnas.jsx';
import PlantillaNarrativa from './PlantillaNarrativa.jsx';
import PlantillaVisual from './PlantillaVisual.jsx';

const RenderizadorPlantilla = ({ invitacion, urlImagen, esModoPDF = false }) => {
  let nombrePlantilla = 'clasica';

  if (invitacion) {
    // Intentar leer el título directamente desde el backend
    const plantillaObj = invitacion.plantilla_usada || invitacion.plantilla || invitacion.Plantilla;
    
    if (plantillaObj && plantillaObj.titulo) {
      const tituloBd = plantillaObj.titulo.toLowerCase();
      if (tituloBd.includes('columnas')) nombrePlantilla = 'dos_columnas';
      else if (tituloBd.includes('narrativa')) nombrePlantilla = 'narrativa';
      else if (tituloBd.includes('visual')) nombrePlantilla = 'visual';
    } 
    // Si el backend no envía el título (ej. al generar el PDF en FaseExito), uso la caché
    else if (invitacion.plantilla_id) {
      const idBuscado = invitacion.plantilla_id.replace(/-/g, '').toLowerCase();
      try {
        const cacheMapa = localStorage.getItem('mapa_plantillas_memoria');
        if (cacheMapa) {
          const mapa = JSON.parse(cacheMapa);
          if (mapa[idBuscado]) {
            nombrePlantilla = mapa[idBuscado];
          }
        }
      } catch (error) {
        console.error("Error leyendo caché de plantillas", error);
      }
    }
  }

  // Renderizado final
  switch (nombrePlantilla) {
    case 'dos_columnas':
      return <PlantillaDosColumnas invitacion={invitacion} urlImagen={urlImagen} esModoPDF={esModoPDF} />;
    case 'narrativa':
      return <PlantillaNarrativa invitacion={invitacion} urlImagen={urlImagen} esModoPDF={esModoPDF} />;
    case 'visual':
      return <PlantillaVisual invitacion={invitacion} urlImagen={urlImagen} esModoPDF={esModoPDF} />;
    case 'clasica':
    default:
      return <PlantillaClasica invitacion={invitacion} urlImagen={urlImagen} esModoPDF={esModoPDF} />;
  }
};

export default RenderizadorPlantilla;