import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/apiService.js";
import * as authService from "../services/authService.js";

const ContextoSesion = createContext();

const ProveedorSesion = ({ children }) => {
  const navegar = useNavigate();

  const datosInicialesRegistro = {
    nombre: "",
    correo: "",
    fechaNacimiento: "",
    password: "",
    confirmPassword: ""
  };

  const datosInicialesLogin = {
    correo: "",
    password: ""
  };

  const [datosRegistro, setDatosRegistro] = useState(datosInicialesRegistro);
  const [datosLogin, setDatosLogin] = useState(datosInicialesLogin);
  const [user, setUser] = useState(null);
  const [cargandoGlobal, setCargandoGlobal] = useState(true);
  const [cargandoAccion, setCargandoAccion] = useState(false);
  const [errorSesion, setErrorSesion] = useState("");

  useEffect(() => {
    const tokenGuardado = localStorage.getItem("token");
    const userGuardado = localStorage.getItem("user");

    if (tokenGuardado && userGuardado) {
      setUser(JSON.parse(userGuardado));
      api.defaults.headers.common["Authorization"] = `Bearer ${tokenGuardado}`;
    }
    setCargandoGlobal(false);
  }, []);

  const actualizarDatoRegistro = (valor, nombreCampo) => {
    setDatosRegistro((prev) => ({ ...prev, [nombreCampo]: valor }));
  };

  const actualizarDatoLogin = (valor, nombreCampo) => {
    setDatosLogin((prev) => ({ ...prev, [nombreCampo]: valor }));
  };

  const registrarUsuario = async (e) => {
    e.preventDefault();
    setErrorSesion("");

    if (datosRegistro.password !== datosRegistro.confirmPassword) {
      return setErrorSesion("Las contraseñas no coinciden.");
    }

    setCargandoAccion(true);

    try {
      await authService.register({
        nombre: datosRegistro.nombre,
        correo: datosRegistro.correo,
        password: datosRegistro.password,
        fecha_nacimiento: datosRegistro.fechaNacimiento
      });

      setDatosRegistro(datosInicialesRegistro);
      navegar("/acceso-usuario"); 
      
    } catch (err) {
      manejarErroresAPI(err);
    } finally {
      setCargandoAccion(false);
    }
  };

  const iniciarSesion = async (e) => {
    if (e) e.preventDefault();
    setErrorSesion("");
    setCargandoAccion(true);

    try {
      const userData = await authService.login({ 
        correo: datosLogin.correo, 
        password: datosLogin.password 
      });
      setUser(userData);
      setDatosLogin(datosInicialesLogin);
      navegar("/acceso-app");
    } catch (err) {
      manejarErroresAPI(err);
    } finally {
      setCargandoAccion(false);
    }
  };

  const cerrarSesion = () => {
    authService.logout();
    setUser(null);
    navegar("/");
  };

  // Función auxiliar para leer los errores de Zod o de Express
  const manejarErroresAPI = (err) => {
    if (typeof err === 'string') {
      setErrorSesion(err);
    } else if (typeof err === 'object' && err !== null) {
      if (err.correo?._errors?.length > 0) return setErrorSesion(`Correo: ${err.correo._errors[0]}`);
      if (err.nombre?._errors?.length > 0) return setErrorSesion(`Nombre: ${err.nombre._errors[0]}`);
      if (err.password?._errors?.length > 0) return setErrorSesion(`Contraseña: ${err.password._errors[0]}`);
      if (err.fecha_nacimiento?._errors?.length > 0) return setErrorSesion(`Fecha: ${err.fecha_nacimiento._errors[0]}`);
      setErrorSesion("Por favor, revisa que todos los datos sean correctos.");
    } else {
      setErrorSesion("Error al conectar con el servidor.");
    }
  };

  const actualizarUsuario = async (datosNuevos) => {
  setErrorSesion("");
  setCargandoAccion(true);

  try {
    // Llamo al servicio de autenticación y envio solo los campos editables: nombre, correo y avatar
    const { usuario } = await authService.update({
      nombre: datosNuevos.nombre,
      correo: datosNuevos.correo,
      imagen: datosNuevos.imagen
    });

    // 1. Actualizo el estado global con los nuevos datos
    const usuarioActualizado = { ...user, ...usuario };
    setUser(usuarioActualizado);

    // 2. Actualizo el localStorage para que al recargar la página se mantengan los cambios
    localStorage.setItem("user", JSON.stringify(usuarioActualizado));

    return { success: true };
  } catch (err) {
    manejarErroresAPI(err);
    return { success: false };
  } finally {
    setCargandoAccion(false);
  }
};

  if (cargandoGlobal) return null;

  const datosInsertadosContexto = {
    user,
    isAuth: !!user,
    datosRegistro,
    datosLogin,
    cargandoAccion,
    errorSesion,
    actualizarDatoRegistro,
    actualizarDatoLogin,
    registrarUsuario,
    iniciarSesion,
    cerrarSesion,
    actualizarUsuario,
  };

  return (
    <ContextoSesion.Provider value={datosInsertadosContexto}>
      {children}
    </ContextoSesion.Provider>
  );
};

export default ProveedorSesion;
export { ContextoSesion };