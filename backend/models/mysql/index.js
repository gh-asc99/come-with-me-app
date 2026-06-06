import { Sequelize } from 'sequelize'

let sequelize

// Opción A: Si mi proveedor de hosting me da una URI completa
if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'mysql',
    logging: false,
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false // Permite conexiones SSL seguras en la nube sin necesidad de certificado CA
      }
    }
  })
} else {
  // Opción B: Configuración tradicional por variables separadas (para mi entorno local)
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 3306,
      dialect: 'mysql',
      logging: false,
      dialectOptions: {
        ...(process.env.NODE_ENV === 'production' && {
          ssl: {
            rejectUnauthorized: false
          }
        })
      }
    }
  )
}

export default sequelize
