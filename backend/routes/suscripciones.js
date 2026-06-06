import { Router } from 'express'
import SuscripcionController from '../controllers/suscripcionController.js'
import { authMiddleware } from '../middlewares/session.js'
import checkRole from '../middlewares/roles.js'

const router = Router()

router.use(authMiddleware)

router.get('/mis-suscripciones', SuscripcionController.getMisSuscripciones)
router.post('/comprar', SuscripcionController.store)

router.get('/', checkRole(['admin']), SuscripcionController.getAll)
router.put('/:id/cancelar', checkRole(['admin']), SuscripcionController.cancelarAdmin)
router.get('/usuario/:id', checkRole(['admin']), SuscripcionController.getByUsuarioAdmin)
router.post('/usuario/:id/comprar', checkRole(['admin']), SuscripcionController.storeAdmin)

export default router
