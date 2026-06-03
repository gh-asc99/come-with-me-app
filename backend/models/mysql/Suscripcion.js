import { DataTypes, Sequelize } from 'sequelize'
import sequelize from './index.js'

const Suscripcion = sequelize.define('Suscripcion', {
  id: {
    type: DataTypes.BLOB('tiny'),
    primaryKey: true,
    defaultValue: Sequelize.literal('(UUID_TO_BIN(UUID()))'),
    get () {
      const value = this.getDataValue('id')
      if (!value) return null
      return value.toString('hex').replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, '$1-$2-$3-$4-$5')
    }
  },
  tipo: {
    type: DataTypes.ENUM('mensual_1', 'mensual_3', 'mensual_6', 'anual', 'ilimitada'),
    allowNull: false
  },
  precio: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  fecha_inicio: { type: DataTypes.DATEONLY, allowNull: false },
  fecha_fin: { type: DataTypes.DATEONLY, allowNull: true },
  estado: {
    type: DataTypes.ENUM('activa', 'vencida', 'cancelada'),
    defaultValue: 'activa'
  }
}, {
  tableName: 'suscripcion',
  timestamps: false
})

export default Suscripcion
