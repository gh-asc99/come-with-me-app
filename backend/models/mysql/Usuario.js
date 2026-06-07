import { DataTypes, Sequelize } from 'sequelize'
import sequelize from './index.js'

const Usuario = sequelize.define('Usuario', {
  id: {
    type: 'BINARY(16)',
    primaryKey: true,
    defaultValue: Sequelize.literal('(UUID_TO_BIN(UUID()))'),
    get () {
      const value = this.getDataValue('id')
      if (!value) return null
      const hex = value.toString('hex')
      return [hex.slice(0, 8), hex.slice(8, 12), hex.slice(12, 16), hex.slice(16, 20), hex.slice(20)].join('-')
    }
  },
  nombre: { type: DataTypes.STRING, allowNull: false },
  correo: { type: DataTypes.STRING, allowNull: false, unique: true },
  password_hash: { type: DataTypes.STRING, allowNull: false },
  imagen: { type: DataTypes.STRING, allowNull: true },
  fecha_nacimiento: { type: DataTypes.DATEONLY, allowNull: false },
  fecha_registro: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
  rol: { type: DataTypes.STRING, defaultValue: 'user' },
  creaciones_historicas: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'usuario',
  timestamps: false
})

export default Usuario