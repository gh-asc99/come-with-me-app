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
    const invitaciones = await Invitacion.findAll({
      where: { usuario_id: Sequelize.fn('UUID_TO_BIN', usuario_id) },
      include: ['plantilla_usada'],
      attributes: {
        include: [
          [Sequelize.literal(`(SELECT COUNT(*) FROM invitado WHERE invitado.invitacion_id = invitacion.id)`), 'total_invitados'],
          [Sequelize.literal(`(SELECT COUNT(*) FROM invitado WHERE invitado.invitacion_id = invitacion.id AND invitado.estado = 'confirmado')`), 'total_confirmados']
        ]
      }
    })
    return invitaciones.map(formatearSalida)
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
