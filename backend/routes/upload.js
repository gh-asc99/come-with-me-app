import { Router } from 'express'
import { upload } from '../middlewares/multerConfig.js'
import { authMiddleware } from '../middlewares/session.js'

const router = Router()

router.post('/imagen', authMiddleware, upload.single('archivo'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se subió ningún archivo' })
    }

    const rutaImagen = `/uploads/${req.file.filename}`
    res.status(200).json({ url: rutaImagen })
  } catch (error) {
    res.status(500).json({ error: 'Error al procesar la imagen' })
  }
})

export default router
