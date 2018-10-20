const jwtLib = require('jsonwebtoken')
const config = require('config')

const SECRET = config.get('secret')

function sign (payload, subject) {
  return new Promise((resolve, reject) => {
    jwtLib.sign(payload, SECRET, {
      algorithm: 'HS256',
      expiresIn: '2 days',
      subject
    }, (err, jwt) => {
      if (err) return reject(err)

      resolve(jwt)
    })
  })
}

function decode (payload) {
  return new Promise((resolve, reject) => {
    jwtLib.verify(payload, SECRET, {
      algorithm: 'HS256'
    }, (err, data) => {
      if (err) return reject(err)

      resolve(data)
    })
  })
}

module.exports = {
  sign,
  decode
}
