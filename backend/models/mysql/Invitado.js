import { DataTypes, Sequelize } from 'sequelize'
import sequelize from './index.js'

const Invitado = sequelize.define('Invitado', {
  id: {
    type: DataTypes.BLOB('tiny'),
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
  correo: { type: DataTypes.STRING, allowNull: true, unique: true },
  estado: {
    type: DataTypes.ENUM('pendiente', 'confirmado', 'rechazado'),
    defaultValue: 'pendiente'
  }
}, {
  tableName: 'invitado',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['correo', 'invitacion_id']
    }
  ]
})

export default Invitado
