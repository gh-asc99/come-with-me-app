import { Router } from 'express'
import { upload } from '../middlewares/multerConfig.js'
import { authMiddleware } from '../middlewares/session.js'

const router = Router()

router.post('/imagen', authMiddleware, upload.single('archivo'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se subió ningún archivo' })
    }

    // Cloudinary devuelve directamente la URL pública y segura en req.file.path
    const rutaImagen = req.file.path

    res.status(200).json({ url: rutaImagen })
  } catch (error) {
    console.error('Error al subir la imagen a Cloudinary:', error)
    res.status(500).json({ error: 'Error al procesar la imagen en la nube' })
  }
})

export default router
