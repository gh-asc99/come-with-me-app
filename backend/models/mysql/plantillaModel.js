import Plantilla from './Plantilla.js'
import Paquete from './Paquete.js'
import PlantillaPaquete from './PlantillaPaquete.js'
import { Sequelize } from 'sequelize'
import crypto from 'node:crypto'

class PlantillaModel {
  static async getAll () {
    return await Plantilla.findAll({ include: 'paquetes' })
  }

  static async getById ({ id }) {
    const idBuffer = Buffer.from(id.replace(/-/g, ''), 'hex')
    return await Plantilla.findOne({ where: { id: idBuffer } })
  }

  static async create ({ input }) {
    const nuevoIdStr = crypto.randomUUID()
    const plantillaBuffer = Buffer.from(nuevoIdStr.replace(/-/g, ''), 'hex')

    const nuevaPlantilla = await Plantilla.create({
      id: plantillaBuffer,
      ...input
    })

    const paquetes = await Paquete.findAll({ attributes: ['id'] })

    if (paquetes.length > 0) {
      const vinculos = paquetes.map(paquete => ({
        plantilla_id: plantillaBuffer,
        paquete_id: paquete.getDataValue('id')
      }))

      await PlantillaPaquete.bulkCreate(vinculos)
    }

    return nuevaPlantilla
  }

  static async delete ({ id }) {
    const plantilla = await Plantilla.findOne({
      where: Sequelize.where(Sequelize.fn('UUID_TO_BIN', id), '=', Sequelize.col('id'))
    })
    if (!plantilla) return false

    await plantilla.destroy()
    return true
  }

  static async update ({ id, input }) {
    const idBuffer = Buffer.from(id.replace(/-/g, ''), 'hex')

    const [filasAfectadas] = await Plantilla.update(input, {
      where: { id: idBuffer }
    })

    if (filasAfectadas === 0) return null
    return await Plantilla.findOne({ where: { id: idBuffer } })
  }

  static async vincularPaquete ({ plantilla_id, paquete_id }) {
    const plantillaBuffer = Buffer.from(plantilla_id.replace(/-/g, ''), 'hex')
    const paqueteBuffer = Buffer.from(paquete_id.replace(/-/g, ''), 'hex')

    const existe = await PlantillaPaquete.findOne({
      where: { plantilla_id: plantillaBuffer, paquete_id: paqueteBuffer }
    })

    if (existe) return false

    await PlantillaPaquete.create({
      plantilla_id: plantillaBuffer,
      paquete_id: paqueteBuffer
    })

    return true
  }
}

export default PlantillaModel
