import { Router } from 'express'
import PaqueteController from '../controllers/paqueteController.js'
import { authMiddleware } from '../middlewares/session.js'
import checkRole from '../middlewares/roles.js'

const router = Router()

router.get('/', PaqueteController.index)
router.get('/evento/:evento_id', PaqueteController.getByEvento)
router.get('/:id', PaqueteController.getById)

router.post('/', authMiddleware, checkRole(['admin']), PaqueteController.store)

router.patch('/:id', authMiddleware, checkRole(['admin']), PaqueteController.update)

router.delete('/:id', authMiddleware, checkRole(['admin']), PaqueteController.destroy)

export default router
