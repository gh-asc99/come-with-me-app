import SugerenciaModel from '../models/mysql/sugerenciaModel.js'
import { validarSugerencia, validarSugerenciaParcial } from '../schemas/sugerenciaSchema.js'

class SugerenciaController {
  static async getAll (req, res) {
    const { evento_id, paquete_id } = req.query

    try {
      const sugerencias = await SugerenciaModel.getAll({ evento_id, paquete_id })
      res.json(sugerencias)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Error al obtener las sugerencias' })
    }
  }

  static async getById (req, res) {
    const { id } = req.params
    const sugerencia = await SugerenciaModel.getById({ id })
    if (!sugerencia) return res.status(404).json({ error: 'Sugerencia no encontrada' })
    res.json(sugerencia)
  }

  static async store (req, res) {
    const result = validarSugerencia(req.body)
    if (!result.success) return res.status(400).json({ error: JSON.parse(result.error.message) })

    try {
      const nueva = await SugerenciaModel.create({ input: result.data })
      res.status(201).json(nueva)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Error al crear la sugerencia' })
    }
  }

  static async update (req, res) {
    const result = validarSugerenciaParcial(req.body)
    if (!result.success) return res.status(400).json({ error: JSON.parse(result.error.message) })

    try {
      const actualizada = await SugerenciaModel.update({ id: req.params.id, input: result.data })
      if (!actualizada) return res.status(404).json({ error: 'Sugerencia no encontrada' })
      res.json({ message: 'Sugerencia actualizada', sugerencia: actualizada })
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar la sugerencia' })
    }
  }

  static async destroy (req, res) {
    try {
      const borrado = await SugerenciaModel.delete({ id: req.params.id })
      if (!borrado) return res.status(404).json({ error: 'Sugerencia no encontrada' })
      res.json({ message: 'Sugerencia eliminada correctamente' })
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar la sugerencia' })
    }
  }
}

export default SugerenciaController
