import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/apiService';
import ContenedorPrincipal from '../components/layout/ContenedorPrincipal.jsx';
import suscripcionesFondo from '../../public/suscripciones/suscripciones.png';
import Aviso from '../components/ui/Aviso.jsx';
import Cargando from '../components/ui/Cargando.jsx';

const planesSuscripcion = [
  { id: "mensual_1", nombre: "Plan Mensual", precio: "9.99", meses: 1 },
  { id: "mensual_3", nombre: "Plan Trimestral", precio: "26.50", meses: 3 },
  { id: "mensual_6", nombre: "Plan Semestral", precio: "44.99", meses: 6 },
  { id: "anual", nombre: "Plan Anual", precio: "109.99", meses: 12 },
  { id: "ilimitada", nombre: "Licencia Ilimitada", precio: "199.99", meses: null },
];

const Checkout = () => {
  const { tipo, id } = useParams();
  const navegar = useNavigate();
  const [resumen, setResumen] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [procesandoPago, setProcesandoPago] = useState(false);
  const [exito, setExito] = useState(false);
  const [aviso, setAviso] = useState({ visible: false, mensaje: '', tipo: 'info' });
  const [datosTarjeta, setDatosTarjeta] = useState({ titular: '', numero: '', caducidad: '', cvc: '' });

  useEffect(() => {
    const cargarResumen = async () => {
      if (tipo === 'suscripcion') {
        const planElegido = planesSuscripcion.find(p => p.id === id);
        if (planElegido) {
          setResumen({
            item: { nombre: planElegido.nombre, imagen: '/suscripciones/suscripciones.png' },
            total: parseFloat(planElegido.precio),
            planData: planElegido 
          });
          setCargando(false);
        } else {
          setAviso({ visible: true, mensaje: "El plan seleccionado no existe.", tipo: 'error' });
          navegar(-1);
        }
        return;
      }

      try {
        const res = await api.get(`/compras/${tipo}/${id}/resumen`);
        setResumen(res.data);
      } catch (error) {
        setAviso({ visible: true, mensaje: "No se pudo cargar la información de compra.", tipo: 'error' });
        navegar(-1);
      } finally {
        setCargando(false);
      }
    };
    cargarResumen();
  }, [tipo, id, navegar]);

  const esperar = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // LÓGICA DE VALIDACIÓN DE PAGO AL PULSAR EL BOTÓN
  const manejarPago = async (e) => {
    e.preventDefault();
    
    const errores = [];
    const regexLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;
    
    // 1. Validar Titular (Solo letras)
    if (!datosTarjeta.titular.trim()) {
      errores.push("• El titular de la tarjeta es obligatorio.");
    } else if (!regexLetras.test(datosTarjeta.titular.trim())) {
      errores.push("• El titular solo puede contener letras y espacios.");
    }

    // 2. Validar Número de Tarjeta (16 números, ignorando espacios puestos por el usuario)
    const numeroLimpio = datosTarjeta.numero.replace(/\s/g, ''); 
    if (!/^\d{16}$/.test(numeroLimpio)) {
      errores.push("• La tarjeta debe contener exactamente 16 números.");
    }

    // 3. Validar Caducidad (MM/YY)
    const regexCaducidad = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!regexCaducidad.test(datosTarjeta.caducidad.trim())) {
      errores.push("• La caducidad debe tener formato MM/YY (ej: 12/26).");
    } else {
      const [mes, anioStr] = datosTarjeta.caducidad.split('/');
      const mesNum = parseInt(mes, 10);
      const anioNum = parseInt(anioStr, 10);
      const anioActual = parseInt(new Date().getFullYear().toString().slice(-2), 10);
      const mesActual = new Date().getMonth() + 1;

      if (anioNum < anioActual || (anioNum === anioActual && mesNum < mesActual)) {
        errores.push("• La tarjeta introducida parece estar caducada.");
      }
    }

    // 4. Validar CVC (3 números exactos)
    if (!/^\d{3}$/.test(datosTarjeta.cvc.trim())) {
      errores.push("• El CVC debe contener exactamente 3 números.");
    }

    // Comprobar si hay errores antes de hacer la petición
    if (errores.length > 0) {
      setAviso({ visible: true, mensaje: `Revisa los datos:\n${errores.join('\n')}`, tipo: 'error' });
      return;
    }

    setProcesandoPago(true);

    try {
      await esperar(2000);
      let esAdmin = false;

      if (tipo === 'suscripcion') {
        const fechaInicio = new Date();
        let fechaFin = null;
        
        if (resumen.planData.meses !== null) {
          fechaFin = new Date(fechaInicio);
          fechaFin.setMonth(fechaFin.getMonth() + resumen.planData.meses);
        }

        const payloadSuscripcion = {
          tipo: id,
          precio: resumen.total,
          precio_pagado: resumen.total,
          fecha_inicio: fechaInicio.toISOString().split('T')[0],
          fecha_fin: fechaFin ? fechaFin.toISOString().split('T')[0] : null
        };

        await api.post('/suscripciones/comprar', payloadSuscripcion);
        
        const usuarioGuardado = JSON.parse(localStorage.getItem('user') || '{}');
        if (usuarioGuardado.id) {
          if (usuarioGuardado.rol === 'admin') {
            esAdmin = true;
            setAviso({ 
              visible: true, 
              mensaje: "Ya tienes acceso total y sin restricciones a toda la plataforma por ser administrador.\n\nPara prevenir que pierdas tus superpoderes, tu tipo de usuario se mantendrá y no cambiará a suscriptor.", 
              tipo: 'info' 
            });
            // Omitimos cambiar a 'subscriber'
          } else {
            usuarioGuardado.rol = 'subscriber';
            localStorage.setItem('user', JSON.stringify(usuarioGuardado));
          }
        }
      } 
      else {
        const payloadCompra = {};
        if (tipo === 'evento') payloadCompra.evento_id = id;
        if (tipo === 'paquete') payloadCompra.paquete_id = id;
        payloadCompra.precio_pagado = resumen.total;

        await api.post(`/compras/${tipo}`, payloadCompra);
      }
      
      setExito(true);
      // Damos más tiempo si es admin para que pueda leer tranquilamente el aviso
      await esperar(esAdmin ? 7500 : 2500);
      window.location.href = '/perfil-usuario';

    } catch (error) {
      setAviso({ visible: true, mensaje: error.response?.data?.error || "Hubo un error procesando tu pago.", tipo: 'error' });
      setProcesandoPago(false);
    }
  };

  const getUrlImagen = (ruta) => {
    if (!ruta) return 'https://via.placeholder.com/400x300?text=Cargando';
    if (ruta.startsWith('http')) return ruta;
    if (ruta.includes('uploads')) {
      const rutaLimpia = ruta.startsWith('/') ? ruta.substring(1) : ruta;
      return `http://localhost:3300/${rutaLimpia}`;
    }
    if (!ruta.includes('/')) {
      return tipo === 'evento' ? `/eventos/${ruta}` : `/paquetes/${ruta}`;
    }
    return ruta.startsWith('/') ? ruta : `/${ruta}`;
  };

  if (cargando) return <Cargando mensaje="Preparando pasarela de pago " />;

  if (exito) return (
    <div className="relative min-h-[calc(100vh-64px)] w-full overflow-hidden flex items-center justify-center py-6 sm:py-10 px-4">
      <Aviso 
        mensaje={aviso.mensaje} 
        tipo={aviso.tipo} 
        visible={aviso.visible} 
        onClose={() => setAviso({ ...aviso, visible: false })} 
      />
      <div className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat scale-105" style={{ backgroundImage: `url(${suscripcionesFondo})` }}>
        <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
      </div>
      <div className="relative z-10 bg-white/90 backdrop-blur-xl p-8 sm:p-10 rounded-[2rem] sm:rounded-[3rem] shadow-2xl text-center max-w-md w-full animate-scale-up border border-white/40">
        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-tr from-green-400 to-green-300 rounded-full flex items-center justify-center mx-auto mb-5 sm:mb-6 text-white shadow-[0_0_20px_rgba(74,222,128,0.4)]">
          <svg className="w-10 h-10 sm:w-12 sm:h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-[#252525] mb-2 tracking-tight">¡Pago Confirmado!</h2>
        <p className="text-gray-500 font-medium text-sm sm:text-base">Transacción completada con éxito. Redirigiendo a tu perfil...</p>
      </div>
    </div>
  );

  return (
    <div className="relative min-h-[calc(100vh-64px)] w-full overflow-hidden flex flex-col items-center py-5">

      <Aviso 
        mensaje={aviso.mensaje} 
        tipo={aviso.tipo} 
        visible={aviso.visible} 
        onClose={() => setAviso({ ...aviso, visible: false })} 
      />

      <div className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat scale-105" style={{ backgroundImage: `url(${suscripcionesFondo})` }}>
        <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
      </div>

      <ContenedorPrincipal className="relative z-10 w-full animate-fade-in-up">
        
        <div className="bg-white/5 backdrop-blur-2xl border border-white/20 rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row items-stretch w-full max-w-6xl mx-auto">
          
          {/* LADO IZQUIERDO: RESUMEN */}
          <div className="w-full lg:w-5/12 p-6 sm:p-10 md:p-12 flex flex-col relative border-b lg:border-b-0 lg:border-r border-white/10 bg-gradient-to-br from-black/20 to-transparent">
            <h3 className="text-[9px] sm:text-[10px] font-black text-sky-300 uppercase tracking-[0.3em] mb-4 sm:mb-6 inline-block">Resumen del pedido</h3>
            <div className="relative w-full aspect-video rounded-[1.5rem] sm:rounded-3xl overflow-hidden mb-6 sm:mb-8 shadow-lg border border-white/10 group">
              <div className="absolute inset-0 bg-black/20 z-10 group-hover:bg-transparent transition-colors duration-500"></div>
              <img src={getUrlImagen(resumen?.item?.imagen)} alt="Portada" className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${tipo === 'suscripcion' ? 'brightness-[0.80]' : ''}`} />
            </div>
            
            <div className="mb-4 sm:mb-6">
              <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full mb-3 inline-block shadow-sm ${tipo === 'suscripcion' ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30' : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'}`}>
                {tipo} Premium
              </span>
              <h4 className="text-2xl sm:text-3xl font-black text-white leading-tight drop-shadow-sm">{resumen?.item?.nombre}</h4>
            </div>
            
            <p className="text-xs sm:text-sm text-gray-200 font-medium mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-white/10 leading-relaxed">
              {tipo === 'suscripcion' ? 'Desbloquea todo el contenido y elimina las marcas de agua durante el periodo contratado. Disfruta de la mejor experiencia.' : `Al adquirir este ${tipo}, se desbloqueará de forma permanente en tu cuenta para que puedas crear invitaciones increíbles.`}
            </p>

            <div className="mt-auto space-y-3 sm:space-y-4 text-white">
              <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-gray-300">
                <span>Subtotal</span>
                <span>{resumen?.total.toFixed(2)}€</span>
              </div>
              <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-gray-300 pb-5 sm:pb-6 border-b border-white/10">
                <span>Impuestos</span>
                <span>Incluidos</span>
              </div>
              <div className="flex justify-between items-center pt-1 sm:pt-2">
                <span className="text-lg sm:text-xl font-black">Total a pagar</span>
                <span className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-pink-300 drop-shadow-md">
                  {resumen?.total.toFixed(2)}€
                </span>
              </div>
            </div>
          </div>

          {/* LADO DERECHO: FORMULARIO DE PAGO */}
          <div className="w-full lg:w-7/12 p-6 sm:p-10 md:p-12 lg:p-14 flex flex-col justify-center bg-white/95 backdrop-blur-xl">
            <div className="mb-6 sm:mb-10">
              <h2 className="text-2xl sm:text-3xl font-black text-[#252525] mb-1.5 sm:mb-2 tracking-tight">Datos de pago</h2>
              <p className="text-gray-500 text-xs sm:text-sm font-medium">Completa la transacción simulada de forma segura.</p>
            </div>
            
            <form onSubmit={manejarPago} className="space-y-4 sm:space-y-6 flex-1 flex flex-col">
              <div>
                <label className="block text-[10px] sm:text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1.5 sm:mb-2">Titular de la tarjeta</label>
                <input 
                  type="text" 
                  value={datosTarjeta.titular} 
                  onChange={e => setDatosTarjeta({...datosTarjeta, titular: e.target.value})} 
                  className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-gray-50 border border-gray-200 text-[#252525] rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400 transition-all font-bold uppercase text-sm sm:text-base" 
                  placeholder="Ej: MANUEL GARCÍA ESTEVE" 
                />
              </div>
              
              <div>
                <label className="block text-[10px] sm:text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1.5 sm:mb-2">Número de tarjeta</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={datosTarjeta.numero} 
                    onChange={e => setDatosTarjeta({...datosTarjeta, numero: e.target.value})} 
                    className="w-full pl-12 sm:pl-14 pr-4 sm:pr-5 py-3 sm:py-4 bg-gray-50 border border-gray-200 text-[#252525] rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400 transition-all font-mono font-bold tracking-widest text-base sm:text-lg" 
                    placeholder="0000 0000 0000 0000" 
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400 absolute left-4 sm:left-5 top-3.5 sm:top-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-[10px] sm:text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1.5 sm:mb-2">Caducidad</label>
                  <input 
                    type="text" 
                    value={datosTarjeta.caducidad} 
                    onChange={e => setDatosTarjeta({...datosTarjeta, caducidad: e.target.value})} 
                    className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-gray-50 border border-gray-200 text-[#252525] rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400 transition-all font-mono font-bold text-base sm:text-lg text-center" 
                    placeholder="MM/YY" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] sm:text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1.5 sm:mb-2">CVC</label>
                  <input 
                    type="text" 
                    value={datosTarjeta.cvc} 
                    onChange={e => setDatosTarjeta({...datosTarjeta, cvc: e.target.value})} 
                    className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-gray-50 border border-gray-200 text-[#252525] rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400 transition-all font-mono font-bold text-center tracking-[0.2em] sm:tracking-[0.3em] text-base sm:text-lg" 
                    placeholder="123" 
                  />
                </div>
              </div>
              
              <div className="pt-6 sm:pt-8 mt-auto">
                <button 
                  type="submit" 
                  disabled={procesandoPago} 
                  className="w-full py-4 sm:py-5 px-6 sm:px-8 bg-[#252525] hover:bg-black text-white rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm uppercase tracking-widest transition-all shadow-[0_10px_20px_rgba(0,0,0,0.1)] active:scale-95 flex justify-center items-center gap-2 sm:gap-3 disabled:bg-gray-300 disabled:shadow-none"
                >
                  {procesandoPago ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>
                      Procesando pago...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Pagar {resumen?.total.toFixed(2)}€
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>

        </div>

        <div className="w-full max-w-6xl mx-auto mt-4 sm:mt-6 px-2 sm:px-0">
          <button 
            onClick={() => navegar(-1)}
            className="flex w-full sm:w-auto justify-center sm:justify-start items-center text-pink-300 bg-white/90 hover:bg-white backdrop-blur-md px-5 py-3 sm:py-2.5 rounded-full font-black text-[9px] sm:text-[10px] uppercase tracking-widest transition-all shadow-sm group border border-white/50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
            </svg>
            Cancelar y volver
          </button>
        </div>
        
      </ContenedorPrincipal>
    </div>
  );
};

export default Checkout;