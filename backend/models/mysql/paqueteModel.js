import Paquete from './Paquete.js'
import { Sequelize } from 'sequelize'

const bufferToUuid = (buffer) => {
  if (!buffer) return null
  if (typeof buffer === 'string') return buffer

  const hex = buffer.toString('hex')
  if (hex.length !== 32) return buffer

  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}

const formatPaquete = (paquete) => {
  if (!paquete) return null
  const item = paquete.toJSON ? paquete.toJSON() : paquete

  item.id = bufferToUuid(item.id)
  item.evento_id = bufferToUuid(item.evento_id)

  if (item.evento && item.evento.id) {
    item.evento.id = bufferToUuid(item.evento.id)
  }

  return item
}

class PaqueteModel {
  static async getAll ({ evento_id }) {
    const options = {
      include: 'evento'
    }

    if (evento_id) {
      options.where = {
        evento_id: Sequelize.fn('UUID_TO_BIN', evento_id)
      }
    }

    const paquetes = await Paquete.findAll(options)
    // 🪄 Pasamos todos los resultados por nuestra función traductora
    return paquetes.map(formatPaquete)
  }

  static async getById ({ id }) {
    const idBuffer = Buffer.from(id.replace(/-/g, ''), 'hex')
    const paquete = await Paquete.findOne({
      where: { id: idBuffer },
      include: ['evento']
    })
    return formatPaquete(paquete)
  }

  static async getByEvento ({ evento_id }) {
    const eventoBuffer = Buffer.from(evento_id.replace(/-/g, ''), 'hex')
    const paquetes = await Paquete.findAll({
      where: { evento_id: eventoBuffer }
    })
    return paquetes.map(formatPaquete)
  }

  static async create ({ input }) {
    const nuevoPaquete = await Paquete.create({
      ...input,
      evento_id: Sequelize.fn('UUID_TO_BIN', input.evento_id)
    })
    return formatPaquete(nuevoPaquete)
  }

  static async delete ({ id }) {
    const paquete = await Paquete.findOne({
      where: Sequelize.where(
        Sequelize.fn('UUID_TO_BIN', id),
        '=',
        Sequelize.col('id')
      )
    })

    if (!paquete) return false

    await paquete.destroy()
    return true
  }

  static async update ({ id, input }) {
    const paquete = await Paquete.findOne({
      where: Sequelize.where(
        Sequelize.fn('UUID_TO_BIN', id),
        '=',
        Sequelize.col('id')
      )
    })

    if (!paquete) return false

    if (input.evento_id) {
      const hex = input.evento_id.replace(/-/g, '')
      input.evento_id = Buffer.from(hex, 'hex')
    }

    await paquete.update(input)
    return true
  }
}

export default PaqueteModel
