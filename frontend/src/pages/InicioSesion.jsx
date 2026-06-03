import React from "react";
import logoCwm from "../assets/logo_CWM_oficial.png";
import CampoFormulario from "../components/forms/CampoFormulario.jsx";
import useSesion from "../hooks/useSesion.js";

const InicioSesion = () => {
const { 
    datosLogin, 
    actualizarDatoLogin, 
    iniciarSesion, 
    cargandoAccion, 
    errorSesion 
  } = useSesion();
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] p-6">
      <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-3xl shadow-xl">
        <div className="flex flex-col items-center mb-4 text-center">
          <img
            src={logoCwm}
            alt="Come With Me"
            className="h-24 md:h-28 object-contain mb-5"
          />
          <h2 className="text-[#252525] text-lg font-bold opacity-80">
            ¡Qué alegría verte de nuevo!
          </h2>
        </div>

        <hr className="mb-4" />

        {errorSesion && (
          <div className="mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded">
            <p className="text-sm font-medium">{errorSesion}</p>
          </div>
        )}

        <form onSubmit={iniciarSesion}>
          <CampoFormulario
            label="Correo"
            name="correo"
            type="email"
            placeholder="Correo electrónico"
            value={datosLogin.correo}
            onChange={(e) => actualizarDatoLogin(e.target.value, "correo")}
          />

          <CampoFormulario
            label="Contraseña"
            name="password"
            type="password"
            placeholder="********"
            value={datosLogin.password}
            onChange={(e) => actualizarDatoLogin(e.target.value, "password")}
          />

          <button
            type="submit"
            disabled={cargandoAccion}
            className="w-full mt-6 bg-pink-300 text-white font-bold text-lg py-3 rounded-full hover:bg-pink-400 transition-colors shadow-sm hover:shadow-md"
          >
            {cargandoAccion ? "Iniciando..." : "Iniciar sesión"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a
            href="/registro-usuario"
            className="text-sm text-gray-500 hover:text-sky-500 transition-colors font-medium"
          >
            ¿Aun no te has registrado?
          </a>
        </div>
      </div>
    </div>
  );
};
export default InicioSesion;
