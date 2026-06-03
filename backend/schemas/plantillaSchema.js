import z from 'zod'

const plantillaSchema = z.object({
  titulo: z.string({ required_error: 'El título es obligatorio' }),
  descripcion: z.string({ required_error: 'La descripción es obligatoria' }),
  imagen: z.string().url({ message: 'La imagen debe ser una URL válida' })
})

const validarPlantilla = (input) => plantillaSchema.safeParse(input)
const validarPlantillaParcial = (input) => plantillaSchema.partial().safeParse(input)

export { validarPlantilla, validarPlantillaParcial }
