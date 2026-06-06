import React from 'react'
import { useNavigate } from 'react-router-dom';
import historialFondo from '../assets/acceso/historial.png';
import crearFondo from '../assets/acceso/crear.png';
import perfilFondo from '../assets/acceso/perfil.png';

const AccesoApp = () => {
  const navigate = useNavigate();

  const paneles = [
    {
      id: 'consultar',
      titulo: 'CREACIONES',
      descripcion: 'Visualiza, edita, comparte o descarga todas las invitaciones y anuncios que has diseñado hasta el momento.',
      imagenFondo: historialFondo,
      ruta: '/mis-creaciones'
    },
    {
      id: 'crear',
      titulo: 'CREAR',
      descripcion: 'Da rienda suelta a tu imaginación. Selecciona un evento, elige tu paquete y diseña una nueva experiencia desde cero.',
      imagenFondo: crearFondo,
      ruta: '/nueva-creacion'
    },
    {
      id: 'perfil',
      titulo: 'PERFIL',
      descripcion: 'Gestiona tu información personal, actualiza tu contraseña y personaliza tu avatar para que te reconozcan.',
      imagenFondo: perfilFondo,
      ruta: '/perfil-usuario'
    }
  ];

  return (
    <div className="flex flex-col md:flex-row w-full md:h-[calc(100vh-64px)] bg-[#252525]">
      
      {paneles.map((panel) => (
        <div 
          key={panel.id}
          onClick={() => navigate(panel.ruta)}
          // En móvil cada panel ocupa 100vh. En escritorio comparten el espacio equitativamente (flex-1).
          className="relative flex items-center justify-center overflow-hidden group cursor-pointer border-b md:border-b-0 md:border-r border-[#252525]/20 last:border-0 w-full h-[calc(100vh-64px)] md:h-full md:flex-1"
        >
          <div 
            className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-in-out md:group-hover:scale-110 md:group-hover:blur-sm"
            style={{ backgroundImage: `url(${panel.imagenFondo})` }}
          />

          {/* CAPA DE OSCURECIMIENTO (Más oscura en móvil por defecto para leer bien el texto) */}
          <div className="absolute inset-0 bg-black/50 md:bg-black/40 transition-colors duration-700 md:group-hover:bg-black/60" />

          <div className="relative z-10 flex flex-col items-center text-center px-6 sm:px-8 w-full max-w-md">
            
            {/* TÍTULO */}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-widest uppercase transition-transform duration-500 ease-out md:group-hover:-translate-y-4 mb-1 md:mb-0">
              {panel.titulo}
            </h2>

            {/* DESCRIPCIÓN (Siempre visible en móvil, animada en Desktop) */}
            <p className="mt-2 md:mt-4 text-gray-200 text-xs sm:text-sm md:text-base leading-relaxed transition-all duration-500 ease-out opacity-100 transform translate-y-0 md:opacity-0 md:translate-y-8 md:group-hover:opacity-100 md:group-hover:translate-y-0">
              {panel.descripcion}
            </p>

            {/* BARRA DECORATIVA (Siempre visible en móvil, animada en Desktop) */}
            <div className="w-8 sm:w-12 h-1 bg-pink-300 mt-4 md:mt-6 rounded-full transition-all duration-500 ease-out opacity-100 transform scale-x-100 md:opacity-0 md:scale-x-0 md:group-hover:opacity-100 md:group-hover:scale-x-100" />
            
          </div>
        </div>
      ))}

    </div>
  )
}

export default AccesoApp;