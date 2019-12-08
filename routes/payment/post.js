const { ValidationError } = require('../../helpers/errors')
const jwt = require('../../helpers/jwt')
const paypal = require('../../helpers/paypal')

const createOrder = (paymentRequest) => new Promise((resolve, reject) => {
  paypal.payment.create(paymentRequest, (err, returnedPayment) => {
    if (err) return reject(err)
    resolve(returnedPayment)
  })
})

module.exports = async (req, res, next) => {
  try {
    if (!req.body.quoteJWT) {
      throw new ValidationError('Missing quoteJWT field')
    }

    const decoded = await jwt.decode(req.body.quoteJWT)
    if (decoded.purchases.length === 0) {
      throw new ValidationError('purchases', '', '0 length')
    }

    if (!(decoded.totalPrice > 0)) {
      throw new ValidationError('purchase', decoded.totalPrice, 'has no value')
    }

    if (!req.body.orderInfo) {
      throw new ValidationError('OrderInfo', '', 'missing')
    }

    if (!req.body.orderInfo.partyName) {
      throw new ValidationError('OrderInfo partyName', '', 'missing')
    }

    if (req.body.orderInfo.yearsAtTheBash === undefined) {
      throw new ValidationError('OrderInfo yearsAtTheBash', '', 'missing')
    }

    if (!req.body.orderInfo.email) {
      throw new ValidationError('OrderInfo email', '', 'missing')
    }

    // add currency to purchases for item list
    const items = decoded.purchases.map(purchase => ({
      ...purchase,
      currency: 'GBP'
    }))

    const paymentRequest = {
      intent: 'sale',
      payer: {
        payment_method: 'paypal'
      },
      transactions: [
        {
          item_list: {
            items
          },
          amount: {
            total: decoded.totalPrice,
            currency: 'GBP'
          },
          description: 'BigBikeBash Order'
        }
      ],
      redirect_urls: {
        return_url: 'https://www.mysite.com',
        cancel_url: 'https://www.mysite.com'
      }
    }

    const payment = await createOrder(paymentRequest)
    const paymentJWT = {
      ...decoded,
      email: req.body.orderInfo.email,
      yearsAtTheBash: req.body.orderInfo.yearsAtTheBash,
      paymentId: payment.id
    }

    delete paymentJWT.exp
    delete paymentJWT.sub

    const token = await jwt.sign(paymentJWT, 'payment')
    res.status(200).json({
      paymentId: payment.id,
      jwt: token
    })
  } catch (e) {
    next(e)
  }
}
