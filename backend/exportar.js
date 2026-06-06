import mysql from 'mysql2/promise'
import fs from 'fs/promises'

const exportar = async () => {
  try {
    const conexion = await mysql.createConnection({
      host: 'localhost',
      user: 'adminRoot',
      password: 'root',
      database: 'db_comewithme'
    })

    console.log('⏳ Conectando y leyendo estructura...')
    let esquema = '-- Estructura de la Base de Datos\n\n'

    const [tablas] = await conexion.query('SHOW TABLES')

    for (let i = 0; i < tablas.length; i++) {
      const nombreTabla = Object.values(tablas[i])[0]
      const [resultado] = await conexion.query(`SHOW CREATE TABLE \`${nombreTabla}\``)

      esquema += resultado[0]['Create Table'] + ';\n\n'
    }

    await fs.writeFile('esquema.sql', esquema)
    console.log('✅ ¡Magia completada! Archivo esquema.sql generado con éxito.')

    await conexion.end()
  } catch (error) {
    console.error('❌ Error al exportar:', error)
  }
}

exportar()
