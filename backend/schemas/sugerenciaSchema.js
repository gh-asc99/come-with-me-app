import z from 'zod'

const sugerenciaSchema = z.object({
  titulo_campo: z.string({ required_error: 'El título del campo es obligatorio' }),
  descripcion_sugerida: z.string().optional().nullable(),
  tipo_campo: z.enum(['texto', 'textarea', 'url', 'fecha', 'numero', 'boolean', 'timeline', 'listado']).default('texto'),
  obligatorio: z.boolean().or(z.number()).transform(val => Boolean(val)).default(false),
  evento_id: z.string().uuid().optional().nullable(),
  paquete_id: z.string().uuid().optional().nullable()
})

const validarSugerencia = (input) => sugerenciaSchema.safeParse(input)
const validarSugerenciaParcial = (input) => sugerenciaSchema.partial().safeParse(input)

export { validarSugerencia, validarSugerenciaParcial }