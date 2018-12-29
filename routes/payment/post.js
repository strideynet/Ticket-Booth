const debug = require('debug')('ticket-booth:payment-creater')
const { GenericError, ValidationError } = require('../../helpers/errors')
const jwt = require('../../helpers/jwt')
const paypal = require('../../helpers/paypal')

module.exports = (req, res, next) => {
  if (!req.body.quoteJWT) {
    throw new ValidationError('Missing quoteJWT field')
  }

  jwt.decode(req.body.quoteJWT)
    .then((decoded) => {
      if (decoded.quote.purchases.length === 0) {
        throw new ValidationError('purchases', '', '0 length')
      }

      if (!(decoded.quote.totalPrice > 0)) {
        throw new ValidationError('purchase', decoded.quote.totalPrice, 'has no value')
      }

      if (!(req.body.orderInfo)) {
        throw new ValidationError('OrderInfo', '', 'missing')
      }

      if (!(req.body.orderInfo.partyName)) {
        throw new ValidationError('OrderInfo partyName', '', 'missing')
      }

      if (req.body.orderInfo.yearsAtTheBash === undefined) {
        throw new ValidationError('OrderInfo yearsAtTheBash', '', 'missing')
      }

      if (!(req.body.orderInfo.email)) {
        throw new ValidationError('OrderInfo email', '', 'missing')
      }

      const payment = {
        intent: 'sale',
        payer: {
          payment_method: 'paypal'
        },
        transactions: [
          {
            amount: {
              total: decoded.quote.totalPrice,
              currency: 'GBP'
            },
            description: 'BigBikeBash ticket purchase'
          }
        ],
        redirect_urls: {
          return_url: 'https://www.mysite.com',
          cancel_url: 'https://www.mysite.com'
        }
      }

      debug('creating payment:')
      debug(payment)

      paypal.payment.create(payment, (err, payment) => {
        if (err) return next(err)

        let newJWT = {
          ...decoded,
          ...req.body.orderInfo,
          paymentID: payment.id
        }

        delete newJWT.exp
        delete newJWT.sub

        jwt.sign(newJWT, 'payment')
          .then((newJWT) => {
            res.status(200).json({
              paymentID: payment.id,
              jwt: newJWT
            })
          }).catch(next)
      })
    })
    .catch(next)
}
