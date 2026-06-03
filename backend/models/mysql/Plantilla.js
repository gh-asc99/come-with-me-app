import { DataTypes, Sequelize } from 'sequelize'
import sequelize from './index.js'

const Plantilla = sequelize.define('Plantilla', {
  id: {
    type: DataTypes.BLOB('tiny'),
    primaryKey: true,
    defaultValue: Sequelize.literal('UUID_TO_BIN(UUID())'),
    get () {
      const value = this.getDataValue('id')
      if (!value) return null
      const hex = value.toString('hex')
      return [
        hex.slice(0, 8), hex.slice(8, 12), hex.slice(12, 16), hex.slice(16, 20), hex.slice(20)
      ].join('-')
    }
  },
  titulo: { type: DataTypes.STRING, allowNull: false },
  descripcion: { type: DataTypes.STRING, allowNull: false },
  imagen: { type: DataTypes.STRING, allowNull: false }
}, {
  tableName: 'plantilla',
  timestamps: false
})

export default Plantilla
