import Sugerencia from './Sugerencia.js'
import { Op, Sequelize } from 'sequelize'

class SugerenciaModel {
  static async getAll ({ evento_id, paquete_id }) {
    // Si el admin pide la ruta sin filtros, devuelve TODAS las sugerencias ordenadas por título
    if (!evento_id && !paquete_id) {
      return await Sugerencia.findAll({
        order: [['titulo_campo', 'ASC']]
      })
    }

    const orConditions = []

    // 1. Sugerencias GLOBALES
    orConditions.push({
      evento_id: { [Op.is]: null },
      paquete_id: { [Op.is]: null }
    })

    // 2. Por Evento
    if (evento_id) {
      const eventoBuffer = Buffer.from(evento_id.replace(/-/g, ''), 'hex');
      orConditions.push({
        evento_id: eventoBuffer,
        paquete_id: { [Op.is]: null }
      })
    }

    // 3. Por Paquete
    if (paquete_id) {
      const paqueteBuffer = Buffer.from(paquete_id.replace(/-/g, ''), 'hex');
      orConditions.push({
        paquete_id: paqueteBuffer
      })
    }

    return await Sugerencia.findAll({
      where: {
        [Op.or]: orConditions
      },
      order: [['titulo_campo', 'ASC']]
    })
  }

  static async getById ({ id }) {
    const idBuffer = Buffer.from(id.replace(/-/g, ''), 'hex')
    return await Sugerencia.findOne({ where: { id: idBuffer } })
  }

  static async create ({ input }) {
    const datos = { ...input }
    if (datos.evento_id) datos.evento_id = Sequelize.fn('UUID_TO_BIN', datos.evento_id)
    if (datos.paquete_id) datos.paquete_id = Sequelize.fn('UUID_TO_BIN', datos.paquete_id)

    return await Sugerencia.create(datos)
  }

  static async update ({ id, input }) {
    const idBuffer = Buffer.from(id.replace(/-/g, ''), 'hex')
    const datos = { ...input }

    if (datos.evento_id) datos.evento_id = Sequelize.fn('UUID_TO_BIN', datos.evento_id)
    else if (datos.evento_id === null) datos.evento_id = null

    if (datos.paquete_id) datos.paquete_id = Sequelize.fn('UUID_TO_BIN', datos.paquete_id)
    else if (datos.paquete_id === null) datos.paquete_id = null

    const [filasAfectadas] = await Sugerencia.update(datos, { where: { id: idBuffer } })
    if (filasAfectadas === 0) return null
    return await Sugerencia.findOne({ where: { id: idBuffer } })
  }

  static async delete ({ id }) {
    const idBuffer = Buffer.from(id.replace(/-/g, ''), 'hex')
    const filasAfectadas = await Sugerencia.destroy({ where: { id: idBuffer } })
    return filasAfectadas > 0
  }
}

export default SugerenciaModel
