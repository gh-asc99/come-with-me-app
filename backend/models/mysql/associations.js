import Evento from './Evento.js'
import Paquete from './Paquete.js'
import Plantilla from './Plantilla.js'
import PlantillaPaquete from './PlantillaPaquete.js'
import Sugerencia from './Sugerencia.js'
import Usuario from './Usuario.js'
import Invitacion from './Invitacion.js'
import Invitado from './Invitado.js'
import Suscripcion from './Suscripcion.js'
import CompraSuscripcion from './CompraSuscripcion.js'
import CompraEvento from './CompraEvento.js'
import CompraPaquete from './CompraPaquete.js'

function defineAssociations () {
  // --- EVENTO Y PAQUETE ---
  Evento.hasMany(Paquete, { foreignKey: 'evento_id', as: 'paquetes', onDelete: 'CASCADE' })
  Paquete.belongsTo(Evento, { foreignKey: 'evento_id', as: 'evento', onDelete: 'CASCADE' })

  // --- PAQUETES Y PLANTILLAS (N:M) ---
  Paquete.belongsToMany(Plantilla, { through: PlantillaPaquete, foreignKey: 'paquete_id', otherKey: 'plantilla_id', as: 'plantillas', onDelete: 'CASCADE' })
  Plantilla.belongsToMany(Paquete, { through: PlantillaPaquete, foreignKey: 'plantilla_id', otherKey: 'paquete_id', as: 'paquetes', onDelete: 'CASCADE' })

  // --- SUGERENCIAS ---
  Evento.hasMany(Sugerencia, { foreignKey: 'evento_id', as: 'sugerencias_evento', onDelete: 'CASCADE' })
  Sugerencia.belongsTo(Evento, { foreignKey: 'evento_id', as: 'evento', onDelete: 'CASCADE' })

  Paquete.hasMany(Sugerencia, { foreignKey: 'paquete_id', as: 'sugerencias_paquete', onDelete: 'CASCADE' })
  Sugerencia.belongsTo(Paquete, { foreignKey: 'paquete_id', as: 'paquete', onDelete: 'CASCADE' })

  // --- INVITACIONES E INVITADOS ---
  Usuario.hasMany(Invitacion, { foreignKey: 'usuario_id', as: 'invitaciones', onDelete: 'CASCADE' })
  Invitacion.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'creador', onDelete: 'CASCADE' })

  Plantilla.hasMany(Invitacion, { foreignKey: 'plantilla_id', as: 'invitaciones_creadas', onDelete: 'CASCADE' })
  Invitacion.belongsTo(Plantilla, { foreignKey: 'plantilla_id', as: 'plantilla_usada', onDelete: 'CASCADE' })

  Invitacion.hasMany(Invitado, { foreignKey: 'invitacion_id', as: 'invitados', onDelete: 'CASCADE' })
  Invitado.belongsTo(Invitacion, { foreignKey: 'invitacion_id', as: 'invitacion', onDelete: 'CASCADE' })

  // --- SUSCRIPCIONES ---
  Usuario.hasMany(Suscripcion, { foreignKey: 'usuario_id', as: 'suscripciones', onDelete: 'CASCADE' })
  Suscripcion.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario', onDelete: 'CASCADE' })

  Usuario.hasMany(CompraSuscripcion, { foreignKey: 'usuario_id', as: 'compras_suscripcion', onDelete: 'CASCADE' })
  CompraSuscripcion.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'comprador', onDelete: 'CASCADE' })

  Suscripcion.hasMany(CompraSuscripcion, { foreignKey: 'suscripcion_id', as: 'pagos', onDelete: 'CASCADE' })
  CompraSuscripcion.belongsTo(Suscripcion, { foreignKey: 'suscripcion_id', as: 'suscripcion', onDelete: 'CASCADE' })

  // --- COMPRA EVENTOS ---
  Usuario.hasMany(CompraEvento, { foreignKey: 'usuario_id', as: 'eventos_comprados', onDelete: 'CASCADE' })
  CompraEvento.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'comprador_evento', onDelete: 'CASCADE' })

  Evento.hasMany(CompraEvento, { foreignKey: 'evento_id', as: 'ventas', onDelete: 'CASCADE' })
  CompraEvento.belongsTo(Evento, { foreignKey: 'evento_id', as: 'evento', onDelete: 'CASCADE' })

  // --- COMPRA PAQUETES ---
  Usuario.hasMany(CompraPaquete, { foreignKey: 'usuario_id', as: 'paquetes_comprados', onDelete: 'CASCADE' })
  CompraPaquete.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'comprador_paquete', onDelete: 'CASCADE' })

  Paquete.hasMany(CompraPaquete, { foreignKey: 'paquete_id', as: 'ventas', onDelete: 'CASCADE' })
  CompraPaquete.belongsTo(Paquete, { foreignKey: 'paquete_id', as: 'paquete', onDelete: 'CASCADE' })

  console.log('🔗 Relaciones definidas correctamente')
}

export default defineAssociations