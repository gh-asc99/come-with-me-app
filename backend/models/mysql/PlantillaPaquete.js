import { DataTypes } from 'sequelize'
import sequelize from './index.js'

const PlantillaPaquete = sequelize.define('PlantillaPaquete', {
  plantilla_id: { type: DataTypes.STRING(16).BINARY, primaryKey: true },
  paquete_id: { type: DataTypes.STRING(16).BINARY, primaryKey: true }
}, {
  tableName: 'plantilla_paquete',
  timestamps: false
})

export default PlantillaPaquete
