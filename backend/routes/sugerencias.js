import { Router } from 'express'
import SugerenciaController from '../controllers/sugerenciaController.js'
import { authMiddleware } from '../middlewares/session.js'
import checkRole from '../middlewares/roles.js'

const router = Router()

router.get('/', SugerenciaController.getAll)
router.get('/:id', authMiddleware, SugerenciaController.getById)

router.post('/', authMiddleware, checkRole(['admin']), SugerenciaController.store)
router.patch('/:id', authMiddleware, checkRole(['admin']), SugerenciaController.update)
router.delete('/:id', authMiddleware, checkRole(['admin']), SugerenciaController.destroy)

export default router
