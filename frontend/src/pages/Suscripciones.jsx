// src/pages/Suscripciones.jsx
import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import useSesion from '../hooks/useSesion.js';
import ContenedorPrincipal from "../components/layout/ContenedorPrincipal.jsx";
import suscripcionesFondo from '../../public/suscripciones/suscripciones.png';

const Suscripciones = () => {
  const { isAuth } = useSesion();
  const navigate = useNavigate();
  
  const planesDisponibles = [
    { id: "mensual_1", nombre: "Plan Mensual", precio: "9.99", periodo: "mes", color: "pink", especial: false },
    { id: "mensual_3", nombre: "Plan Trimestral", precio: "26.50", periodo: "3 meses", color: "pink", especial: false },
    { id: "mensual_6", nombre: "Plan Semestral", precio: "44.99", periodo: "6 meses", color: "pink", popular: true, especial: false },
    { id: "anual", nombre: "Plan Anual", precio: "109.99", periodo: "año", color: "pink", especial: false },
    { id: "ilimitada", nombre: "Licencia Ilimitada", precio: "199.99", periodo: "pago único", color: "sky", especial: true },
  ];

  // Estado para controlar qué plan está seleccionado (por defecto el Semestral)
  const [planSeleccionado, setPlanSeleccionado] = useState(planesDisponibles[2]);
  const [procesando, setProcesando] = useState(false);

  const manejarCompra = () => {
    setProcesando(true);
    navigate(`/comprar/suscripcion/${planSeleccionado.id}`);
  };

  const ventajasPremium = [
    "Invitaciones y eventos ilimitados",
    "Sin marcas de agua en tus creaciones",
    "Acceso a estilos y plantillas exclusivas",
    "Soporte técnico prioritario 24/7"
  ];

  return (
    <div className="relative min-h-[calc(100vh-64px)] w-full overflow-hidden flex items-center justify-center py-5">
      
      {/* FONDO DINÁMICO CLARO */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat scale-105"
        style={{ backgroundImage: `url(${suscripcionesFondo})` }}
      >
        {/* Un ligerísimo velo y desenfoque para asegurar que el texto blanco siga siendo legible, sin oscurecer la imagen */}
        <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
      </div>

      <ContenedorPrincipal className="relative z-10 w-full animate-fade-in-up">
        
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden flex flex-col lg:flex-row items-stretch w-full max-w-6xl mx-auto shadow-2xl">
          
          {/* ==========================================
              LADO IZQUIERDO: PROPUESTA DE VALOR
              ========================================== */}
          <div className="w-full lg:w-5/12 p-6 sm:p-10 md:p-12 lg:p-16 flex flex-col justify-center bg-gradient-to-br from-black/20 to-transparent border-b lg:border-b-0 lg:border-r border-white/10">
            <span className="bg-sky-500/20 text-sky-400 px-3 py-1.5 sm:px-4 sm:py-1.5 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] mb-4 sm:mb-6 inline-block w-fit border border-sky-500/30 shadow-sm">
              Membresía Premium
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 sm:mb-6 tracking-tight leading-tight drop-shadow-sm">
              Desbloquea  <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-pink-300">todo el potencial</span>
            </h1>
            <p className="text-gray-200 text-xs sm:text-sm md:text-base font-medium leading-relaxed mb-8 sm:mb-10 drop-shadow-sm">
              Elige el plan que mejor se adapte a ti y disfruta de ventajas exclusivas. Haz que cada creación sea el reflejo perfecto de tus ideas.
            </p>

            <ul className="space-y-4 sm:space-y-5">
              {ventajasPremium.map((ventaja, index) => (
                <li key={index} className="flex items-center text-gray-100 font-medium text-xs sm:text-sm">
                  <div className="flex-shrink-0 mr-3 sm:mr-4 p-1.5 rounded-full bg-pink-300/20 text-pink-300 border border-pink-300/30">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  {ventaja}
                </li>
              ))}
            </ul>
          </div>

          {/* ==========================================
              LADO DERECHO: SELECTOR DE PLANES
              ========================================== */}
          <div className="w-full lg:w-7/12 p-6 sm:p-10 md:p-12 lg:p-16 flex flex-col justify-center relative bg-black/10">
            <h2 className="text-lg sm:text-xl font-black text-white mb-4 sm:mb-6">Selecciona tu plan</h2>
            
            <div className="space-y-3 mb-8 sm:mb-10">
              {planesDisponibles.map((plan) => {
                const isSelected = planSeleccionado.id === plan.id;
                const activeColor = plan.especial ? 'sky' : 'pink';
                
                return (
                  <div
                    key={plan.id}
                    onClick={() => setPlanSeleccionado(plan)}
                    className={`relative flex items-center justify-between p-3.5 sm:p-4 md:p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                      isSelected 
                        ? activeColor === 'sky' 
                          ? 'border-sky-400 bg-sky-400/20 shadow-[0_0_20px_rgba(56,189,248,0.25)]' 
                          : 'border-pink-300 bg-pink-300/20 shadow-[0_0_20px_rgba(244,114,182,0.25)]'
                        : 'border-white/20 bg-white/10 hover:bg-white/20 hover:border-white/30'
                    }`}
                  >
                    {/* Badge Recomendado Inline */}
                    {plan.popular && !isSelected && (
                      <div className="absolute -top-2.5 right-4 sm:right-6 bg-pink-300 text-white text-[8px] sm:text-[9px] font-black uppercase px-2 sm:px-3 py-1 rounded-full tracking-widest shadow-lg">
                        Recomendado
                      </div>
                    )}

                    <div className="flex items-center gap-3 sm:gap-4">
                      {/* Radio Button Custom */}
                      <div className={`flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                        isSelected 
                          ? activeColor === 'sky' ? 'border-sky-400' : 'border-pink-300'
                          : 'border-gray-300'
                      }`}>
                        {isSelected && <div className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full ${activeColor === 'sky' ? 'bg-sky-400' : 'bg-pink-300'}`}></div>}
                      </div>
                      
                      <div className="flex flex-col justify-center">
                        <h3 className={`font-black text-xs sm:text-sm md:text-base leading-none ${isSelected ? 'text-white' : 'text-gray-100'}`}>
                          {plan.nombre}
                        </h3>
                        {plan.especial && <p className="text-[9px] sm:text-[10px] text-sky-400 uppercase tracking-widest font-bold mt-1 leading-none">Acceso Vitalicio</p>}
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className={`text-lg sm:text-xl md:text-2xl font-black ${isSelected ? 'text-white' : 'text-gray-100'}`}>
                        {plan.precio}€
                      </span>
                      <span className="text-[10px] sm:text-xs text-gray-300 font-bold uppercase tracking-wider ml-1">
                        / {plan.periodo}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* BOTÓN DE ACCIÓN GLOBAL */}
            <div>
              {isAuth ? (
                <button
                  onClick={manejarCompra}
                  disabled={procesando}
                  className={`w-full font-black text-white text-xs sm:text-sm uppercase tracking-widest py-4 sm:py-5 rounded-2xl transition-all active:scale-95 flex justify-center items-center gap-2 ${
                    planSeleccionado.especial 
                      ? "bg-sky-500 hover:bg-sky-400 shadow-sky-500/30" 
                      : "bg-pink-300 hover:bg-pink-400 shadow-pink-400/30"
                  }`}
                >
                  {procesando ? "Procesando..." : `Continuar con ${planSeleccionado.nombre}`}
                </button>
              ) : (
                <Link
                  to="/acceso-usuario"
                  className="block w-full text-center font-black text-white bg-white/20 border border-white/30 text-xs sm:text-sm uppercase tracking-widest py-4 sm:py-5 rounded-2xl hover:bg-white/30 transition-all active:scale-95"
                >
                  Inicia sesión para continuar
                </Link>
              )}
            </div>

          </div>
        </div>

      </ContenedorPrincipal>
    </div>
  );
};

export default Suscripciones;