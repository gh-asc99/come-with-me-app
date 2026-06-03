const checkRole = (rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(500).json({ error: 'Error de servidor: se requiere autenticación previa' })
    }

    const { rol } = req.user

    if (rolesPermitidos.includes(rol)) {
      next()
    } else {
      return res.status(403).json({ error: 'No tienes permisos para realizar esta acción' })
    }
  }
}

export default checkRole
