// src/schemas/usuarioSchema.js
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


// 1. ESQUEMA PARA EL USUARIO NORMAL (Su propio perfil)
// IMPORTANTE: Aquí NO ponemos el 'rol' para evitar escalada de privilegios
const actualizacionBasicaSchema = z.object({
  nombre: z.string().min(2).optional(),
  correo: z.string().email().optional(),
  fecha_nacimiento: z.string().optional(),
  // ¡AQUÍ ESTÁ LA MAGIA! Quitamos la restricción .url() 
  // para que acepte rutas locales como "/avatar/perfil_1.png"
  imagen: z.string().optional()
})

// 2. ESQUEMA PARA EL ADMIN (Modal del panel de control)
// Aquí sí permitimos editar nombre, correo y ROL
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


// --- FUNCIONES VALIDADORAS EXPORTADAS ---
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