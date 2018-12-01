const config = require('config')
const debug = require('debug')('ticket-booth:email')
const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(config.get('sendgrid'))

const emails = {}

emails.receipt = function (order) {
  const msg = {
    to: order.email,
    from: 'noreply@bigbikebash.org.uk',
    templateId: 'd-e417404d0b344408b78ab7ba72b68f4a',
    dynamic_template_data: {
      ...order.dataValues
    }
  }

  debug('sending email')
  debug(msg)

  return sgMail.send(msg)
}

module.exports = emails
