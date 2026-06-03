import { Router } from 'express'
import AuthController from '../controllers/authController.js'

const router = Router()

router.post('/register', AuthController.register)
router.post('/login', AuthController.login)

router.get('/usuarios', AuthController.getAllUsers)
router.delete('/usuarios/:id', AuthController.deleteUsuario)

// Ruta para el ADMINISTRADOR (Usa el esquema Admin)
router.put('/usuarios/:id', AuthController.updateUsuario)

// NUEVA: Ruta para el PROPIO USUARIO (Usa el esquema Perfil con Imagen)
router.put('/perfil/:id', AuthController.update)

// NUEVA: Ruta para que el usuario borre su propia cuenta
router.delete('/perfil/:id', AuthController.deleteUsuario)

export default router
