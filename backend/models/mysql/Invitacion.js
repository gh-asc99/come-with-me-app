import { DataTypes, Sequelize } from 'sequelize'
import sequelize from './index.js'

const Invitacion = sequelize.define('Invitacion', {
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
  titulo: { type: DataTypes.STRING, allowNull: false },
  mensaje: { type: DataTypes.TEXT, allowNull: false },
  fecha_evento: { type: DataTypes.DATEONLY, allowNull: false },
  hora_inicio: { type: DataTypes.TIME, allowNull: false },
  lugar: { type: DataTypes.STRING, allowNull: false },
  // Dentro de la definición de tu modelo Invitacion:
  paquete_id: { type: DataTypes.STRING(16).BINARY, allowNull: false },
  fecha_creacion: { type: DataTypes.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
  estado: {
    type: DataTypes.ENUM('borrador', 'publicada', 'enviada'),
    defaultValue: 'borrador'
  },
  datos_extra: {
    type: DataTypes.JSON,
    allowNull: true
  },
  imagen: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'invitacion',
  timestamps: false
})

export default Invitacion
