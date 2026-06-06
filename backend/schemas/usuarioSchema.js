import z from 'zod'

const validarRegistro = (input) =>
  z.object({
    nombre: z.string().min(2),
    correo: z.string().email(),
    password: z.string().min(6),
    fecha_nacimiento: z.string()
  }).safeParse(input)

const validarLogin = (input) =>
  z.object({
    correo: z.string().email({ message: 'Email inválido' }),
    password: z.string().min(1, { message: 'La contraseña es obligatoria' })
  }).safeParse(input)

const actualizacionBasicaSchema = z.object({
  nombre: z.string().min(2).optional(),
  correo: z.string().email().optional(),
  fecha_nacimiento: z.string().optional(),
  imagen: z.string().optional()
})

const actualizacionAdminSchema = z.object({
  nombre: z.string().min(2).optional(),
  correo: z.string().email().optional(),
  rol: z.enum(['admin', 'user', 'subscriber']).optional()
})

const actualizacionRolSchema = z.object({
  rol: z.enum(['admin', 'user', 'subscriber'], {
    required_error: 'El rol es obligatorio y debe ser válido'
  })
})

const validarActualizacionPerfil = (input) => actualizacionBasicaSchema.safeParse(input)
const validarActualizacionAdmin = (input) => actualizacionAdminSchema.safeParse(input)
const validarActualizacionRol = (input) => actualizacionRolSchema.safeParse(input)

export {
  validarRegistro,
  validarLogin,
  validarActualizacionPerfil,
  validarActualizacionAdmin,
  validarActualizacionRol
}
