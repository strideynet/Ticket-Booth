module.exports = function (sequelize, DataTypes) {
  const Order = sequelize.define('order', {
    paypalPayment: {
      type: DataTypes.STRING,
      allowNull: false
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
    }
  })

  Order.associate = function (models) {
    Order.hasMany(models.Participant)
  }

  return Order
}
