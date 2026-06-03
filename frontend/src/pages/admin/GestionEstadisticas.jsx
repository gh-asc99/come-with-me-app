// src/pages/admin/GestionEstadisticas.jsx
import React, { useState, useEffect } from 'react';
import api from '../../services/apiService'; 
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import ContenedorPrincipal from "../../components/layout/ContenedorPrincipal.jsx";
import Cargando from "../../components/ui/Cargando.jsx"; // <-- IMPORTAMOS CARGANDO

// =========================================================================
// NOTA IMPORTANTE PARA EL LAYOUT:
// Para que el fondo "admin_mosaico.png" se aplique a TODAS las vistas del admin 
// de forma consistente y sin cortarse, asegúrate de que tu AdminLayout.jsx
// mantenga la capa de fondo y el velo negro configurados correctamente.
// =========================================================================

const GestionEstadisticas = () => {
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Estado inicial vacío esperando a la API
  const [datos, setDatos] = useState({
    kpis: {
      totalUsuarios: 0,
      suscripcionesActivas: 0,
      totalInvitaciones: 0,
      totalIngresos: 0,
      tasaConversion: 0
    },
    usuariosPorRol: [],
    usoEventos: [],
    usoPaquetes: []
  });

  useEffect(() => {
    const fetchEstadisticas = async () => {
      try {
        const res = await api.get('/admin/estadisticas');
        setDatos(res.data);
      } catch (err) {
        console.error("Error al cargar estadísticas:", err);
        setError("No se pudieron cargar las estadísticas reales. Mostrando datos a 0.");
      } finally {
        setCargando(false);
      }
    };

    fetchEstadisticas();
  }, []);

  // ==========================================
  // TARJETA DE KPI ESTILO "DARK Glass"
  // ==========================================
  const KpiCard = ({ titulo, valor, icono, colorTexto, colorFondoBg }) => (
    <div className="bg-black/25 backdrop-blur-2xl rounded-[1.5rem] sm:rounded-[2rem] p-5 sm:p-6 flex items-center gap-4 sm:gap-5 transition-transform hover:-translate-y-1">
      <div className={`w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0 rounded-xl sm:rounded-2xl flex items-center justify-center border shadow-inner ${colorFondoBg}`}>
        {icono}
      </div>
      <div className="flex-1 overflow-hidden">
        <p className="text-[9px] sm:text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] mb-1 truncate">{titulo}</p>
        <p className={`text-2xl sm:text-3xl font-black ${colorTexto} drop-shadow-sm truncate`}>{valor}</p>
      </div>
    </div>
  );

  // PANTALLA DE CARGA UNIFICADA
  if (cargando) return <Cargando mensaje="Cargando estadísticas..." />;

  return (
    // Usamos ContenedorPrincipal para respetar los márgenes horizontales de la app
    <ContenedorPrincipal className="animate-fade-in-up flex flex-col">
      
      {/* CABECERA */}
      <div className="w-full bg-black/25 backdrop-blur-2xl rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 md:px-12 md:py-8 mb-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tighter drop-shadow-sm leading-tight">Estadísticas Globales</h1>
          <p className="text-xs sm:text-sm text-gray-300 mt-2 font-medium">Analiza el rendimiento y crecimiento de la plataforma en tiempo real.</p>
        </div>
      </div>

      {error && (
        <div className="bg-orange-500/20 backdrop-blur-md border border-orange-500/30 text-orange-200 p-4 rounded-2xl mb-6 sm:mb-8 flex items-center justify-center gap-3">
           <svg className="w-5 h-5 flex-shrink-0 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
           <span className="text-xs sm:text-sm font-bold tracking-wide">{error}</span>
        </div>
      )}

      <>
        {/* ==================================================
            FILA 1: KPIs
            ================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-5">
          <KpiCard 
            titulo="Usuarios Totales" 
            valor={datos.kpis.totalUsuarios} 
            // Cero Emojis: Usamos SVGs limpios para un look Admin
            icono={<svg className="w-5 h-5 sm:w-6 sm:h-6 text-sky-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
            colorTexto="text-white" 
            colorFondoBg="bg-sky-500/20 border-sky-500/30" 
          />
          <KpiCard 
            titulo="Suscripciones" 
            valor={datos.kpis.suscripcionesActivas} 
            icono={<svg className="w-5 h-5 sm:w-6 sm:h-6 text-pink-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>}
            colorTexto="text-white" 
            colorFondoBg="bg-pink-500/20 border-pink-500/30" 
          />
          <KpiCard 
            titulo="Invitaciones" 
            valor={datos.kpis.totalInvitaciones} 
            icono={<svg className="w-5 h-5 sm:w-6 sm:h-6 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" /></svg>}
            colorTexto="text-white" 
            colorFondoBg="bg-purple-500/20 border-purple-500/30" 
          />
          <KpiCard 
            titulo="Ingresos Totales" 
            valor={`${datos.kpis.totalIngresos}€`} 
            icono={<svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            colorTexto="text-green-300" 
            colorFondoBg="bg-green-500/20 border-green-500/30" 
          />
        </div>

        {/* ==================================================
            FILA 2: GRÁFICOS PRINCIPALES
            ================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-8 mb-5">
          
          {/* GRÁFICO CIRCULAR: Distribución de Usuarios */}
          <div className="bg-black/25 backdrop-blur-2xl rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 lg:col-span-1 flex flex-col min-h-[300px]">
            <h3 className="text-xs sm:text-sm font-black text-gray-300 uppercase tracking-widest mb-4 sm:mb-6 flex items-center gap-2 border-b border-white/10 pb-3 sm:pb-4">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>
              Distribución de Roles
            </h3>
            
            <div className="w-full flex-1 min-h-[250px] min-w-0 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                <PieChart>
                  <Pie
                    data={datos.usuariosPorRol}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {datos.usuariosPorRol.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value} usuarios`, 'Cantidad']}
                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                    itemStyle={{ color: 'white', fontSize: '12px' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ color: '#d1d5db', fontSize: '11px', fontWeight: 'bold' }}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* GRÁFICO DE BARRAS: Invitaciones por Evento */}
          <div className="bg-black/25 backdrop-blur-2xl rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 lg:col-span-2 flex flex-col min-h-[300px]">
            <h3 className="text-xs sm:text-sm font-black text-gray-300 uppercase tracking-widest mb-4 sm:mb-6 flex items-center gap-2 border-b border-white/10 pb-3 sm:pb-4">
               <svg className="w-4 h-4 sm:w-5 sm:h-5 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
               Invitaciones por Temática
            </h3>
            <div className="w-full flex-1 min-h-[250px] min-w-0 pt-2 sm:pt-4">
              <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                <BarChart data={datos.usoEventos} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="nombre" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 'bold' }} 
                    dy={15} 
                    angle={-45} // Inclinamos el texto para que quepa en móviles
                    textAnchor="end"
                  />
                  <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 'bold' }} dx={-10} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                    itemStyle={{ color: '#38bdf8', fontSize: '12px' }}
                  />
                  <Bar dataKey="cantidad" name="Creadas" fill="#38bdf8" radius={[8, 8, 0, 0]} barSize={35} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* ==================================================
            FILA 3: GRÁFICO DE BARRAS (Paquetes)
            ================================================== */}
        <div className="bg-black/25 backdrop-blur-2xl rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 mb-10 flex flex-col min-h-[350px]">
          <h3 className="text-xs sm:text-sm font-black text-gray-300 uppercase tracking-widest mb-4 sm:mb-6 flex items-center gap-2 border-b border-white/10 pb-3 sm:pb-4">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            Popularidad de Paquetes (Top 5)
          </h3>
          <div className="w-full h-[250px] sm:h-[300px] min-w-0 pt-2 sm:pt-4">
            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
              <BarChart data={datos.usoPaquetes} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.1)" />
                <XAxis type="number" allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 'bold' }} dy={10} />
                <YAxis type="category" dataKey="nombre" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 'bold' }} width={90} sm:width={120} dx={-5} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                  itemStyle={{ color: '#f472b6', fontSize: '12px' }}
                />
                <Bar dataKey="cantidad" name="Utilizado" fill="#f472b6" radius={[0, 8, 8, 0]} barSize={25} sm:barSize={35} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </>
    </ContenedorPrincipal>
  );
};

export default GestionEstadisticas;