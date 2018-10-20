const jwt = require('../../helpers/jwt')
const paypal = require('../../helpers/paypal')
const db = require('../../db')

module.exports = (req, res, next) => {
  if (!req.body.quoteJWT || !req.body.orderInfo) {
    return res.status(422).json({err: 'Missing field.'})
  }

  jwt.decode(req.body.quoteJWT)
    .then((decoded) => {
      if (decoded.sub !== 'quote') {
        return res.status(422).json({
          err: {
            title: 'Validation failed',
            detail: 'Wrong JWT Type'
          }
        })
      }

      if (decoded.quote.purchases.length === 0) {
        return res.status(422).json({
          err: {
            title: 'Validation failed',
            detail: 'No purchases found'
          }
        })
      }

      if (!(decoded.totalPrice > 0)) {
        return res.status(422).json({
          err: {
            title: 'Validation failed',
            detail: 'No purchase value'
          }
        })
      }

      const payment = {
        intent: 'sale',
        payer: {
          payment_method: 'paypal'
        },
        transactions: [
          {
            amount: decoded.totalPrice,
            currency: 'GBP'
          }
        ],
        description: 'BigBikeBash ticket purchase'
      }


    })
    .then()
    .catch((err) => next(err))
}
