import { DataTypes, Sequelize } from 'sequelize'
import sequelize from './index.js'

const Evento = sequelize.define(
  'Evento',
  {
    id: {
      type: 'BINARY(16)',
      primaryKey: true,
      allowNull: false,
      defaultValue: Sequelize.literal('(UUID_TO_BIN(UUID()))'),
      get () {
        const value = this.getDataValue('id')
        if (!value) return null

        return [
          value.toString('hex').slice(0, 8),
          value.toString('hex').slice(8, 12),
          value.toString('hex').slice(12, 16),
          value.toString('hex').slice(16, 20),
          value.toString('hex').slice(20)
        ].join('-')
      }
    },

    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },

    descripcion: {
      type: DataTypes.STRING,
      allowNull: false
    },

    imagen: {
      type: DataTypes.STRING,
      allowNull: false
    },

    paleta_colores: {
      type: DataTypes.STRING,
      defaultValue: 'default'
    },

    tipografia: {
      type: DataTypes.STRING,
      defaultValue: 'sans-serif'
    },

    bloqueado: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },

    estilo_grafico: {
      type: DataTypes.STRING,
      defaultValue: 'minimalista'
    }
  },
  {
    tableName: 'evento',
    timestamps: false
  }
)

export default Evento
