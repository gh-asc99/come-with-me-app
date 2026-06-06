import SuscripcionModel from '../models/mysql/suscripcionModel.js'
import { validarCompraSuscripcion } from '../schemas/suscripcionSchema.js'

class SuscripcionController {
  static async getMisSuscripciones (req, res) {
    try {
      const usuario_id = req.user.id
      const suscripciones = await SuscripcionModel.getByUsuario({ usuario_id })
      res.json(suscripciones)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Error al obtener las suscripciones' })
    }
  }

  static async store (req, res) {
    const result = validarCompraSuscripcion(req.body)
    if (!result.success) return res.status(400).json({ error: JSON.parse(result.error.message) })

    try {
      const usuario_id = req.user.id
      const nuevaSuscripcion = await SuscripcionModel.procesarCompra({ input: result.data, usuario_id })

      res.status(201).json({
        message: '¡Compra procesada con éxito! Ahora eres VIP.',
        suscripcion: nuevaSuscripcion
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Error interno al procesar la compra' })
    }
  }

  static async storeAdmin (req, res) {
    const { id } = req.params

    const result = validarCompraSuscripcion(req.body)
    if (!result.success) return res.status(400).json({ error: JSON.parse(result.error.message) })

    try {
      const nuevaSuscripcion = await SuscripcionModel.procesarCompra({ input: result.data, usuario_id: id })

      res.status(201).json({
        message: '¡Compra realizada con éxito!',
        suscripcion: nuevaSuscripcion
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Error interno al procesar la compra como Admin' })
    }
  }

  static async getByUsuarioAdmin (req, res) {
    try {
      const { id } = req.params

      const suscripciones = await SuscripcionModel.getByUsuario({ usuario_id: id })

      res.json(suscripciones)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Error al obtener las suscripciones del usuario' })
    }
  }

  static async getAll (req, res) {
    try {
      const suscripciones = await SuscripcionModel.getAllAdmin()
      res.json(suscripciones)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Error al obtener todas las suscripciones' })
    }
  }

  static async cancelarAdmin (req, res) {
    const { id } = req.params
    try {
      const cancelada = await SuscripcionModel.cancelarSuscripcion({ id })
      if (!cancelada) return res.status(404).json({ error: 'Suscripción no encontrada' })

      res.json({ message: 'Suscripción cancelada y privilegios revocados.' })
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Error al cancelar la suscripción' })
    }
  }
}

export default SuscripcionController
