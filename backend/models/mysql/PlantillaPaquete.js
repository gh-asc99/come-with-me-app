import sequelize from './index.js'

const PlantillaPaquete = sequelize.define('PlantillaPaquete', {
  plantilla_id: { type: 'BINARY(16)', primaryKey: true },
  paquete_id: { type: 'BINARY(16)', primaryKey: true }
}, {
  tableName: 'plantilla_paquete',
  timestamps: false
})

export default PlantillaPaquete
