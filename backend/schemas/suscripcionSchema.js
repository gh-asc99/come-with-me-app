import z from 'zod'

const suscripcionSchema = z.object({
  tipo: z.enum(['mensual_1', 'mensual_3', 'mensual_6', 'anual', 'ilimitada'], {
    required_error: 'El tipo de suscripción es obligatorio'
  }),
  precio: z.number().min(0, 'El precio base no puede ser negativo'),
  fecha_inicio: z.string({ required_error: 'La fecha de inicio es obligatoria' }),
  fecha_fin: z.string().optional().nullable(),
  precio_pagado: z.number().min(0, 'El precio pagado no puede ser negativo')
})

const validarCompraSuscripcion = (input) => suscripcionSchema.safeParse(input)

export { validarCompraSuscripcion }
