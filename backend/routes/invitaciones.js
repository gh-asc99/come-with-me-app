import { Router } from 'express'
import InvitacionController from '../controllers/invitacionController.js'
import { authMiddleware } from '../middlewares/session.js'
import checkRole from '../middlewares/roles.js'

const router = Router()

router.get('/publica/:id', InvitacionController.getPublicById)

router.use(authMiddleware)
router.patch('/:id', InvitacionController.update)

router.get('/', InvitacionController.index)
router.post('/', InvitacionController.store)

router.get('/usuario/:id', checkRole(['admin']), InvitacionController.getByUsuarioAdmin)
router.post('/usuario/:id', checkRole(['admin']), InvitacionController.storeAdmin)

router.get('/:id', InvitacionController.getById)
router.delete('/:id', InvitacionController.delete)

export default router
