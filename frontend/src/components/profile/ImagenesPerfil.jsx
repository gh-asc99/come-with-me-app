import React, { useState } from 'react';

const ImagenesPerfil = (props) => {
  const avataresDisponibles = [
    "/avatar/perfil_1.png",
    "/avatar/perfil_2.png",
    "/avatar/perfil_3.png",
    "/avatar/perfil_4.png",
    "/avatar/perfil_5.png",
    "/avatar/perfil_6.png"
  ];

  const [avatarSeleccionado, setAvatarSeleccionado] = useState(props.avatarActual);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">

      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-2xl w-full max-w-md relative animate-fade-in-up">
        
        <button 
          onClick={props.onClose} 
          className="absolute top-5 right-5 text-gray-400 hover:text-pink-500 transition-colors p-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* CABECERA */}
        <div className="flex flex-col items-center mb-8 text-center mt-2">
          <h3 className="font-bold text-[#252525] text-2xl md:text-3xl mb-2">
            Nuevo Avatar
          </h3>
          <p className="text-gray-500 text-sm font-medium leading-relaxed">
            Selecciona el personaje que quieres que te represente en la plataforma.
          </p>
        </div>

        {/* AVATARES */}
        <div className="grid grid-cols-3 gap-4 md:gap-6 mb-8">
          {avataresDisponibles.map((avatar, index) => (
            <div 
              key={index}
              onClick={() => setAvatarSeleccionado(avatar)}
              className={`cursor-pointer rounded-full p-1.5 transition-all duration-200 flex items-center justify-center ${
                avatarSeleccionado === avatar 
                  ? 'border-4 border-pink-300 scale-105 shadow-md bg-pink-50' 
                  : 'border-4 border-transparent hover:scale-105 hover:bg-gray-50'
              }`}
            >
              <img 
                src={avatar} 
                alt={`Avatar ${index + 1}`} 
                className="w-full h-full object-cover rounded-full bg-sky-100 shadow-inner"
              />
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <button 
            onClick={props.onClose}
            className="flex-1 px-6 py-3.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
          <button 
            onClick={() => props.onConfirmar(avatarSeleccionado)}
            className="flex-1 px-6 py-3.5 bg-pink-400 hover:bg-pink-500 font-bold rounded-xl text-white transition-colors shadow-md"
          >
            Confirmar
          </button>
        </div>

      </div>
    </div>
  );
}

export default ImagenesPerfil;