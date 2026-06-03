import React from "react";
import logoCwm from "../assets/logo_CWM_oficial.png";
import logoCrs from "../assets/logo_CRS_oficial.png";
import CampoFormulario from "../components/forms/CampoFormulario.jsx";
import useSesion from "../hooks/useSesion.js";

const RegistroUsuario = () => {
const { 
    datosRegistro, 
    actualizarDatoRegistro, 
    registrarUsuario, 
    cargandoAccion, 
    errorSesion 
  } = useSesion();
  return (
    <div className="flex flex-col lg:flex-row items-center justify-evenly min-h-[calc(100vh-64px)] w-full max-w-6xl mx-auto p-6 lg:p-12 gap-10">
      <div className="flex flex-col items-center justify-center w-full lg:w-1/2">
        <img
          src={logoCwm}
          alt="Come With Me"
          className="w-64 md:w-80 lg:w-96 object-contain mb-8"
        />

        <div className="flex items-center gap-2">
          <span className="text-[#252525] text-sm opacity-70">
            Desarrollada por
          </span>
          <img
            src={logoCrs}
            alt="codeRAIN Studio"
            className="h-7 mb-1 object-contain"
          />
        </div>
      </div>

      <div className="flex items-center justify-center w-full lg:w-1/2">
        <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-2xl shadow-xl">
          <h2 className="text-[#252525] text-center text-lg font-bold opacity-80 mb-3">
            ¡Únete a la comunidad y empieza a crear!
          </h2>

          <hr className="mb-3"/>

          {errorSesion && (
            <div className="mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded text-sm font-medium">
              {errorSesion}
            </div>
          )}

          <form onSubmit={registrarUsuario}>
            <CampoFormulario
              label="Nombre"
              name="nombre"
              type="text"
              placeholder="Nombre de usuario"
              value={datosRegistro.nombre}
              onChange={(e) => actualizarDatoRegistro(e.target.value, "nombre")}
            />

            <CampoFormulario
              label="Correo"
              name="correo"
              type="email"
              placeholder="Correo electrónico"
              value={datosRegistro.correo}
              onChange={(e) => actualizarDatoRegistro(e.target.value, "correo")}
            />

            <CampoFormulario
              label="Fecha de nacimiento"
              name="fechaNacimiento"
              type="date"
              value={datosRegistro.fechaNacimiento}
              onChange={(e) => actualizarDatoRegistro(e.target.value, "fechaNacimiento")}
            />

            <CampoFormulario
              label="Contraseña"
              name="password"
              type="password"
              placeholder="Contraseña"
              value={datosRegistro.password}
              onChange={(e) => actualizarDatoRegistro(e.target.value, "password")}
            />

            <CampoFormulario
              label="Confirmación de contraseña"
              name="confirmPassword"
              type="password"
              placeholder="Escribe nuevamente tu contraseña"
              value={datosRegistro.confirmPassword}
              onChange={(e) => actualizarDatoRegistro(e.target.value, "confirmPassword")}
            />

            <button
              type="submit"
              disabled={cargandoAccion}
              className="w-full mt-6 bg-pink-300 text-white font-bold py-3 rounded-full hover:bg-pink-400 transition-colors shadow-sm hover:shadow-md"
            >
              {cargandoAccion ? 'Registrando...' : 'Registrar usuario'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistroUsuario;
