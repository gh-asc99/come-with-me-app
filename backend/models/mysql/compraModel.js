// src/models/mysql/compraModel.js
import CompraEvento from './CompraEvento.js'
import CompraPaquete from './CompraPaquete.js'
import crypto from 'node:crypto'
import sequelize from './index.js'

class CompraModel {
  static async getMisCompras ({ usuario_id }) {
    const idBuffer = Buffer.from(usuario_id.replace(/-/g, ''), 'hex')

    // Hago JOIN con las tablas evento y paquete para obtener el nombre y la imagen
    // y reincorporo evento_id y paquete_id para que el frontend pueda desbloquearlos
    const [evts, paqs] = await Promise.all([
      sequelize.query(`
        SELECT 
          BIN_TO_UUID(ce.id) as id,
          BIN_TO_UUID(ce.evento_id) as evento_id,
          'evento' as tipo,
          e.nombre as item_nombre,
          e.imagen as imagen,
          ce.fecha,
          ce.precio_pagado
        FROM compra_evento ce
        INNER JOIN evento e ON ce.evento_id = e.id
        WHERE ce.usuario_id = ?
      `, { replacements: [idBuffer], type: sequelize.QueryTypes.SELECT }),

      sequelize.query(`
        SELECT 
          BIN_TO_UUID(cp.id) as id,
          BIN_TO_UUID(cp.paquete_id) as paquete_id,
          'paquete' as tipo,
          p.nombre as item_nombre,
          p.imagen as imagen,
          cp.fecha,
          cp.precio_pagado
        FROM compra_paquete cp
        INNER JOIN paquete p ON cp.paquete_id = p.id
        WHERE cp.usuario_id = ?
      `, { replacements: [idBuffer], type: sequelize.QueryTypes.SELECT })
    ])

    // Unimos ambos arrays y los ordenamos de más reciente a más antiguo
    const compras = [...evts, ...paqs].sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
    return compras
  }

  static async comprarEvento ({ input, usuario_id }) {
    const idBuffer = Buffer.from(crypto.randomUUID().replace(/-/g, ''), 'hex')
    const usuarioBuffer = Buffer.from(usuario_id.replace(/-/g, ''), 'hex')
    const eventoBuffer = Buffer.from(input.evento_id.replace(/-/g, ''), 'hex')

    return await CompraEvento.create({
      id: idBuffer,
      usuario_id: usuarioBuffer,
      evento_id: eventoBuffer,
      precio_pagado: input.precio_pagado
    })
  }

  static async comprarPaquete ({ input, usuario_id }) {
    const idBuffer = Buffer.from(crypto.randomUUID().replace(/-/g, ''), 'hex')
    const usuarioBuffer = Buffer.from(usuario_id.replace(/-/g, ''), 'hex')
    const paqueteBuffer = Buffer.from(input.paquete_id.replace(/-/g, ''), 'hex')

    return await CompraPaquete.create({
      id: idBuffer,
      usuario_id: usuarioBuffer,
      paquete_id: paqueteBuffer,
      precio_pagado: input.precio_pagado
    })
  }
}

export default CompraModel
