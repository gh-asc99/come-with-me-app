import { DataTypes, Sequelize } from 'sequelize'
import sequelize from './index.js'

const CompraEvento = sequelize.define('CompraEvento', {
  id: {
    type: 'BINARY(16)',
    primaryKey: true,
    allowNull: false, // <-- AÑADIDO
    defaultValue: Sequelize.literal('(UUID_TO_BIN(UUID()))'), // <-- AÑADIDO CON PARÉNTESIS EXTRA
    get () {
      const value = this.getDataValue('id')
      if (!value) return null
      return value.toString('hex').replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, '$1-$2-$3-$4-$5')
    }
  },
  fecha: { type: DataTypes.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
  precio_pagado: { type: DataTypes.DECIMAL(10, 2), allowNull: false }
}, { tableName: 'compra_evento', timestamps: false })

export default CompraEvento