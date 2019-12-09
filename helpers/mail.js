const config = require('config')

const logger = require('pino')({
  name: 'mail',
  level: process.env.LOG_LEVEL || 'info'
})

const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(config.get('sendgrid'))

const emails = {}

emails.receipt = function (order) {
  const msg = {
    to: order.email,
    from: 'noreply@bigbikebash.org.uk',
    templateId: 'd-4f4fb606c72b4f2ba28efe12fae9693e',
    dynamic_template_data: {
      ...order
    }
  }

  logger.debug('sending receipt', msg)

  return sgMail.send(msg)
}

module.exports = emails
