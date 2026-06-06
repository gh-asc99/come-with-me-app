import cors from 'cors'

// Convierto las variables de entorno en un array si existen (separadas por comas)
const originsEnv = process.env.ACCEPTED_ORIGINS
  ? process.env.ACCEPTED_ORIGINS.split(',')
  : []

const ACCEPTED_ORIGINS = [
  'http://localhost:1234',
  'http://localhost:5173',
  ...originsEnv
]

const corsMiddleware = ({ acceptedOrigins = ACCEPTED_ORIGINS } = {}) => cors({
  origin: (origin, callback) => {
    if (acceptedOrigins.includes(origin)) {
      return callback(null, true)
    }

    if (!origin) {
      return callback(null, true)
    }

    return callback(new Error('No permitido por CORS'))
  },

  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
})

export default corsMiddleware
