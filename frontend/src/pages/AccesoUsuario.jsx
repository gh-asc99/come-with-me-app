import React, { useState, useEffect } from "react";
import logoCwm from "../assets/logo_CWM_oficial.png";
import logoCrs from "../assets/logo_CRS_oficial.png";
import CampoFormulario from "../components/forms/CampoFormulario.jsx";
import useSesion from "../hooks/useSesion.js";
import ContenedorPrincipal from "../components/layout/ContenedorPrincipal.jsx";
import fondoMosaico from '../../public/fondo_mosaico.png';
import Aviso from "../components/ui/Aviso.jsx";

const AccesoUsuario = () => {
  const {
    datosLogin,
    actualizarDatoLogin,
    iniciarSesion,
    datosRegistro,
    actualizarDatoRegistro,
    registrarUsuario,
    cargandoAccion,
    errorSesion,
  } = useSesion();

  const [aviso, setAviso] = useState({ visible: false, mensaje: '', tipo: 'info' });
  
  const [intentandoRegistro, setIntentandoRegistro] = useState(false);
  const [intentandoLogin, setIntentandoLogin] = useState(false);

  useEffect(() => {
    if (errorSesion) {
      setAviso({ visible: true, mensaje: errorSesion, tipo: 'error' });
    }
  }, [errorSesion]);

  useEffect(() => {
    if (intentandoRegistro && !cargandoAccion) {
      if (!errorSesion) {
        setAviso({ 
          visible: true, 
          mensaje: "¡Registro completado con éxito!\nTu cuenta ha sido creada correctamente en Come With Me.", 
          tipo: 'exito' 
        });
      }
      setIntentandoRegistro(false);
    }
  }, [cargandoAccion, intentandoRegistro, errorSesion]);


  // VALIDACIÓN Y CONTROL DE REGISTRO
  const manejarRegistro = (e) => {
    e.preventDefault();
    const errores = [];

    const { nombre, correo, fechaNacimiento, password, confirmPassword } = datosRegistro;

    // 1. Validar Nombre (Letras y espacios)
    const regexNombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;
    if (!nombre || !nombre.trim()) {
      errores.push("• El nombre completo es obligatorio.");
    } else if (!regexNombre.test(nombre.trim())) {
      errores.push("• El nombre solo puede contener letras y espacios.");
    }

    // 2. Validar Correo
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!correo || !correo.trim()) {
      errores.push("• El correo electrónico es obligatorio.");
    } else if (!regexCorreo.test(correo.trim())) {
      errores.push("• El formato del correo electrónico no es válido.");
    }

    // 3. Validar Edad (Mínimo 16 años)
    if (!fechaNacimiento) {
      errores.push("• Por favor, introduce tu fecha de nacimiento.");
    } else {
      const hoy = new Date();
      const fechaNac = new Date(fechaNacimiento);
      let edad = hoy.getFullYear() - fechaNac.getFullYear();
      const mes = hoy.getMonth() - fechaNac.getMonth();
      
      if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
        edad--;
      }

      if (edad < 16) {
        errores.push("• Debes tener al menos 16 años para poder registrarte.");
      }
    }

    // 4. Validar Contraseña (Mínimo 6 caracteres, letras y números)
    if (!password) {
      errores.push("• La contraseña es obligatoria.");
    } else {
      if (password.length < 6) {
        errores.push("• La contraseña debe tener al menos 6 caracteres.");
      }
      if (!/[a-zA-Z]/.test(password) || !/\d/.test(password)) {
        errores.push("• La contraseña debe contener tanto letras como números.");
      }
    }

    // 5. Validar Confirmación de Contraseña
    if (password !== confirmPassword) {
      errores.push("• Las contraseñas introducidas no coinciden.");
    }

    // Si hay errores de validación local, se bloquea el envío y se muestra el Aviso
    if (errores.length > 0) {
      setAviso({ 
        visible: true, 
        mensaje: `No se pudo crear la cuenta:\n${errores.join('\n')}`, 
        tipo: 'error' 
      });
      return;
    }

    // Si pasa los filtros de la UI, ejecuta la petición al servidor e indica que se está esperando
    setIntentandoRegistro(true);
    registrarUsuario(e);
  };

  // VALIDACIÓN Y CONTROL DE LOGIN
  const manejarLogin = (e) => {
    e.preventDefault();
    
    if (!datosLogin.correo.trim() || !datosLogin.password) {
      setAviso({ 
        visible: true, 
        mensaje: "Por favor, rellena el correo y la contraseña para poder acceder a tu cuenta.", 
        tipo: 'error' 
      });
      return;
    }

    setIntentandoLogin(true);
    iniciarSesion(e);
  };

  return (
    <div className="relative min-h-[calc(100vh-64px)] w-full overflow-hidden flex items-center justify-center py-5 bg-sky-50">

      <Aviso 
        mensaje={aviso.mensaje} 
        tipo={aviso.tipo} 
        visible={aviso.visible} 
        onClose={() => setAviso({ ...aviso, visible: false })} 
      />

      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${fondoMosaico})` }}
      >
        <div className="absolute inset-0 bg-black/10"></div>
      </div>

      <ContenedorPrincipal className="relative z-10 w-full animate-fade-in-up">

        <div className="bg-black/25 backdrop-blur-2xl border border-white/10 rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row items-stretch w-full max-w-6xl mx-auto">
          
          {/* LADO IZQUIERDO: INICIO DE SESIÓN */}
          <div className="w-full lg:w-1/2 p-6 sm:p-10 md:p-12 lg:p-16 flex flex-col justify-center relative border-b lg:border-b-0 lg:border-r border-white/10 bg-gradient-to-br from-black/30 to-transparent">
            
            <div className="flex flex-col items-center mb-8 md:mb-12 text-center">
              <img
                src={logoCwm}
                alt="Come With Me"
                className="w-40 sm:w-48 md:w-56 object-contain mb-4 md:mb-5 drop-shadow-[0_0_15px_rgba(255,255,255,0.15)] hover:scale-105 transition-transform duration-500"
              />
              <div className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity duration-500">
                <span className="text-gray-300 text-[8px] sm:text-[9px] font-black uppercase tracking-widest">
                  Desarrollada por
                </span>
                <img
                  src={logoCrs}
                  alt="codeRAIN Studio"
                  className="h-7 sm:h-9 pb-1 sm:pb-2 object-contain brightness-0 invert"
                />
              </div>
            </div>

            <div className="text-center mb-8 md:mb-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight drop-shadow-sm">
                Iniciar Sesión
              </h2>
              <p className="text-gray-300 text-xs sm:text-sm mt-2 font-medium drop-shadow-md">
                ¿Listo para tu próxima creación?
              </p>
            </div>

            <form onSubmit={manejarLogin} className="flex flex-col flex-1 max-w-sm mx-auto w-full text-gray-200">
              <div className="space-y-4 sm:space-y-6 flex-1">
                <CampoFormulario
                  label="Correo electrónico"
                  name="correo_login"
                  type="email"
                  placeholder="tu@correo.com"
                  value={datosLogin.correo}
                  onChange={(e) => actualizarDatoLogin(e.target.value, "correo")}
                />
                <CampoFormulario
                  label="Contraseña"
                  name="password_login"
                  type="password"
                  placeholder="********"
                  value={datosLogin.password}
                  onChange={(e) => actualizarDatoLogin(e.target.value, "password")}
                />
              </div>

              <button
                type="submit"
                disabled={cargandoAccion}
                className="w-full mt-8 sm:mt-10 bg-sky-500 text-white font-black text-xs sm:text-sm uppercase tracking-widest py-3 sm:py-4 rounded-2xl hover:bg-sky-400 transition-all active:scale-95 disabled:bg-gray-500 disabled:shadow-none"
              >
                {cargandoAccion && intentandoLogin ? "Verificando..." : "Acceder"}
              </button>
            </form>
          </div>

          {/* LADO DERECHO: REGISTRO DE USUARIO */}
          <div className="w-full lg:w-1/2 p-6 sm:p-10 md:p-12 lg:p-16 flex flex-col justify-center relative bg-black/20">
            
            <div className="text-center mb-8 md:mb-10">
              <span className="bg-pink-300/20 text-pink-300 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] mb-4 sm:mb-6 inline-block w-fit border border-pink-300/30">
                Nuevo Usuario
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight drop-shadow-sm">
                Crear Cuenta
              </h2>
              <p className="text-gray-300 text-xs sm:text-sm mt-2 font-medium drop-shadow-md">
                Únete a la comunidad y empieza a diseñar
              </p>
            </div>

            <form onSubmit={manejarRegistro} className="flex flex-col flex-1 text-gray-200">
              <div className="space-y-4 sm:space-y-6 flex-1">
                <CampoFormulario
                  label="Nombre completo"
                  name="nombre"
                  type="text"
                  placeholder="Tu nombre completo"
                  value={datosRegistro.nombre}
                  onChange={(e) => actualizarDatoRegistro(e.target.value, "nombre")}
                />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <CampoFormulario
                    label="Correo electrónico"
                    name="correo_registro"
                    type="email"
                    placeholder="tu@correo.com"
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
                </div>

                <CampoFormulario
                  label="Contraseña"
                  name="password_registro"
                  type="password"
                  placeholder="********"
                  value={datosRegistro.password}
                  onChange={(e) => actualizarDatoRegistro(e.target.value, "password")}
                />
                
                <CampoFormulario
                  label="Confirmar contraseña"
                  name="confirmPassword"
                  type="password"
                  placeholder="********"
                  value={datosRegistro.confirmPassword}
                  onChange={(e) => actualizarDatoRegistro(e.target.value, "confirmPassword")}
                />
              </div>

              <button
                type="submit"
                disabled={cargandoAccion}
                className="w-full mt-8 sm:mt-10 bg-pink-300 text-white font-black text-xs sm:text-sm uppercase tracking-widest py-3 sm:py-4 rounded-2xl hover:bg-pink-400 transition-all active:scale-95 disabled:bg-gray-500 disabled:shadow-none"
              >
                {cargandoAccion && intentandoRegistro ? "Creando cuenta..." : "Registrarme"}
              </button>
            </form>
          </div>

        </div>
      </ContenedorPrincipal>
    </div>
  );
};

export default AccesoUsuario;