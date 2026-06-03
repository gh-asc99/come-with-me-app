// src/models/mysql/Sugerencia.js
import { DataTypes, Sequelize } from 'sequelize'
import sequelize from './index.js'

const Sugerencia = sequelize.define('Sugerencia', {
  id: {
    type: DataTypes.STRING(16).BINARY,
    primaryKey: true,
    defaultValue: Sequelize.literal('(UUID_TO_BIN(UUID()))'),
    get () {
      const value = this.getDataValue('id')
      if (!value) return null
      const hex = value.toString('hex')
      return [hex.slice(0, 8), hex.slice(8, 12), hex.slice(12, 16), hex.slice(16, 20), hex.slice(20)].join('-')
    }
  },
  evento_id: {
    type: DataTypes.STRING(16).BINARY,
    allowNull: true,
    get () {
      const value = this.getDataValue('evento_id')
      if (!value) return null
      const hex = value.toString('hex')
      return [hex.slice(0, 8), hex.slice(8, 12), hex.slice(12, 16), hex.slice(16, 20), hex.slice(20)].join('-')
    }
  },
  paquete_id: {
    type: DataTypes.STRING(16).BINARY,
    allowNull: true,
    get () {
      const value = this.getDataValue('paquete_id')
      if (!value) return null
      const hex = value.toString('hex')
      return [hex.slice(0, 8), hex.slice(8, 12), hex.slice(12, 16), hex.slice(16, 20), hex.slice(20)].join('-')
    }
  },
  titulo_campo: { type: DataTypes.STRING, allowNull: false },
  descripcion_sugerida: { type: DataTypes.STRING, allowNull: true },
  tipo_campo: {
    type: DataTypes.ENUM('texto', 'textarea', 'url', 'fecha', 'numero', 'boolean', 'timeline', 'listado'),
    defaultValue: 'texto'
  },
  obligatorio: { type: DataTypes.BOOLEAN, defaultValue: false },
  opciones: { type: DataTypes.JSON, allowNull: true }
}, {
  tableName: 'sugerencia',
  timestamps: false
})

export default Sugerencia;