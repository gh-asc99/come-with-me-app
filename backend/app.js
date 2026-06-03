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

  await sequelize.sync({ force: true })
  console.log('🟢 Modelos sincronizados')
} catch (error) {
  console.error('❌ Error de conexión:', error)
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

// app.listen(PORT, () => {
//   console.log(`Servidor corriendo en http://localhost:${PORT}`)
// })

app.listen(PORT, () => {
  // Cambiamos el log para que simplemente indique el puerto activo en Render
  console.log(`🚀 Servidor backend listo y escuchando en el puerto ${PORT}`)
})