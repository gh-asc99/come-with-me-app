import Suscripcion from './Suscripcion.js'
import CompraSuscripcion from './CompraSuscripcion.js'
import Usuario from './Usuario.js'
import crypto from 'node:crypto'

class SuscripcionModel {
  static async getByUsuario ({ usuario_id }) {
    const usuarioBuffer = Buffer.from(usuario_id.replace(/-/g, ''), 'hex')

    return await Suscripcion.findAll({
      where: { usuario_id: usuarioBuffer },
      include: [{
        model: CompraSuscripcion,
        as: 'pagos',
        attributes: ['id', 'fecha', 'precio_pagado']
      }],
      order: [['fecha_inicio', 'DESC']]
    })
  }

  static async procesarCompra ({ input, usuario_id }) {
    const usuarioBuffer = Buffer.from(usuario_id.replace(/-/g, ''), 'hex')

    const suscripcionIdStr = crypto.randomUUID()
    const suscripcionBuffer = Buffer.from(suscripcionIdStr.replace(/-/g, ''), 'hex')

    const compraIdStr = crypto.randomUUID()
    const compraBuffer = Buffer.from(compraIdStr.replace(/-/g, ''), 'hex')

    const nuevaSuscripcion = await Suscripcion.create({
      id: suscripcionBuffer,
      usuario_id: usuarioBuffer,
      tipo: input.tipo,
      precio: input.precio,
      fecha_inicio: input.fecha_inicio,
      fecha_fin: input.fecha_fin,
      estado: 'activa'
    })

    await CompraSuscripcion.create({
      id: compraBuffer,
      usuario_id: usuarioBuffer,
      suscripcion_id: suscripcionBuffer,
      precio_pagado: input.precio_pagado
    })

    await Usuario.update(
      { rol: 'subscriber' },
      { where: { id: usuarioBuffer } }
    )

    return nuevaSuscripcion
  }

  // --- NUEVO: Obtener todas las suscripciones (Para el panel Admin) ---
  static async getAllAdmin () {
    return await Suscripcion.findAll({
      include: [{
        model: Usuario,
        as: 'usuario', // Asegúrate de que esta asociación existe en tu associations.js
        attributes: ['id', 'nombre', 'correo', 'imagen']
      }],
      order: [['fecha_inicio', 'DESC']]
    })
  }

  // --- NUEVO: Cancelar una suscripción y quitar el rol VIP ---
  static async cancelarSuscripcion ({ id }) {
    const idBuffer = Buffer.from(id.replace(/-/g, ''), 'hex')

    // Buscamos la suscripción
    const suscripcion = await Suscripcion.findOne({ where: { id: idBuffer } })
    if (!suscripcion) return null
    // 1. Cambiamos el estado a cancelada
    await Suscripcion.update({ estado: 'cancelada' }, { where: { id: idBuffer } })
    // 2. Le quitamos los privilegios al usuario (lo devolvemos a 'user')
    await Usuario.update({ rol: 'user' }, { where: { id: suscripcion.usuario_id } })

    return true
  }
}

export default SuscripcionModel
