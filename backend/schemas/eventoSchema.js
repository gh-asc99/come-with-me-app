import zod from 'zod'

const eventoSchema = zod.object({
  nombre: zod.string({
    invalid_type_error: 'El nombre del evento debe ser un texto.'
  }),
  descripcion: zod.string({
    invalid_type_error: 'La descripcion del evento debe ser un texto.'
  }),
  bloqueado: zod.boolean().optional(),
  imagen: zod.string().min(1, { message: 'La imagen es obligatoria' })
})

const validarEvento = (objeto) => {
  return eventoSchema.safeParse(objeto)
}

const validarEventoParcialmente = (objeto) => {
  return eventoSchema.partial().safeParse(objeto)
}

export {
  validarEvento,
  validarEventoParcialmente
}
