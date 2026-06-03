import { Router } from 'express'
import EventoController from '../controllers/eventoController.js'
import { authMiddleware } from '../middlewares/session.js'
import checkRole from '../middlewares/roles.js'

const eventosRouter = Router()

eventosRouter.get('/', EventoController.showAll)
eventosRouter.get('/:id', EventoController.showById)

eventosRouter.post('/', authMiddleware, checkRole(['admin']), EventoController.store)
eventosRouter.delete('/:id', authMiddleware, checkRole(['admin']), EventoController.destroy)
eventosRouter.patch('/:id', authMiddleware, checkRole(['admin']), EventoController.update)

export default eventosRouter
