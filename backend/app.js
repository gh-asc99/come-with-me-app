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
import Plantilla from './models/mysql/Plantilla.js'
import PlantillaPaquete from './models/mysql/PlantillaPaquete.js'
import crypto from 'node:crypto'

try {
  await sequelize.authenticate()
  console.log('✅ Conectado a MySQL con Sequelize')

  defineAssociations()

  // 1. Apagamos la revisión de seguridad de MySQL temporalmente
  await sequelize.query('SET FOREIGN_KEY_CHECKS = 0', { raw: true })
  
  // 2. Sequelize crea todas las tablas libremente de golpe
  await sequelize.sync({ force: true })
  
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
// SCRIPT DE LLENADO NATIVO CORREGIDO (¡Borrar tras usar!)
// ==========================================================
app.get('/api/seed', async (req, res) => {
  try {
    const datosSemilla = [
      {
        evento: {
          nombre: 'Unidos por la música',
          descripcion: 'Donde la música es el punto de encuentro y cada nota cuenta una historia compartida.',
          imagen: 'musica.png',
          paleta_colores: 'default',
          tipografia: 'sans-serif',
          estilo_grafico: 'minimalista'
        },
        paquetes: [
          { nombre: 'Mi próximo concierto', descripcion: 'Una velada de música en directo pensada para emocionar, compartir y vibrar juntos.', precio: 0.99, imagen: 'paquetes/musica/paquete_mi_proximo_concierto.png' },
          { nombre: '¡Vámonos de disco!', descripcion: 'La invitación perfecta para una noche de baile, luces y ritmo sin pausa.', precio: 0.99, imagen: 'paquetes/musica/paquete_vamonos_de_disco.png' },
          { nombre: 'Mi nuevo lanzamiento musical', descripcion: 'Para artistas que quieren presentar al mundo su próximo tema o proyecto.', precio: 0.99, imagen: 'paquetes/musica/paquete_mi_nuevo_lanzamiento_musical.png' }
        ]
      },
      {
        evento: {
          nombre: 'Momentos que nos unen',
          descripcion: 'Planes pensados para disfrutar en familia y crear recuerdos que perduren.',
          imagen: 'familia.png',
          paleta_colores: 'default',
          tipografia: 'sans-serif',
          estilo_grafico: 'minimalista'
        },
        paquetes: [
          { nombre: 'Celebración familiar', descripcion: 'Porque cualquier excusa es buena para reunirnos con aquellos que más queremos.', precio: 0.99, imagen: 'paquetes/familia/paquete_celebracion_familiar.png' },
          { nombre: 'Día especial en casa', descripcion: 'Un plan íntimo y acogedor para compartir tiempo de calidad con los tuyos.', precio: 0.99, imagen: 'paquetes/familia/paquete_dia_especial_en_casa.png' },
          { nombre: 'Reunión familiar importante', descripcion: 'Para anunciar noticias, decisiones o momentos que merecen ser comunicados en persona.', precio: 0.99, imagen: 'paquetes/familia/paquete_reunion_familiar_importante.png' }
        ]
      },
      {
        evento: {
          nombre: 'Rumbo a la aventura',
          descripcion: 'Porque los mejores recuerdos empiezan con un “¿y si nos vamos…?',
          imagen: 'viajes.png',
          paleta_colores: 'default',
          tipografia: 'sans-serif',
          estilo_grafico: 'minimalista'
        },
        paquetes: [
          { nombre: 'Escapada de fin de semana', descripcion: 'Una pequeña aventura para desconectar, compartir experiencias y crear nuevos recuerdos.', precio: 0.99, imagen: 'paquetes/viajes/paquete_escapada_de_fin_de_semana.png' },
          { nombre: 'Un viaje inolvidable', descripcion: 'Pensado para grandes viajes llenos de sorpresas y momentos únicos.', precio: 0.99, imagen: 'paquetes/viajes/paquete_un_viaje_inolvidable.png' },
          { nombre: 'Plan al aire libre', descripcion: 'Excursiones, rutas, montañas y naturaleza: el plan perfecto para respirar libertad.', precio: 0.99, imagen: 'paquetes/viajes/paquete_plan_al_aire_libre.png' }
        ]
      },
      {
        evento: {
          nombre: 'Aprender y celebrar',
          descripcion: 'Cada etapa merece ser reconocida, compartida y celebrada.',
          imagen: 'educacion.png',
          paleta_colores: 'default',
          tipografia: 'sans-serif',
          estilo_grafico: 'minimalista'
        },
        paquetes: [
          { nombre: '¡Nos vamos de graduación!', descripcion: 'Un anuncio especial para cerrar una etapa y celebrar el esfuerzo realizado.', precio: 0.99, imagen: 'paquetes/educacion/paquete_nos_vamos_de_graduacion.png' },
          { nombre: 'Charlas y talleres educativos', descripcion: 'Planes únicos para disfrutar de reuniones educativas, formativas y divulgativas.', precio: 0.99, imagen: 'paquetes/educacion/charlas_y_talleres_educativos.png' },
          { nombre: 'Reunión académica', descripcion: 'Para encuentros entre estudiantes, profesores o equipos educativos.', precio: 0.99, imagen: 'paquetes/educacion/reunion_academica.png' }
        ]
      },
      {
        evento: {
          nombre: 'Veladas románticas',
          descripcion: 'Cuando compartir tiempo juntos se convierte en algo inolvidable.',
          imagen: 'amor.png',
          paleta_colores: 'default',
          tipografia: 'sans-serif',
          estilo_grafico: 'minimalista'
        },
        paquetes: [
          { nombre: 'Nuestro aniversario', descripcion: 'Celebra el tiempo compartido y todo lo que queda por vivir junto a tu alma gemela.', precio: 0.99, imagen: 'paquetes/amor/paquete_nuestro_aniversario.png' },
          { nombre: 'Una boda de ensueño', descripcion: 'El gran día merece una presentación tan especial como la historia que nos une.', precio: 0.99, imagen: 'paquetes/amor/paquete_una_boda_de_ensueno.png' },
          { nombre: 'Salida romántica', descripcion: 'Para compartir momentos íntimos cargados de sentimientos y emociones a flor de piel.', precio: 0.99, imagen: 'paquetes/amor/paquete_salida_romantica.png' }
        ]
      },
      {
        evento: {
          nombre: 'Conexión profesional',
          descripcion: 'Espacios donde las ideas, los equipos y los proyectos se encuentran.',
          imagen: 'laboral.png',
          paleta_colores: 'default',
          tipografia: 'sans-serif',
          estilo_grafico: 'minimalista'
        },
        paquetes: [
          { nombre: 'Reunión de equipo', descripcion: 'Para coordinar, informar y fortalecer el trabajo en grupo.', precio: 0.99, imagen: 'paquetes/laboral/paquete_reunion_de_equipo.png' },
          { nombre: 'Anuncio corporativo', descripcion: 'Comunica cambios, novedades o hitos importantes de tu empresa.', precio: 0.99, imagen: 'paquetes/laboral/paquete_anuncio_corporativo.png' },
          { font_name: 'Evento empresarial', nombre: 'Evento empresarial', descripcion: 'Presentaciones, inauguraciones o encuentros profesionales.', precio: 0.99, imagen: 'paquetes/laboral/paquete_evento_empresarial.png' }
        ]
      }
    ];

    const plantillasSemilla = [
      { titulo: 'Dos Columnas (Profesional)', descripcion: 'Estructura detallada que separa la información clave (izquierda) de los detalles logísticos como agenda, transporte o normas (derecha).', imagen: 'plantillas/plantilla_dos_columnas.png' },
      { titulo: 'Narrativa (Storytelling)', descripcion: 'Diseño enfocado en contar una historia. Perfecto para bodas, aniversarios o eventos familiares donde el texto largo y los sentimientos son los protagonistas.', imagen: 'plantillas/plantilla_narrativa.png' },
      { titulo: 'Visual (Enfoque Gráfico)', descripcion: 'Prioriza las composiciones de imágenes sobre el texto. Excelente para eventos de aventura, viajes o presentaciones visuales.', imagen: 'plantillas/plantilla_visual.png' },
      { titulo: 'Clásica Vertical (Minimalista)', descripcion: 'Diseño limpio y directo. Ideal para eventos que requieren poca información y un impacto visual rápido con una sola imagen principal.', imagen: 'plantillas/plantilla_clasica.png' }
    ];

    // Limpieza radical previa controlando las claves foráneas
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0', { raw: true });
    await Evento.destroy({ truncate: true, cascade: true });
    await Paquete.destroy({ truncate: true, cascade: true });
    await Plantilla.destroy({ truncate: true, cascade: true });
    await PlantillaPaquete.destroy({ truncate: true, cascade: true });
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1', { raw: true });

    const todosLosPaquetesBuffers = [];
    let eventosContador = 0;
    let paquetesContador = 0;

    // 1 y 2. Creación nativa de Eventos y Paquetes
    for (const item of datosSemilla) {
      const eventoIdBuffer = Buffer.from(crypto.randomUUID().replace(/-/g, ''), 'hex');
      
      await Evento.create({
        id: eventoIdBuffer,
        ...item.evento
      });
      eventosContador++;

      for (const p of item.paquetes) {
        const paqueteIdBuffer = Buffer.from(crypto.randomUUID().replace(/-/g, ''), 'hex');
        
        await Paquete.create({
          id: paqueteIdBuffer,
          ...p,
          evento_id: eventoIdBuffer
        });
        paquetesContador++;
        todosLosPaquetesBuffers.push(paqueteIdBuffer);
      }
    }

    // 3. Creación nativa de Plantillas y vinculación cruzada inmediata (CROSS)
    for (const pl of plantillasSemilla) {
      const plantillaIdBuffer = Buffer.from(crypto.randomUUID().replace(/-/g, ''), 'hex');
      
      await Plantilla.create({
        id: plantillaIdBuffer,
        ...pl
      });

      const enlaces = todosLosPaquetesBuffers.map(paqueteBuffer => ({
        plantilla_id: plantillaIdBuffer,
        paquete_id: paqueteBuffer
      }));

      await PlantillaPaquete.bulkCreate(enlaces);
    }

    // CORREGIDO: Hacemos el cálculo matemático directo eliminando la variable conflictiva
    res.json({
      success: true,
      mensaje: '¡Base de datos sembrada nativamente al 100%! 🚀🌱',
      estadisticas: {
        eventos: eventosContador,
        paquetes: paquetesContador,
        plantillas: plantillasSemilla.length,
        relaciones_intermedias_creadas: paquetesContador * plantillasSemilla.length
      }
    });

  } catch (error) {
    console.error('Error en el seeding nativo:', error);
    res.status(500).json({ error: error.message });
  }
});