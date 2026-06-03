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