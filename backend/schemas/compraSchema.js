import z from 'zod'

const compraEventoSchema = z.object({
  evento_id: z.string().uuid({ message: 'ID de evento inválido' }),
  precio_pagado: z.number().min(0, 'El precio no puede ser negativo')
})

const compraPaqueteSchema = z.object({
  paquete_id: z.string().uuid({ message: 'ID de paquete inválido' }),
  precio_pagado: z.number().min(0, 'El precio no puede ser negativo')
})

const validarCompraEvento = (input) => compraEventoSchema.safeParse(input)
const validarCompraPaquete = (input) => compraPaqueteSchema.safeParse(input)

export { validarCompraEvento, validarCompraPaquete }
