import 'dotenv/config'
import express, { json } from 'express'
import corsMiddleware from './middlewares/cors.js'
import sequelize from './models/mysql/index.js'
import defineAssociations from './models/mysql/associations.js'
import eventosRouter from './routes/eventos.js'
import authRouter from './routes/auth.js'
import paquetesRouter from './routes/paquetes.js'
import plantillasRouter from './routes/plantillas.js'
import sugerenciasRouter from './routes/sugerencias.js'
import invitacionesRouter from './routes/invitaciones.js'
import invitadosRouter from './routes/invitados.js'
import suscripcionesRouter from './routes/suscripciones.js'
import comprasRouter from './routes/compras.js'
import uploadRouter from './routes/upload.js'
import adminRouter from './routes/admin.js'

import Evento from './models/mysql/Evento.js'
import Paquete from './models/mysql/Paquete.js'
import Sugerencia from './models/mysql/Sugerencia.js'
import crypto from 'node:crypto'

try {
  await sequelize.authenticate()
  console.log('✅ Conectado a MySQL con Sequelize')

  defineAssociations()

  // 1. Apagamos la revisión de seguridad de MySQL temporalmente
  await sequelize.query('SET FOREIGN_KEY_CHECKS = 0', { raw: true })
  
  // 2. Sequelize crea todas las tablas libremente de golpe
  await sequelize.sync()
  
  // 3. Volvemos a encender la seguridad
  await sequelize.query('SET FOREIGN_KEY_CHECKS = 1', { raw: true })
  
  console.log('🟢 Modelos sincronizados')
} catch (error) {
  console.error('❌ Error general de Sequelize:', error.message)
  console.error('🔍 Detalle exacto de MySQL:', error.parent?.sqlMessage || 'No disponible')
}

const app = express()
app.use(json())
app.use(corsMiddleware())
app.disable('x-powered-by')

app.use('/eventos', eventosRouter)
app.use('/auth', authRouter)
app.use('/paquetes', paquetesRouter)
app.use('/plantillas', plantillasRouter)
app.use('/sugerencias', sugerenciasRouter)
app.use('/invitaciones', invitacionesRouter)
app.use('/invitados', invitadosRouter)
app.use('/suscripciones', suscripcionesRouter)
app.use('/compras', comprasRouter)
app.use('/uploads', express.static('uploads'))
app.use('/upload', uploadRouter)
app.use('/admin', adminRouter)

const PORT = process.env.PORT ?? 3300

app.listen(PORT, () => {
  console.log(`🚀 Servidor backend listo y escuchando en el puerto ${PORT}`)
})


// ==========================================================
// SCRIPT DE LLENADO DE SUGERENCIAS (¡Borrar tras usar!)
// ==========================================================
app.get('/api/seed-sugerencias', async (req, res) => {
  try {
    const sugerenciasData = [
      { ev_nombre: "Unidos por la música", pq_nombre: "Mi próximo concierto", titulo_campo: "Canciones que sonarán", descripcion_sugerida: "Lista una, varias o todas las canciones que podrán disfrutar los espectadores.", tipo_campo: "texto", obligatorio: true },
      { ev_nombre: "Rumbo a la aventura", pq_nombre: "Plan al aire libre", titulo_campo: "Equipaje recomendado", descripcion_sugerida: "Especifica el equipamiento recomendado para hacer este plan al aire libre.", tipo_campo: "texto", obligatorio: true },
      { ev_nombre: "Unidos por la música", pq_nombre: null, titulo_campo: "Artista/s musical/es", descripcion_sugerida: "Intérpretes o grupos que sonarán en el evento.", tipo_campo: "texto", obligatorio: true },
      { ev_nombre: "Momentos que nos unen", pq_nombre: null, titulo_campo: "Cosas que hacen falta", descripcion_sugerida: "Elementos que puedan ser necesarios (juegos, comida, ropa, ...).", tipo_campo: "texto", obligatorio: false },
      { ev_nombre: null, pq_nombre: "Un viaje inolvidable", titulo_campo: "Momentos destacados en el viaje", descripcion_sugerida: "Lista las actividades que se harán en este viaje.", tipo_campo: "listado", obligatorio: false },
      { ev_nombre: "Veladas románticas", pq_nombre: "Salida romántica", titulo_campo: "Sitios por los que se va a pasar", descripcion_sugerida: "Especifica los lugares a los que iréis durante el plan.", tipo_campo: "texto", obligatorio: false },
      { ev_nombre: "Rumbo a la aventura", pq_nombre: null, titulo_campo: "Duración total del viaje", descripcion_sugerida: "Tiempo estimado que tomará el viaje en total (ida + plan + vuelta).", tipo_campo: "texto", obligatorio: false },
      { ev_nombre: "Veladas románticas", pq_nombre: null, titulo_campo: "Código de vestimenta", descripcion_sugerida: "Estilo de vestimenta que llevareis tú y tu pareja.", tipo_campo: "texto", obligatorio: true },
      { ev_nombre: "Conexión profesional", pq_nombre: "Anuncio corporativo", titulo_campo: "Cambios relevantes", descripcion_sugerida: "Enumera el/los cambio/s más importantes que supondrá esta decisión.", tipo_campo: "texto", obligatorio: true },
      { ev_nombre: "Aprender y celebrar", pq_nombre: "Charlas y talleres educativos", titulo_campo: "Objetivo/s de aprendizaje", descripcion_sugerida: "Indica que aprendizajes se van a trabajar con esta actividad.", tipo_campo: "texto", obligatorio: true },
      { ev_nombre: "Rumbo a la aventura", pq_nombre: "Un viaje inolvidable", titulo_campo: "Medio de transporte", descripcion_sugerida: "Indica el medio de transporte usado para llegar al destino.", tipo_campo: "texto", obligatorio: true },
      { ev_nombre: "Momentos que nos unen", pq_nombre: "Reunión familiar importante", titulo_campo: "Tema/s a tratar", descripcion_sugerida: "Especifica los temas que se hablarán en la reunión.", tipo_campo: "texto", obligatorio: true },
      { ev_nombre: "Veladas románticas", pq_nombre: "Una boda de ensueño", titulo_campo: "Nombre de los novios", descripcion_sugerida: "Escribe el nombre de la pareja que se casa.", tipo_campo: "texto", obligatorio: true },
      { ev_nombre: "Momentos que nos unen", pq_nombre: "Celebración familiar", titulo_campo: "Tipo de celebración", descripcion_sugerida: "Especifica el tipo de celebración (cumpleaños, comunión, bautizo...).", tipo_campo: "texto", obligatorio: true },
      { ev_nombre: "Unidos por la música", pq_nombre: "¡Vámonos de disco!", titulo_campo: "Local/es a visitar", descripcion_sugerida: "Menciona aquellos pubs/discotecas/locales a los que se acudirá.", tipo_campo: "texto", obligatorio: true },
      { ev_nombre: null, pq_nombre: "Un viaje inolvidable", titulo_campo: "Es necesario tener pasaporte y DNI vigente", descripcion_sugerida: "Concreta si haría falta tener habilitado el pasaporte y el DNI", tipo_campo: "boolean", obligatorio: false },
      { ev_nombre: "Unidos por la música", pq_nombre: null, titulo_campo: "Género/s de música", descripcion_sugerida: "Estilo de música que sonará en el evento.", tipo_campo: "texto", obligatorio: true },
      { ev_nombre: "Conexión profesional", pq_nombre: "Evento empresarial", titulo_campo: "Tipo de evento", descripcion_sugerida: "Concreta el tipo de evento (inauguración, presentación, ...).", tipo_campo: "texto", obligatorio: true },
      { ev_nombre: "Momentos que nos unen", pq_nombre: null, titulo_campo: "Alergias o restricciones", descripcion_sugerida: "Posibles alergias, intolerancias o condiciones a tener en cuenta.", tipo_campo: "texto", obligatorio: false },
      { ev_nombre: null, pq_nombre: null, titulo_campo: "Lista de invitados", descripcion_sugerida: "Estos son los acompañantes propuestos para el viaje.", tipo_campo: "listado", obligatorio: false },
      { ev_nombre: "Conexión profesional", pq_nombre: "Reunión de equipo", titulo_campo: "Puntos a tratar", descripcion_sugerida: "Especifica los temas que se tratarán durante la reunión.", tipo_campo: "texto", obligatorio: true },
      { ev_nombre: null, pq_nombre: "Escapada de fin de semana", titulo_campo: "Gasto total estimado por persona", descripcion_sugerida: "Indica un gasto orientativo del viaje (ya sea mediante una cifra o rango).", tipo_campo: "texto", obligatorio: false },
      { ev_nombre: "Conexión profesional", pq_nombre: null, titulo_campo: "Espacio y/o sala", descripcion_sugerida: "Ubicación y/o sala en la que tendrá lugar el evento.", tipo_campo: "texto", obligatorio: true },
      { ev_nombre: null, pq_nombre: "Una boda de ensueño", titulo_campo: "Fases de la boda", descripcion_sugerida: "Plasma las partes o acontecimientos que tendrá la boda", tipo_campo: "timeline", obligatorio: true },
      { ev_nombre: "Veladas románticas", pq_nombre: null, titulo_campo: "Requisitos para el plan", descripcion_sugerida: "Condiciones necesarias que debe cumplir tu pareja.", tipo_campo: "texto", obligatorio: false },
      { ev_nombre: "Aprender y celebrar", pq_nombre: null, titulo_campo: "Centro educativo que organiza la actividad", descripcion_sugerida: "Nombre del centro académico del que forma parte el evento.", tipo_campo: "texto", obligatorio: false },
      { ev_nombre: "Rumbo a la aventura", pq_nombre: null, titulo_campo: "Nuestro destino", descripcion_sugerida: "Meta final de nuestro viaje.", tipo_campo: "url", obligatorio: false },
      { ev_nombre: null, pq_nombre: null, titulo_campo: "Organizador", descripcion_sugerida: "Foto de la persona que organiza el evento.", tipo_campo: "url", obligatorio: false },
      { ev_nombre: "Aprender y celebrar", pq_nombre: "Reunión académica", titulo_campo: "Tema a tratar", descripcion_sugerida: "Especifica qué tema se tratará principalmente en la reunión.", tipo_campo: "texto", obligatorio: true },
      { ev_nombre: "Rumbo a la aventura", pq_nombre: null, titulo_campo: "Equipaje recomendado", descripcion_sugerida: "Lista el equipaje que consideres necesario para el viaje", tipo_campo: "listado", obligatorio: true },
      { ev_nombre: "Aprender y celebrar", pq_nombre: null, titulo_campo: "Tema/área de conocimiento", descripcion_sugerida: "Campo de estudio sobre el que girará el evento.", tipo_campo: "texto", obligatorio: false },
      { ev_nombre: "Unidos por la música", pq_nombre: "Mi nuevo lanzamiento musical", titulo_campo: "Plataforma/s en las que disfrutar el lanzamiento", descripcion_sugerida: "Nombra las diferentes plataformas en las que tus oyentes podrán escuchar tu nuevo hit.", tipo_campo: "texto", obligatorio: true },
      { ev_nombre: "Veladas románticas", pq_nombre: "Nuestro aniversario", titulo_campo: "¿Cuántos años cumplis tu pareja y tú?", descripcion_sugerida: "Especifica el número de años que llevais juntos oficialmente.", tipo_campo: "numero", obligatorio: true },
      { ev_nombre: "Momentos que nos unen", pq_nombre: "Día especial en casa", titulo_campo: "Tipo de plan", descripcion_sugerida: "Especifica el tipo de plan (cine en casa, juegos de mesa, ...).", tipo_campo: "texto", obligatorio: true },
      { ev_nombre: "Conexión profesional", pq_nombre: null, titulo_campo: "Empresa organizadora", descripcion_sugerida: "Nombre de la empresa que organiza el evento.", tipo_campo: "texto", obligatorio: true },
      { ev_nombre: "Aprender y celebrar", pq_nombre: "¡Nos vamos de graduación!", titulo_campo: "Etapa/curso del que me graduo", descripcion_sugerida: "Menciona el nombre del curso o etapa académica en la que te graduas.", tipo_campo: "texto", obligatorio: true }
    ];

    // 1. Obtener los Eventos y Paquetes actuales de la Base de Datos para sacar sus nuevos IDs
    const eventosActuales = await Evento.findAll();
    const paquetesActuales = await Paquete.findAll();

    // Crear diccionarios para hacer la búsqueda instantánea
    const mapaEventos = {};
    eventosActuales.forEach(e => {
      // Sequelize devuelve un objeto para IDs binarios cuando se serializa mal, forzamos la lectura del Buffer crudo si es necesario
      const idBuffer = e.getDataValue('id');
      mapaEventos[e.nombre] = idBuffer;
    });

    const mapaPaquetes = {};
    paquetesActuales.forEach(p => {
      const idBuffer = p.getDataValue('id');
      mapaPaquetes[p.nombre] = idBuffer;
    });

    let contadorSugerencias = 0;

    // 2. Limpiar las sugerencias antiguas para no duplicar si lanzas el script varias veces
    await Sugerencia.destroy({ truncate: true });

    // 3. Crear cada sugerencia vinculando los nuevos IDs binarios nativos
    for (const sug of sugerenciasData) {
      const sugerenciaIdBuffer = Buffer.from(crypto.randomUUID().replace(/-/g, ''), 'hex');
      
      const nuevoEventoId = sug.ev_nombre ? mapaEventos[sug.ev_nombre] : null;
      const nuevoPaqueteId = sug.pq_nombre ? mapaPaquetes[sug.pq_nombre] : null;

      await Sugerencia.create({
        id: sugerenciaIdBuffer,
        evento_id: nuevoEventoId,
        paquete_id: nuevoPaqueteId,
        titulo_campo: sug.titulo_campo,
        descripcion_sugerida: sug.descripcion_sugerida,
        tipo_campo: sug.tipo_campo,
        obligatorio: sug.obligatorio,
        opciones: null
      });

      contadorSugerencias++;
    }

    res.json({
      success: true,
      mensaje: '¡Sugerencias inyectadas y mapeadas correctamente! 🚀',
      estadisticas: {
        total_creadas: contadorSugerencias
      }
    });

  } catch (error) {
    console.error('Error al insertar las sugerencias:', error);
    res.status(500).json({ error: error.message });
  }
});