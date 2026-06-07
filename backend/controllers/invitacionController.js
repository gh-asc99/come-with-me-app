import InvitacionModel from '../models/mysql/invitacionModel.js'
import { validarInvitacion } from '../schemas/invitacionSchema.js'

class InvitacionController {
  static async index (req, res) {
    try {
      const usuario_id = req.user.id
      const invitaciones = await InvitacionModel.getAllByUsuario({ usuario_id })
      res.json(invitaciones)
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener tus invitaciones' })
    }
  }

  static async getById (req, res) {
    const { id } = req.params
    const usuario_id = req.user.id

    try {
      const invitacion = await InvitacionModel.getById({ id, usuario_id })
      if (!invitacion) return res.status(404).json({ error: 'Invitación no encontrada o no tienes permisos' })
      res.json(invitacion)
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener la invitación' })
    }
  }

  static async getPublicById (req, res) {
    const { id } = req.params

    try {
      const invitacion = await InvitacionModel.getByIdPublico({ id })

      if (!invitacion) {
        return res.status(404).json({ error: 'Invitación no encontrada' })
      }

      res.json(invitacion)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Error al obtener la invitación pública' })
    }
  }

  static async store (req, res) {
    const result = validarInvitacion(req.body)
    if (!result.success) return res.status(400).json({ error: JSON.parse(result.error.message) })

    try {
      const usuario_id = req.user.id
      const nueva = await InvitacionModel.create({ input: result.data, usuario_id })
      res.status(201).json(nueva)
    } catch (error) {
      if (error.message === 'LIMITE_ALCANZADO') {
        return res.status(403).json({ error: 'Has alcanzado el límite de 6 creaciones gratuitas. Pásate a Premium para seguir creando sin límites.' })
      }
      console.error(error)
      res.status(500).json({ error: 'Error al crear la invitación' })
    }
  }

  static async delete (req, res) {
    const { id } = req.params
    const usuario_id = req.user.id

    try {
      const borrado = await InvitacionModel.delete({ id, usuario_id })
      if (!borrado) return res.status(404).json({ error: 'Invitación no encontrada o no te pertenece' })
      res.json({ message: 'Invitación eliminada correctamente' })
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar la invitación' })
    }
  }

  static async getByUsuarioAdmin (req, res) {
    try {
      const { id } = req.params
      const invitaciones = await InvitacionModel.getAllByUsuario({ usuario_id: id })
      res.json(invitaciones)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Error al obtener las invitaciones del usuario' })
    }
  }

  static async storeAdmin (req, res) {
    const { id } = req.params
    const result = validarInvitacion(req.body)
    if (!result.success) return res.status(400).json({ error: JSON.parse(result.error.message) })

    try {
      const nueva = await InvitacionModel.create({ input: result.data, usuario_id: id, bypassLimit: true })
      res.status(201).json({
        message: 'Invitación creada con éxito',
        invitacion: nueva
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Error al crear la invitación como Admin' })
    }
  }

  static async update (req, res) {
    const { id } = req.params
    const usuario_id = req.user.id

    const result = validarInvitacion(req.body)
    if (!result.success) return res.status(400).json({ error: JSON.parse(result.error.message) })

    try {
      const actualizado = await InvitacionModel.update({ id, input: result.data, usuario_id })

      if (!actualizado) {
        return res.status(404).json({ error: 'Invitación no encontrada o no tienes permisos' })
      }

      res.json({ message: 'Invitación actualizada con éxito' })
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Error al actualizar la invitación' })
    }
  }
}

export default InvitacionController