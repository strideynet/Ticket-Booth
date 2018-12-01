module.exports = function (sequelize, DataTypes) {
  const Participant = sequelize.define('participant', {
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
        isIn: [['paying', 'trade', 'sponsor']]
      },
      defaultValue: 'paying',
      allowNull: false
    },
    mobile: {
      type: DataTypes.STRING,
      allowNull: true
    }
  })

  Participant.associate = function (models) {
    Participant.belongsTo(models.Order)
  }

  return Participant
}
