import z from 'zod'

const invitadoSchema = z.object({
  invitacion_id: z.string().uuid({ message: 'ID de invitación inválido' }),
  nombre: z.string({ required_error: 'El nombre es obligatorio' }),
  correo: z.string().email({ message: 'Debe ser un correo válido' }).optional().nullable().or(z.literal('')),
  estado: z.enum(['pendiente', 'confirmado', 'rechazado']).default('pendiente')
})

const validarInvitado = (input) => invitadoSchema.safeParse(input)
const validarInvitadoParcial = (input) => invitadoSchema.partial().safeParse(input)

export { validarInvitado, validarInvitadoParcial }
