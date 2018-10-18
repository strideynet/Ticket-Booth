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
    }
  })

  return Participant
}
