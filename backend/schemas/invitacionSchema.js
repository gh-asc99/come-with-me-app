import z from 'zod'

const invitacionSchema = z.object({
  plantilla_id: z.string().uuid({ message: 'ID de plantilla inválido' }),
  titulo: z.string({ required_error: 'El título es obligatorio' }),
  mensaje: z.string().min(5, 'El mensaje es demasiado corto'),
  fecha_evento: z.string({ required_error: 'La fecha es obligatoria' }),
  hora_inicio: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/, 'Debe ser una hora válida (HH:MM)'),
  lugar: z.string({ required_error: 'El lugar es obligatorio' }),
  estado: z.enum(['borrador', 'publicada', 'enviada']).default('borrador'),
  datos_extra: z.unknown().optional().nullable(),
  paquete_id: z.string({ required_error: 'El paquete_id es obligatorio' }),
  imagen: z.string().optional().nullable().or(z.literal(''))
})

const validarInvitacion = (input) => invitacionSchema.safeParse(input)
const validarInvitacionParcial = (input) => invitacionSchema.partial().safeParse(input)

export { validarInvitacion, validarInvitacionParcial }
