import PaqueteModel from '../models/mysql/paqueteModel.js'
import { validarPaquete, validarPaqueteParcial } from '../schemas/paqueteSchema.js'

class PaqueteController {
  static async index (req, res) {
    const { evento_id } = req.query
    const paquetes = await PaqueteModel.getAll({ evento_id })
    res.json(paquetes)
  }

  static async getById (req, res) {
    const { id } = req.params
    try {
      const paquete = await PaqueteModel.getById({ id })
      if (!paquete) return res.status(404).json({ error: 'Paquete no encontrado' })
      res.json(paquete)
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el paquete' })
    }
  }

  static async getByEvento (req, res) {
    const { evento_id } = req.params
    try {
      const paquetes = await PaqueteModel.getByEvento({ evento_id })
      res.json(paquetes)
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los paquetes del evento' })
    }
  }

  static async store (req, res) {
    const result = validarPaquete(req.body)

    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    try {
      const nuevoPaquete = await PaqueteModel.create({ input: result.data })
      res.status(201).json(nuevoPaquete)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Error al crear el paquete' })
    }
  }

  static async update (req, res) {
    const result = validarPaqueteParcial(req.body)
    const { id } = req.params

    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const updated = await PaqueteModel.update({ id, input: result.data })

    if (updated) {
      return res.json({ message: 'Paquete actualizado' })
    }
    res.status(404).json({ message: 'Paquete no encontrado' })
  }

  static async destroy (req, res) {
    const { id } = req.params
    const deleted = await PaqueteModel.delete({ id })

    if (deleted) {
      return res.json({ message: 'Paquete eliminado' })
    }
    res.status(404).json({ message: 'Paquete no encontrado' })
  }
}

export default PaqueteController
