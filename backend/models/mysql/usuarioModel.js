import Usuario from './Usuario.js'
import { Sequelize } from 'sequelize'

class UsuarioModel {
  static async create (data) {
    return await Usuario.create(data)
  }

  static async getAll () {
    return await Usuario.findAll({
      attributes: { exclude: ['password_hash'] }
    })
  }

  static async findByEmail ({ correo }) {
    return await Usuario.findOne({
      where: { correo }
    })
  }

  static async findById ({ id }) {
    return await Usuario.findOne({
      where: Sequelize.where(
        Sequelize.fn('UUID_TO_BIN', id),
        '=',
        Sequelize.col('id')
      )
    })
  }

  static async update ({ id, input }) {
    const idBuffer = Buffer.from(id.replace(/-/g, ''), 'hex')

    if (Object.keys(input).length > 0) {
      await Usuario.update(input, {
        where: { id: idBuffer }
      })
    }

    return await Usuario.findOne({
      where: { id: idBuffer },
      attributes: { exclude: ['password_hash'] }
    })
  }

  static async delete ({ id }) {
    const idBuffer = Buffer.from(id.replace(/-/g, ''), 'hex')
    const filasAfectadas = await Usuario.destroy({
      where: { id: idBuffer }
    })
    return filasAfectadas > 0
  }
}

export default UsuarioModel
