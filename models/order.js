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
    paypalPayment: {
      type: DataTypes.STRING,
      allowNull: true
    },
    value: {
      type: DataTypes.DECIMAL(8, 2), // 999999.99 Max value should be enough.
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
      defaultValue: () => {
        return [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('')
      }
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
    }
  })

  Order.associate = function (models) {
    Order.hasMany(models.Participant)
  }

  return Order
}
