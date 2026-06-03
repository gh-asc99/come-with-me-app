import jwt from 'jsonwebtoken'

const authMiddleware = (req, res, next) => {
  try {
    const authorization = req.headers.authorization

    if (!authorization) {
      return res.status(401).json({ error: 'Token no proporcionado' })
    }

    const token = authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    req.user = decoded

    next()
  } catch (error) {
    console.error('Error de token:', error.message)
    return res.status(401).json({ error: 'Token inválido o expirado' })
  }
}

const checkRole = (rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.user || !rolesPermitidos.includes(req.user.rol)) {
      return res.status(403).json({ error: 'Acceso denegado: No tienes los permisos necesarios' })
    }
    next()
  }
}

export { authMiddleware, checkRole }
