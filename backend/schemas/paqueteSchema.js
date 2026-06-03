import z from 'zod'

const paqueteSchema = z.object({
  nombre: z.string({ required_error: 'El nombre es obligatorio' }),
  descripcion: z.string({ required_error: 'La descripción es obligatoria' }),
  precio: z.number({ required_error: 'El precio debe ser un número' }).positive(),
  imagen: z.string().min(1, { message: 'La imagen es obligatoria' }),
  bloqueado: z.boolean().optional(),
  evento_id: z.string().uuid({ message: 'El ID del evento no es válido' })
})

const validarPaquete = (input) => {
  return paqueteSchema.safeParse(input)
}

const validarPaqueteParcial = (input) => {
  return paqueteSchema.partial().safeParse(input)
}

export { validarPaquete, validarPaqueteParcial }
