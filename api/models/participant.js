module.exports = function (sequelize, DataTypes) {
  const Participant = sequelize.define('participant', {
    first: {
      type: DataTypes.STRING
    },
    last: {
      type: DataTypes.STRING
    },
    nick: {
      type: DataTypes.STRING
    },
    dob: {
      type: DataTypes.DATE
    },
    gender: {
      type: DataTypes.STRING,
      validate: {
        isIn: [['male', 'female', 'other']]
      }
    },
    type: {
      type: DataTypes.STRING,
      validate: {
        isIn: [['paying', 'trade', 'sponsor']]
      }
    },
    mobile: {
      type: DataTypes.STRING
    }
  })

  Participant.associate = function (models) {
    Participant.belongsTo(models.Order)
  }

  return Participant
}
