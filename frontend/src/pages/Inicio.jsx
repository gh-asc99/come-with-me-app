import React from 'react';
import { Link } from 'react-router-dom';
import ContenedorPrincipal from '../components/layout/ContenedorPrincipal.jsx';
import fondoMosaico from '../../public/fondo_mosaico.png'; 

const EtiquetaPaso = ({ paso, titulo, color = 'sky' }) => {
  const isSky = color === 'sky';
  return (
    <div className="flex items-center gap-3 mb-4 md:mb-6">
      <span className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center font-black text-xs md:text-sm text-white shadow-lg ${isSky ? 'bg-sky-400 shadow-sky-400/40' : 'bg-pink-300 shadow-pink-300/40'}`}>
        {paso}
      </span>
      <span className={`px-3 py-1 md:px-4 md:py-1.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] border shadow-sm ${isSky ? 'bg-sky-500/20 text-sky-300 border-sky-500/30' : 'bg-pink-300/20 text-pink-300 border-pink-300/30'}`}>
        {titulo}
      </span>
    </div>
  );
};

const TituloSeccion = ({ children }) => (
  <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-white tracking-tighter drop-shadow-md mb-4 md:mb-6 leading-tight">
    {children}
  </h2>
);

const Parrafo = ({ children }) => (
  <p className="text-gray-300 font-medium text-xs sm:text-sm md:text-base leading-relaxed drop-shadow-sm mb-4 md:mb-6">
    {children}
  </p>
);

const ImagenTutorial = ({ src, alt, className = "" }) => (
  <div className={`rounded-[1.2rem] md:rounded-[2rem] overflow-hidden border-2 border-white/20 shadow-2xl bg-[#121212] group relative w-full aspect-video ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none"></div>
    <img
      src={src}
      alt={alt}
      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out relative z-0"
      loading="lazy"
    />
  </div>
);

const Inicio = () => {
  return (
    <div className="relative min-h-[calc(100vh-64px)] w-full overflow-hidden flex flex-col items-center bg-[#0a192f] pb-10 md:pb-20">

      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${fondoMosaico})` }}
      >
        <div className="absolute inset-0 bg-sky-950/60 backdrop-blur-[2px]"></div>
      </div>

      <ContenedorPrincipal className="relative z-10 w-full animate-fade-in-up flex flex-col gap-12 md:gap-20 pt-8 md:pt-10">

        {/* HERO SECTION & TRAILER */}
        <section className="w-full max-w-6xl mx-auto flex flex-col items-center text-center px-2">

          {/* LOGOTIPO */}
          <img
            src="/logo_CWM_oficial.png"
            alt="Come With Me"
            className="w-full max-w-[240px] sm:max-w-[340px] md:max-w-md lg:max-w-xl object-contain mb-6 md:mb-8 animate-fade-in drop-shadow-xl"
          />

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tighter mb-4 md:mb-6 leading-tight max-w-4xl">
            Crea invitaciones
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-pink-300"> y organiza eventos inolvidables</span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-gray-300 font-medium max-w-3xl mx-auto drop-shadow-md mb-8 md:mb-12">
            La plataforma definitiva para diseñar, personalizar y gestionar las invitaciones de todos tus eventos. Descubre la magia paso a paso.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12 md:mb-20 w-full sm:w-auto px-4 sm:px-0">
            <Link to="/acceso-usuario" className="bg-pink-300 text-white font-black text-xs uppercase tracking-widest px-10 py-4 md:py-5 rounded-full hover:bg-pink-400 transition-all hover:scale-105 active:scale-95 text-center">
              Empezar ahora
            </Link>
            <a href="#tutorial" className="bg-white/10 backdrop-blur-md border border-white/20 text-white font-black text-xs uppercase tracking-widest px-10 py-4 md:py-5 rounded-full hover:bg-white/20 transition-all shadow-lg hover:scale-105 active:scale-95 text-center">
              Ver Tutorial
            </a>
          </div>

          {/* VÍDEO TRAILER */}
          <div className="w-full max-w-5xl mx-auto bg-black/40 backdrop-blur-2xl rounded-[1.5rem] sm:rounded-[3rem] shadow-2xl relative group p-2 sm:p-4">
            <div className="relative w-full aspect-video rounded-[1rem] sm:rounded-[2rem] overflow-hidden shadow-inner bg-black">
              <iframe
                className="absolute inset-0 w-full h-full"
                src="https://www.youtube-nocookie.com/embed/_-hUr3d-dfE"
                title="Come With Me Trailer"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </section>

        {/* TUTORIAL PASO A PASO */}
        <div id="tutorial" className="w-full max-w-6xl mx-auto flex flex-col gap-8 sm:gap-12 md:gap-20">

          {/* PASO 1: REGISTRO */}
          <section className="bg-black/30 backdrop-blur rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 md:p-16 flex flex-col lg:flex-row items-stretch gap-8 md:gap-12">
            <div className="w-full lg:w-5/12 flex flex-col justify-center">
              <EtiquetaPaso paso="1" titulo="El Comienzo" color="sky" />
              <TituloSeccion>Tu llave de acceso al <span className="text-sky-400">universo creativo</span></TituloSeccion>
              <Parrafo>
                Todo gran viaje empieza con un primer paso. En la pantalla de acceso encontrarás a la izquierda el inicio de sesión y a la derecha un sencillo formulario de registro.
              </Parrafo>
              <Parrafo>
                Solo necesitas un nombre, tu correo, una contraseña segura y tu fecha de nacimiento para crear tu cuenta y desbloquear tu espacio personal en segundos.
              </Parrafo>
            </div>
            <div className="w-full lg:w-7/12 flex items-center">
              <ImagenTutorial src="/inicio/inicio_registro.png" alt="Pantalla de Registro" />
            </div>
          </section>

          {/* PASO 2: PERFIL Y MENÚ */}
          <section className="bg-black/30 backdrop-blur rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 md:p-16 flex flex-col lg:flex-row-reverse items-stretch gap-8 md:gap-12">
            <div className="w-full lg:w-5/12 flex flex-col justify-center">
              <EtiquetaPaso paso="2" titulo="Centro de Mando" color="pink" />
              <TituloSeccion>Control total sobre tu <span className="text-pink-300">identidad</span></TituloSeccion>
              <Parrafo>
                Una vez dentro, el menú de navegación espacial te acompañará a todas partes. Desde él podrás crear, explorar o visitar tu Área Personal.
              </Parrafo>
              <Parrafo>
                En tu perfil podrás consultar tu estado, gestionar tus datos y darle un toque único a tu cuenta modificando tu avatar a través de un panel interactivo lleno de opciones.
              </Parrafo>
            </div>
            <div className="w-full lg:w-7/12 flex flex-col gap-4 md:gap-6 justify-center">
              <ImagenTutorial src="/inicio/menu_inicial.png" alt="Menú Inicial" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                <ImagenTutorial src="/inicio/perfil_user.png" alt="Perfil Usuario" />
                <ImagenTutorial src="/inicio/cambio_imagen.png" alt="Cambiar Avatar" />
              </div>
            </div>
          </section>

          {/* PASO 3: SUSCRIPCIONES Y COMPRAS */}
          <section className="bg-black/30 backdrop-blur rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 md:p-16 flex flex-col items-center text-center">
            <div className="max-w-4xl mb-8 md:mb-12">
              <EtiquetaPaso paso="3" titulo="Acceso Sin Límites" color="sky" />
              <TituloSeccion>Diseñado para <span className="text-sky-400">adaptarse a ti</span></TituloSeccion>
              <Parrafo>
                ¿Quieres ir un paso más allá? Explora nuestros planes de suscripción. Al hacerte Premium, tu perfil se iluminará mostrando tu estado VIP, eliminando marcas de agua y dándote acceso ilimitado a absolutamente todo nuestro catálogo.
              </Parrafo>
            </div>
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8">
              <ImagenTutorial src="/inicio/compra_suscripciones.png" alt="Planes de Suscripción" />
              <ImagenTutorial src="/inicio/perfil_subscriber.png" alt="Perfil VIP" />
            </div>
          </section>

          {/* PASO 4: DE VACÍO A TODO */}
          <section className="bg-black/30 backdrop-blur rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 md:p-16 flex flex-col lg:flex-row items-stretch gap-8 md:gap-12">
            <div className="w-full lg:w-5/12 flex flex-col justify-center">
              <EtiquetaPaso paso="4" titulo="El Catálogo" color="pink" />
              <TituloSeccion>Del desierto a <span className="text-pink-300">la creación</span></TituloSeccion>
              <Parrafo>
                Al principio, tu historial de creaciones parecerá un desierto vacío. ¡Es la señal perfecta para pulsar en "Nueva Creación"!
              </Parrafo>
              <Parrafo>
                Navegarás por una selección de Eventos y Paquetes. Verás que algunos elementos están bloqueados con un candado. Puedes desbloquearlos adquiriendo una suscripción o realizando una compra individual.
              </Parrafo>
              <Parrafo>
                Una vez desbloqueado... ¡Todo el contenido visual estará a tu disposición para empezar a diseñar!
              </Parrafo>
            </div>
            <div className="w-full lg:w-7/12 flex flex-col gap-4 md:gap-6 justify-center">
              <ImagenTutorial src="/inicio/historial_vacío.png" alt="Historial Vacío" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                <ImagenTutorial src="/inicio/fase1_bloqueo.png" alt="Evento Bloqueado" />
                <ImagenTutorial src="/inicio/fase2_todo.png" alt="Paquetes Desbloqueados" />
              </div>
            </div>
          </section>

          {/* PASO 5: FORMULARIO DINÁMICO */}
          <section className="bg-black/30 backdrop-blur-xl rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 md:p-16 flex flex-col">
            <div className="w-full flex flex-col items-center text-center max-w-4xl mx-auto mb-8 md:mb-12">
              <EtiquetaPaso paso="5" titulo="Magia Pura" color="sky" />
              <TituloSeccion>El corazón de <span className="text-sky-400">Come With Me</span></TituloSeccion>
              <Parrafo>
                Has llegado a la fase más importante: el Formulario Dinámico. Aquí darás vida a tu evento rellenando los datos principales (título, lugar, fecha).
              </Parrafo>
              <Parrafo>
                ¿La mejor parte? Nuestra app inyecta automáticamente sugerencias específicas (obligatorias y opcionales) dependiendo del evento y paquete que hayas elegido. Selecciona tu plantilla favorita de nuestro catálogo interactivo y pulsa en generar.
              </Parrafo>
            </div>
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8">
              <ImagenTutorial src="/inicio/fase3_parte1.png" alt="Datos Fijos" />
              <ImagenTutorial src="/inicio/fase3_parte2.png" alt="Sugerencias" />
              <ImagenTutorial src="/inicio/fase3_parte3.png" alt="Opcionales" />
              <ImagenTutorial src="/inicio/fase3_parte4.png" alt="Plantillas" />
            </div>
          </section>

          {/* PASO 6: ÉXITO Y RESULTADOS */}
          <section className="bg-black/30 backdrop-blur rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 md:p-16 flex flex-col lg:flex-row-reverse items-stretch gap-8 md:gap-12">
            <div className="w-full lg:w-5/12 flex flex-col justify-center">
              <EtiquetaPaso paso="6" titulo="Misión Cumplida" color="pink" />
              <TituloSeccion>Tu invitación, <span className="text-pink-300">tus reglas</span></TituloSeccion>
              <Parrafo>
                ¡Enhorabuena! Al confirmar la creación llegarás a la pantalla de éxito. Desde aquí tienes múltiples vías para distribuir tu obra de arte.
              </Parrafo>
              <Parrafo>
                Puedes ver el resultado web interactivo en tiempo real, generar un código QR para imprimirlo, o incluso solicitar que la app genere un precioso documento PDF maquetado automáticamente con todos tus datos.
              </Parrafo>
            </div>
            <div className="w-full lg:w-7/12 flex flex-col gap-4 md:gap-6 justify-center">
              <ImagenTutorial src="/inicio/fase4_exito.png" alt="Éxito" />
              <ImagenTutorial src="/inicio/resultado_parte1.png" alt="Web Animada" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                <ImagenTutorial src="/inicio/generar_qr.png" alt="Código QR" />
                <ImagenTutorial src="/inicio/pdf_parte1.png" alt="PDF Generado" />
              </div>
            </div>
          </section>

          {/* PASO 7: GESTIÓN */}
          <section className="bg-black/30 backdrop-blur rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 md:p-16 flex flex-col lg:flex-row items-stretch gap-8 md:gap-12">
            <div className="w-full lg:w-5/12 flex flex-col justify-center">
              <EtiquetaPaso paso="7" titulo="Gestión Total" color="sky" />
              <TituloSeccion>Control absoluto de tus <span className="text-sky-400">invitados</span></TituloSeccion>
              <Parrafo>
                Ahora, cuando visites tu Historial de Creaciones, dirás adiós al desierto. Tus invitaciones aparecerán en elegantes tarjetas.
              </Parrafo>
              <Parrafo>
                Si te has equivocado en algo, el botón de "Editar Invitación" te permite realizar cambios en vivo. Además, con la herramienta de Gestión de Invitados, podrás añadir asistentes a tu lista y enviarles la invitación personalmente por WhatsApp con un solo clic.
              </Parrafo>
            </div>
            <div className="w-full lg:w-7/12 flex flex-col gap-4 md:gap-6 justify-center">
              <ImagenTutorial src="/inicio/historial_normal.png" alt="Historial Lleno" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                <ImagenTutorial src="/inicio/editar_invitacion.png" alt="Editar Invitación" />
                <ImagenTutorial src="/inicio/gestionar_invitados.png" alt="Gestión Invitados" />
              </div>
            </div>
          </section>

          {/* LLAMADA A LA ACCIÓN FINAL Y FOOTER CORPORATIVO */}
          <div className="w-full text-center py-5 flex flex-col items-center px-4">
            <h3 className="text-2xl sm:text-4xl font-black text-white mb-6 md:mb-8 drop-shadow-md">¿Listo para empezar tu propia historia?</h3>
            <Link to="/acceso-usuario" className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-sky-400 to-pink-300 text-white font-black text-xs uppercase tracking-widest px-8 py-4 md:px-12 md:py-5 rounded-full hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] active:scale-95 mb-12 md:mb-16 w-full sm:w-auto">
              Crear mi cuenta gratuita
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>

            {/* SELLO CODERAIN STUDIO */}
            <div className="flex flex-col items-center justify-center opacity-70 hover:opacity-100 transition-opacity duration-300">
              <span className="text-[9px] md:text-[10px] text-sky-200 font-bold uppercase tracking-[0.3em] mb-3 md:mb-4">Una experiencia desarrollada por</span>
              <img
                src="/logo_CRS_oficial.png"
                alt="CodeRAIN Studio"
                className="h-8 md:h-12 object-contain filter drop-shadow-lg"
              />
            </div>
          </div>

        </div>
      </ContenedorPrincipal>
    </div>
  );
};

export default Inicio;