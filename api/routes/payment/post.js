const jwt = require('../../helpers/jwt')
const paypal = require('../../helpers/paypal')

module.exports = (req, res, next) => {
  if (!req.body.quoteJWT) {
    return res.status(422).json({err: 'Missing field.'})
  }

  jwt.decode(req.body.quoteJWT)
    .then((decoded) => {
      if (decoded.quote.purchases.length === 0) {
        return res.status(422).json({
          err: {
            title: 'Validation failed',
            detail: 'No purchases found'
          }
        })
      }

      if (!(decoded.quote.totalPrice > 0)) {
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

      paypal.payment.create(payment, (err, payment) => {
        if (err) return next(err)

        let newJWT = {
          ...decoded,
          paymentID: payment.id
        }

        jwt.sign(newJWT, 'payment')
          .then((jwt) => {
            res.status(200).json({
              paymentID: payment.id,
              jwt: newJWT
            })
          }).catch((err) => next(err))
      })
    })
    .catch((err) => next(err))
}
