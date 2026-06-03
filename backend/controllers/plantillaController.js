import PlantillaModel from '../models/mysql/plantillaModel.js'
import { validarPlantilla, validarPlantillaParcial } from '../schemas/plantillaSchema.js'

class PlantillaController {
  static async index (req, res) {
    const plantillas = await PlantillaModel.getAll()
    res.json(plantillas)
  }

  static async getById (req, res) {
    const { id } = req.params
    const plantilla = await PlantillaModel.getById({ id })
    if (!plantilla) return res.status(404).json({ error: 'Plantilla no encontrada' })
    res.json(plantilla)
  }

  static async store (req, res) {
    const result = validarPlantilla(req.body)
    if (!result.success) return res.status(400).json({ error: JSON.parse(result.error.message) })

    try {
      const nuevaPlantilla = await PlantillaModel.create({ input: result.data })
      res.status(201).json(nuevaPlantilla)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Error al crear la plantilla' })
    }
  }

  static async update (req, res) {
    const result = validarPlantillaParcial(req.body) // Usamos la validación parcial
    if (!result.success) return res.status(400).json({ error: JSON.parse(result.error.message) })

    try {
      const { id } = req.params
      const actualizada = await PlantillaModel.update({ id, input: result.data })

      if (!actualizada) return res.status(404).json({ error: 'Plantilla no encontrada' })
      res.json({ message: 'Plantilla actualizada', plantilla: actualizada })
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Error al actualizar la plantilla' })
    }
  }

  static async destroy (req, res) {
    try {
      const { id } = req.params
      const borrado = await PlantillaModel.delete({ id })

      if (!borrado) return res.status(404).json({ error: 'Plantilla no encontrada' })
      res.json({ message: 'Plantilla eliminada correctamente' })
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Error al eliminar la plantilla' })
    }
  }

  static async vincular (req, res) {
    const { id } = req.params
    const { paquete_id } = req.body

    if (!paquete_id) {
      return res.status(400).json({ error: 'Debes proporcionar un paquete_id' })
    }

    try {
      const vinculado = await PlantillaModel.vincularPaquete({ plantilla_id: id, paquete_id })
      if (vinculado) {
        return res.status(201).json({ message: 'Plantilla vinculada al paquete correctamente' })
      } else {
        return res.status(409).json({ message: 'La plantilla ya estaba vinculada a este paquete' })
      }
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'Error al vincular la plantilla' })
    }
  }
}

export default PlantillaController
