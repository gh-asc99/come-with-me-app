import { Router } from 'express'
import InvitadoController from '../controllers/invitadoController.js'
import { authMiddleware } from '../middlewares/session.js'

const router = Router()

router.get('/publico/:id', InvitadoController.getByIdPublico)
router.patch('/publico/:id', InvitadoController.updateEstado)

router.use(authMiddleware)
router.post('/', InvitadoController.store)
router.get('/invitacion/:invitacion_id', InvitadoController.getByInvitacion)
router.delete('/:id', InvitadoController.delete)

export default router
