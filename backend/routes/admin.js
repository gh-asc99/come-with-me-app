import { Router } from 'express'
import AdminController from '../controllers/adminController.js'
import { authMiddleware } from '../middlewares/session.js'
import checkRole from '../middlewares/roles.js'

const router = Router()

router.get('/estadisticas', authMiddleware, checkRole(['admin']), AdminController.getEstadisticas)
router.get('/compras', authMiddleware, checkRole(['admin']), AdminController.getHistorialCompras)

export default router
