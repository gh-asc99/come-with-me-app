import { Router } from 'express'
import CompraController from '../controllers/compraController.js'
import { authMiddleware } from '../middlewares/session.js'
import checkRole from '../middlewares/roles.js'

const router = Router()

router.use(authMiddleware)

router.get('/mis-compras', CompraController.getMisCompras)
router.post('/evento', CompraController.comprarEvento)
router.post('/paquete', CompraController.comprarPaquete)

router.get('/:tipo/:id/resumen', CompraController.getResumenCompra)

router.get('/usuario/:id', checkRole(['admin']), CompraController.getByUsuarioAdmin)
router.post('/usuario/:id/evento', checkRole(['admin']), CompraController.comprarEventoAdmin)
router.post('/usuario/:id/paquete', checkRole(['admin']), CompraController.comprarPaqueteAdmin)

export default router
