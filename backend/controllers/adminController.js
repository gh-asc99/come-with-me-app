import Usuario from '../models/mysql/Usuario.js';
import Invitacion from '../models/mysql/invitacion.js';
import Suscripcion from '../models/mysql/Suscripcion.js';
import sequelize from '../models/mysql/index.js';

class AdminController {
  static async getEstadisticas(req, res) {
    try {
      // 1. KPIs Generales
      const totalUsuarios = await Usuario.count();
      const suscripcionesActivas = await Suscripcion.count({ where: { estado: 'activa' } });
      const totalInvitaciones = await Invitacion.count();

      // 2. Distribución de Roles (Pie Chart)
      const usuariosPorRol = await Usuario.findAll({
        attributes: [
          [sequelize.fn('COUNT', sequelize.col('id')), 'value'],
          ['rol', 'name']
        ],
        group: ['rol']
      });

      // 3. Uso de Eventos (Mucho más directo: Evento -> Paquete -> Invitacion)
      const usoEventosRaw = await sequelize.query(`
        SELECT e.nombre as nombre, COUNT(i.id) as cantidad
        FROM evento e
        LEFT JOIN paquete p ON e.id = p.evento_id
        LEFT JOIN invitacion i ON p.id = i.paquete_id
        GROUP BY e.id, e.nombre
      `, { type: sequelize.QueryTypes.SELECT });

      const usoEventos = usoEventosRaw.map(item => ({
        nombre: item.nombre,
        cantidad: Number(item.cantidad)
      }));

      // 4. Popularidad de Paquetes (Directo: Paquete -> Invitacion)
      const usoPaquetesRaw = await sequelize.query(`
        SELECT p.nombre as nombre, COUNT(i.id) as cantidad
        FROM paquete p
        LEFT JOIN invitacion i ON p.id = i.paquete_id
        GROUP BY p.id, p.nombre
        ORDER BY cantidad DESC
        LIMIT 5
      `, { type: sequelize.QueryTypes.SELECT });

      const usoPaquetes = usoPaquetesRaw.map(item => ({
        nombre: item.nombre,
        cantidad: Number(item.cantidad)
      }));

      // 5. Ingresos Totales (Sumando suscripciones, eventos y paquetes comprados)
      const ingresosSuscripciones = await sequelize.query('SELECT SUM(precio_pagado) as total FROM compra_suscripcion', { type: sequelize.QueryTypes.SELECT });
      const ingresosEventos = await sequelize.query('SELECT SUM(precio_pagado) as total FROM compra_evento', { type: sequelize.QueryTypes.SELECT });
      const ingresosPaquetes = await sequelize.query('SELECT SUM(precio_pagado) as total FROM compra_paquete', { type: sequelize.QueryTypes.SELECT });

      const totalIngresos = 
        (parseFloat(ingresosSuscripciones[0].total) || 0) + 
        (parseFloat(ingresosEventos[0].total) || 0) + 
        (parseFloat(ingresosPaquetes[0].total) || 0);

      res.json({
        kpis: {
          totalUsuarios,
          suscripcionesActivas,
          totalInvitaciones,
          totalIngresos: totalIngresos.toFixed(2),
          tasaConversion: totalUsuarios > 0 ? ((suscripcionesActivas / totalUsuarios) * 100).toFixed(1) : 0
        },
        usuariosPorRol: usuariosPorRol.map(r => ({
          name: r.getDataValue('name') === 'admin' ? 'Administradores' : r.getDataValue('name') === 'subscriber' ? 'Suscriptores VIP' : 'Usuarios Base',
          value: r.getDataValue('value'),
          color: r.getDataValue('name') === 'admin' ? '#94a3b8' : r.getDataValue('name') === 'subscriber' ? '#f472b6' : '#38bdf8'
        })),
        usoEventos,
        usoPaquetes
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al generar estadísticas' });
    }
  }

  // --- AÑADIR DENTRO DE AdminController ---
  static async getHistorialCompras(req, res) {
    try {
      const historialRaw = await sequelize.query(`
        SELECT 
          BIN_TO_UUID(ce.id) as id,
          'evento' as tipo,
          e.nombre as item_nombre,
          ce.precio_pagado,
          ce.fecha,
          BIN_TO_UUID(u.id) as usuario_id,
          u.nombre as usuario_nombre,
          u.correo as usuario_correo,
          u.imagen as usuario_imagen,
          u.rol as usuario_rol
        FROM compra_evento ce
        JOIN evento e ON ce.evento_id = e.id
        JOIN usuario u ON ce.usuario_id = u.id

        UNION ALL

        SELECT 
          BIN_TO_UUID(cp.id) as id,
          'paquete' as tipo,
          p.nombre as item_nombre,
          cp.precio_pagado,
          cp.fecha,
          BIN_TO_UUID(u.id) as usuario_id,
          u.nombre as usuario_nombre,
          u.correo as usuario_correo,
          u.imagen as usuario_imagen,
          u.rol as usuario_rol
        FROM compra_paquete cp
        JOIN paquete p ON cp.paquete_id = p.id
        JOIN usuario u ON cp.usuario_id = u.id

        UNION ALL

        SELECT 
          BIN_TO_UUID(cs.id) as id,
          'suscripcion' as tipo,
          s.tipo as item_nombre,
          cs.precio_pagado,
          cs.fecha,
          BIN_TO_UUID(u.id) as usuario_id,
          u.nombre as usuario_nombre,
          u.correo as usuario_correo,
          u.imagen as usuario_imagen,
          u.rol as usuario_rol
        FROM compra_suscripcion cs
        JOIN suscripcion s ON cs.suscripcion_id = s.id
        JOIN usuario u ON cs.usuario_id = u.id

        ORDER BY fecha DESC
      `, { type: sequelize.QueryTypes.SELECT });

      res.json(historialRaw);
    } catch (error) {
      console.error('Error al obtener historial de compras:', error);
      res.status(500).json({ error: 'Error al obtener el historial de transacciones' });
    }
  }
}

export default AdminController;