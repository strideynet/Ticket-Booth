const crypto = require('crypto')

module.exports = function (sequelize, DataTypes) {
  const Participant = sequelize.define('participant', {
    id: {
      defaultValue: () => crypto.randomBytes(16).toString('hex'),
      primaryKey: true,
      type: DataTypes.STRING
    },
    first: {
      type: DataTypes.STRING,
      allowNull: false
    },
    last: {
      type: DataTypes.STRING,
      allowNull: false
    },
    nick: {
      type: DataTypes.STRING,
      allowNull: false
    },
    dob: {
      type: DataTypes.DATE,
      allowNull: false
    },
    gender: {
      type: DataTypes.STRING,
      validate: {
        isIn: [['male', 'female', 'other']]
      },
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      validate: {
        isIn: [['PAYING', 'TRADE', 'SPONSOR']]
      },
      defaultValue: 'PAYING',
      allowNull: false
    },
    mobile: {
      type: DataTypes.STRING,
      allowNull: true
    },
    plateNumber: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    bedAndBreakfast: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  })

  Participant.associate = function (models) {
    Participant.belongsTo(models.Order)
  }

  return Participant
}
