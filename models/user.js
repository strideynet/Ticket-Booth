const crypto = require('crypto')
const bcrypt = require('bcrypt')

module.exports = function (sequelize, DataTypes) {
  const User = sequelize.define('user', {
    hash: {
      type: DataTypes.STRING
    },
    id: {
      defaultValue: () => crypto.randomBytes(16).toString('hex'),
      primaryKey: true,
      type: DataTypes.STRING
    },
    username: {
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
