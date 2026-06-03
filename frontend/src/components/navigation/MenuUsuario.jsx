import React, { useState } from "react";
import perfilDesconocido from "../../assets/perfil_desconocido.png";
import useSesion from "../../hooks/useSesion.js";
import { Link } from "react-router-dom";
// Ajusta esta ruta dependiendo de dónde tengas exactamente tu MenuUsuario.jsx
import ModalConfirmacion from "../ui/ModalConfirmacion.jsx";

const MenuUsuario = () => {
  const { isAuth, user, cerrarSesion } = useSesion();

  // Estado para controlar la visibilidad del modal
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  // Función que se ejecuta solo si el usuario confirma
  const confirmarSalida = () => {
    cerrarSesion();
    setMostrarConfirmacion(false);
  };

  const avatarPorDefecto = "/avatar/perfil_6.png";

  return (
    <>
      {!isAuth ? (
        <>
          <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-sky-200">
            <Link to="/acceso-usuario" className="flex items-center">
              <img
                src={avatarPorDefecto}
                alt="Ir al registro de usuario"
                className="w-full h-full object-cover"
              />
            </Link>
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center gap-3">
            <span className="text-white font-medium hidden lg:block tracking-wide">
              Hola, {user?.nombre}
            </span>

            <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-sky-200 shadow-sm">
              <Link to="/perfil-usuario" className="flex items-center">
                <img
                  src={user?.imagen || avatarPorDefecto}
                  alt={`Perfil de ${user?.nombre}`}
                  className="w-full h-full object-cover"
                />
              </Link>
            </div>

            <button
              onClick={() => setMostrarConfirmacion(true)} // <-- Ahora abre el modal
              title="Cerrar sesión"
              aria-label="Cerrar sesión"
              className="bg-white text-sky-500 hover:text-pink-300 hover:bg-pink-50 p-2 rounded-full transition-colors ml-2 shadow-sm flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>

          <ModalConfirmacion
            isOpen={mostrarConfirmacion}
            titulo="¿Cerrar sesión?"
            mensaje="¿Estás seguro de que quieres salir de tu cuenta? Tendrás que volver a introducir tus credenciales la próxima vez."
            textoConfirmar="Sí, salir"
            textoCancelar="Cancelar"
            esDestructivo={true}
            onConfirm={confirmarSalida}
            onCancel={() => setMostrarConfirmacion(false)}
          />
        </>
      )}
    </>
  );
};

export default MenuUsuario;