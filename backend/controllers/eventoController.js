import { validarEvento, validarEventoParcialmente } from '../schemas/eventoSchema.js'
import EventoModel from '../models/mysql/eventoModel.js'

class EventoController {
  static async showAll (req, res) {
    const { nombre } = req.query

    const eventos = await EventoModel.getAllEvents({ nombre })
    if (eventos.length > 0) res.json(eventos)
  }

  static async showById (req, res) {
    const { id } = req.params

    const evento = await EventoModel.getEventById({ id })
    if (evento) return res.json(evento)
  }

  static async store (req, res) {
    const resultado = validarEvento(req.body)

    if (resultado.error) {
      return res.status(400).json({ error: resultado.error.message })
    }

    const success = await EventoModel.saveEvent({ input: resultado.data })

    if (success) {
      console.log('Evento insertado correctamente')
      return res.status(201).json({ message: 'Evento creado correctamente' })
    } else {
      console.log('Error al insertar el evento')
      return res.status(500).json({ error: 'No se pudo crear el evento' })
    }
  }

  static async destroy (req, res) {
    const { id } = req.params

    const success = await EventoModel.removeEventById({ id })

    if (success) {
      console.log('Evento eliminado correctamente')
      return res.status(200).json({ message: 'Evento eliminado correctamente' })
    } else {
      console.log('Error al eliminar el evento')
      return res.status(500).json({ error: 'No se pudo eliminar el evento' })
    }
  }

  static async update (req, res) {
    const resultado = validarEventoParcialmente(req.body)

    if (resultado.error) {
      return res.status(400).json({ error: JSON.parse(resultado.error.message) })
    }

    const { id } = req.params
    const eventoActualizado = await EventoModel.updateEventById({ id, input: resultado.data })

    if (eventoActualizado) {
      console.log('Evento actualizado correctamente')
      return res.status(200).json({ message: 'Evento actualizado correctamente' })
    } else {
      console.log('Error al actualizar el evento')
      return res.status(500).json({ error: 'No se pudo actualizar el evento' })
    }
  }
}

export default EventoController
