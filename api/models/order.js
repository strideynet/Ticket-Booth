module.exports = function (sequelize, DataTypes) {
  const Order = sequelize.define('order', {
    paypalPayment: {
      type: DataTypes.STRING
    },
    value: {
      type: DataTypes.DECIMAL(8, 2) // 999999.99 Max value should be enough.
    }
  })

  Order.associate = function (models) {
    Order.belongsTo(models['customer'].model)
  }

  return Order
}
