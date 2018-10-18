const bcrypt = require('bcrypt')

module.exports = function (sequelize, DataTypes) {
  const User = sequelize.define('user', {
    username: {
      type: DataTypes.STRING
    },
    hash: {
      type: DataTypes.STRING
    }
  })

  User.prototype.comparePassword = function (attemptedPassword) {
    return bcrypt.compare(attemptedPassword, this.get('hash'))
  }

  /**
   * Sets users hash field to hash of supplied string.
   *
   * Returns promise that resolves when field is set.
   * @param newPassword
   * @returns {Promise<any>}
   */
  User.prototype.setPassword = function (newPassword) {
    return new Promise((resolve, reject) => {
      bcrypt.hash(newPassword, 10)
        .then((hash) => {
          this.setDataValue('hash', hash)

          resolve()
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  return User
}
