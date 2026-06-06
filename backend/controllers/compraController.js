import CompraModel from '../models/mysql/compraModel.js'
import { validarCompraEvento, validarCompraPaquete } from '../schemas/compraSchema.js'
import sequelize from '../models/mysql/index.js'

class CompraController {
  static async getResumenCompra (req, res) {
    const { tipo, id } = req.params
    const idBuffer = Buffer.from(id.replace(/-/g, ''), 'hex')

    try {
      if (tipo === 'paquete') {
        const [paquete] = await sequelize.query(
          'SELECT nombre, imagen, descripcion, precio FROM paquete WHERE id = ?',
          { replacements: [idBuffer], type: sequelize.QueryTypes.SELECT }
        )
        if (!paquete) return res.status(404).json({ error: 'Paquete no encontrado' })
        return res.json({ item: paquete, total: parseFloat(paquete.precio) })
      } else if (tipo === 'evento') {
        const [evento] = await sequelize.query(
          'SELECT nombre, imagen, descripcion FROM evento WHERE id = ?',
          { replacements: [idBuffer], type: sequelize.QueryTypes.SELECT }
        )
        if (!evento) return res.status(404).json({ error: 'Evento no encontrado' })

        const [suma] = await sequelize.query(
          'SELECT COALESCE(SUM(precio), 0) as total FROM paquete WHERE evento_id = ?',
          { replacements: [idBuffer], type: sequelize.QueryTypes.SELECT }
        )
        return res.json({ item: evento, total: parseFloat(suma.total) })
      }
      res.status(400).json({ error: 'Tipo inválido' })
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Error al obtener resumen' })
    }
  }

  static async getMisCompras (req, res) {
    const compras = await CompraModel.getMisCompras({ usuario_id: req.user.id })
    res.json(compras)
  }

  static async getByUsuarioAdmin (req, res) {
    try {
      const { id } = req.params
      const compras = await CompraModel.getMisCompras({ usuario_id: id })
      res.json(compras)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Error al obtener el historial de compras del usuario' })
    }
  }

  static async comprarEvento (req, res) {
    const result = validarCompraEvento(req.body)
    if (!result.success) return res.status(400).json({ error: JSON.parse(result.error.message) })

    try {
      const compra = await CompraModel.comprarEvento({ input: result.data, usuario_id: req.user.id })
      res.status(201).json({ message: 'Evento desbloqueado', compra })
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Error al procesar la compra del evento' })
    }
  }

  static async comprarPaquete (req, res) {
    const result = validarCompraPaquete(req.body)
    if (!result.success) return res.status(400).json({ error: JSON.parse(result.error.message) })

    try {
      const compra = await CompraModel.comprarPaquete({ input: result.data, usuario_id: req.user.id })
      res.status(201).json({ message: 'Paquete desbloqueado', compra })
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Error al procesar la compra del paquete' })
    }
  }

  static async comprarEventoAdmin (req, res) {
    const { id } = req.params
    const result = validarCompraEvento(req.body)
    if (!result.success) return res.status(400).json({ error: JSON.parse(result.error.message) })

    try {
      const compra = await CompraModel.comprarEvento({ input: result.data, usuario_id: id })
      res.status(201).json({ message: 'Evento desbloqueado con éxito.', compra })
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Error al procesar la compra del evento como Admin' })
    }
  }

  static async comprarPaqueteAdmin (req, res) {
    const { id } = req.params
    const result = validarCompraPaquete(req.body)
    if (!result.success) return res.status(400).json({ error: JSON.parse(result.error.message) })

    try {
      const compra = await CompraModel.comprarPaquete({ input: result.data, usuario_id: id })
      res.status(201).json({ message: 'Paquete desbloqueado con éxito.', compra })
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Error al procesar la compra del paquete como Admin' })
    }
  }
}

export default CompraController
