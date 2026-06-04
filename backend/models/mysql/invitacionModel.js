import Invitacion from './Invitacion.js'
import { Sequelize } from 'sequelize'
import crypto from 'crypto'

const formatearSalida = (invitacion) => {
  if (!invitacion) return null
  const obj = invitacion.toJSON ? invitacion.toJSON() : invitacion
  if (Buffer.isBuffer(obj.id)) obj.id = obj.id.toString('hex')
  if (Buffer.isBuffer(obj.usuario_id)) obj.usuario_id = obj.usuario_id.toString('hex')
  if (Buffer.isBuffer(obj.plantilla_id)) obj.plantilla_id = obj.plantilla_id.toString('hex')
  // NUEVO: Formateamos también el paquete_id
  if (Buffer.isBuffer(obj.paquete_id)) obj.paquete_id = obj.paquete_id.toString('hex')
  return obj
}

class InvitacionModel {
  static async getAllByUsuario ({ usuario_id }) {
    try {
      const invitaciones = await Invitacion.findAll({
        where: { usuario_id: Sequelize.fn('UUID_TO_BIN', usuario_id) },
        include: [
          'plantilla_usada',
          // Incluimos la relación de invitados, pero sin traer todos sus datos.
          // Solo queremos que Sequelize nos permita usar sus atributos para contar.
          {
            association: 'invitados', // <-- IMPORTANTE: Este nombre debe coincidir con el alias de tu relación (ej: Invitacion.hasMany(Invitado, { as: 'invitados' }))
            attributes: [] 
          }
        ],
        // Le pedimos a Sequelize que añada dos columnas dinámicas a los resultados
        attributes: {
          include: [
            // Cuenta TODOS los invitados asociados a esta invitación
            [Sequelize.fn('COUNT', Sequelize.col('invitados.id')), 'total_invitados'],
            
            // Cuenta SOLO los invitados cuyo estado es 'confirmado'
            // Usamos SUM y un CASE para emular el conteo condicional sin romper la consulta principal
            [
              Sequelize.fn(
                'SUM',
                Sequelize.literal(`CASE WHEN \`invitados\`.\`estado\` = 'confirmado' THEN 1 ELSE 0 END`)
              ),
              'total_confirmados'
            ]
          ]
        },
        // Como estamos usando funciones de agregación (COUNT, SUM), necesitamos agrupar por el ID de la invitación
        group: ['Invitacion.id', 'plantilla_usada.id'] 
      })

      return invitaciones.map(formatearSalida)
    } catch (error) {
      console.error('Error al obtener invitaciones del usuario:', error)
      throw new Error('Error al consultar el historial de invitaciones')
    }
  }

  static async create ({ input, usuario_id }) {
    const { plantilla_id, imagen, paquete_id, ...restoDatos } = input
    const id = crypto.randomUUID().replace(/-/g, '')

    await Invitacion.create({
      ...restoDatos, 
      id: Sequelize.fn('UUID_TO_BIN', id),
      usuario_id: Sequelize.fn('UUID_TO_BIN', usuario_id),
      plantilla_id: Sequelize.fn('UUID_TO_BIN', plantilla_id),
      paquete_id: Sequelize.fn('UUID_TO_BIN', paquete_id), // <--- REPARADO
      imagen: imagen
    })

    return { ...restoDatos, id, usuario_id, plantilla_id, paquete_id, imagen }
  }

  static async update ({ id, input, usuario_id }) {
    const invitacion = await Invitacion.findOne({
      where: {
        id: Sequelize.fn('UUID_TO_BIN', id),
        usuario_id: Sequelize.fn('UUID_TO_BIN', usuario_id)
      }
    })

    if (!invitacion) return false

    // Añadimos paquete_id a la extracción de datos
    const { titulo, mensaje, fecha_evento, hora_inicio, lugar, datos_extra, imagen, plantilla_id, paquete_id } = input

    await invitacion.update({
      titulo: titulo !== undefined ? titulo : invitacion.titulo,
      mensaje: mensaje !== undefined ? mensaje : invitacion.mensaje,
      fecha_evento: fecha_evento !== undefined ? fecha_evento : invitacion.fecha_evento,
      hora_inicio: hora_inicio !== undefined ? hora_inicio : invitacion.hora_inicio,
      lugar: lugar !== undefined ? lugar : invitacion.lugar,
      datos_extra: datos_extra !== undefined ? datos_extra : invitacion.datos_extra,
      imagen: imagen !== undefined ? imagen : invitacion.imagen,
      plantilla_id: plantilla_id ? Sequelize.fn('UUID_TO_BIN', plantilla_id) : invitacion.plantilla_id,
      // NUEVO: Actualizamos el paquete si viene en el input
      paquete_id: paquete_id ? Sequelize.fn('UUID_TO_BIN', paquete_id) : invitacion.paquete_id
    })

    return true
  }

  static async getById ({ id, usuario_id }) {
    const invitacion = await Invitacion.findOne({
      where: {
        id: Sequelize.fn('UUID_TO_BIN', id),
        usuario_id: Sequelize.fn('UUID_TO_BIN', usuario_id)
      }
    })

    return formatearSalida(invitacion)
  }

  static async delete ({ id, usuario_id }) {
    const filasAfectadas = await Invitacion.destroy({
      where: {
        id: Sequelize.fn('UUID_TO_BIN', id),
        usuario_id: Sequelize.fn('UUID_TO_BIN', usuario_id)
      }
    })

    return filasAfectadas > 0
  }

  static async getByIdPublico ({ id }) {
    const invitacion = await Invitacion.findOne({
      where: {
        id: Sequelize.fn('UUID_TO_BIN', id)
      },
      include: ['plantilla_usada']
    })

    return formatearSalida(invitacion)
  }
}

export default InvitacionModel
