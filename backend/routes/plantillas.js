import { Router } from 'express'
import PlantillaController from '../controllers/plantillaController.js'
import { authMiddleware } from '../middlewares/session.js'
import checkRole from '../middlewares/roles.js'

const router = Router()

router.get('/', PlantillaController.index)
router.get('/:id', PlantillaController.getById)

router.post('/', authMiddleware, checkRole(['admin']), PlantillaController.store)
router.patch('/:id', authMiddleware, checkRole(['admin']), PlantillaController.update)
router.delete('/:id', authMiddleware, checkRole(['admin']), PlantillaController.destroy)

router.post('/:id/vincular', authMiddleware, checkRole(['admin']), PlantillaController.vincular)

export default router
