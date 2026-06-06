import bcrypt from 'bcrypt'
import crypto from 'node:crypto'
import jwt from 'jsonwebtoken'
import UsuarioModel from '../models/mysql/usuarioModel.js'
import Usuario from '../models/mysql/Usuario.js'
import Suscripcion from '../models/mysql/Suscripcion.js'

import {
  validarRegistro,
  validarLogin,
  validarActualizacionPerfil,
  validarActualizacionAdmin,
  validarActualizacionRol
} from '../schemas/usuarioSchema.js'

class AuthController {
  static async getAllUsers (req, res) {
    try {
      const usuarios = await Usuario.findAll({
        attributes: { exclude: ['password_hash'] },
        include: [{
          model: Suscripcion,
          as: 'suscripciones',
          where: { estado: 'activa' },
          required: false
        }],
        order: [['fecha_registro', 'DESC']]
      })
      res.json(usuarios)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Error al obtener los usuarios' })
    }
  }

  static async register (req, res) {
    try {
      const result = validarRegistro(req.body)
      if (!result.success) return res.status(400).json({ error: result.error.format() })

      const { nombre, correo, password, fecha_nacimiento } = result.data

      const existe = await UsuarioModel.findByEmail({ correo })
      if (existe) return res.status(409).json({ error: 'El correo ya está registrado' })

      const password_hash = await bcrypt.hash(password, 10)
      const uuid = crypto.randomUUID()
      const hex = uuid.replace(/-/g, '')
      const idBuffer = Buffer.from(hex, 'hex')

      await UsuarioModel.create({ id: idBuffer, nombre, correo, password_hash, fecha_nacimiento })

      return res.status(201).json({ message: 'Usuario registrado correctamente' })
    } catch (error) {
      console.error('Error en register:', error)
      return res.status(500).json({ error: 'Error interno al registrar el usuario' })
    }
  }

  static async login (req, res) {
    try {
      const result = validarLogin(req.body)
      if (!result.success) return res.status(400).json({ error: result.error.format() })

      const { correo, password } = result.data
      const user = await UsuarioModel.findByEmail({ correo })

      if (!user) return res.status(401).json({ error: 'Usuario o contraseña incorrectos' })

      const isValid = await bcrypt.compare(password, user.password_hash)
      if (!isValid) return res.status(401).json({ error: 'Usuario o contraseña incorrectos' })

      const token = jwt.sign(
        { id: user.id, nombre: user.nombre, rol: user.rol },
        process.env.JWT_SECRET,
        { expiresIn: '8h' }
      )

      return res.json({
        message: 'Login exitoso',
        user: { id: user.id, nombre: user.nombre, correo: user.correo, rol: user.rol, fecha_nacimiento: user.fecha_nacimiento, imagen: user.imagen },
        token
      })
    } catch (error) {
      console.error('Error en login:', error)
      return res.status(500).json({ error: 'Error interno en el login' })
    }
  }

  static async update (req, res) {
    const { id } = req.params

    const result = validarActualizacionPerfil(req.body)
    if (!result.success) return res.status(400).json({ error: JSON.parse(result.error.message) })

    try {
      const usuarioActualizado = await UsuarioModel.update({ id, input: result.data })
      if (!usuarioActualizado) return res.status(404).json({ error: 'Usuario no encontrado' })
      res.json({ message: 'Perfil actualizado', usuario: usuarioActualizado })
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Error al actualizar el perfil' })
    }
  }

  static async updateRol (req, res) {
    const { id } = req.params
    const result = validarActualizacionRol(req.body)
    if (!result.success) return res.status(400).json({ error: JSON.parse(result.error.message) })

    try {
      const usuarioActualizado = await UsuarioModel.update({ id, input: result.data })
      if (!usuarioActualizado) return res.status(404).json({ error: 'Usuario no encontrado' })
      res.json({ message: 'Rol actualizado', usuario: usuarioActualizado })
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Error al actualizar el rol' })
    }
  }

  static async updateUsuario (req, res) {
    const { id } = req.params
    const result = validarActualizacionAdmin(req.body)
    if (!result.success) return res.status(400).json({ error: JSON.parse(result.error.message) })

    try {
      const usuarioActualizado = await UsuarioModel.update({ id, input: result.data })
      if (!usuarioActualizado) return res.status(404).json({ error: 'Usuario no encontrado' })
      res.json({ message: 'Perfil del usuario actualizado por Admin', usuario: usuarioActualizado })
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Error al actualizar el usuario' })
    }
  }

  static async deleteUsuario (req, res) {
    const { id } = req.params
    try {
      const borrado = await UsuarioModel.delete({ id })
      if (!borrado) return res.status(404).json({ error: 'Usuario no encontrado' })
      res.json({ message: 'Cuenta de usuario eliminada por Admin' })
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Error al eliminar la cuenta del usuario' })
    }
  }
}

export default AuthController
