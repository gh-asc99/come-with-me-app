import { DataTypes, Sequelize } from 'sequelize'
import sequelize from './index.js'

const CompraPaquete = sequelize.define('CompraPaquete', {
  id: {
    type: DataTypes.BLOB('tiny'),
    primaryKey: true,
    get () {
      const value = this.getDataValue('id')
      if (!value) return null
      return value.toString('hex').replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, '$1-$2-$3-$4-$5')
    }
  },
  fecha: { type: DataTypes.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
  precio_pagado: { type: DataTypes.DECIMAL(10, 2), allowNull: false }
}, { tableName: 'compra_paquete', timestamps: false })

export default CompraPaquete
