// import { Sequelize } from 'sequelize'

// const sequelize = new Sequelize(
//   process.env.DB_NAME,
//   process.env.DB_USER,
//   process.env.DB_PASSWORD,
//   {
//     host: process.env.DB_HOST,
//     dialect: 'mysql',
//     logging: false
//   }
// )

// export default sequelize

import { Sequelize } from 'sequelize'

let sequelize

// Opción A: Si tu proveedor de hosting te da una URI completa (ej: mysql://user:pass@host:port/db)
if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'mysql',
    logging: false,
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false // Permite conexiones SSL seguras en la nube sin necesidad de descargar el certificado CA
      }
    }
  })
} else {
  // Opción B: Configuración tradicional por variables separadas (ideal para tu entorno local)
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 3306, // Inyecta el puerto de la nube o usa 3306 por defecto
      dialect: 'mysql',
      logging: false,
      dialectOptions: {
        // En local no solemos usar SSL, pero si en producción usas variables separadas, 
        // puedes activar esta línea en el panel de Render si tu proveedor lo exige:
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
