import Evento from './Evento.js'
import { Op, Sequelize } from 'sequelize'

class EventoModel {
  static async getAllEvents ({ nombre }) {
    const where = {}

    if (nombre) {
      where.nombre = { [Op.like]: `%${nombre}%` }
    }

    return await Evento.findAll({ where })
  }

  static async getEventById ({ id }) {
    return await Evento.findOne({
      where: Sequelize.where(
        Sequelize.fn('UUID_TO_BIN', id),
        '=',
        Sequelize.col('id')
      )
    })
  }

  static async saveEvent ({ input }) {
    return await Evento.create(input)
  }

  static async removeEventById ({ id }) {
    const evento = await Evento.findOne({
      where: Sequelize.where(
        Sequelize.fn('UUID_TO_BIN', id),
        '=',
        Sequelize.col('id')
      )
    })

    if (!evento) return null

    await evento.destroy()
    return true
  }

  static async updateEventById ({ id, input }) {
    const evento = await Evento.findOne({
      where: Sequelize.where(
        Sequelize.fn('UUID_TO_BIN', id),
        '=',
        Sequelize.col('id')
      )
    })

    if (!evento) return null

    await evento.update(input)
    return true
  }
}

export default EventoModel
