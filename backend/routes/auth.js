import { Router } from 'express'
import AuthController from '../controllers/authController.js'

const router = Router()

router.post('/register', AuthController.register)
router.post('/login', AuthController.login)

router.get('/usuarios', AuthController.getAllUsers)
router.delete('/usuarios/:id', AuthController.deleteUsuario)

router.put('/usuarios/:id', AuthController.updateUsuario)
router.put('/perfil/:id', AuthController.update)
router.delete('/perfil/:id', AuthController.deleteUsuario)

export default router
