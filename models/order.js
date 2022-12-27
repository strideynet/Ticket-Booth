const crypto = require('crypto')

const statuses = [
  'PENDING', // Can be used for manual orders, pending payment
  'CONFIRMED', // Successful purchases, tickets are valid
  'CANCELLED' // Cancelled order, tickets are invalidated
]

const types = [
  'PORTAL_PURCHASE', // Tickets purchased via website
  'MANUAL_PURCHASE' // Orders added for purchases made elsewhere
]

module.exports = function (sequelize, DataTypes) {
  const Order = sequelize.define('order', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: () => crypto.randomBytes(16).toString('hex')
    },
    paypalPayment: {
      type: DataTypes.STRING,
      allowNull: true
    },
    value: {
      type: DataTypes.DECIMAL(8, 2), // 999999.99 Max value should be enough
      allowNull: false
    },
    yearsAtTheBash: {
      type: DataTypes.TINYINT,
      defaultValue: -1
    },
    partyName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    secret: {
      type: DataTypes.STRING,
      defaultValue: () => crypto.randomBytes(16).toString('hex')
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    note: {
      type: DataTypes.TEXT('medium'),
      allowNull: true
    },
    registrationPlates: {
      type: DataTypes.JSON,
      allowNull: false
    },
    paypalTransactionId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    shippingAddress: {
      type: DataTypes.TEXT,
      allowNull: true
    },
  })

  Order.associate = function (models) {
    Order.hasMany(models.participant)
  }

  return Order
}
