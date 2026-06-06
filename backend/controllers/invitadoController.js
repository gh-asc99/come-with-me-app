import Invitado from '../models/mysql/Invitado.js'
import { validarInvitado, validarInvitadoParcial } from '../schemas/invitadoSchema.js'
import { Sequelize } from 'sequelize'
import crypto from 'crypto'

// Traductor para limpiar los UUIDs en formato Buffer a texto Hexadecimal
const formatearInvitado = (invitado) => {
  if (!invitado) return null
  const obj = invitado.toJSON ? invitado.toJSON() : invitado

  if (Buffer.isBuffer(obj.id)) obj.id = obj.id.toString('hex')
  if (Buffer.isBuffer(obj.invitacion_id)) obj.invitacion_id = obj.invitacion_id.toString('hex')

  return obj
}

class InvitadoController {
  static async getByInvitacion (req, res) {
    const { invitacion_id } = req.params
    const invitados = await Invitado.findAll({
      where: { invitacion_id: Sequelize.fn('UUID_TO_BIN', invitacion_id) }
    })

    res.json(invitados.map(formatearInvitado))
  }

  static async getByIdPublico (req, res) {
    const { id } = req.params
    try {
      const invitado = await Invitado.findOne({
        where: Sequelize.where(Sequelize.fn('UUID_TO_BIN', id), '=', Sequelize.col('id'))
      })

      if (!invitado) return res.status(404).json({ error: 'Invitado no encontrado' })
      res.json(formatearInvitado(invitado))
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Error al cargar el invitado' })
    }
  }

  static async store (req, res) {
    const result = validarInvitado(req.body)
    if (!result.success) return res.status(400).json({ error: JSON.parse(result.error.message) })

    try {
      const datos = { ...result.data }

      if (datos.correo === '') datos.correo = null

      const nuevoId = crypto.randomUUID().replace(/-/g, '')

      datos.id = Sequelize.fn('UUID_TO_BIN', nuevoId)
      datos.invitacion_id = Sequelize.fn('UUID_TO_BIN', datos.invitacion_id)

      await Invitado.create(datos)

      res.status(201).json({
        ...result.data,
        id: nuevoId,
        estado: 'pendiente'
      })
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({ error: 'Este correo ya ha sido invitado a este evento' })
      }
      console.error(error)
      res.status(500).json({ error: 'Error al añadir invitado' })
    }
  }

  static async updateEstado (req, res) {
    const { id } = req.params
    const result = validarInvitadoParcial(req.body)
    if (!result.success) return res.status(400).json({ error: JSON.parse(result.error.message) })

    const invitado = await Invitado.findOne({
      where: Sequelize.where(Sequelize.fn('UUID_TO_BIN', id), '=', Sequelize.col('id'))
    })

    if (!invitado) return res.status(404).json({ message: 'Invitado no encontrado' })

    await invitado.update(result.data)
    res.json({ message: 'Estado del invitado actualizado', invitado: formatearInvitado(invitado) })
  }

  static async delete (req, res) {
    const { id } = req.params
    try {
      const borrado = await Invitado.destroy({
        where: Sequelize.where(Sequelize.col('id'), '=', Sequelize.fn('UUID_TO_BIN', id))
      })

      if (!borrado) return res.status(404).json({ error: 'Invitado no encontrado' })
      res.json({ message: 'Invitado eliminado correctamente' })
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Error al eliminar el invitado' })
    }
  }
}

export default InvitadoController
