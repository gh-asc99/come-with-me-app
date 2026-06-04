// import multer from 'multer'
// import path from 'path'
// import fs from 'fs'

// const uploadDir = 'uploads/'
// // Verificamos que la carpeta exista, si no, la creamos
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir)
// }

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, uploadDir)
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//     cb(null, uniqueSuffix + path.extname(file.originalname))
//   }
// })

// const fileFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith('image/')) {
//     cb(null, true)
//   } else {
//     cb(new Error('El archivo no es una imagen válida'), false)
//   }
// }

// export const upload = multer({
//   storage: storage,
//   fileFilter: fileFilter,
//   limits: { fileSize: 15 * 1024 * 1024 }
// })

import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'

// 1. Configuración de conexión con Cloudinary usando variables de entorno
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

// 2. Configurar el motor de almacenamiento de Multer hacia Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'come-with-me-uploads', // Crea esta carpeta automáticamente en tu cuenta de Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
    // Opcional: Si quieres que las imágenes muy grandes se reduzcan automáticamente para ahorrar datos
    transformation: [{ width: 1200, crop: 'limit' }] 
  }
})

// 3. Mantenemos tu filtro de seguridad intacto
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true)
  } else {
    cb(new Error('El archivo no es una imagen válida'), false)
  }
}

// 4. Exportamos el middleware configurado con tus límites de 15MB
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 15 * 1024 * 1024 }
})